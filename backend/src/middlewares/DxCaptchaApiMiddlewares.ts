var fs=require('fs');
var conf=require("../config.js");
var axios=require('axios');
class DxCaptchaResoucesMiddlewares{
    minImageId:number;
    maxImageId:number;
    config:any;
    dxOriginalAxios:any;
    bingCnAxios:any;
    bingPhotoAxios:any;
    constructor(){
        this.minImageId=0;
        this.maxImageId=148;
        this.config=conf.DxCaptcha;
        this.dxOriginalAxios=axios.create({
            baseURL:this.config.Api.OriginalUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
                "Origin":this.config.Api.OriginalOrigin,
                "Referer":this.config.Api.OriginalReferer,
                "origin":this.config.Api.OriginalOrigin,
                "referer":this.config.Api.OriginalReferer,
            }
        });
        this.bingCnAxios=axios.create({
            baseURL:"https://cn.bing.com",
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
            }
        })
    }
    GetDxCaptchaImage(){
        var __this=this;
        return (req,res,next)=>{
            console.log("GetDxCaptchaImage");
            console.log(req.query.aid)
            console.log(req.query.aid&&req.query.aid.startsWith("dx"))
            var isRequestFromDxCaptcha=false;
            //如果query中aid属性的值以dx开头则认为是验证码请求
            if(req.query.aid&&req.query.aid.startsWith("dx")){
                isRequestFromDxCaptcha=true;
            }
            if(isRequestFromDxCaptcha){
                //随机在__this.minImageId和__this.maxImageId之间取一个数字,可以包含__this.minImageId和__this.maxImageId
                var imageId=Math.floor(Math.random()*(__this.maxImageId-__this.minImageId+1))+__this.minImageId;
                var fileName=`${imageId}.jpg`
                var filePath=`${this.config.Resources.Images.path}/${fileName}`;
                var fileReadStream=fs.createReadStream(filePath);
                fileReadStream.on("error",(e)=>{
                    console.log(e)
                    res.json({
                        statusCode:-1,
                        errors:String(e),
                        timestamp:new Date().getTime(),
                    });
                    return;
                })
                try{
                
                   //返回图片
                     res.setHeader("Content-Type","image/jpeg");
                        fileReadStream.pipe(res);
                }catch(e){
                    console.log(e)
                    res.json({
                        statusCode:-1,
                        errors:String(e),
                        timestamp:new Date().getTime(),
                    });
                    return;
                }
            }else{
                next();
            }
        }
    }
    AllDxCaptchaProxy(){
        var __this=this;
        return async (req,res,next)=>{
            console.log("AllDxCaptchaProxy");
            console.log(req.query.aid)
            console.log(req.query.aid&&req.query.aid.startsWith("dx"))
            var isRequestFromDxCaptcha=false;
            var dxAxiosResult;
            var requestUrl,requestHeaders,dxAxiosRequestHeaders,dxAxiosRequestUrl;
            var dxAxiosResponseHeaders,dxAxiosResponseData;
            //如果query中aid属性的值以dx开头则认为是验证码请求
            if(req.query.aid&&req.query.aid.startsWith("dx")){
                isRequestFromDxCaptcha=true;
            }
            if(isRequestFromDxCaptcha){
                try{
                    //获取请求路径
                    requestUrl=req.originalUrl;
                    //获取请求头
                    requestHeaders=req.headers;
                    console.log(requestUrl)
                    dxAxiosRequestUrl=requestUrl.replace(__this.config.Api.ProxyUrl,"")
                    dxAxiosRequestHeaders=requestHeaders;
                    //从 origin 和 referer 中提取host
                    dxAxiosRequestHeaders.host=dxAxiosRequestHeaders.origin.replace(/^https?:\/\//,"").replace(/\/.*$/,"");
                    //dxAxiosRequestHeaders.origin=__this.config.Api.OriginalOrigin;
                    //dxAxiosRequestHeaders.referer=__this.config.Api.OriginalReferer;
                    //dxAxiosRequestHeaders.host="cap.dingxiang-inc.com";
                    //要原模原样的把请求发送给dx，再把dx的响应原模原样返回给客户端
                    console.log(dxAxiosRequestHeaders)
                    dxAxiosResult  = await __this.dxOriginalAxios({
                        method:`${req.method}`,
                        url:`${dxAxiosRequestUrl}`,
                        data:req.body,
                        headers:dxAxiosRequestHeaders,
                        params:req.query,
                    });
                    //打印整个过程中的请求头，请求的参数，url和方法
                    console.log(dxAxiosResult.request._headers);
                    console.log(dxAxiosResult.request.params);
                    console.log(dxAxiosResult.request.url);
                    console.log(dxAxiosResult.request.method);
                    dxAxiosResponseHeaders=dxAxiosResult.headers;
                    dxAxiosResponseData=dxAxiosResult.data;
                    for(var key in dxAxiosResponseHeaders){
                        res.setHeader(key,dxAxiosResponseHeaders[key]);
                    }
                    res.json(dxAxiosResponseData);
                    
                }catch(e){
                    console.log(e)
                    await res.json({
                        statusCode:-1,
                        errors:String(e),
                        timestamp:new Date().getTime(),
                    });
                    return;
                }
            }else{
                next();
            }
        }
    }
    GetBingImage(){
        var __this=this;
        return async (req,res,next)=>{
            console.log("GetBingImage");
            console.log(req.query.aid)
            console.log(req.query.aid&&req.query.aid.startsWith("dx"))
            var isRequestFromDxCaptcha=false;
            var photoDatas;
            var requestQuerys=req.query;
            var sendQuery=requestQuerys;
            if(req.query.aid&&req.query.aid.startsWith("dx")){
                isRequestFromDxCaptcha=true;
            }
            if(isRequestFromDxCaptcha){
                try{
                    sendQuery["format"]="js"
                    photoDatas = await __this.bingPhotoAxios({
                        method:"get",
                        url:"/HPImageArchive.aspx",
                    });
                    await res.json({
                        statusCode:0,
                        data:photoDatas.data,
                        timestamp:new Date().getTime(),
                    });
                }catch(e){
                    console.log(e)
                    await res.json({
                        statusCode:-1,
                        errors:String(e),
                        timestamp:new Date().getTime(),
                    });
                    return;
                }
            }else{
                next();
            }
        }

                
    }

}
module.exports=DxCaptchaResoucesMiddlewares;