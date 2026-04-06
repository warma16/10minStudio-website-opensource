const {randomBytes,createCipheriv,createDecipheriv,createHash} = require('crypto');
var CryptAdapter=require("./utils/CryptServersideAdapter.js");
var nanoid=require("nanoid")
var Adapter=new CryptAdapter();

function aesEncrypt(data, key) {
    var text=data
    const algorithm = 'aes-256-ctr';
    let nkey = createHash('sha256').update(String(key)).digest('base64').slice(0, 44);
    const key_in_bytes = Buffer.from(nkey, 'base64')
    //console.log(key_in_bytes.length)


const ENCRYPTION_KEY = key_in_bytes; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
const IV_LENGTH = 16;
let iv = randomBytes(IV_LENGTH);
let cipher = createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
let encrypted = cipher.update(text);
encrypted = Buffer.concat([encrypted, cipher.final()]);
return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function aesDecrypt(encrypted, key) {
    var text=encrypted
    const algorithm = 'aes-256-ctr';
    let nkey = createHash('sha256').update(String(key)).digest('base64').slice(0, 44);
    const key_in_bytes = Buffer.from(nkey, 'base64')
    //console.log(key_in_bytes.length)


const ENCRYPTION_KEY = key_in_bytes; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
let textParts = text.split(':');
let iv = Buffer.from(textParts.shift(), 'hex');
let encryptedText = Buffer.from(textParts.join(':'), 'hex');
let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
let decrypted = decipher.update(encryptedText);
decrypted = Buffer.concat([decrypted, decipher.final()]);
return decrypted.toString();

}

/*密钥密文解密
Adapter.Decode(aesDecrypt(text,conf.key))[1]
密钥有效时间解密
Number(Adapter.Decode(aesDecrypt(conf.refreshTime,conf.key))[1])
逆向一下，写出加密
*/
function build_keys(conf){
    var key_ignore=["key"]
    var a="inokana&ocero(warma16)"
    var b="10minStudio"
    var randomstr=(str)=>{
        var newStrAll = [];
        str.split('').forEach((item, index, array) => {
        var newIndex = Math.round(Math.random() * newStrAll.length);
        newStrAll.splice(newIndex, 0, item);
        });
        return newStrAll.join('')
    }
    a=randomstr(`${a}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}`)
    b=randomstr(`${b}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}${nanoid.nanoid()}`)
    b=b.slice(0,60)
    c=nanoid.nanoid()
    c=c.slice(0,4)
    b=randomstr(`${b}${c}`)
    console.log(b.length)
    var key11=aesEncrypt(a,b)
    conf["key"]=Adapter.Encode(key11,500*365*24*60*60*1000)
    var conf_keys=Object.keys(conf)
    for(var i=0;i<conf_keys.length;i++){
        //console.log(conf)
        if(key_ignore.indexOf(conf_keys[i])==-1){
            conf[conf_keys[i]]=Adapter.Encode(aesEncrypt(conf[conf_keys[i]],key11),500*365*24*60*60*1000)

        }
    }
    return conf
}


console.log(build_keys(dxKeys))