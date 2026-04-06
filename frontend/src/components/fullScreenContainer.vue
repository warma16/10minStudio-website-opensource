<template>
    <!--div :style="every_fullscreen_style">
        <div class="container">
            <slot></slot>
        </div>
    </div--->
    <slot :style="every_fullscreen_style"></slot>
</template>
<script>
// 获取浏览器窗口的可视区域的宽度
function getViewPortWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth;
}

// 获取浏览器窗口的可视区域的高度
function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
}

export default {
    data(){
        return {
            page_width:0,
            page_height:0,
            every_fullscreen_style:{
                "margin-top":"0%",
                "margin-left":"0%",
                "width":"100%",
                "height":"100%",
                "border":"none",
            },
        }
    },
    created() {
        var __this=this
        //this.page_width=window.innerWidth;
        //this.page_height=window.innerHeight;
        this.page_width=getViewPortWidth();
        this.page_height=getViewPortHeight();
        this.every_fullscreen_style={
            "margin-top":`${0}px`,
            "margin-left":`${0}px`,
            //"border":"1px solid red",
            //"background-color":"red",
            "width":`${this.page_width}px`,
            "height":`${this.page_height}px`,
        }
        //add event listener for resize
        window.addEventListener('resize',()=>{
            //__this.page_width=window.innerWidth;
            //__this.page_height=window.innerHeight;
            __this.page_width=getViewPortWidth();
            __this.page_height=getViewPortHeight();
            __this.every_fullscreen_style={
                "margin-top":`${0}px`,
                "margin-left":`${0}px`,
                //"border":"1px solid red",
                //"background-color":"red",
                "width":`${__this.page_width}px`,
                "height":`${__this.page_height}px`,
            }
        });

    },
}
</script>
<style scoped>
.container{
    margin:0;
    padding:0;
    border:none;
    width:100%;
    height:100%;
}
</style>
