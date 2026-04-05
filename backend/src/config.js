const path = require('path')
const tokens_process= require('./KeysProcess.js')
var config={
    TmsBackend:{

        url:'https://www.baidu.com',//最后一个字符千万不能是/
        host:'',
        auth:{
            application:{
                cmsUser:"cms.homepage",
            },
            settings:{
                JWT: {
                    IssuerSigningKey: "4.514*191",
                    ExpiredTime: 1440,
                    ClockSkew: 5 
                }
            }
        },
        Databases:{
            Users:{
                path:path.join(__dirname,"/Data/TMSBackendAbout/UserDatabase.json"),
            }
        }

    },
    ArticleAbout:{
        Resources:{
            path:`${path.join(__dirname,'/Data/ArticleAbout/Resources')}`,
        },
        Databases:{
            Article:{
                path:`${path.join(__dirname,'/Data/ArticleAbout/ArticleDatabase.json')}`,
            },
            Markdown:{
                path:`${path.join(__dirname,'/Data/ArticleAbout/MarkdownDatabase.json')}`,
            }
        },
        Languages:[
            "zh-cn",
            "en",
        ]
    },
    AllowCORSOrigin:[
        'http://localhost:8080/#/editArticle',
        "http://192.168.31.198:8080/",
        "http://tenminswebsitetest.metalstudio.top",
        "https://tenminswebsitetest.metalstudio.top"
    ],
    DxCaptcha:{
        appId: tokens_process.getDxId(),
        appSecret: tokens_process.getDxSecret(),
        genreateIdFunc:tokens_process.getDxId,
        generateSecretFunc: tokens_process.getDxSecret,
        Resources:{
            path:`${path.join(__dirname,'/Data/DxCaptcha/Resources')}`,
            Images:{
                path:`${path.join(__dirname,'/Data/DxCaptcha/Resources/Images')}`,
            }
        },
        Api:{
            OriginalUrl:"https://cap.dingxiang-inc.com",
            ProxyUrl:"/dxCaptcha",//后面不能有任何符号例如*和/,
            OriginalOrigin:"https://cap.dingxiang-inc.com",
            OriginalReferer:"https://cap.dingxiang-inc.com/",
        }
    },
    BingGallery:{
        Resources:{
            path:`${path.join(__dirname,'/Data/BingGallery/Resources')}`,
            Images:{
                path:`${path.join(__dirname,'/Data/BingGallery/Resources/Images')}`,
            }
        },
    },
    Hitokoto:{
        OneWord:{
            SentencePack:{
                path:`${path.join(__dirname,'/Data/Hitokoto/OneWord/SentencePack')}`,
                //定时每天更新一回包
                updateCron:"0 0 * * *",
                versionJsonPath:`${path.join(__dirname,'/Data/Hitokoto/OneWord/SentencePack/version.json')}`,
                updateUrl:"http://cdn.jsdelivr.net/gh/hitokoto-osc/sentences-bundle@latest/sentences",
            }
        }
    },
    CareerAbout:{ 
        Database:{
            Path:`${path.join(__dirname,'/Data/CareerAbout/Database.json')}`,
        }
    },
    BannerAbout:{ 
        Database:{
            Path:`${path.join(__dirname,'/Data/BannerAbout/Database.json')}`,
        }
    },
    MemberAbout:{ 
        Database:{
            Path:`${path.join(__dirname,'/Data/MemberAbout/Database.json')}`,
        }
    },
    I18NAbout:{ 
        Resources:{
            Path:`${path.join(__dirname,'/Data/I18NAbout/Resources')}`,
        }
    }
}
module.exports=config
