<template>
    <a-layout :style="body_style" :class=" this.$deviceCheck.DisplayCheck()!=this.$deviceCheck.Type.PC?'container':'' ">
        <a-layout-content>
            <a-space :style="{padding: 0, marginRight: '20.5%',marginLeft:'5%'}" v-if="this.$deviceCheck.DisplayCheck()==this.$deviceCheck.Type.PC">
                <a-space  size="">
                        <div class="row" v-if="hasFriendLinks">
                            <p style="font-weight: 500;font-size: 16px;line-height: 24px;">友情链接</p>
                            <a-col v-for="(item,index) in friendLinks" :key="index" :span="24/friendLinks.length">
                                <a-link :href="item.url" target="_blank" style="color:#000;">
                                    {{item.name}}
                                </a-link>
                            </a-col>
                        </div>
                        
                </a-space>
            </a-space>
            <a-collapse v-if="this.$deviceCheck.DisplayCheck()!=this.$deviceCheck.Type.PC" accordion style="background-color: #f7f8fa;">
                
                <a-collapse-item v-if="hasFriendLinks" header="友情链接" style="background-color: #f7f8fa;">
                    <a-list class="u_list" :bordered="false">
                        <a-list-item class="l_item" v-for="(item,index) in  friendLinks" :key="index">
                            <a-link    :href="item.url" target="_blank">
                                {{item.name}}
                            </a-link>
                        </a-list-item>
                    </a-list>
                </a-collapse-item>
                <a-collapse-item v-if="hasLogoSideLinks" header="关于10minStudio">
                    <a-list class="u_list" :bordered="false">
                        <a-list-item class="l_item" v-for="(item,index) in  logoSideLinks" :key="index">
                            <a-link    :href="item.url" target="_blank">
                                {{item.name}}
                            </a-link>
                        </a-list-item>
                    </a-list>
                </a-collapse-item>
            </a-collapse>
            <a-space direction="vertical" size="mini" v-if="this.$deviceCheck.DisplayCheck()!=this.$deviceCheck.Type.PC">
                <a-space>
                    <a-link v-if="hasSocialMediaLinksDetail.bilibili" :href="bilibiliUrl">
                        <icon-font type="icon-bilibiliNoFill" :size="20" />
                    </a-link>
                    <a-link v-if="hasSocialMediaLinksDetail.discord" :href="discordUrl">
                        <icon-font type="icon-discord" :size="20" />
                    </a-link>
                    <a-link v-if="hasSocialMediaLinksDetail.qqQun" :href="qqQunUrl">
                        <icon-qq  :size="20"/>
                    </a-link>
                    <a-link v-if="hasSocialMediaLinksDetail.qqPindao" :href="qqPindaoUrl">
                        <icon-font type="icon-qqPindao" :size="20" />
                    </a-link>
                    <a-link v-if="hasSocialMediaLinksDetail.taptap" :href="taptapUrl">
                        <icon-font type="icon-taptap" :size="50" />
                    </a-link>

                </a-space>
                <a-space v-if="hasCountryNeedInfo">
                    <a-link style="color:#000" v-for="(item,index) in countryNeedInfos" :key="index" :href="item.url">
                        {{item.showText}}
                    </a-link>
                </a-space>
                <span v-if="hasCopyright">{{showCopyrightText}}</span>
            </a-space>
        </a-layout-content>
        <a-layout-footer v-if="this.$deviceCheck.DisplayCheck()==this.$deviceCheck.Type.PC">
            <a-layout :style="{padding: 0, marginRight: '20.5%',marginLeft:'5%'}">
                <a-layout-header v-if="hasLogoSideLinks&&this.$deviceCheck.DisplayCheck()==this.$deviceCheck.Type.PC">

                    <div class="pivot_container ">  
                        <a class="pivot_heading">
                            <img src="img/company_logo.svg" style="width:42px;height:24px;object-fit:scale-down;"/>
                        </a>  
                        <a v-for="(item,index) in  logoSideLinks" :key="index" class="pivot_button "  :href="item.url" target="_blank">
                            {{item.name}}
                        </a>
                    </div>  
                    
                </a-layout-header>
                <a-layout-content>
                    <a-divider v-if="hasLogoSideLinks&&this.$deviceCheck.DisplayCheck()==this.$deviceCheck.Type.PC"/>
                </a-layout-content>
                <a-layout-footer>
                    <a-space direction="vertical" size="mini">
                        <a-space>
                            <a-link v-if="hasSocialMediaLinksDetail.bilibili" :href="bilibiliUrl">
                                <icon-font type="icon-bilibiliNoFill" :size="20" />
                            </a-link>
                            <a-link v-if="hasSocialMediaLinksDetail.discord" :href="discordUrl">
                                <icon-font type="icon-discord" :size="20" />
                            </a-link>
                            <a-link v-if="hasSocialMediaLinksDetail.qqQun" :href="qqQunUrl">
                                <icon-qq  :size="20"/>
                            </a-link>
                            <a-link v-if="hasSocialMediaLinksDetail.qqPindao" :href="qqPindaoUrl">
                                <icon-font type="icon-qqPindao" :size="20" />
                            </a-link>
                            <a-link v-if="hasSocialMediaLinksDetail.taptap" :href="taptapUrl">
                                <icon-font type="icon-taptap" :size="50" />
                            </a-link>

                        </a-space>
                        <a-space v-if="hasCountryNeedInfo">
                            <a-link style="color:#000" v-for="(item,index) in countryNeedInfos" :key="index" :href="item.url">
                                {{item.showText}}
                            </a-link>
                        </a-space>
                        <span v-if="hasCopyright">{{showCopyrightText}}</span>
                    </a-space>
                </a-layout-footer>
            </a-layout>
        </a-layout-footer>
    </a-layout>
