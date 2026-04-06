var router = require('express').Router();
var DxCaptchaResoucesMiddlewaresInstance= require('../middlewares/DxCaptchaApiMiddlewares');
var config=require('../config.js');
var dxApiConfig=config.DxCaptcha.Api
var dxCaptchaResoucesMiddlewares=new DxCaptchaResoucesMiddlewaresInstance();
router.get(`${dxApiConfig.ProxyUrl}/randomImage`,dxCaptchaResoucesMiddlewares.GetBingImage());
module.exports = router;