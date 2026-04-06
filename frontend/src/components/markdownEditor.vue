<template>
    
    <a-card>
        <a-layout >
            <a-layout-header>
                <a-space  size="large" :style="{ padding: 0, marginLeft:'2%'}">
                    <a-space  >
                        <h1 v-if="!isTitleEdit">{{title}}</h1>
                        <a-input v-if="isTitleEdit" v-model="title" placeholder="请输入标题" style="font-size: 32px;padding:10%"></a-input>
                        <a-button type="text" long @click="editTitle">
                            <template #icon>
                                <icon-edit  v-if="!isTitleEdit" />
                                <icon-check  v-else />
                            </template>
                        </a-button>
                        <a-divider direction="vertical" />
                    </a-space>
                    <div class=".right-buttons">
                        <a-button-group >
                            <a-button type="text" long @click="TriggerUpload">
                                <template #icon>
                                    <icon-upload />
                                </template>
                                上传
                            </a-button>
                        </a-button-group>
                        <a-divider direction="vertical"  v-if="hasFirstAutoSave"/>
                    </div>
                    <div  v-if="hasFirstAutoSave">
                        <span>
                            <icon-loading  v-if="isAutoSaving"/>
                            <icon-check-circle  v-if="isAutoSavedOK"/>
                            <icon-close-circle  v-if="isAutoSavedFailed"/>
                            {{autoSaveText}}
                        </span>
                    </div>
                </a-space>
            </a-layout-header>
            <a-layout-content>
                <!--DONE:要把编辑器中的toolbar中的save删掉，替换成自定义的save-->
                <mavon-editor v-model="value" ref="md" @imgAdd="$imgAdd" :boxShadow="false" style="z-index:0;height:100%;" @save="onSave" />
                <a-modal :visible="needUpload" @cancel="ModalCancel" @before-ok="ModalBeforeOk">
                    <a-form :model="uploadForm">
                        <a-form-item field="lang" label="语言(Language)">
                            <a-select v-model="uploadForm.lang">
                                <a-option value="zh-cn">简体中文(Chinese Simplified)</a-option>
                                <a-option value="en">英文(English)</a-option>
                            </a-select>
                        </a-form-item>
                    </a-form>
                </a-modal>
            </a-layout-content>
        </a-layout>
    </a-card>
