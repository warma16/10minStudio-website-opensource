<template>
  <a-layout  v-if="!this.$loginStore.isCmsUserLogin">
    <a-layout-content >
      <a-carousel :style="carouselFullScreenStyle" animation-name="fade">
        <a-carousel-item v-for="(item,index) in carouselItems" :key="index" @click="BannerClick(item.link)">
          <img :src="item.image" :alt="item.title" :style="{width: '100%',height:'100%','object-fit':'cover'}" img class=" img-fluid " :data-src="item.image"  lazy="loaded"  referrerPolicy="no-referrer" />
              <div class="banner-text" >
                  <a-space  class="top-card" direction="vertical">
                    <h1 style="font-size:32px;"  >{{item.title}}</h1>
                    <p style="font-size:24px;">{{item.subTitle}}</p>
                    <h5></h5>
                  </a-space>
              </div>
        </a-carousel-item>
      </a-carousel>
      <a-layout class="section section-lg effect-fade effect-scroll">
        <a-layout-content>
          <div class="container">
            <div class="row row-grid align-items-center" style=" display: flex;justify-content: space-between;">
              <div class="col-md-3 order-md-3" style="   ">
                <img src="img/company_logo.svg" class="img-fluid " style="width:240px;height:300px;margin-right:0px;" />
              </div>
              
              <div class="col-md-5 order-md-1">
                <h3 >关于我们</h3>
                  
                <div class="pr-md-4 ">
                  <p>始于音游，不止音游。
10min Studio 持续致力于优质游戏的探索与开发。</p>
                  
                </div>
              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout class="section section-lg " style="background-color: rgb(247, 248, 250);">
        <a-layout-content>
          <div class="container">
            <div class="row justify-content-center text-center mb-lg" >
              <div class="col-lg-8">
                <h2 class="display-3">我们的作品</h2>
                <p class="lead text-muted">每一个作品的出现，都是为了遇见特别的你</p>
              </div>
              <div class="row">
                <work-card></work-card>

              </div>
            </div>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout  class="section section-lg">
        <a-layout-content  >
          <div class="container">
              <div class="row justify-content-center text-center mb-lg">
                <div class="col-lg-8">
                  <h2 class="display-3">
                    我们的团队
                    <a-button type="text" @click="MoreMemberClick()">更多<icon-caret-right /></a-button>
                  </h2>
                  
                </div>
              </div>
              <div class="row">
                        <member-card v-for="(item,index) in teamMembers" :key="index" :name="item.name" :description="item.tags" :biliMid="item.biliMid" :out-avatar="item.gravatarUrl"></member-card>
                        
                    </div>
            </div>
        </a-layout-content>
      </a-layout>
      <a-layout class="section section-lg" >
        <a-layout-content>
            <div class="container">
              <!--招聘页面引导-->
              <div class="row justify-content-center text-center mb-lg">
                <div class="col-lg-8">
                  <h2 class="display-3">大千世界，欢迎你的加入</h2>
                  <a-button type="primary" @click="this.$router.push({name:'Career'})">点击了解更多招聘信息</a-button>
                </div>
              </div>
            </div>
        
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
  <a-layout v-if="this.$loginStore.isCmsUserLogin">
    <a-layout-content>
      <a-card v-if="hasNoneMarkdown" style="display:flex;flex-direction: column;justify-content: space-around;">
          <h2>您还没有创建过文章</h2>
          <p>创建文章可以让您的作品更加精彩</p>
          <a-button type="primary" @click="CreateArticle">创建文章</a-button>
      </a-card>
      <a-list v-if="hasMarkdown" size="large" >
          <template #header>
              你创建过的文章
          </template>
          <a-list-item v-for="(data,key) in myMarkdowns" :key="key" @click="MarkDownItemClick(data.markdownId,data.willBindArticleId)">
            <a-list-item-meta :title="data.title" :description="data.content">
              <template #avatar>
                  <a-avatar shape="square">
                    <img alt="avatar" src="img/coffee.png" />
                  </a-avatar>
                </template>
            </a-list-item-meta>
          </a-list-item>
      </a-list>
    </a-layout-content>
  </a-layout>
</template>
<style scoped>
.middle-card{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.left-card{
  position: absolute;
  top: 50%;
  left: 25%;
  transform: translate(-25%, -40%);
}
.right-card{
  position: absolute;
  top: 50%;
  right: 25%;
  transform: translate(25%, -40%);
}
.top-card{
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -25%);
}
.bottom-card{
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translate(-50%, 25%);
}
.bottom-guide{
  position: absolute;
  bottom: 0;
  left: 50%;
  right: 0;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 12px;
}
 .banner-text{
    position: absolute;
    top: 0px;
    padding-bottom: 120px;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.1);
    color: #FFF;
    /**display: flex;
    flex-direction: row;
    justify-content: center;*/
}
figure {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 40px;
    margin-inline-end: 40px;
}
.arrow-class{
  color:var(    --primary-1);
}
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 2.1875rem;
}
.effect-fade {
  opacity: 0;
  transform: translateY(45px);
  transition: all .8s
}

