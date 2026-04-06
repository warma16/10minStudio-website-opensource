import WSSDK from "../utils/WSSDK";
class Reporter{
    constructor(){
        this.baseUrl=process.env.NODE_ENV=="production"?"ws://10minstudio.com:3000/report":"ws://127.0.0.1:3000/report"; 
        this.ws=new WSSDK({
            url:this.baseUrl,
        });
    }
    report({visitorId,eventType,eventData}){
        this.ws.send({
            visitorId,
            eventType,
            eventData,
            timestamp:Date.now()
        })
    }

}
export default Reporter;
