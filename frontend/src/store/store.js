import { defineStore } from 'pinia';
var loginStore = defineStore("loginStore", {
    state: ()=>{
        return {
            isCmsUserLogin: false,
            isCmsUserLogout: false,
            cmsAccessToken: null,
            cmsRefreshToken: null,
            cmsUserId: null,
            cmsUserName: null,
            cmsUserEmail: null,
            cmsUserAvatar: null,
        }
    },
    persist: {
        enabled: true,
        // 自定义持久化参数
        strategies: [
            {
                // 自定义key
                key: 'login_store',
                // 自定义存储方式，默认sessionStorage
                storage: localStorage,
                // 指定要持久化的数据，默认所有 state 都会进行缓存，可以通过 paths 指定要持久化的字段，其他的则不会进行持久化。
            }
        ]
    },
    getters:{
    },
    actions:{
        CmsUserLogout(){
            this.cmsAccessToken=null;
            this.cmsRefreshToken=null;
            this.cmsUserId=null;
            this.cmsUserName=null;
            this.cmsUserEmail=null;
            this.isCmsUserLogin=false;
            this.isCmsUserLogout=true;

        }
    }
});
var displayStore = defineStore("displayStore", {
    state:()=>{
        return {
            needDisplayWebsite: false,
            needDisplayCms: false,
        }
    }
})

export default {
    loginStore,
    displayStore
}