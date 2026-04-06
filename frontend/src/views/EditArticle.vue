<template>
    <a-layout>
        <a-layout-content>
            <markdown-editor :style="carouselFullScreenStyle" :markdownId="this.$route.params.markdownId" :articleId="this.$route.params.articleId"></markdown-editor>
        </a-layout-content>
    </a-layout>
</template>
<script>
import markdownEditor from '../components/markdownEditor.vue';
export default {
    components: {
        markdownEditor
    },
    created(){
        this.fullscreenStyle=this.$fullscreenStyle;
        console.log(this.fullscreenStyle);
        this.carouselFullScreenStyle={
            "width":`${this.fullscreenStyle.width}`,
            "height":`${this.fullscreenStyle.height}`,
        }
        this.$bus.on('fullscreenStyle',(data)=>{
            console.log("before")
            console.log(this.carouselFullScreenStyle);
            this.fullscreenStyle=data;
            this.carouselFullScreenStyle={
                "width":`${this.fullscreenStyle.width}`,
                "height":`${this.fullscreenStyle.height}`,
            }
            console.log(this.carouselFullScreenStyle);
            console.log("after")
        });
        console.log(this.fullscreenStyle);
    },
    data(){
        return {
            fullscreenStyle:{},
            carouselFullScreenStyle:{},
            articleId:"",
            markdownId:"",
        }
    },
    mounted(){
        //接收一下路由传过来的params
        console.log(this.$route.params);
        var params=this.$route.params;
        this.articleId=params.articleId;
        this.markdownId=params.markdownId;

    }
}
</script>