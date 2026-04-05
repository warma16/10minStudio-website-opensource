var router=require('express').Router();
var HitokotoMiddlewaresInstance=require('../middlewares/HitokotoMiddlewares');
var hitokotoMiddlewares=new HitokotoMiddlewaresInstance();
router.get('/',hitokotoMiddlewares.getRandomSentence());
module.exports=router;