<template>
    <div v-if="!this.$loginStore.isCmsUserLogin">
        错误：您没有登录，请先登录！
    </div>
    <a-layout v-if="this.$loginStore.isCmsUserLogin">
            <a-layout-content>
                <h1>
                    正在为您创建文章，一会儿将自动跳转到编辑页面，请耐心等待！
                </h1>
            </a-layout-content>
    </a-layout>
</template>
<script>
export default {
    data(){
        return {
            showText:"",
            article:{
                title:"",
            },
            articleId:"",
            markdownId:"",
        }
    },
    methods:{
        CreateArticle(){
            this.$backendAxios({
                method:"post",
                url:"/createArticle",
                data:{
                    accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000),
                }
            }).then(res=>{
                var response=res.data;
                if(response.statusCode==0){
                    this.articleId=response.data.articleId;
                    this.$backendAxios({
                        method:"post",
                        url:"/createMarkdown",
                        data:{
                            accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000),
                            articleId:this.articleId,
                            owner:this.$loginStore.cmsUserId,
                        }
                    }).then((ress)=>{
                        var response=ress.data;
                        if(response.statusCode==0){
                            this.markdownId=response.data.markdownId;
                            this.$router.push({
                                name:"editArticle",
                                params:{
                                    articleId:this.articleId,
                                    markdownId:this.markdownId,
                                }
                            });
                        }
                    }).catch((err)=>{
                        this.$message.error(err);
                    });
                    
                }
            }).catch(err=>{
                this.$message.error(err);
            });
        },
    },
    mounted(){
        this.CreateArticle();
    },
}
</script>