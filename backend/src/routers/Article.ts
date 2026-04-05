var express=require('express');

var router=express.Router();
var ArticleMiddlewaresLib=require('../middlewares/ArticleMiddlewares');
var ArticleMiddlewaresInstance=new ArticleMiddlewaresLib();
var TMSAuthMiddlewaresLib=require('../middlewares/TMSAuthMiddlewares');
var TMSAuthMiddlewares=new TMSAuthMiddlewaresLib();
router.post("/getArticle",ArticleMiddlewaresInstance.GetArticle());
router.post("/getMarkdown",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.GetMarkdown());
router.post("/uploadArticleResource",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.UploadArticleResource());
router.get("/getArticleResource",ArticleMiddlewaresInstance.GetArticleResource());
router.post("/getAllMarkdownsByOwner",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.GetAllMarkdownsByOwner());
router.post("/createArticle",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.CreateArticle());
router.post("/createMarkdown",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.CreateMarkdown());
router.post("/updateMarkdown",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.UpdateMarkdown());
router.post("/forkMarkdown",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.ForkMarkdown());
router.post("/postArticle",TMSAuthMiddlewares.hasKeptRights(),ArticleMiddlewaresInstance.PostArticle());
module.exports=router;
