<template>
    <a-layout id="mainn">
      <a-layout-header>
        <headers></headers>
      </a-layout-header>
      <a-layout-content class="main_content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer>
        <footers></footers>
      </a-layout-footer>
    </a-layout>
    <a-back-top target-container="#mainn" :style="{position:'absolute'}" />
</template>
<script>
import headers from './components/headers.vue';
import footers from './components/footers.vue';
export default {
  components: {
    headers,
    footers,
  },
  mounted() {
    this.$bus.on('change-page', ({ key }) => {
      this.current = key;
      //INFO: submenu 是用于占位
      if(key !== "submenu" && key.indexOf("/")===0){
        this.$router.push(key);
      }
    });
  },
  data() {
    return {
      current: '1',
      urls:{
        "1":"/",
      }
    };
  },
  created(){
    console.log("hello world")
  }
}
</script>
<style lang="less">
.fade-in-section {
  opacity: 0;
  transform: translateY(20vh);
  visibility: hidden;
  transition: opacity 1200ms ease-out, transform 600ms ease-out,
  visibility 1200ms ease-out;
  will-change: opacity, transform, visibility; // 动画性能优化，页面不是特别复杂情况下不要使用，详见：这里　　
}
.fade-in-section.is-visible {
  opacity: 1;
  transform: none;
  visibility: visible;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.main_content {
  padding: 0;
  height:fit-content;
}
@media (prefers-color-scheme: light) {
  .slide_tips{ width: 30px; height: 57px; position: absolute; left: 50%; margin-left: -15px; bottom: 100%; z-index: 100;}
  .slide_tips .s_line{ width: 2px; height: 32px; border-radius: 2px; position: absolute; left: 50%; margin-left: -1px; top: 0px; color:#000;}
  .slide_tips .txt{ width: 100%; position: absolute; left:0; text-align: center; bottom: 0px; font-size: 12px; letter-spacing: 2px;}


  .en-us .slide_tips .txt{ left:-6px;}

  .slide_tips .s_line{ animation: a_banner_s_line 3s 0.3s linear both infinite;-webkit-animation: a_banner_s_line 3s 0.3s linear both infinite;-ms-animation: a_banner_s_line 3s 0.3s linear both infinite;-moz-animation: a_banner_s_line 3s 0.3s linear both infinite;-o-animation: a_banner_s_line 3s 0.3s linear both infinite;}

  .banner_txt .hook_area > i{ opacity: 0;}
}
@media (prefers-color-scheme: dark) {
  .slide_tips{ width: 30px; height: 57px; position: absolute; left: 50%; margin-left: -15px; bottom: 100%; z-index: 100;}
  .slide_tips .s_line{ width: 2px; height: 32px; border-radius: 2px; position: absolute; left: 50%; margin-left: -1px; top: 0px; color:rgba(255,255,255,0.5);}
  .slide_tips .txt{ width: 100%; position: absolute; left:0; text-align: center; bottom: 0px; font-size: 12px; letter-spacing: 2px;color:rgba(255,255,255,0.5);}
  .en-us .slide_tips .txt{ left:-6px;}
  .slide_tips .s_line{ animation: a_banner_s_line 3s 0.3s linear both infinite;-webkit-animation: a_banner_s_line 3s 0.3s linear both infinite;-ms-animation: a_banner_s_line 3s 0.3s linear both infinite;-moz-animation: a_banner_s_line 3s 0.3s linear both infinite;-o-animation: a_banner_s_line 3s 0.3s linear both infinite;}
  .banner_txt .hook_area > i{ opacity: 0;}
}
@media(prefers-color-scheme:no-preference){
  .slide_tips{ width: 30px; height: 57px; position: absolute; left: 50%; margin-left: -15px; bottom: 100%; z-index: 100;}
  .slide_tips .s_line{ width: 2px; height: 32px; border-radius: 2px; position: absolute; left: 50%; margin-left: -1px; top: 0px; color:#86909C;}
  .slide_tips .txt{ width: 100%; position: absolute; left:0; text-align: center; bottom: 0px; font-size: 12px; letter-spacing: 2px;color:#86909C;}
  .en-us .slide_tips .txt{ left:-6px;}
  .slide_tips .s_line{ animation: a_banner_s_line 3s 0.3s linear both infinite;-webkit-animation: a_banner_s_line 3s 0.3s linear both infinite;-ms-animation: a_banner_s_line 3s 0.3s linear both infinite;-moz-animation: a_banner_s_line 3s 0.3s linear both infinite;-o-animation: a_banner_s_line 3s 0.3s linear both infinite;}
  .banner_txt .hook_area > i{ opacity: 0;}
}
@keyframes a_banner_s_line {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(32px);
  }
}

.company-logo{
  background-image: url('./assets/company_logo.svg');
  background-repeat: no-repeat;
  object-fit: cover;
 /* color:transparent;
  filter: invert(1) grayscale(1) contrast(2);*/
}
</style>

