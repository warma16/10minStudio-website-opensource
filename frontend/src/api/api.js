import axios from 'axios';
class Api   {
    constructor(){
        this.axios=axios;
        this.baseurl="https://api.womadao.top/";
        this.axios.defaults.headers.common["Authorization"]="APPCODE "+"f3eb64598b844ec89b56ce55fa158735"
        this.axios.defaults.headers.common["Content-Type"]="application/json;charset=utf-8"
        
    }
    getbilibiliuidinfo(uid=0,callback=()=>{}){
        var __this=this
        return new Promise((resolve,reject)=>{
            __this.axios(this.baseurl+"getbilibiliuidinfo?uid="+String(uid),{
                
            }).then((res)=>{
                resolve(res);
                callback(res);
            }).catch((err)=>{
                reject(err);
            })
        })
    }
    blacklist(callback=()=>{}){
        var __this=this
        return new Promise((resolve,reject)=>{
            __this.axios(this.baseurl+"getbanlist",{
                
            }).then((res)=>{
                resolve(res);
                callback(res);
            }).catch((err)=>{
                reject(err);
            })
        })
    }
    getbilibilivideoinfo(bvid){
        var __this=this
        return new Promise((resolve,reject)=>{
            __this.axios(this.baseurl+"getbilibilivideoinfo?bvid="+String(bvid),{
                
            }).then((res)=>{
                resolve(res);
            }).catch((err)=>{
                reject(err);
            })
        })
            
    }
    getip(){
        var __this =this
        return new Promise((resolve,reject)=>{
            __this.axios("getip").then((res)=>{
                resolve(res);
            }).catch((err)=>{
                reject(err);
            })
        })
    }
    
}

export default Api