var config=require("../config.js")
var fs=require("fs")
var axios=require("axios");
var nodecron=require("node-cron");
class UpdateOneWordSentencePack  {
    config:any;
    igroneFnPrefix:string;
    needUpdateCategorys:string[];
    constructor() {
        this.config=config.Hitokoto.OneWord.SentencePack
        this.igroneFnPrefix="extend-"
        this.needUpdateCategorys=[
            "a",
            "b",
            //c to l
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
        ],
        this.update();
        this.cronUpdate();
    }
    update(){
        console.log("正在更新一言的语句包...");
        //扫一遍存放目录，把所有的文件名存到数组中
        var __this=this
        var files=[],willDeleteFilenames=[];
        var filesPath=this.config.path;
        files=fs.readdirSync(filesPath);
        //看看文件名开头是不是以extend-开头，如果不是，就存到要删除的数组中
        files.forEach(function(file){
            var fileName=file.split(".")[0];
            if(fileName.indexOf(__this.igroneFnPrefix)===-1){
                willDeleteFilenames.push(file);
            }
        })
        //删除文件
        for(var i=0;i<willDeleteFilenames.length;i++){
            var fileName=willDeleteFilenames[i];
            fs.unlinkSync(filesPath+"/"+fileName);
        }
        //从云端更新文件
        var updateSource=this.config.updateUrl
        var StorePath=this.config.path;
        //将云端的文件下载到本地
        var si=0;
        this.needUpdateCategorys.forEach(function(category){
            var fileName=category+".json";
            var filePath=StorePath+"/"+fileName;
            var fileUrl=updateSource+"/"+fileName;
            var file=fs.createWriteStream(filePath);
            axios.get(fileUrl,{
                responseType: 'arraybuffer'
            }).then(function(response){
                file.write(Buffer.from(response.data));
                file.end();
                si++;
                console.log("正在更新一言文件 更新进度："+si+"/"+__this.needUpdateCategorys.length);
                
            }).catch(function(error){
                console.log(error);
                file.end();
                si++;
                console.log("正在更新一言文件 更新进度："+si+"/"+__this.needUpdateCategorys.length);
                
            })
        })
    }
    cronUpdate(){
        var __this=this;
        nodecron.schedule(__this.config.updateCron,__this.update)
    }
}
module.exports=UpdateOneWordSentencePack;