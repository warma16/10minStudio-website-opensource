import crypto from "crypto-js"
var identicon = require('identicon.js');
var fs=require("fs")
class AvatarByEmailMiddlewares{
    emailUrl:string;
    identiconConfig:any;
    constructor(){
        this.emailUrl="http://127.0.0.1:3000"
        this.identiconConfig={
            format:"svg",
        }
    }
    GetAvatarByEmail(){
        return async (req,res,next)=>{
            var email=req.body.email;
            const address = String( email ).trim().toLowerCase();
            var hash= await crypto.MD5(address).toString();
            var avatarUrl=this.emailUrl+`/avatar/${hash}`;
            await res.json({
                statusCode:0,
                data:{
                    avatarUrl:avatarUrl
                },
                timestamp:new Date().getTime(),
            });
        }
    }
    GenerateAvatarByHash(){
        var __this=this;
        return async (req,res,next)=>{
            var hash=req.params.hash;
            //return like data:image/svg+xml;base64,
            var resultBase64=new identicon(hash,__this.identiconConfig).toString();
            var resultBuffer=Buffer.from(resultBase64,"base64");
            //设置头为 image/svg+xml
            await res.setHeader('Content-Type', 'image/svg+xml');
            await res.send(resultBuffer);
        }
    }
}
module.exports=AvatarByEmailMiddlewares;