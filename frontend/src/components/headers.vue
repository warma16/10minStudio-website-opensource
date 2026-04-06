<template>
        <a-menu mode="horizontal" :default-selected-keys="['1']" v-on:menu-item-click="handleSelect" class="navbar" theme="" v-if="this.$deviceCheck.DisplayCheck()==this.$deviceCheck.Type.PC">
            <!--DONE:更改菜单选项为，主页，作品页（下拉框），招募页-->
            <!--DONE:把作品页的展示做个配置程序，方便以后增加减-->
            <a-menu-item key="logo" :style="{ padding: 0, 'float':'left'}" :disabled="this.$loginStore.isCmsUserLogin">
                <div
                    :style="{
                        width: '100px',
                        height: '40px',
                        borderRadius: '2px',
                        cursor: 'text',
                    }"
                    class="logo company-logo"
                >
                    
                </div>
            </a-menu-item>
            <a-menu-group  v-if="!this.$loginStore.isCmsUserLogin" :style="{ padding: 0,'float':'right'}">
                <a-menu-item key="/" >首页</a-menu-item>
                <a-sub-menu >
                    <template #title>作品</template>
                    <a-menu-item v-for="(item) in worksDetails" :key="item.url" >{{item.name}}</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="/career" >招募</a-menu-item>
            </a-menu-group>
            <a-menu-group v-if="this.$loginStore.isCmsUserLogin" :style="{ padding: 0,'float':'right'}">
                <a-menu-item key="/createArticle" >创建文章</a-menu-item>
                <a-sub-menu key="1" >
                    <template #icon>
                        <a-avatar >
                            <img alt="avatar" :src="this.$loginStore.cmsUserAvatar"/>
                        </a-avatar>
                    </template>
                    <template #title>
                        <span>{{this.$loginStore.cmsUserName}}</span>
                    </template>
                    <a-menu-item key="logout" >
                        <icon-export />
                        退出
                    </a-menu-item>
                </a-sub-menu>
            </a-menu-group>

            
        </a-menu>
        <a-menu mode="horizontal" :default-selected-keys="['1']" v-on:menu-item-click="handleSelect" class="navbar pivot_container" theme="" v-if="this.$deviceCheck.DisplayCheck()!=this.$deviceCheck.Type.PC" >
            <a-menu-item key="logo" :style="{ padding: 0, }" :disabled="this.$loginStore.isCmsUserLogin" class="pivot_heading">
                <div
                    :style="{
                        width: '100px',
                        height: '40px',
                        borderRadius: '2px',
                        cursor: 'text',
                    }"
                    class="logo company-logo"
                >
                    
                </div>
            </a-menu-item>
            <a-menu-item key="expandPanelIcon" :style="{ padding: 0, }" class="pivot_button right">
                <icon-unordered-list  :size="30" />
            </a-menu-item>
        </a-menu>
        <a-menu v-if="this.$deviceCheck.DisplayCheck()!=this.$deviceCheck.Type.PC&&sidebarShow" v-on:menu-item-click="handleSelectSideBar" accordion>
            <a-menu-group  v-if="!this.$loginStore.isCmsUserLogin" >
                <a-menu-item key="/" >首页</a-menu-item>
                <a-sub-menu >
                    <template #title>作品</template>
                    <a-menu-item v-for="(item) in worksDetails" :key="item.url" >{{item.name}}</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="/career" >招募</a-menu-item>
            </a-menu-group>
            <a-menu-group v-if="this.$loginStore.isCmsUserLogin" >
                <a-menu-item key="/createArticle" >创建文章</a-menu-item>
                <a-sub-menu key="1" >
                    <template #icon>
                        <a-avatar >
                            <img alt="avatar" :src="this.$loginStore.cmsUserAvatar"/>
                        </a-avatar>
                    </template>
                    <template #title>
                        <span>{{this.$loginStore.cmsUserName}}</span>
                    </template>
                    <a-menu-item key="logout" >
                        <icon-export />
                        退出
                    </a-menu-item>
                </a-sub-menu>
            </a-menu-group>
        </a-menu>
