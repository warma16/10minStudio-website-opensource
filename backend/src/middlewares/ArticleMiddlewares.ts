var config =require("../config")
var Adapter=require("../utils/JsonDatabaseAdapter")
const { nanoid } = require("nanoid");
var fs=require("fs");
class ArticleMiddlewares{
    config:any;
    nanoid:any;
    markdownAdapter:any;
    articleAdapter:any;
    articleLanguages:any;
    constructor(){
        this.config=config.ArticleAbout;
        this.nanoid=nanoid;
        this.markdownAdapter=new Adapter(this.config.Databases.Markdown.path);
        this.articleAdapter=new Adapter(this.config.Databases.Article.path);
        this.articleLanguages=this.config.Languages;
    }
    CreateArticle(){
        //创建文章而不是发布文章啊喂
        var __this=this;
        var GenerateArticleId=async ()=>{
            var tmpArticleId=nanoid();
            var articleData=await __this.articleAdapter.SearchAllResults("/articles",(val)=>{
                return val.articleId==tmpArticleId;
            })
            if(articleData.length>0){
                GenerateArticleId();
            }
            return tmpArticleId;
        }
        return async (req,res,next)=>{
            var tmpArticleId=await GenerateArticleId();
            var articleTemplate={
                "articleId":tmpArticleId,
            }
            await __this.articleLanguages.forEach((language)=>{
                articleTemplate[language]={
                    "markdownId":null
                }
            })
            var originArticleDatas=await __this.articleAdapter.Get("/articles");
            originArticleDatas.push(articleTemplate);
            await __this.articleAdapter.Set("/articles",originArticleDatas);
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    articleId:tmpArticleId,
                }
            });

        }
    }
    UploadArticleResource(){
        var __this=this;
        return (reqq,ress,nextt)=>{
            var fileId=`${__this.nanoid()}${__this.nanoid()}${__this.nanoid()}`;
            var middleware=(req,res,next)=>{
                var fsStream;
                req.pipe(req.busboy);
                req.busboy.on('file', (fieldname, file, filename)=>{
                    console.log(filename.filename)
                    var fileName=String(filename.filename);
                    var fileNameArray=fileName.split(".");
                    var type=fileNameArray[fileNameArray.length-1];
                    var newFileName=`${fileId}.${type}`;
                    var newFilePath=`${__this.config.Resources.path}/${newFileName}`;
                    console.log("Uploading: " + newFileName); 
                    fsStream = fs.createWriteStream(newFilePath);
                    file.on("end",()=>{
                        console.log("end")
                        fsStream.end();
                        console.log("send_info")
                        res.json({
                            statusCode:0,
                            timestamp:new Date().getTime(),
                            data:{
                                fileName:newFileName,
                            }
                        });
                    })
                    file.pipe(fsStream);
                });

            }
            middleware(reqq,ress,nextt);

        }
    }
    GetArticleResource(){
        var __this=this;
        return (req,res,next)=>{
            //like?fileName=2.3.4
            var fileName=req.query.fileName;
            var filePath=`${__this.config.Resources.path}/${fileName}`;
            var fileStream=fs.createReadStream(filePath);
            fileStream.on("error",(e)=>{
                console.log(e)
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                });
                return;
            })
            try{
                
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', 'attachment; filename='+fileName);
                //发送文件二进制数据
                fileStream.pipe(res);
            }catch(e){
                console.log(e)
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                });
                return;
            }
        }
    }
    GetArticle(){
        var __this=this;
        return async (req,res,next)=>{
            var requestData=req.body;
            var articleId=requestData.articleId;
            var language=requestData.language;
            var hasLanguage;
            var markdownData,markdownId;
            var articleData=await __this.articleAdapter.SearchFirstResult("/articles",(val)=>{
                return articleId==val.articleId;
            })
            if(articleData==null){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"article not found"
                    }
                });
                return;
            }
            for(var key in articleData){
                if(key==language){
                    hasLanguage=true;
                    break;
                }

            }
            if(!hasLanguage){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"language not found"
                    }
                });
                return;
            }
            markdownData=articleData[language];
            markdownId=markdownData.markdownId;
            var markdownInstance=await __this.markdownAdapter.SearchFirstResult("/markdowns",(val)=>{
                return val.markdownId==markdownId;
            })
            if(markdownInstance==null){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"markdown not found"
                    }
                });
                return;
            }
            res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    title:markdownInstance.title,
                    content:markdownInstance.content,
                }
            });
            


        }
    }
    PostArticle(){
        var __this=this
        return async (req,res,next)=>{
            var requestData=req.body;
            var articleId=requestData.articleId;
            var markdownId=requestData.markdownId;
            var language=requestData.language;
            var articleData=await __this.articleAdapter.SearchFirstResult("/articles",(val)=>{
                return val.articleId==articleId;
            })
            var originalArticleData=articleData;
            if(articleData==null){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"article not found"
                    }
                });
                return;
            }
            if(__this.articleLanguages.indexOf(language)==-1){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"language not found"
                    }
                });
                return;
            }
            articleData[language]={
                "markdownId":markdownId
            }
            var originArticleDatas=await __this.articleAdapter.Get("/articles");
            //去除原来的数据
            originArticleDatas.splice(originArticleDatas.indexOf(originalArticleData),1);
            //添加新的数据
            originArticleDatas.push(articleData);
            await __this.articleAdapter.Set("/articles",originArticleDatas);
            res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    message:"success"
                }
            });

        }
    }
    CreateMarkdown(){
        var __this=this;
        var GenerateMarkdownId=async ()=>{
            var tmpId=`${__this.nanoid()}${__this.nanoid()}${__this.nanoid()}`;
            var elements=await __this.markdownAdapter.SearchAllResults("/markdowns",(val)=>{
                return val.markdownId==tmpId;
            })
            if(elements.length>0){
                GenerateMarkdownId();
            }
            return tmpId;
        }
        return async (req,res,next)=>{
            var requestData=req.body;
            var owner=requestData.owner;
            var willBindArticleId=requestData.articleId;
            var markdownId=await GenerateMarkdownId();
            var originMarkdownDatas= await __this.markdownAdapter.Get("/markdowns");
            var markdownData={
                "markdownId":markdownId,
                "title":"标题",
                "content":"",
                "createdAt":new Date().getTime(),
                "updatedAt":new Date().getTime(),
                "owner":owner,
                "willBindArticleId":willBindArticleId,
            }
            originMarkdownDatas.push(markdownData);
            await __this.markdownAdapter.Set("/markdowns",originMarkdownDatas);
            await res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    markdownId:markdownId,
                }
            });

        }
    }
    GetMarkdown(){
        var __this=this;
        return async (req,res,next)=>{
            var requestData=req.body;
            var markdownId=requestData.markdownId;
            console.log(markdownId)
            var markdownInstance=await __this.markdownAdapter.SearchFirstResult("/markdowns",(val)=>{
                return val.markdownId==markdownId;
            })
            if(markdownInstance==null){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"markdown not found"
                    }
                });
                return;
            }
            res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    title:markdownInstance.title,
                    content:markdownInstance.content,
                    createdAt:markdownInstance.createdAt,
                    updatedAt:markdownInstance.updatedAt,
                    owner:markdownInstance.owner,
                },
            });
        }
    }
    UpdateMarkdown(){
        var __this=this;
        return async (req,res,next)=>{
            var requestData=req.body;
            var markdownId=requestData.markdownId;
            var markdownData=await __this.markdownAdapter.SearchFirstResult("/markdowns",(val)=>{
                return val.markdownId==markdownId;
            })
            var originalMarkdownData=markdownData;
            if(markdownData==null){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"markdown not found"
                    }
                });
                return;
            }
            var title=requestData.title;
            var content=requestData.content;
           // console.log(markdownData)
            var updatedAt=new Date().getTime();
            markdownData.title=title;
            markdownData.content=content;
            markdownData.updatedAt=updatedAt;
            var originalMarkdownDatas=await __this.markdownAdapter.Get("/markdowns");
            //去掉原来的数据
            originalMarkdownDatas.splice(originalMarkdownDatas.indexOf(originalMarkdownData),1);
            //添加新的数据
            originalMarkdownDatas.push(markdownData);
            await __this.markdownAdapter.Set("/markdowns",originalMarkdownDatas);
            res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    message:"success"
                }
            });

        }
    }
    ForkMarkdown(){
        var __this=this;
        var GenerateMarkdownId=async ()=>{
            var tmpId=`${__this.nanoid()}${__this.nanoid()}${__this.nanoid()}`;
            var elements=await __this.markdownAdapter.SearchAllResults("/markdowns",(val)=>{
                return val.markdownId==tmpId;
            })
            if(elements.length>0){
                GenerateMarkdownId();
            }
            return tmpId;
        }
        return async (req,res,next)=>{
            var requestData=req.body;
            var oldMarkdownId=requestData.markdownId;
            var toOwner=requestData.toOwner;
            var originMarkdownData=await __this.markdownAdapter.SearchFirstResult("/markdowns",(val)=>{
                return val.markdownId==oldMarkdownId;
            })
            if(originMarkdownData==null){
                res.json({
                    statusCode:-1,
                    timestamp:new Date().getTime(),
                    data:{
                        message:"be forked markdown not found"
                    }
                });
                return;
            }
            var markdownId= await GenerateMarkdownId();
            var markdownData={
                "markdownId":markdownId,
                "title":originMarkdownData.title,
                "content":originMarkdownData.content,
                "createdAt":new Date().getTime(),
                "updatedAt":new Date().getTime(),
                "owner":toOwner,
                "willBindArticleId":originMarkdownData.willBindArticleId,
            }
            var originalMarkdownDatas=await __this.markdownAdapter.Get("/markdowns");
            originalMarkdownDatas.push(markdownData);
            await __this.markdownAdapter.Set("/markdowns",originalMarkdownDatas);
            res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    markdownId:markdownId,
                }
            });

        }
    }   
    GetAllMarkdownsByOwner(){
        var __this=this;
        return async (req,res,next)=>{
            var requestData=req.body;
            var owner=requestData.owner;
            var markdowns=await __this.markdownAdapter.SearchAllResults("/markdowns",(val)=>{
                return val.owner==owner;
            })
            console.log(markdowns)
            res.json({
                statusCode:0,
                timestamp:new Date().getTime(),
                data:{
                    markdowns:markdowns
                }
            });
        }
    }

}
module.exports=ArticleMiddlewares;