</template>
<script>
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import {debounce} from 'lodash-es';
    export default {
        name: 'editor',
        components: {
            mavonEditor
            // or 'mavon-editor': mavonEditor
        },
        data(){
            return {
                value: '',
                autoSaveText:"",
                hasFirstAutoSave:false,
                isAutoSavedOK:false,
                isAutoSaving:false,
                isAutoSavedFail:false,
                isLoadedCache:false,
                title:"标题",
                isTitleEdit:false,
                uploadForm:{
                    lang:"",
                },
                needUpload:false,
                // or 'value': ''
            }
        },
        props:{
            articleId:{
                type:String,
                default:''
            },
            markdownId:{
                type:String,
                default:''
            }
        },
        methods:{
            // 绑定@imgAdd event
            async $imgAdd(pos, $file){
                var vm=this.$refs.md;
                // 第一步.将图片上传到服务器.
                try{
                    var res=await this.uploadArticleResources($file);
                    var fileName=res.data.data.fileName;
                    var requestArticleResourcesPath="/getArticleResource"
                    var url=`${this.$backendUrl}${requestArticleResourcesPath}?fileName=${fileName}`;
                    // 第二步.将图片插入到编辑器中.
                    vm.$img2Url(pos, url);
                }
                catch(e){
                    console.log(e);
                    return;
                }
            },
            uploadArticleResources(file){
                var __this=this
                return new Promise((resolve,reject)=>{
                    var formdata = new FormData();
                    //上传文件
                    formdata.append('file', file);
                    formdata.append("accessToken",__this.$cryptAdapter.Encrypt(__this.$loginStore.cmsAccessToken,60000));
                    __this.$backendAxios({
                        url: '/uploadArticleResource?accessToken='+__this.$loginStore.cmsAccessToken,
                        method: 'post',
                        data: formdata,
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }).then((res) => {
                        //上传成功
                        resolve(res)

                    }).catch((err) => {
                        //上传失败
                        reject(err)
                    })
                })
            },
            autoSave:debounce(function(){
                var success=true;
                 if(!this.hasFirstAutoSave){
                     this.hasFirstAutoSave=true;
                     try{
                        this.$cookieManager.setCookie(`${this.articleId}-${this.markdownId}-ContentCache`,"");
                    }catch(e){
                        console.log(e);
                        success=false;
                    }
                     
                    
               }
               this.isAutoSavedOK=false;
                this.isAutoSavedFailed=false;
                this.isAutoSaving=false;
                this.isAutoSaving=true;
                this.autoSaveText="正在自动保存...";
                console.log(this.value)
                var offlineCacheNotify=(suc)=>{
                    if(suc){
                            setTimeout(()=>{
                                this.isAutoSaving=false;
                                this.isAutoSavedFailed=false;
                                this.isAutoSavedOK=true;
                                this.autoSaveText="离线保存成功";
                            },1000)
                        }else{
                            setTimeout(()=>{
                                this.isAutoSaving=false;
                                this.isAutoSavedFailed=true;
                                this.isAutoSavedOK=false;
                                this.autoSaveText="离线保存失败";
                            },1000)
                        }
                }
                try{
                    this.$cookieManager.removeCookie(`${this.articleId}-${this.markdownId}-ContentCache`);
                    this.$cookieManager.setCookie(`${this.articleId}-${this.markdownId}-ContentCache`,JSON.stringify({
                        title:this.title,
                        content:this.value
                    }));
                    this.$backendAxios({
                        method:"post",
                        url:"/updateMarkdown",
                        data:{
                            accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000),
                            markdownId:this.markdownId,
                            title:this.title,
                            content:this.value
                        }
                    }).then((res)=>{
                        var response=res.data;
                        if(response.statusCode==0){
                            this.isAutoSaving=false;
                            this.isAutoSavedFailed=false;
                            this.isAutoSavedOK=true;
                            this.autoSaveText="自动保存成功";
                        }else{
                            offlineCacheNotify(success)
                        }
                    }).catch((err)=>{
                        offlineCacheNotify(success)
                    })
                }catch(e){
                    setTimeout(()=>{
                        this.isAutoSaving=false;
                        this.isAutoSavedFailed=true;
                        this.isAutoSavedOK=false;
                        this.autoSaveText="自动保存失败";
                    },1000)
                }
            },750),
            autoSaveHandler(val){
            },
            editTitle(){
                this.isTitleEdit=!this.isTitleEdit;
                console.log(this.isTitleEdit)
                if(!this.isTitleEdit){
                    this.autoSave();
                }
            },
            onSave(){
                this.autoSave();
            },
            GetArticleByMarkdownId(markdownId){
                if(this.$loginStore.isCmsUserLogin){
                    this.$backendAxios({
                        method:"post",
                        url:"/getMarkdown",
                        data:{
                            markdownId:markdownId,
                            accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000),
                        }
                    }).then((res)=>{
                        var response=res.data;
                        if(response.statusCode==0){
                            this.value=response.data.content;
                            console.log(response.data.content);
                            this.title=response.data.title;
                        }else{
                            this.$message.error(response.message);
                        }
                    }).catch((err)=>{
                        this.$message.error(err);
                    });
                }
            },
            TriggerUpload(){
                if(this.needUpload==false){
                    this.needUpload=true;
                }
            },
            ModalBeforeOk(done){
                this.$backendAxios({
                    method:"post",
                    url:"/postArticle",
                    data:{
                        accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000),
                        articleId:this.articleId,
                        markdownId:this.markdownId,
                        language:this.uploadForm.lang,
                    }
                }).then((res)=>{
                    var response=res.data;
                    if(response.statusCode==0){
                        this.$message.success("发布成功");
                        this.needUpload=false;
                    }else{
                        this.$message.error(response.message);
                        this.needUpload=false;
                    }
                }).catch((err)=>{
                    this.$message.error(err);
                    this.needUpload=false;
                });
            },
            ModalCancel(){
                this.needUpload=false;
            }
        },
        watch:{
            value(){
                this.autoSave();
            },
        },
        mounted(){
            console.log("articleId:")
            console.log(this.articleId)
            console.log("markdownId:")
            console.log(this.markdownId)
            this.GetArticleByMarkdownId(this.markdownId);
            //看一眼之前有没有对应的cookie,如果有,就直接读取cookie,如果没有,就读取编辑器的内容.
            var contentCache=this.$cookieManager.getCookie(`${this.articleId}-${this.markdownId}-ContentCache`);
            if(contentCache){
                var data=JSON.parse(contentCache);
                console.log(data)
                this.value=data.content;
                this.title=data.title;
                this.$notification.success("自动恢复上一次的编辑内容");
            }

        }
    }
    </script>
    <style scoped>
    #editor {
        margin: auto;
        width: 80%;
        height: 580px;
    }
    .right-buttons{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;

    }
    </style>
