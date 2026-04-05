
var express=require('express');
var app=express();
var busboy = require('connect-busboy');
var cors=require('cors');
var expressWs=require('express-ws');
var config=require('./config.js');
var authRouter=require('./routers/Auth');
var articleRouter=require('./routers/Article');
var dxCaptchaRouter=require('./routers/DxCaptchaApi');
var hitokotoRouter=require('./routers/Hitokoto');
var avatarRouter=require('./routers/Avatar');
var OneWordUpdatePlugin=require('./Plugins/UpdateOnewordSentencePack');
var ReportWSRouter=require('./routers/ReportWS');
var BiliApiRouter=require('./routers/BiliApi');
var corsWhiteList=config.AllowCORSOrigin;
import CareerRouter from './routers/Career';
import BannerRouter from "./routers/Banner";
import MemberRouter from "./routers/Member";
import I18NRouter from "./routers/I18N";

app.use(cors({
    option:(origin,callback)=>{
        if(corsWhiteList.indexOf(origin)>-1){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    }
}))
app.use(express.json());
app.use(busboy());
expressWs(app);
app.use(articleRouter);
app.use(authRouter);
app.use(dxCaptchaRouter);
app.use(avatarRouter);
app.get("/",async (req,res)=>{
    //检查头里面有没有:authority: api.dingxiang-inc.com
    if(req.headers.authority=="api.dingxiang-inc.com"){
        res.send("Hello World");
        return;
    }
    res.send("周公吐哺，天下归心。10minStudio欢迎你的加入")
})
//把hikotoko Router挂载到app的"/hitokoto"路径上
app.use('/hitokoto',hitokotoRouter);
app.use("/report",ReportWSRouter);
app.use("/biliapi",BiliApiRouter)
app.use("/career",CareerRouter);
app.use("/banner",BannerRouter);
app.use("/member",MemberRouter);
app.use("/i18n",I18NRouter);
app.listen(3000,'127.0.0.1',()=>{
    console.log('Server is running at port 3000');
    //var oneWordUpdatePlugin=new OneWordUpdatePlugin();
})