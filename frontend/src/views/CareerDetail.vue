<template>
    <a-layout>
        <a-layout-content >
            <div class="container">
                <a-card :bordered="false">
                    <template #title>
                        <a-space>
                            <h1>{{showData.name}}</h1>
                            <a-tag v-for="(tag,tagIndex) in showData.tags" :key="tagIndex">
                                {{tag}}
                            </a-tag>
                            <a-button @click="this.$router.back()" type="primary">返回</a-button>
                        </a-space>
                    </template>
                    <div class="row">
                        <div class="col-md-6">
                            <h2>简介</h2>
                            
                        </div>
                        <h5>{{showData.description}}</h5>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <h2>职位要求</h2>
                            
                        </div>
                        <br>
                        <div class="row" v-for="(data,number,key) in showData.requirements" :key="key">
                            <h5>{{"    "+(number+1)+".  "+data}}</h5>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <h2>应聘方式</h2>
                            
                        </div>
                        <a-space direction="vertical">
                            <a-link href="https://qun.qq.com/qqweb/qunpro/share?_wv=3&_wwv=128&appChannel=share&inviteCode=1W7JoRn&businessType=9&from=246610&biz=ka" target="_blank">
                                <icon-font type="icon-qqPindao" :size="20" />
                                点此进入聚贤堂子频道，进行应聘
                            </a-link>
                            <a-link href="https://jq.qq.com/?_wv=1027&k=XPlM5bK7" target="_blank">
                                <icon-qq  :size="20" />
                                点此进入公招QQ群，进行应聘
                            </a-link>
                            <a-link @click="openMailTo()">
                                <icon-font type="icon-emailNoFill" :size="20" />
                                发送邮件到：{{mailToAbout.email}}，进行应聘
                            </a-link>
                        </a-space>
                    </div>
                </a-card>
            </div>
        </a-layout-content>
    </a-layout>

</template>
<style scoped>
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 2.1875rem;
}
</style>
<script>
export default {
    data(){
        return {
            showData:[],
            backRouterName:'Career',
            mailToAbout:{
                name:'10MinStudio',
                email:"connect@10minstudio.com",
                cc:"",
                bcc:"",
                subject:"",
            }
        }
    },
    methods:{
        generateMailTo(){
            let mailTo = "mailto:";
            let hasParam = false;
            if(this.mailToAbout.name!=""&&this.mailToAbout.email!=""){
                mailTo += `${encodeURI(this.mailToAbout.name)}<${encodeURI(this.mailToAbout.email)}>`;
            }
            if(this.mailToAbout.email!=""&&this.mailToAbout.name==""){
                mailTo += `${encodeURI(this.mailToAbout.email)}`;
            }
            if(this.mailToAbout.cc){
                if(!hasParam){
                    hasParam = true;
                    mailTo += "?";
                }else{
                    mailTo += "&";
                }
                mailTo += "cc="+encodeURI(this.mailToAbout.cc);
            }
            if(this.mailToAbout.bcc){
                if(!hasParam){
                    hasParam = true;
                    mailTo += "?";
                }else{
                    mailTo += "&";
                }
                mailTo += "bcc="+encodeURI(this.mailToAbout.bcc);
            }
            if(this.mailToAbout.subject){
                if(!hasParam){
                    hasParam = true;
                    mailTo += "?";
                }else{
                    mailTo += "&";
                }
                mailTo += "subject="+encodeURI(this.mailToAbout.subject);
            }
            return mailTo;
        },
        async openMailTo(){
            let displayCheckResult=this.$deviceCheck.DisplayCheck()
            if(displayCheckResult==this.$deviceCheck.Type.PC){
                await this.$urlSchemeOpener(this.generateMailTo())
            }
        },
        async openContactQQGroup(){
            let displayCheckResult=this.$deviceCheck.DisplayCheck()
            let groupId = "800000131";
            let url="https://jq.qq.com/?_wv=1027&k=XPlM5bK7"
            await alert(url)
            await this.$urlSchemeOpener(url)
        }
    },
    created(){
        this.showData=this.$route.params
        let name = this.showData.name || "";
        let subject = "应聘"+name+"职位 ";
        this.mailToAbout.subject = subject;
    }

}
</script>