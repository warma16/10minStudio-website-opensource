var BiliBiliLib=require("../utils/biliApi.js")
class BiliApiMiddlewares{
    biliApi:any;
    constructor(){
        this.biliApi=new BiliBiliLib();
    }
    getUserInfo(){
        var __this=this;
        return async (req,res,next)=>{
            var mid=req.query.mid;
            if(!mid){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:"mid is null"
                });
                return;
            }
            try{
                var userInfo=await __this.biliApi.getUserInfo(mid);
                await res.json({
                    statusCode:0,
                    timestamp:new Date().getTime(),
                    data:userInfo
                });
            }catch(e){
                await res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    errors:e
                });
                return;
            }
        }
    }
}
module.exports=BiliApiMiddlewares;