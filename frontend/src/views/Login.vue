<template>
    <a-layout :style="fullscreenStyle">
        <a-layout-sider :style="asideBackground">
            <hitokoto style="color:white;margin-top: 53%; font-weight:800; margin-left:10px;"></hitokoto>
        </a-layout-sider>
        <a-layout-content >
            <a-card  title="登录" class="object-center text-center" style="backdrop-filter: blur(2px); ">
                <a-card style="border-color: transparent;" class="flex justify-center">
                  <a-form :model="form" :style="{width:'314px','padding-right':'1px'}" @submit="handleSubmit" layout="horizontal" ref="formLogin" class="object-center" v-if="isCMSMode">
                        <a-form-item field="ident" label="用户名" :rule="usernameRules" :validate-trigger="['change','input']" class="object-center">
                            <a-input v-model="form.ident" placeholder="请输入您的账户名" />
                        </a-form-item>
                        <a-form-item field="password" label="密码" :rule="[{required:true,message:'嘿！密码可别忘填咯'}]" :validate-trigger="['change','input']">
                            <a-input-password v-model="form.password" placeholder="请输入您的密码.." allow-clear  />
                        </a-form-item>
                        <a-form-item >
                            <dx-captcha @success="CaptchaSuccess"  @fail="CaptchaFailed" appId="ecfc96cddc9e91f2d72f9b3da5eca9c9"  captchaStyle="oneclick"></dx-captcha>
                        </a-form-item>
                        <a-form-item>
                            <a-button html-type="submit">
                                <a-spin v-if="isLogining"></a-spin>
                                {{submitShowText}}
                            </a-button>
                        </a-form-item>
                    </a-form>
                <QRCode @display="fetchTapLoginQR" :data="taptapAbout.loginQr" v-if="!isCMSMode"></QRCode>
                </a-card>
                <!--a-divider orientation="center">其他登录方式</a-divider>
                <a-card style="border-color: transparent;">
                    <div class="center row columns-3">
                        <div >
                            TapTap
                        </div>
                        <div >
                            TapTap
                        </div>
                        <div >
                            TapTap
                        </div>
                    </div>
                </a-card-->
            </a-card>
        </a-layout-content>
    </a-layout>
