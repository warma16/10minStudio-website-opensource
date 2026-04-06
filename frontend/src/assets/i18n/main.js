export let loadLanguage = (lang="zh-cn",backendAxios,i18nInstance)=>{
    backendAxios({
        "method":"GET",
        "url":`/i18n`,
        params:{
            lang:lang
        }
    }).then((resp)=>{
        let data=resp.data
        i18nInstance.global.setLocaleMessage(lang,data)
    })
}