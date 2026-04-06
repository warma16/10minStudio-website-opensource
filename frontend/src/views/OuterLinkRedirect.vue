<template>
    <a-layout :style="fullscreenStyle">
        <a-layout-content>
            <a-result status="warning" title="即将离开10MinStudio官网" v-if="isDangerous" :style="innerElementFullScreenStyle">
                <template #subtitle>
                    您即将离开10MinStudio官网，请注意您的帐号和财产安全。

                    {{toUrl}}
                </template>

                <template #extra>
                <a-space>
                    <a-button type='primary'>继续</a-button>
                </a-space>
                </template>
            </a-result>
            <a-spin :loading="!isDangerous" v-if="!isDangerous" :tip="tipShow" :style="innerElementFullScreenStyle" :size="64">

            </a-spin>
        </a-layout-content>
    </a-layout>


</template>
<script>
import CheckDomainTrusted from '../utils/CheckDomainTrusted.js';
var checkInstance=new CheckDomainTrusted();
export default {
    data(){
        return {
            toUrl:"",
            isDangerous:false,
            carefulTips:[
                "不要相信输入银行卡用户名和密码的网站，以免被骗。",
                "不要随意点击邮箱中的不明来历的链接，以免被骗。",
            ],
            everywordShowTime:25,//每个字的显示时间
            everywordShowTimeOuter:null,//每个字的显示时间定时器
            tipShow:"",//提示文字
            //全屏块专用脚本
            fullscreenStyle:{},
            innerElementFullScreenStyle:{},
        }
    },
    created(){
        this.fullscreenStyle=this.$fullscreenStyle;
        console.log(this.fullscreenStyle);
            this.innerElementFullScreenStyle={
      "width":`${this.fullscreenStyle.width}`,
      "height":`${this.fullscreenStyle.height}`,
    }
        this.$bus.on('fullscreenStyle',(data)=>{
            this.fullscreenStyle=data;
             this.innerElementFullScreenStyle={
        "width":`${this.fullscreenStyle.width}`,
        "height":`${this.fullscreenStyle.height}`,
      }
        });
        this.toUrl="https://cn.bing.com/?form=hh";
        var domain=this.toUrl.split("//")[1].split("/")[0];
        checkInstance.Check(domain).then(()=>{
            this.isDangerous=false;
            this.showTip();
        }).catch(()=>{
            this.isDangerous=true;
        })
    },
    methods:{
        showTip(){
            //随机选一条,读完就走人
            let index=Math.floor(Math.random()*this.carefulTips.length);
            this.tipShow=`即将导航到${this.toUrl}\n友情提示 : ${this.carefulTips[index]}`;
            this.everywordShowTimeOuter=setTimeout(()=>{
                //开启新标签页
                console.log("开启新标签页");
                window.open(this.toUrl);
                //创建新的a元素用target="_blank"打开新标签页，并触发点击
                let a=document.createElement("a");
                a.href=this.toUrl;
                a.target="_blank";
                a.click();
                //自式跳转链接
                window.location.href=`${this.toUrl}`;
                //把路由推回去
            },this.everywordShowTime*this.tipShow.length);
        },
        confimSecurity(){
            this.isDangerous=false;
        },
    },
}
</script>