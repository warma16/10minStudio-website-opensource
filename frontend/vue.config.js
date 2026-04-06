const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  //"packageManager": "yarn",
    pwa: {
    name: '10Min Studio Website',
    themeColor: '#000000',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths:{
      faviconSVG: 'img/company_logo.svg',
      favicon32: 'img/192.png',
      favicon16: 'img/192.png',
    }
  }
})
