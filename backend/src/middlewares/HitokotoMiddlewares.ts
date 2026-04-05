var JsonDBAdapter =require("../utils/JsonDatabaseAdapter.js");
var config=require("../config.js");
class HitokotoMiddlewares{
    config:any;
    Adapters:any;
    constructor(){
        this.config=config.Hitokoto.OneWord;
        this.Adapters={
            "a":new JsonDBAdapter(this.config.SentencePack.path+"/a.json"),
            //b to l
            "b":new JsonDBAdapter(this.config.SentencePack.path+"/b.json"),
            "c":new JsonDBAdapter(this.config.SentencePack.path+"/c.json"),
            "d":new JsonDBAdapter(this.config.SentencePack.path+"/d.json"),
            "e":new JsonDBAdapter(this.config.SentencePack.path+"/e.json"),
            "f":new JsonDBAdapter(this.config.SentencePack.path+"/f.json"),
            "g":new JsonDBAdapter(this.config.SentencePack.path+"/g.json"),
            "h":new JsonDBAdapter(this.config.SentencePack.path+"/h.json"),
            "i":new JsonDBAdapter(this.config.SentencePack.path+"/i.json"),
            "j":new JsonDBAdapter(this.config.SentencePack.path+"/j.json"),
            "k":new JsonDBAdapter(this.config.SentencePack.path+"/k.json"),
            "l":new JsonDBAdapter(this.config.SentencePack.path+"/l.json"),
            "extend-pack.10minStudio":new JsonDBAdapter(this.config.SentencePack.path+"/extend-pack.10minStudio.json"),
        }
        //console.log(this.config.SentencePack.path+"/b.json");
    }
    getRandomSentence(){
        var __this=this;
        var keys=[];
        for(var key in this.Adapters){
            keys.push(key);
        }
        return async (req,res,next)=>{
            var requestCategory=req.query.c;
            var category="a";
            var categoryRandomIndex=Math.floor(Math.random()*keys.length);
            
            if(requestCategory){
                if(keys.indexOf(requestCategory)>-1){
                    category=requestCategory;
                }else{
                    category=keys[categoryRandomIndex];
                }
            }else{
                category=keys[categoryRandomIndex];
            }
            var adapter=__this.Adapters[category];
            try{
                var sentenceDatas=await adapter.SearchAllResults('/')
                //console.log(sentenceDatas);
                var sentenceRandomIndex=Math.floor(Math.random()*sentenceDatas.length);
                var sentenceData=sentenceDatas[sentenceRandomIndex];
                //console.log(sentenceData);
                var sentence=sentenceData["hitokoto"];
                await res.send(sentence);  
            }catch(e){
                console.log(e)
                await res.send("服务还没有准备好，请稍后再试")
            }
        }

    }
}
module.exports=HitokotoMiddlewares;