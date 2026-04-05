var router=require('express').Router();
var AvatarMiddlewaresLib=require('../middlewares/AvatarMiddlewares');
var AvatarMiddlewares=new AvatarMiddlewaresLib();
router.post("/getAvatarByEmail",AvatarMiddlewares.GetAvatarByEmail());
router.get("/avatar/:hash",AvatarMiddlewares.GenerateAvatarByHash());
module.exports=router;