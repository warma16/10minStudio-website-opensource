import fs from "fs/promises"
import path from "path"
var conf=require("../config.js");

class I18NMiddlewares{
    private static resourcesPath=conf.I18NAbout.Resources.Path
    private static async GetI18NJsonPath(lang="zh-cn"){
        return path.join(this.resourcesPath,`/${lang}.json`)
    }
    private static async ReadI18NJson(lang="zh-cn"){
        let fullPath=await this.GetI18NJsonPath(lang)
        try{
            let oData=await fs.readFile(fullPath,'utf-8')

            return oData
        }catch(e){
            console.log(e)
            return JSON.stringify({
                err:"404"
            })
        }
    }
    public static GetI18N=()=>{
        let __this=this
        return async (req,res)=>{
            let lang=req.query.lang
            console.log(lang)
            let i18nJson=await __this.ReadI18NJson(lang)
            console.log(i18nJson)
            await res.send(i18nJson)
        }
    }
}
export default I18NMiddlewares
