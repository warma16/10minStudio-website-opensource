var axios=require('axios');
class QQApi{
    constructor(){
    }
    async getUserAvatar(uid){
        var res=await axios.get("https://q.qlogo.cn/headimg_dl",{
            params:{
                dst_uin:uid,
                spec:640,
            },
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
                "Referer":"https://user.qzone.qq.com/"+uid,
                "Content-Type":"application/octet-stream",
            }
        })
        return res.data;
    }
}
module.exports=QQApi;