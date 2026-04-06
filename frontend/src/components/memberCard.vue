<template>

    <div class="col-md-6 col-lg-2 mb-5 mb-lg-0">
        <div class="px-4">
            <img class="rounded-circle img-center img-fluid shadow shadow-lg--hover" :data-src="avatar" :src="avatar" lazy="loaded" style="width: 400px;" referrerPolicy="no-referrer" />
            <div class="pt-4 text-center">
                <h5 class="title">
                    <span class="d-block mb-1" style="color:var(--color-text-1); ">{{name}}</span>
                    <small class="h6 text-muted" >
                        <a-tag v-for="(tag) in description" :key="tag" bordered color="blue">{{tag}}</a-tag>
                    </small>
                </h5>
                <div class="mt-3">
                    <a-space style="" size="large">
                        <a-button type="primary" shape="circle" class="floating-btn" style="" v-for="(data,index) in options" :key="index" @click="openTab(data.url)">
                            <icon-font :type="data.icon"></icon-font>
                        </a-button>

                    </a-space>
                </div>
            </div>
        </div>
    </div>

</template>
<style scoped>
.floating-btn:hover{
  cursor: pointer;
  /**要求元素上移一段距离并有底部的投影 */
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

}
</style>
<script>
export default {
    data(){
        return {
            actionContainerStyle:{
                marginLeft:"20px",
                marginTop:"0px",
                padding:"0px",
            },
            options:{

            },
            
            baseMarginLeft:10,
            cardWidth:220,
            avatar:"",
        }
    },
    props:{
        /*biliMid:"12345",
            emailTo:"metal_studio@foxmail.com",
            blogUrl:"",
            weiboUrl:"",
            githubUrl:"",
            qqUrl:"https://www.baidu.com",*/
        biliMid:{
            type:String,
            default:"",
        },
        emailTo:{
            type:String,
            default:"",
        },
        blogUrl:{
            type:String,
            default:"",
        },
        weiboUrl:{
            type:String,
            default:"",
        },
        githubUrl:{
            type:String,
            default:"",
        },
        qqUrl:{
            type:String,
            default:"",
        },
        name:{
            type:String,
            default:"Lorem Ipsum",
        },
        description:{
            type:Array,
            default:["Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"],
        },
        outAvatar:{
            type:String,
            default:"",
        }
    },
    methods:{
        onClick(){
            console.log("click");
        },
        computeActionContainerStyle(){
            var dom=document.querySelector(".col-md-6 .col-lg-3 .mb-5 .mb-lg-0")
            console.log(dom);
            var middleLeft=(this.cardWidth-30)/2;
            var space=24;
            var buttonWidth=32;
            //算出区域的宽度，按钮的宽度加上间隔的宽度，按钮个数是Object.keys(this.options).length
            var buttonNum=Object.keys(this.options).length
            var actionContainerWidth=buttonNum*buttonWidth+(buttonNum-1)*space;
            var marginLeft=0;
            //获取到actionContainer的宽度中心点的位置
            var actionContainerMiddleLeft=actionContainerWidth/2;
            //跟middleLeft对齐计算出marginLeft的值
            marginLeft=middleLeft-actionContainerMiddleLeft;
            console.log(marginLeft);

            return {
                marginLeft:`${marginLeft}px`,
            }
        },
        openTab(url){
            //创建a target="_blank"的链接
            var a = document.createElement('a');
            a.target = "_blank";
            a.href = url;
            a.click();
        },
    },
    created(){

        if(this.biliMid.length>0){
            this.options["biliMid"]={
                icon:"icon-bilibiliNoFill",
                url:`https://space.bilibili.com/${this.biliMid}`,
            }
            this.$backendAxios.get("/biliapi/getUserInfo",{
                params:{
                    mid:this.biliMid,
                }
            }).then(res=>{
                this.avatar=this.outAvatar.length>0?this.outAvatar:res.data.data.avatar;
            }).catch(err=>{
                this.avatar=this.outAvatar;
                console.log(err);
            })
        }
        if(this.emailTo.length>0){
            this.options["emailTo"]={
                icon:"icon-emailNoFill",
                url:`mailto:${this.emailTo}`,
            }
        }
        if(this.blogUrl.length>0){
            this.options["blogUrl"]={
                icon:"icon-blog",
                url:this.blogUrl,
            }
        }
        if(this.weiboUrl.length>0){
            this.options["weiboUrl"]={
                icon:"icon-weibo",
                url:this.weiboUrl,
            }
        }
        if(this.githubUrl.length>0){
            this.options["githubUrl"]={
                icon:"icon-github",
                url:this.githubUrl,
            }
        }
        if(this.qqUrl.length>0){
            this.options["qqUrl"]={
                icon:"icon-qqNoFill",
                url:this.qqUrl,
            }
        }
    },
    watch:{
        options:{
            handler(val,oldVal){
                this.actionContainerStyle=this.computeActionContainerStyle();
            },
            deep:true,
        },
    },
}
</script>