</template>
<script>
export default {
    name: 'Footers_vue',
    data() {
        return {
            current: '1',
            is_dark:false,
            hasFriendLinks:false,
            hasLogoSideLinks:false,
            hasCopyright:true,
            hasCountryNeedInfo:false,
            hasSocialMediaLinksDetail:{
                discord:false,
                qqQun:false,
                qqPindao:false,
                bilibili:false,
                taptap:false,
            },
            countryNeedInfos:[
                /**
                 * 国家必填信息，例如：
                 * 粤网文[20**]61**-**号 | 
                 * 网络视听许可证19*****号 | 
                 * 增值电信业务经营许可证：粤B2-******* | 
                 * 粤公网安备 44030******号
                 * 数据规则:
                 * {
                 *      showText:'',//显示文字
                 *     url:'',//链接地址
                 * }
                 */
                {
                    showText:'粤网文[20**]61**-**号',
                    url:'http://www.miitbeian.gov.cn/',
                },
                
            ],
            body_style:{
                backgroundColor: '#f7f8fa',
            },
            friendLinks:[
               /** 
                * name:显示的名称
                * url:链接地址
                * {
                    name:'溯Resux',
                    url:'#'
                },
                * */ 
               {
                name:'溯Resux',
                url:'#'
               }
            ],
            logoSideLinks:[
                /** 
                 * 显示在右边的logo链接
                * name:显示的名称
                * url:链接地址
                * {
                    name:'友情链接测试1',
                    url:'#'
                },
                * */ 
                {
                name:'人才招聘',
                url:'#',

               },
               {
                name:"联系我们",
                url:'#',
               },
               {
                name:"关于我们",
                url:'#',
               },
               {
                name:"服务条款",
                url:'#',
               },
               {
                name:"隐私政策",
                url:'#',
               },
               {
                name:"版权声明",
                url:'#',
               },

              
 
            ],
            discordUrl:'#',
            bilibiliUrl:'https://space.bilibili.com/229690533',
            taptapUrl:'#',
            qqQunUrl:'#',
            qqPindaoUrl:'#',
            showCopyrightText:'',
            

        };
    },
    methods: {
    },
    created(){
        if(this.friendLinks.length>0){
            this.hasFriendLinks=true;
        }
        if(this.logoSideLinks.length>0){
            this.hasLogoSideLinks=true;
        }
        if(this.discordUrl!=''){
            this.hasSocialMediaLinksDetail.discord=true;
        }
        if(this.bilibiliUrl!=''){
            this.hasSocialMediaLinksDetail.bilibili=true;
        }
        if(this.taptapUrl!=''){
            this.hasSocialMediaLinksDetail.taptap=true;
        }
        if(this.qqQunUrl!=''){
            this.hasSocialMediaLinksDetail.qqQun=true;
        }
        if(this.qqPindaoUrl!=''){
            this.hasSocialMediaLinksDetail.qqPindao=true;
        }
        if(this.hasCopyright){
            var today = new Date();
            var year = today.getFullYear();
            this.showCopyrightText=`Copyright © ${year} 10minStudio. All rights reserved.`;
        }
        if(this.countryNeedInfos.length>0){
            this.hasCountryNeedInfo=true;
        }
    }
};
</script>
<style scoped>
.itemTitle{
    color: #fff;
    margin-bottom: 8px;
    font-size: 12px;
    line-height: 24px;
    font-weight: 500;
}
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 2.1875rem;
    padding-top:25px;
}
</style>