</template>
<script>
export default {
    name: 'Headers_vue',
    data() {
        return {
            current: '1',
            tapLogoTimes:0,
            tapLogoTimestamps:[],
            is_dark:false,
            hasWorks:false,
            logo_color:{ backgroundColor: '#ffffff' },
            worksDetails:[
                /** 
                 * {
                 *    name:'',//作品名称
                 *   url:'',//作品页的路由
                 * }
                */
                {
                    name:'溯Resux',
                    url:'/works/Resux'
                },
                {
                    name:'test',
                    url:'/works/test'
                }
            ],
            isCmsUser:false,
            cmsUserAvatarUrl:'',
            cmsUserName:'',
            sidebarShow:false,
        };
    },
    methods: {
        handleSelect(key) {
            console.log(key);
            //use the eventbus which is binded to the this
            this.$bus.emit('change-page', {
                key,
            });
        },
        redirectToLoginPage(){
            console.log(this.$loginStore.isCmsUserLogin)
            if(!this.$loginStore.isCmsUserLogin){
                console.log("redirectToLoginPage");
                console.log(this.$router.currentRoute.value.path);
                if(this.$router.currentRoute.value.path=="/"){
                    this.tapLogoTimes++;
                    var nowTimestamp=new Date().getTime();
                    if(this.tapLogoTimestamps.length<=0){
                        this.tapLogoTimestamps.push(nowTimestamp);
                    }
                    this.tapLogoTimestamps.push(nowTimestamp);
                    console.log(this.tapLogoTimestamps);
                    var timeDistance=Math.abs(this.tapLogoTimestamps[this.tapLogoTimestamps.length-2]-this.tapLogoTimestamps[this.tapLogoTimestamps.length-1])
                    if(timeDistance>1000){
                        console.log("未连续")
                        this.tapLogoTimestamps=[];
                        this.tapLogoTimestamps.push(nowTimestamp);
                        this.tapLogoTimes=0;
                    }
                    if(this.tapLogoTimes>=10){
                        this.$message.success('您已成功进入编辑者模式，正在为您跳转到登录页面!')
                        this.tapLogoTimes=0;
                        this.$router.push('/login');
                    }
                }else{
                    this.$router.push('/');
                }
            }
        },
        getUserInfo(){
            if(this.$loginStore.cmsUserId == null|| this.$loginStore.cmsUserName==null || this.$loginStore.cmsUserEmail==null){
                this.$backendAxios({
                    method:"post",
                    url:"/getUserInfo",
                }).then((res)=>{
                    if(res.data.statusCode==0){
                        this.$loginStore.cmsUserId=res.data.data.uid;
                        this.$loginStore.cmsUserName=res.data.data.nickname;
                        this.$loginStore.cmsUserEmail=res.data.data.email;
                    }
                })
            }
        },
        getAvatar(){
            if(this.$loginStore.cmsUserId == null|| this.$loginStore.cmsUserName==null || this.$loginStore.cmsUserEmail==null){
                this.getUserInfo();
            }
            this.$backendAxios({
                method:"post",
                url:"/getAvatar",
                data:{
                    email:this.$loginStore.cmsUserEmail
                }
            }).then((res)=>{
                if(res.data.statusCode==0){
                    this.cmsUserAvatarUrl=res.data.data.avatarUrl;
                }
            })
        },
        actionExpandPanel(){
            if(this.$deviceCheck.DisplayCheck()!=this.$deviceCheck.Type.PC){
                this.sidebarShow=!this.sidebarShow;
            }
        },
        handleSelectSideBar(key){
            this.$bus.emit('change-page', {
                key,
            });
            this.actionExpandPanel();
        },
    },
    mounted(){
        //检查一下是否登录到cms
        //检测当前页面路由传递的
        console.log(this.$loginStore.isCmsUserLogin)
        this.isCmsUser=this.$loginStore.isCmsUserLogin;
        this.$bus.on('getUserInfo',()=>{
            this.getUserInfo();
        })
        if(this.$loginStore.isCmsUserLogin){
            this.getUserInfo();
            this.cmsUserName=this.$loginStore.cmsUserName;
            this.getAvatar();
        }
        this.$bus.on('change-page', ({ key }) => {
            
            if(key=="logo"){
                this.redirectToLoginPage();
            }
            if(key == "logout"){
               /*this.$backendAxios({
                    method:"post",
                    url:"/logout",
                    data:{
                        accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,60000)
                    }
                }).then((res)=>{
                    if(res.data.statusCode==0){
                         this.$message.success('您已成功退出登录，正在为您跳转到首页!')
                        this.$loginStore.CmsUserLogout();
                        this.$router.push('/');
                    }
                }).catch((err)=>{
                    console.log(err);
                })*/
                this.$message.success('您已成功退出登录，正在为您跳转到首页!')
                this.$loginStore.CmsUserLogout();
                this.$router.push('/');

            }
            if(key == "expandPanelIcon"){
                //alert("expandPanelIcon");
                this.actionExpandPanel();
            }
        });
        let listeners={
            dark:(mediaQueryList )=>{
                if(mediaQueryList.matches){
                    this.is_dark=true;
                    this.logo_color={ backgroundColor: '#000000' }
                }
            },
            light:(mediaQueryList)=>{
                if(mediaQueryList.matches){
                    this.is_dark=false;
                    this.logo_color={ backgroundColor: '#ffffff' }
                }
            },
        }

        window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark)
        window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light)
    },
    activated () {
        console.log("I'm activated");
        console.log(this.$loginStore.isCmsUserLogin)
        this.isCmsUser=this.$loginStore.isCmsUserLogin;
        if(this.$loginStore.isCmsUserLogin){
            this.getUserInfo();
            this.cmsUserName=this.$loginStore.cmsUserName;
            this.getAvatar();
        }
    },
};
</script>
<style scoped>
.navbar {
    /*border-bottom: 1px solid #e8e8e8;*/
   /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);*/
   margin-top:0;
   margin-left: 0;
    width:100%;
    height:100%;
}
.logo{
    object-fit:scale-down;
}
</style>