</template>
<script>
import dxCaptcha from '@/components/dxCaptcha.vue';
import hitokoto from '../components/hitokoto.vue';
import QRCode from '../components/QRCode.vue'
export default {
    name: 'LoginPage',
    components: {
        dxCaptcha,
        hitokoto,
        QRCode
    },
    data(){
        return {
            form:{
                ident:"",
                password:"",
            },
            fullscreenStyle:{},
            carouselFullScreenStyle:{},
            randomImageUrl:"",
            backgroundDiv : {
                "background-image" : `url("${this.$backendUrl}/dxCaptcha/randomImage?aid=dx-0907861")`,
               "background-repeat" : 'no-repeat',
                "background-size" : '100% 100%',
                "opacity" : '1',
            },  
            isVerfied:false,
            asideBackground:{
                "background-image" : `url("https://api.vlssu.com/bing/")`,
               "background-repeat" : 'no-repeat',
                "background-size" : 'cover',
                "opacity" : '1',
                "width":"59%",
            },
            usernameRules:[{
                validator:(value, cb)=>{
                    return new Promise(resolve => {
                        if(value.length<=0){
                            cb("你用户名别不填啊你，你是不是要气死我")
                            
                        }else{
                            resolve()
                        }
                    })
                }
            }],
            submitShowText:"登录",
            isLogining:false,
            isLoginSuccess:false,
            isLoginFailed:false,
            isCMSMode:true,
            taptapAbout:{
                loginQr:"",
            }
        }
    },
    created(){
        // 获取当前日期
        var date = new Date();

        // 获取当前月份
        var nowMonth = date.getMonth() + 1;

        // 获取当前是几号
        var strDate = date.getDate();

        // 添加分隔符“-”
        var seperator = "/";

        // 对月份进行处理，1-9月在前面添加一个“0”
        if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
        }

        // 对月份进行处理，1-9号在前面添加一个“0”
        if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
        }

        // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
        var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
        this.asideBackground["background-image"] = `url("https://api.vlssu.com/bing/${nowDate}.jpg")`;
        console.log(this.asideBackground["background-image"]);
        this.randomImageUrl = `${this.$backendUrl}/dxCaptcha/randomImage?aid=dx-090786`;
        this.fullscreenStyle=this.$fullscreenStyle;
        console.log(this.fullscreenStyle);
        console.log(this.randomImageUrl);
        console.log(this.backgroundDiv);
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
        console.log(this.$cryptAdapter)
    },
    methods: {
        CaptchaSuccess(token){
            this.isVerfied = true;
            console.log("Catcha ok")
            console.log(token);
            this.form.dxToken = token;
        },
        CaptchaFailed(err){
            console.log("Catcha failed")
            console.log(err);
        },
        handleSubmit({values, errors}){
            console.log("attached submit");
            console.log(values);
            console.log(this.$refs.formLogin)
            var form;
            var ovalues=values;
            var hasErrorSubmit = false;
            if(values.ident.length<=0){
                hasErrorSubmit = true;
                this.$message.error("用户名：我掏空了，还不赶紧给我填上？");
            }
            if(values.password.length<=0){
                hasErrorSubmit = true;
                this.$message.error('密码：呜呜呜主人请您关注一下我吧。写一下好不好嘛');
            }
            if(!this.isVerfied || values.dxToken.length<=0){
                hasErrorSubmit = true;
                this.$message.error('麻烦你把验证码划一下呢，你是不是要气死我，气死了，不给你工作了，哼');
            }
            if(!hasErrorSubmit){
                this.submitShowText = "登录中...";
                form=ovalues;
                form.password=this.$cryptAdapter.Encrypt(ovalues.password,60000);
                this.$backendAxios({
                    method:"post",
                    url:"/login",
                    data:form,
                }).then((res)=>{
                    console.log(res.data);
                    //获取到access_token和refresh_token
                    console.log(res.data.statusCode)
                    console.log(res.data.statusCode==0)
                    if(res.data.statusCode==0){
                        var accessToken = res.data.data.accessToken;
                        var refreshToken = res.data.data.refreshToken;
                        //存到pinia的loginStore中
                        this.$loginStore.$patch({
                            cmsAccessToken:accessToken,
                            cmsRefreshToken:refreshToken,
                            isCmsUserLogin:true,
                        })
                        console.log(accessToken);
                        var encryptAccessToken=this.$cryptAdapter.Encrypt(accessToken,60000)
                        //获取用户信息
                        this.$backendAxios({
                            method:"post",
                            url:"/getAllInfo",
                            headers:{
                                
                            },
                            data:{
                                accessToken:encryptAccessToken,
                            },
                        }).then((ress)=>{
                            console.log(ress.data);
                            if(ress.data.statusCode==0){
                                var userInfo = ress.data.data;
                                this.$loginStore.$patch({
                                    cmsUserName:userInfo.nickname,
                                    cmsUserId:userInfo.uid,
                                    cmsUserEmail:userInfo.email,
                                })
                                //请求头像地址
                                this.$backendAxios({
                                    method:"post",
                                    url:"getAvatarByEmail",
                                    data:{
                                        email:userInfo.email,
                                    },
                                }).then((resss)=>{
                                    console.log(resss.data);
                                    if(resss.data.statusCode==0){
                                        var avatarUrl = resss.data.data.avatarUrl;
                                        this.$loginStore.$patch({
                                            cmsUserAvatar:avatarUrl,
                                        })
                                        this.isLoginSuccess = true;
                                        this.isLogining = false;
                                        this.isLoginFailed = false;
                                        this.submitShowText = "登录";
                                        this.$message.success("登录成功");
                                        this.$router.push("/");
                                    }else{
                                        this.isLoginSuccess = false;
                                        this.isLogining = false;
                                        this.isLoginFailed = true;
                                        this.submitShowText = "登录";
                                        this.$message.error("登录失败");
                                    }
                                }).catch((err)=>{
                                    this.isLoginSuccess = false;
                                    this.isLogining = false;
                                    this.isLoginFailed = true;
                                    this.submitShowText = "登录";
                                    this.$message.error("登录失败");
                                })
                            }else{
                                this.isLoginSuccess = false;
                                this.isLoginFailed = true;
                                this.isLogining = false;
                                this.submitShowText = "登录";
                                this.$message.error(ress.data.message);
                            }
                        }).catch((err)=>{
                            console.log(err);
                            this.isLoginSuccess = false;
                            this.isLoginFailed = true;
                            this.isLogining = false;
                            this.submitShowText = "登录";
                            this.$message.error("登录失败");
                        })
                    }else{
                        this.$message.error("登录失败,请检查用户名和密码及当前网络环境是否安全");
                    }
                }).catch(err=>{
                    console.log(err);
                    this.$message.error("登录失败,请检查用户名和密码及当前网络环境是否安全");
                })
            }
        },
        fetchTapLoginQR(){
            alert("I'm in Taplogin")
            var __this=this
            this.$backendAxios({
                method:"get",
                url:"/getTapQR",
            }).then((res)=>{
                console.log(res)
                __this.taptapAbout.loginQr=res.data
            })
        }
    },
}
</script>
<style scoped>
.login-modal{
    margin-top:20px;
    float:right;
    margin-right: 10px;
    opacity:1;

}
.center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>