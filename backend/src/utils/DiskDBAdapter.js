var diskDb=require("diskdb")
class JsonDatabaseAdapter{
    constructor(databasePath){
        this.databasePath = databasePath.replace(/\\/g,"/");
        //this.databasePath 值类似于 F:/10minstudio/websiteBackend/Data/TMSBackendAbout/UserDatabase.json
        this.dbFolder = this.databasePath.split("/").splice(0,this.databasePath.split("/").length-1).join("/");
        this.dbFileName = this.databasePath.split("/")[this.databasePath.split("/").length-1];
        console.log("dataPath")
        console.log(this.databasePath)
        console.log("folder")
        console.log(this.dbFolder)
        console.log("filename")
        console.log(this.dbFileName)
        this.dbInstance = diskDb.connect(this.dbFolder, [this.dbFileName]);
        console.log(this.dbInstance._db.find)
    }
    async Get(){
        return await this.dbInstance[this.dbFileName].find()
    }
    async Set(value){
        await this.dbInstance[this.dbFileName].save(value)
    }
    async Remove(conditions,isFirstMatch=true){
        await this.dbInstance[this.dbFileName].remove(conditions,isFirstMatch);
    }
    async SearchAllResults(conditions){
        return await this.dbInstance[this.dbFileName].find(conditions);
    }
    async SearchFirstResult(conditions){
        return await this.dbInstance[this.dbFileName].findOne(conditions);
    }
    async GetAllDatas(path){
        return await this.dbInstance.getData(path);
    }
    async Update(original,newValue){
        await this.dbInstance[this.dbFileName].update(original,newValue);
    }
}
module.exports=JsonDatabaseAdapter;