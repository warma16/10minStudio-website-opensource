import CareerMiddlewares from "../middlewares/CareerMiddlewares";
import { Router } from "express";
let router=Router();
router.get("/",CareerMiddlewares.GetCareerAbout());
router.get("/names",CareerMiddlewares.GetCareerNames());
router.get("/searchByName",CareerMiddlewares.GetCareerByName());
router.get("/searchByTag",CareerMiddlewares.GetCareerByTag());
export default router;