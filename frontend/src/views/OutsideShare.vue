<template>
    <div>{{showText}}</div>
</template>
<script>
export default {
    data(){
        return {
            showText:"",
        }
    },
    methods:{
    },
    mounted(){
        //获取query参数
        var query=this.$route.query;
        console.log(query);
        switch(query.action){
            case "shareMarkdown":
                if(!this.$loginStore.isCmsUserLogin){
                    this.showText="错误：您没有登录，请先登录！";
                }else{
                    this.$router.push({
                        name:"showArticle",
                        params:{
                            articleId:query.articleId,
                            markdownId:query.markdownId,
                        }
                    });
                }
                break;
        }
    }
}
</script>