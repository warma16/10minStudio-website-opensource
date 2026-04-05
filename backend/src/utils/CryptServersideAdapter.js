// change the content of coder.py to this file using the javascript format
var encode=(data,tl)=>{
    //your encode function

}
var decode=(data,tl)=>{
    //your decode function
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
module.exports=Adapter