import ConsoleEgg from './utils/ConsoleEgg';
import { createApp } from 'vue'
import App from './App.vue'
import routerConfig from './router'
import ArcoVue from '@arco-design/web-vue';
import "@arco-themes/vue-10minstudio/css/arco.css";
import vueEventbus from 'vue3-eventbus';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { Icon } from '@arco-design/web-vue';
import ComputeFullScreen from './utils/ComputeFullScreen';
import axios from 'axios';
import CookieManager from './utils/CookieManager';
import stores from './store/store';
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
import CryptAdapter from './utils/CryptBrowserAdapter';
import clipBorad from "vue-clipboard3";
import fingerprint from '@fingerprintjs/fingerprintjs';
import { createRouter} from "vue-router";
import Reporter from './api/report';
import DeviceCheck from './utils/DeviceCheck';
import UrlSchemeOpener from './utils/UrlSchemeOpener';
var app=createApp(App);
app.use(vueEventbus,{
    globalPropertyName: '$bus'
})
app.config.globalProperties.$isInCareerPage=false;
var fingerprintt=fingerprint.load();
var getVisitorId=(app,fingerprintt)=>{
    //从localStorage中获取visitorId
    var visitorId=localStorage.getItem("TMSvisitorId");
    if(!visitorId){

        fingerprintt.then((fp)=>{
            fp.get().then((result1)=>{
                fp.get().then((result2)=>{
                    fp.get().then((result3)=>{
                        var tmpVisitorId=result1.visitorId+result2.visitorId+result3.visitorId;
                        localStorage.setItem("TMSvisitorId",tmpVisitorId);
                        app.config.globalProperties.$visitorId=tmpVisitorId;
                    })
                })
            })
        })
    }else{
        app.config.globalProperties.$visitorId=visitorId;
    }
}
app.config.globalProperties.$visitorId="";
getVisitorId(app,fingerprintt);
app.config.globalProperties.$reporter=new Reporter(app.config.globalProperties.$visitorId)
app.config.globalProperties.$bus.on("nativeconsolelog",(content)=>{
    app.config.globalProperties.$reporter.nativeconsole.log(content)
})
ConsoleEgg()
var router=createRouter(routerConfig);

router.beforeEach((to,from,next)=>{
    //获取路由名称
    app.config.globalProperties.$reporter.nativeconsole.log(to)
    var routeName=to.name;
    if (window._hmt) {
        if (to.path) {
          window._hmt.push(['_trackPageview', '/#' + to.fullPath])

        }
      }
    //如果routeName中有Carrer字符串，则设置$isInCareerPage为true
    if(routeName.indexOf("Carrer")>-1){
        app.config.globalProperties.$isInCareerPage=true;
        //eventbus 发送事件
        app.config.globalProperties.$bus.$emit("isInCareerPage",true);
    }
    next();
})
let Clip = clipBorad;
/*对于正式上线环境
*var prodBackendurl="http://10minstudio.com:3000"
*/
//团队内部测试环境
var prodBackendurl="https://t"
var devBackendurl="http://127.0.0.1:3000"//"http://127.0.0.1:3000"
let { toClipboard } = Clip();
const pinia = createPinia()
pinia.use(piniaPluginPersist)
var backendUrl=process.env.NODE_ENV==="production"?prodBackendurl:devBackendurl
var computeFullScreen=new ComputeFullScreen();
var cryptAdapter=new CryptAdapter();
console.log(cryptAdapter)

const IconFont = Icon.addFromIconFontCn({ src: './assets/iconfont.js' });
// 全局注册IconFont组件
app.component('IconFont', IconFont);
app.use(pinia)
app.use(router)
app.use(ArcoVue)

app.use(ArcoVueIcon);

var computeFullScreen=new ComputeFullScreen(false,(style)=>{
    app.config.globalProperties.$bus.emit('fullscreenStyle',style);
    app.config.globalProperties.$fullscreenStyle=style;
});
app.config.globalProperties.$backendAxios=axios.create({
    baseURL:backendUrl,
})
app.config.globalProperties.$backendAxios.interceptors.request.use((config)=>{
    app.config.globalProperties.$reporter.report("success","axiosOnRequest",{
        TMSVisitorId:app.config.globalProperties.$visitorId,
        eventData:{
            url:config.url,
            method:config.method,
            data:config.data,
            query:config.params,
            headers:config.headers,

        }
    })
    return config;
},(error)=>{
    app.config.globalProperties.$reporter.report("error","axiosOnRequest",{
        TMSVisitorId:app.config.globalProperties.$visitorId,
        eventData:{
            url:error.config.url,
            method:error.config.method,
            data:error.config.data,
            query:error.config.params,
            headers:error.config.headers,
            error:error.message,
        }
    })
    return Promise.reject(error);
})
app.config.globalProperties.$backendAxios.interceptors.response.use((response)=>{
    app.config.globalProperties.$reporter.report("success","axiosOnResponse",{
        TMSVisitorId:app.config.globalProperties.$visitorId,
        eventType:2,
        eventData:{
            url:response.config.url,
            method:response.config.method,
            data:response.data,
            query:response.config.params,
            headers:response.headers,
        }
    })
    return response;
},(error)=>{
    app.config.globalProperties.$reporter.report("success","axiosOnResponse",{
        TMSVisitorId:app.config.globalProperties.$visitorId,
        eventType:2,
        eventData:{
            url:error.config.url,
            method:error.config.method,
            data:error.config.data,
            query:error.config.params,
            headers:error.config.headers,
            error:error.message,
        }
    })
    return Promise.reject(error);
})
app.config.globalProperties.$backendUrl=backendUrl;
app.config.globalProperties.$cookieManager=new CookieManager();
app.config.globalProperties.$displayStore=stores.displayStore();
app.config.globalProperties.$loginStore=stores.loginStore();
app.provide("$cryptAdapter",cryptAdapter);
app.config.globalProperties.$cryptAdapter=cryptAdapter;
app.config.globalProperties.$toClipboard=toClipboard;
app.config.globalProperties.$deviceCheck=DeviceCheck
app.config.globalProperties.$urlSchemeOpener=UrlSchemeOpener;

app.mount('#app')