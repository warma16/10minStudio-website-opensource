var  {JsonDB} = require('node-json-db');
var  {Config} = require('node-json-db/dist/lib/JsonDBConfig');
class JsonDatabaseAdapter{
    constructor(databasePath){
        this.databasePath = databasePath;
        this.init()
    }
    init(){
        this.dbInstance=null
        this.dbInstance=new JsonDB(new Config(this.databasePath,true,true))
    }
    async Get(path){
        var result= await this.dbInstance.getData(path);
        await this.init();
        return result;
    }
    async Set(path,value){
        await this.dbInstance.push(path,value);
        await this.init();
    }
    async Remove(path){
        await this.dbInstance.delete(path);
        await this.init();
    }
    async SearchAllResults(path,filterFunc=(val,index)=>{return true;}){
        var result=await this.dbInstance.filter(path,filterFunc);
        await this.init();
        return result;
    }
    async isExist(path){
        var result=await this.dbInstance.exists(path);
        await this.init();
        return result;
    }
    async SearchFirstResult(path,filterFunc=(val,index)=>{return true;}){
        var result= this.dbInstance.find(path,filterFunc);
        await this.init();
        return result;
    }
    async GetAllDatas(path){
        var result= this.dbInstance.getData(path);
        await this.init();
        return result;
    }
}
module.exports=JsonDatabaseAdapter;
//export default JsonDatabaseAdapter