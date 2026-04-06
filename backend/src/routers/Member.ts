import MemberMiddlewares from "../middlewares/MemberMiddlewares";
import { Router } from "express";
let router=Router();
router.get("/",MemberMiddlewares.GetMemberAbout())
export default router;