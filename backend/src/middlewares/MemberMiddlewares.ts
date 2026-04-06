let JsonDBAdapter =require("../utils/JsonDatabaseAdapter.js");
let configs=require("../config.js");
class MemberMiddlewares{
    private static config=configs.MemberAbout;
    private static Adapter=new JsonDBAdapter(MemberMiddlewares.config.Database.Path);
    public static GetMemberAbout=()=>{
        return async (req,res,next)=>{
            let members:any=await MemberMiddlewares.Adapter.Get("/members");
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:members
            });
        }
    }
}
export default MemberMiddlewares;