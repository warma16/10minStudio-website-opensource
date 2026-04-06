// change the content of coder.py to this file using the javascript format
var sum = function(x,y){ return x+y;};　　//求和函数
var square = function(x){ return x*x;};
var getverficationcode=(data)=>{
    var sum = function(x,y){ return x+y;};　　//求和函数
    var square = function(x){ return x*x;};　　//数组中每个元素求它的平方
    var mean = data.reduce(sum)/data.length;
    var deviations = data.map(function(x){return x-mean;});
    var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));
    return stddev
}
var range=(start=0,end,step=1,callback)=>{
    for(var i=start;i<end;i+=step){
        callback(i);
    }
}
var chr=(string)=>{
    return String.fromCharCode(string);
}
var istoken=(string)=>{
    return string == '!' || string == '-' || string == '+'||string=="|"||string=="."||string==`"`
} 
var encode=(code,accept_timeout=1000)=>{
    //your code here

}
var decode=(key)=>{
    //your code here

  }
//export the function
class Adapter{
    constructor(){
        this.encode=encode
        this.decode=decode
    }
    Encode(data,timeOut=1000){
        return encode(data,timeOut)
    }
    Decode(data){
        return decode(data)
    }
    Decrypt(data){
        return decode(data)
    }
    Encrypt(data,timeOut=1000){
        return encode(data,timeOut)
    }
}
export default Adapter