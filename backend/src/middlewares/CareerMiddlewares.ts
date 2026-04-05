let JsonDBAdapter =require("../utils/JsonDatabaseAdapter.js");
let configs=require("../config.js");
class CareerMiddlewares{
    private static config=configs.CareerAbout;
    private static Adapter=new JsonDBAdapter(CareerMiddlewares.config.Database.Path);
    public static GetCareerAbout=()=>{
        return async (req,res,next)=>{
            let careers:any=await CareerMiddlewares.Adapter.Get("/careers");
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:careers
            });
        }
    }
    public static GetCareerNames=()=>{
        return async (req,res,next)=>{
            let careers:any=await CareerMiddlewares.Adapter.Get("/careers");
            let names:string[]=[];
            await careers.forEach((career:any)=>{
                names.push(career.name);
            });
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:names
            });
        }
    }
    public static GetCareerByName=()=>{
        return async (req,res,next)=>{
            let careers:any=await CareerMiddlewares.Adapter.Get("/careers");
            let career:any=await careers.find((career:any)=>{
                return career.name==req.query.name;
            })||{};
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:career
            });
        }
    }
    public static GetCareerByTag=()=>{
        return async (req,res,next)=>{
            let careers:any=await CareerMiddlewares.Adapter.Get("/careers");
            let career:any=await careers.find((career:any)=>{
                return career.tags.indexOf(req.query.tag)>-1;
            })||{};
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:career
            });
        }
    }
}
export default CareerMiddlewares;