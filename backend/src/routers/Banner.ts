import BannerMiddlewares from "../middlewares/BannerMiddlewares";
import { Router } from "express";
let router=Router();
router.get("/",BannerMiddlewares.GetBannerAbout())
export default router;