.effect-fade.effect-scroll {
  opacity: 1;
  transform: translate(0)
}
.display-3, .display-4 {
   
    line-height: 1.3;
}
.display-3 {
    font-size: 2.1875rem;
}
.lead {
    font-size: 1.25rem;
    margin-top: 1.5rem;
}
.lead, p {
    font-weight: 300;
    line-height: 1.7;
}
.img-fluid, .img-thumbnail {
    max-width: 100%;
    height: auto;
}
.floating {
    -webkit-animation: floating 3s ease infinite;
   
}
/**创建动画 */
@-webkit-keyframes floating {
    0% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(10px);
    }
    100% {
        transform: translateY(0);
    }
}
.mobile-banner{
  margin-bottom:-16px;
  height:320px;
  overflow:hidden;
}
</style>
<script>
// @ is an alias to /src

import memberCard from '../components/memberCard.vue';
import workCard from '../components/workCard.vue';
export default {
  name: 'HomeView',
  data(){
    return {
      fullscreenStyle:{},
      carouselFullScreenStyle:{},
      carouselItems:[
      ],
      myMarkdowns:[

      ],
      hasNoneMarkdown:false,
      hasMarkdown:false,
      teamMembers:[],
      teamMembersOrigin:[]
    }
  },
  created(){
    let bannerAdjust=(data)=>{
      let displayCheckResult=this.$deviceCheck.DisplayCheck()
      console.log("before")
      console.log(this.carouselFullScreenStyle);
      switch(displayCheckResult){
        case this.$deviceCheck.Type.PC:
          this.fullscreenStyle=data;
          this.carouselFullScreenStyle={
            "width":`${this.fullscreenStyle.width}`,
            "height":`${this.fullscreenStyle.height}`,
          }
          break;
        case this.$deviceCheck.Type.Phone:
          this.carouselFullScreenStyle={
            "margin-bottom":"-16px",
            "height":"420px",
            "overflow":"hidden",
          }
          break;
        default:
          console.log("unk")
          break;
      }
      console.log(this.carouselFullScreenStyle);
      console.log("after")
    }
    bannerAdjust(this.$fullscreenStyle)
    this.$bus.on('fullscreenStyle',(data)=>{
      bannerAdjust(data)
    });
    console.log(this.fullscreenStyle);
    if(!this.$loginStore.isCmsUserLogin){
      this.$backendAxios({
        method: 'get',
        url:"/banner"
      }).then((ress)=>{
        this.carouselItems=ress.data.data;
        console.log(this.carouselItems);
      }).catch((err)=>{ console.log(err); })

      this.$backendAxios({
        method: 'get',
        url:"/member"
      }).then((ress)=>{
        let teamMembers=ress.data.data;
        this.teamMembers=teamMembers.slice(0,6)
        this.teamMembersOrigin=teamMembers
        this.$bus.emit("nativeconsolelog",this.teamMembers);
      }).catch((err)=>{ this.$bus.emit("nativeconsolelog",err); })
    }

  },
  methods:{
    BannerClick(url){
      if(url.indexOf("/")==0){
        this.$router.push(url); 
      }else{
        window.location.href=url;
      }
    },
    GetAllMarkdownsByOwner(){
      if(this.$loginStore.isCmsUserLogin){
        this.$backendAxios({
          method:"post",
          url:"/getAllMarkdownsByOwner",
          data:{
            owner:this.$loginStore.cmsUserId,
            accessToken:this.$cryptAdapter.Encrypt(this.$loginStore.cmsAccessToken,1000),
          }
        }).then((res)=>{
          var response=res.data;
          if(response.statusCode==0){
            this.myMarkdowns=response.data.markdowns; 
            if(this.myMarkdowns.length<=0){
              this.hasNoneMarkdown=true;
            }else{
              for(var i=0;i<this.myMarkdowns.length;i++){
                if(this.myMarkdowns[i].content==""){
                  this.myMarkdowns[i].content="好像还没有写内容呢";
                }else{
                  this.myMarkdowns[i].content=this.myMarkdowns[i].content.replace(" ","");
                  if(this.myMarkdowns[i].content.length>47){
                    this.myMarkdowns[i].content=this.myMarkdowns[i].content.substring(0,47)+"...";
                  }
                }
              }
              this.hasMarkdown=true;
              console.log(this.myMarkdowns);
            }
          }else{
            this.$message.error(response.message);
          }
        }).catch((err)=>{
          console.log(err);
          this.$message.error("获取文章失败");
        });

      }
    },
    CreateArticle(){
      this.$router.push("/createArticle");
    },
    MarkDownItemClick(markdownId,articleId){
      //获取点击的文章id
      //跳转到文章页面 /showArticle ,用params传递文章id
      this.$router.push({
        name:"showArticle",
        params:{
          markdownId:markdownId,
          articleId:articleId,
        }
      });
    },
    MoreMemberClick(){
      this.$router.push({
        name:"Staff",
        params:{
          staffData:JSON.stringify(this.teamMembersOrigin)
        }
      })
    }
  },
  mounted(){
    this.GetAllMarkdownsByOwner();
  },
  activated(){
    this.GetAllMarkdownsByOwner();
  },
  components:{
    memberCard,
    workCard,
  }
}
</script>
