function getViewPortWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth;
}

// 获取浏览器窗口的可视区域的高度
function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
}
class ComputeFullScreen{
    constructor( need_highlight=false,handler=()=>{}){
        this.page_width=0;
        this.page_height=0;
        this.every_fullscreen_style={
            "margin-top":"0%",
            "margin-left":"0%",
            "width":"100%",
            "height":"100%",
            "border":"none",
        }
        this.handler=handler;
        this.need_highlight=need_highlight;
        this.resizeHandleAdd();
        this.compute();
    }
    compute(){

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
        if(this.need_highlight){
            this.every_fullscreen_style["background-color"]="red";
            this.every_fullscreen_style["border"]="20px solid red";
        }
        this.handler(this.every_fullscreen_style);
    }
    resizeHandleAdd(){
        var __this=this;
        window.addEventListener("resize",()=>{
            __this.compute();
        });
    }
}
export default ComputeFullScreen;