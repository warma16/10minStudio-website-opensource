var router = require('express').Router();
var BiliApiMiddlewaresLib = require('../middlewares/BiliApiMiddlewares');
var biliApiMiddlewares = new BiliApiMiddlewaresLib();
router.get('/getUserInfo', biliApiMiddlewares.getUserInfo());
module.exports = router;