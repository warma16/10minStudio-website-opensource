var express=require('express');
var expressWs = require('express-ws');
var router=express.Router();
expressWs(router);
var TMSAuthMiddlewaresLib=require('../middlewares/TMSAuthMiddlewares');
import TapTapMiddlewares from "../middlewares/TapTapMiddlewares";
import WSHandleScheduler from "../utils/WSHandleScheduler";
WSHandleScheduler.importTasks([TapTapMiddlewares.CheckLoginQRWS()])
var TMSAuthMiddlewares=new TMSAuthMiddlewaresLib();
//router.post('/register',TMSAuthMiddlewares.Register());
router.post('/login',TMSAuthMiddlewares.Login());
router.post("/getDxCaptchaAppId",TMSAuthMiddlewares.GetDxCaptchaAppId());
router.post("/getAllInfo",TMSAuthMiddlewares.GetAllInfo());
router.post('/logout',TMSAuthMiddlewares.Logout());
router.get("/getTapQR",TapTapMiddlewares.FetchLoginQR());
router.ws("/checkTapQR",(ws, req)=>{
    ws.on('message', (msg)=>{
        if(msg=="ping"){
            ws.send("pong");
        }else{
            console.log(msg);
            WSHandleScheduler.Start(ws,msg)
        }
        
    })
})
module.exports=router;