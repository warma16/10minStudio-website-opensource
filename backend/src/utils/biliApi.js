var axios=require('axios');
var grpc=require('@grpc/grpc-js');


class BIlibiliApi{
    constructor(){
        var __this=this;
        this.requestResponsePool={};
       this.biliApiConfig={
            baseUrl:"https://api.bilibili.com/x",
            appGrpcUrl:"app.bilibili.com",
            normalGrpcUrl:"grpc.biliapi.net",
            errCodes:{
                //see https://github.com/warma16/bilibili-API-collect/blob/master/other/errcode.md
                //for more error code
                "-1":"应用程序不存在或者已经被禁用",
                "-2":"access key不正确",
                "-412":"请求被风控系统拦截",
                "-400":"请求参数不正确",

            }
        }
        this.restfulApi=axios.create({
            baseURL:this.biliApiConfig.baseUrl,
            headers:{
                "Host":"api.bilibili.com",
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
            }
        });
        this.restfulApi.interceptors.response.use(
            (response)=>{
                var code=response.data.code;
                console.log(code)
                var errorCodes=Object.keys(__this.biliApiConfig.errCodes);
                if(errorCodes.includes(code.toString())){
                    throw response.data.message;
                }else{
                    return response;
                }
            }
        )
        //this.appGrpcClient=new grpc.Client(biliApiConfig.appGrpcUrl,grpc.credentials.createInsecure());
        //this.normalGrpcClient=new grpc.Client(biliApiConfig.normalGrpcUrl,grpc.credentials.createInsecure());
    }
    async getUserInfo(uid=0){
        var res=await this.restfulApi.get(`space/acc/info`,{
            params:{
                mid:uid,
            }
        });
        var data=res.data;
        var avatar=data.data.face;
        var name=data.data.name;
        return {
            avatar,
            name
        }
    }
}
module.exports=BIlibiliApi;