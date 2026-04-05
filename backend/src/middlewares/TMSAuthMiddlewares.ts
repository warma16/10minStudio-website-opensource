var config=require("../config.js")
var axios=require("axios")
import crypto from "crypto-js"
var EncryptAdapter=require("../utils/CryptServersideAdapter.js");
const CaptchaSDK = require('dx-captcha-sdk');
var JsonDatabaseAdapter=require("../utils/JsonDatabaseAdapter.js");
class TMSAuthMiddlewares{
    config:any;
    dxCaptchaConfig:any;
    baseUrl:string;
    encryptAdapter:any;
    axios:any;
    dxCaptchaSDK:any;
    userDatabase:any;
    constructor(){
        this.config=config.TmsBackend
        this.dxCaptchaConfig=config.DxCaptcha
        this.baseUrl=this.config.url
        this.encryptAdapter=new EncryptAdapter();
        console.log(this.baseUrl)
        this.axios=new axios.create({
            baseURL:this.baseUrl,
            headers:{
                "Host":this.config.host,
            }
        })
        //console.log(this.encryptAdapter.Decode(this.dxCaptchaConfig.appId)[1])
        this.dxCaptchaSDK=new CaptchaSDK(
            this.encryptAdapter.Decode(this.dxCaptchaConfig.appId)[1],
            this.encryptAdapter.Decode(this.dxCaptchaConfig.appSecret)[1],
        )
        this.userDatabase=new JsonDatabaseAdapter(this.config.Databases.Users.path);

    }
    Login(){
        var __this=this;
        return async (req,res,next)=>{
            var axiosResponse;
            var returnData;
            var sendData = req.body,clientIp=req.headers["x-forwarded-for"]||req.connection.remoteAddress;
            var password=sendData.password;
            var dxToken=sendData.dxToken;
            var decodePasswordResult=__this.encryptAdapter.Decrypt(password);
            console.log(decodePasswordResult)
            if(decodePasswordResult[0]!=200){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:decodePasswordResult[1]
                });
                return;
            }
            var preSendPassword=decodePasswordResult[1];
            try{
                await  __this.dxCaptchaSDK.verifyToken(dxToken, clientIp)
            }catch(e){
                console.log(" error in valid dxToken")
                console.log(e)
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:e
                });
                return;
            }
            var sendPassword=crypto.MD5(preSendPassword).toString();
            var ident=sendData.ident;
            var config = {
                method: 'post',
                url: `/api/user/login`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : {
                    ident:ident,
                    password:sendPassword,
                    application:__this.config.auth.application.cmsUser

                }
            };
            try{
                axiosResponse=await __this.axios(config)
                returnData=axiosResponse.data;
                console.log(returnData)
                if(axiosResponse.data.statusCode!=200){
                    returnData.statusCode=-1;
                }
                if(axiosResponse.data.statusCode==200){
                    returnData.statusCode=0;
                    //把AccessToken存到数据库
                    var allowAccessTokens=await __this.userDatabase.Get("/allowAccessTokens");
                    console.log(allowAccessTokens)
                    allowAccessTokens.push(returnData.data.accessToken);
                    await __this.userDatabase.Set("/allowAccessTokens",allowAccessTokens);
                    __this.userDatabase=new JsonDatabaseAdapter(__this.config.Databases.Users.path);
                }
                await res.json(returnData);
            }catch(e){
                console.log(e)
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                });
            }
        }

    }
    GetDxCaptchaAppId(){
        var __this=this;
        return async (req,res,next)=>{
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    AppId:__this.dxCaptchaConfig.genreateIdFunc()
                }
            });
        }

    }
    GetAllInfo(){
        var __this=this;
        return async (req,res,next)=>{
            var bearerToken=req.body.accessToken;
            var bearTokenDecodeResult=await __this.encryptAdapter.Decrypt(bearerToken);
            if(bearTokenDecodeResult[0]!=200){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:bearTokenDecodeResult[1]
                });
                return;
            }
            var sendBearerToken=bearTokenDecodeResult[1];
            console.log(sendBearerToken)
            var axiosResponse;
            var returnData;
            var sendData = req.body;
            var config = {
                method: 'get',
                url: `/api/user/all-info?access_token=${sendBearerToken}`,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${sendBearerToken}`
                },
                
            };
            try{
                axiosResponse=await __this.axios(config)
                returnData=axiosResponse.data;
                console.log(returnData)
                if(axiosResponse.data.statusCode!=200){
                    returnData.statusCode=-1;
                }
                if(axiosResponse.data.statusCode==200){
                    returnData.statusCode=0;
                }
                await res.json(returnData);
            }catch(e){
                console.log(e)
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                });
            }
        }
    }
    hasKeptRights(){
        var __this=this;
        return async (req,res,next)=>{
            //所有method通用
            var requestAccessToken = req.body.accessToken  ;
            var pureAccessToken=req.query.accessToken;
            //把req.method全部大写
            //console.log(requestAccessToken)
            if(!pureAccessToken&&!requestAccessToken){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:"accessToken  is null"
                });
                return;
            }
            if(!pureAccessToken){
                var requestAccessTokenDecodeResult=await __this.encryptAdapter.Decrypt(requestAccessToken);
                if(requestAccessTokenDecodeResult[0]!=200){
                    await res.json({
                        statusCode:-1,
                        timestamp:new Date().getTime(),
                        errors:requestAccessTokenDecodeResult[1]
                    });
                    return;
                }
                var requestAccessRealToken=requestAccessTokenDecodeResult[1];
                console.log(requestAccessRealToken)
            }else{
                var requestAccessRealToken=pureAccessToken;
            }
            var allowAccessTokens=await __this.userDatabase.Get("/allowAccessTokens");
            console.log(allowAccessTokens)
            console.log(requestAccessRealToken)
            if(allowAccessTokens.indexOf(requestAccessRealToken)!=-1  ){
                next();
            }else{
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:"accessToken  is invalid"
                });
                return;
            }


        }
    }
    Logout(){
        var __this=this;
        return async (req,res,next)=>{
            var requestAccessToken = req.body.accessToken || req.query.accessToken ;
            //把req.method全部大写
            //console.log(requestAccessToken)
            if(!requestAccessToken){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:"accessToken  is null"
                });
                return;
            }
            var requestAccessTokenDecodeResult=await __this.encryptAdapter.Decrypt(requestAccessToken);
            if(requestAccessTokenDecodeResult[0]!=200){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:requestAccessTokenDecodeResult[1]
                });
                return;
            }
            var requestAccessRealToken=requestAccessTokenDecodeResult[1];
            var allowAccessTokens=await __this.userDatabase.Get("/allowAccessTokens");
            if(allowAccessTokens.indexOf(requestAccessRealToken)!=-1 ){
                var index=allowAccessTokens.indexOf(requestAccessRealToken);
                allowAccessTokens.splice(index,1);
                await __this.userDatabase.Set("/allowAccessTokens",allowAccessTokens);
                await res.json({
                    statusCode:0,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"logout success"
                    }
                });
                return;
            }else{
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:"accessToken  is invalid"
                });
                return;
            }

        }
    }
    
}
module.exports=TMSAuthMiddlewares