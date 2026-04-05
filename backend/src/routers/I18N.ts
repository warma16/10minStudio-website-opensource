import I18NMiddlewares from "../middlewares/I18NMiddleware";
import {Router} from "express"
let router=Router()
router.get("/",I18NMiddlewares.GetI18N())
export default router