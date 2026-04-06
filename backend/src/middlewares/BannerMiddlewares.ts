let JsonDBAdapter =require("../utils/JsonDatabaseAdapter.js");
let configs=require("../config.js");
class BannerMiddlewares{
    private static config=configs.BannerAbout;
    private static Adapter=new JsonDBAdapter(BannerMiddlewares.config.Database.Path);
    public static GetBannerAbout=()=>{
        return async (req,res,next)=>{
            let banners:any=await BannerMiddlewares.Adapter.Get("/banners");
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:banners
            });
        }
    }
}
export default BannerMiddlewares;