<template>
    <div ref="Captcha"></div>
</template>
<script>

export default {
    name:"dxCaptcha",
    emits: [
        "success",
        "failed",
    ],
    props:{
        captchaStyle:{
            type:String,
            default:"embed",
        },
        languege:{
            type:String,
            default:"",
        },
        inlineFloatPosition:{
            type:String,
            default:"right",
        },
        oneClickFloatPosition:{
            type:String,
            default:"right",
        },
        apiServer:{
            type:String,
            default:"https://cap.dingxiang-inc.com",
        },
        appId:{
            type:String,
            default:"",
        },
    },
    mounted() {
        _dx.Captcha(this.$refs.Captcha, {
            // appId, 在控制台应用管理或应用配置模块获取
            appId: this.appId,
            apiServer: this.apiServer,  
            // apiServer域名地址在控制台页面->无感验证->应用管页面左上角获取，必须填写完整包括https://。
            success: token => {
                // 获取验证码token，用于后端校验，注意获取token若是sl开头的字符串，则是前端网络不通生成的降级token,请检查前端网络及apiServer地址。
                this.$emit('success', token);
            },
            fail: err => {
                // 获取验证码失败
                this.$emit('failed', err);
            },
            // 其他参数可以查看接口文档
            style: this.captchaStyle,
            language: this.languege,
            inlineFloatPosition: this.inlineFloatPosition || "",
            oneClickFloatPosition: this.oneClickFloatPosition || "",
        });
    }
}
</script>
