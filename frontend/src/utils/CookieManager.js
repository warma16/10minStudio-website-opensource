import Cookies from 'js-cookie'
// cookie保存的天数
 
class CookieManager{
    constructor(){
    }
    setCookie(name,value,expries=999999999999){
        Cookies.set(name,value,{expires:expries});
    }
    getCookie(name){
        return Cookies.get(name);
    }
    removeCookie(name){
        Cookies.remove(name);
    }
}
export default CookieManager;