var config=require("../config.js")
var axios=require("axios")
import crypto from "crypto-js"
var EncryptAdapter=require("../utils/CryptServersideAdapter.js");
import { ScanningState ,TapTapConf,CompleteQRCodeData} from "../utils/TapTapApi/interfaces";
import { TapTapHelper } from "../utils/TapTapApi/lib";
function sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * function sleep(ms:number){
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function test(){
    var testAppConfig=<TapTapConf>{
        clientId:'your_client_id',
        clientToken:'your_client_token',
    }
    await TapTapHelper.init("your_tap_sdk_version",testAppConfig)
    var res=await TapTapHelper.requestLoginQrCode()
    var qrUrl=res.url
    console.log(qrUrl)
    console.log(res.expiresInSeconds)
    console.log(Date.now() - res.now*1000)
    var lastState:ScanningState
    while (Date.now() - res.now*1000 < res.expiresInSeconds * 1000) {
        
        var loginRes=await TapTapHelper.checkQRCodeResult(res)
        if(TapTapHelper.currentScanningState==ScanningState.Success){
            break;
        }
        await sleep(3000)
    }
    var respp=await TapTapHelper.getProfile(loginRes)
    console.log(respp)
    


}
 */
interface LoginCache{
    expires_in:number,
    isEnded:boolean,
    completeQRCodeData:CompleteQRCodeData,
    ScanningState:ScanningState
}
var CacheDict:{[user_code:string]:LoginCache}={}
//监听setter方法在setter的时候实现gc
class TapTapMiddlewares{
    private static AppConfig:TapTapConf={
        clientId:'<your_client_id>',
        clientToken:'<your_client_token>',
    }
    public static FetchLoginQR(){
        return async (req,res,next)=>{
            TapTapHelper.init("3.0",TapTapMiddlewares.AppConfig)
            var ress=await TapTapHelper.requestLoginQrCode()
            console.log(ress.deviceCode)
            var urlparams=new URLSearchParams(ress.url)
            var user_code=urlparams.get("user_code")
            CacheDict[user_code]={
                expires_in:ress.expiresInSeconds,
                isEnded:false,
                completeQRCodeData:ress,
                ScanningState:ScanningState.Waiting
            }
            res.send(ress.url)
            
        }
    }
    public static CheckLoginQRWS(){
        return async (req,res,next)=>{
            //用WSHandleScheduler来处理
            //console.log("check")
            //console.log(req.body)
            var input=req.params
            var data=input.user_code
            var LoginCache=CacheDict[data]
            var completeQRCodeData=LoginCache.completeQRCodeData
            var ws=req.ws
            var isClosed=false
            var isEnded=LoginCache.isEnded
            var isReplied=false
            ws.on("close",()=>{
                isClosed=true
            })
            if(isEnded){
                await res.send({
                    state:LoginCache.ScanningState,
                    userCode:input.user_code,
                    isEnded:isEnded
                })
                isReplied=true
                return;
            }
            var oldState:ScanningState;
            console.log(completeQRCodeData.expiresInSeconds)
            while (Date.now() - completeQRCodeData.now*1000 <= completeQRCodeData.expiresInSeconds * 1000+30*1000) {
                if(isClosed){
                    break;
                }
        
                await TapTapHelper.checkQRCodeResult(completeQRCodeData)
                var newState=TapTapHelper.currentScanningState
                if(newState!=oldState){
                    oldState=newState
                    if(newState!=ScanningState.Waiting&&newState!=ScanningState.Other&&newState!=ScanningState.Scanning){
                        isEnded=true
                        CacheDict[input.user_code].isEnded=true
                        CacheDict[input.user_code].ScanningState=newState
                    }
                    await res.send({
                        state:newState,
                        userCode:input.user_code,
                        isEnded:isEnded
                    })
                    if(isEnded){
                        break;
                    }
                }
                await sleep(3000)
            }
            
        }
        
    }
}

export default TapTapMiddlewares