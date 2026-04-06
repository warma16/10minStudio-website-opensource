import axios from "axios";
class DNS{
    constructor(){
        this.axios=axios;
    }
    resolve(domain){
        return new Promise((resolve,reject)=>{
            var results=[];
            var dnsAnswers=[];
            this.axios.get(`https://dns.alidns.com/resolve?name=${domain}`).then((res)=>{
                console.log(res.data)
                dnsAnswers=res.data.Answer;
                dnsAnswers.forEach(answer=>{
                    console.log(answer);
                    //检查应答数据是不是IP地址（例如 8.8.8.8)，如果是，则添加到结果数组
                    //如果answer.data类似于8.8.8.8,1.1.1.1,11.451.419.198,则添加到结果数组
                    if(answer.data.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)){
                        results.push(answer.data);
                    }
                });
                resolve(results);
            }).catch((err)=>{
                //如果是500错误，说明是未知域名
                resolve(results);
                console.log(err);
            })
        });
    }
}
export default DNS;