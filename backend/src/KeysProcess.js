var conf=require("./keys.js");
const {randomBytes,createCipheriv,createDecipheriv,createHash} = require('crypto');
var CryptAdapter=require("./utils/CryptServersideAdapter.js");
const { assert } = require("console");
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
let decipher = createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
let decrypted = decipher.update(encryptedText);
decrypted = Buffer.concat([decrypted, decipher.final()]);
return decrypted.toString();

}
var getValue=(key="",conf={})=>{
  if(key!=""&&Object.keys(conf).indexOf("key")!=-1&&key!="key"&&Object.keys(conf).indexOf(key)!=-1){
    const adaptered_key=conf.key
    const aesed_key=Adapter.Decrypt(adaptered_key)[1]
    const adaptered_value=conf[key]
    const aesed_value=Adapter.Decrypt(adaptered_value)[1]
    const text_value=aesDecrypt(aesed_value,aesed_key)

      return text_value

  }
}

var getDxSecret=(oldSecret="")=>{
    if(oldSecret==""){
      return Adapter.Encode(getValue("appSecret",conf),getValue("refreshTime",conf))
      
 

    }
}
var getDxId=()=>{
    return Adapter.Encode(getValue("appId",conf),getValue("refreshTime",conf))
}
module.exports= {
    getDxSecret,
    getDxId
}