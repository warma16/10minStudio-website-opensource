<template>
    <div class="fit" v-html="showHtml">

    </div>
</template>
<script>
import {debounce} from 'lodash-es';
export default {
    name: 'markdownRenderer',
    data(){
        return {
            md:window.markdownit({
                html:true,
            }),
            showHtml:"",
        }
    },
    props:{
        markdown:{
            type:String,
            default:"",
        },
    },
    methods:{
        renderMarkdown:debounce(function(){
            this.showHtml=this.md.render(this.markdown);
        },750),
    },
    mounted(){
        this.renderMarkdown();
    },
    watch:{
        markdown(val){
            this.renderMarkdown();
        },
    },
}
</script>
<style scoped>
.wrapper {
        position: relative;
        height: 0;
        padding-top: 100%;
    }

    .box {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border: 1px solid #ccc;
        overflow:auto;
    }
.fit{
    overflow: auto;
}
</style>