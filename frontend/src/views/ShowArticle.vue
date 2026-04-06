<template>
    <a-card :title="title">
        <template #extra >
            <a-button-group v-if="this.$loginStore.isCmsUserLogin">
                <a-button type="text" @click="DirectEditView" v-if="isMeEdited">
                    <template #icon>
                        <icon-edit />
                    </template>
                    编辑
                </a-button>
                <a-button type="text" @click="ForkIt" v-if="!isMeEdited">
                    <template #icon>
                        <icon-font type="icon-fork" />
                    </template>
                    Fork一下
                </a-button>
                <a-button type="text" @click="CopyTeamMateShareLink">

                    分享协助链接
                    <template #icon>
                        <icon-send />
                    </template>
                </a-button>
            </a-button-group>
      </template>
        <!--弄完这个之后修bug-->
        <!---我知道了-->
        <MarkdownRender :markdown="markdownCodeNeedToBeTransformed" :style="{'margin-right':'25%'}" ></MarkdownRender>

    </a-card>
</template>
<script>
import  MarkdownRender from "../components/markdownRenderer.vue";
export default {
    data(){
        return {
            markdownCodeNeedToBeTransformed: `
            
            `,
            title:"",
            isMeEdited:false,
            willBindArticleId:"",
            markdownId:"",
            markdownRenderOptions:{
                markdownIt:{
                    html:true,
                },
            }
        }
    },
    components: {
        MarkdownRender,
    },
    methods:{
        GetArticleById(articleId,lang="zh-cn"){
            if(!this.$loginStore.isCmsUserLogin){
                this.$backendAxios({
                    method:"post",
                    url:"/getArticle",
                    data:{
                        articleId:articleId,
                        language:lang,
                        
                    }
                }).then((res)=>{
                    var response=res.data;
                    if(response.statusCode==0){
                        this.markdownCodeNeedToBeTransformed=response.data.content;
                        this.title=response.data.title;
                    }else{
                        this.$message.error(response.message);
                    }
                });
            }
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
                        this.markdownCodeNeedToBeTransformed=response.data.content;
                        console.log(response.data.content);
                        this.title=response.data.title;
                        if(response.data.owner==this.$loginStore.cmsUserId){
                            this.isMeEdited=true;
                        }
                    }else{
                        this.$message.error(response.message);
                    }
                }).catch((err)=>{
                    this.$message.error(err);
                });
            }
        },
        DirectEditView(){
            //用params传递参数
            this.$router.push({
                name:"editArticle",
                params:{
                    markdownId:this.markdownId,
                    articleId:this.willBindArticleId,
                }
            });
        },
        ForkIt(){
            this.$backendAxios({
                method:"post",
                url:"/forkMarkdown",
                data:{
                    markdownId:this.markdownId,
                    accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000),
                    toOwner:this.$loginStore.cmsUserId,
                }
            }).then((res)=>{
                var response=res.data;
                if(response.statusCode==0){
                    this.$message.success("Fork成功！,请到我的文章中查看");
                    this.$router.push({
                        name:"home",
                    })
                }else{
                    this.$message.error(response.message);
                }
            }).catch((err)=>{
                this.$message.error(err);
            });
        },
        CopyTeamMateShareLink(){
            //将当前页面的url获取下来
            //url就像是http://192.168.31.198:8080/#/showArticle一样
            //然后将/showArticle替换为/share
            //action参数是shareMarkdown
            //将markdownId和articleId传递下去
            //拼接得到url并复制到剪切板
            var currentUrl=window.location.href;
            var url=currentUrl.replace("showArticle","share");
            var markdownId=this.markdownId;
            var articleId=this.willBindArticleId;
            var action="shareMarkdown";
            var realUrl=url+"?action="+action+"&markdownId="+markdownId+"&articleId="+articleId;
            this.$toClipboard(realUrl);
            this.$message.success("分享协助链接已复制到剪贴板，请到分享协助链接中查看");
        },
    },
    mounted(){
        var params=this.$route.params;
        console.log(params);
        if(this.$loginStore.isCmsUserLogin){
            this.willBindArticleId=params.articleId;
            this.markdownId=params.markdownId;
            this.GetArticleByMarkdownId(params.markdownId);
        }else{
            this.GetArticleById(params.articleId);
        }
    }
}
</script>