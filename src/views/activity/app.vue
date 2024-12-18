<template>
   <div  v-show="!show">
    <el-carousel class="banner" autoplay  v-if="fileList?.length">
        <el-carousel-item
            style="height:50vw"
            v-for="item in fileList"
            :key="item"
        >
            <el-image style="width: 100%" :src="item"  />
        </el-carousel-item>
    </el-carousel>
    <div class="icon_block">
        <div class="paly_button" @click="play(1)">立即试玩</div>
        <img class="game_icon" :src="three"/>
    </div>
    <div class="icon_block">
        <div class="paly_button" @click="play(2)">立即试玩</div>
        <img class="game_icon" :src="four"/>
    </div>
    <div style="height:50px"></div>
    <div class="button_block">
        <div class="button_footer" @click="goHome">主站畅玩</div>
        <div class="button_footer"  v-if="platform=='Android'"><a :href="'https://img.shiliucun.com/package/ysjx.apk'">下载{{platform}} APP</a></div>
    </div>
   </div>
   <div class="iframe"  v-if="show">
    <div class="return_activity" @click="returnPage">返回</div>
    <iframe
          allowfullscreen
          id="gameIframe"
          frameborder="0"
          style="width: 100vh;height:100vw"
          :src="iframe_url"
        >
    </iframe>
   </div>
  </template>

  <script lang="ts" setup>
  import one from "@/assets/banner/one.webp";
  import two from "@/assets/banner/two.webp";
  import three from "@/assets/banner/three.jpg";
  import four from "@/assets/banner/four.webp";

  import { onMounted, ref } from "vue";
  var domainName = window.location.hostname;
  const iframe_url = ref<any>("");
  const fileList =[one,two]
  const show= ref(false)
  const isHttps= ref(false)
  const platform= ref<any>(false)
  if(domainName.includes('shiliucun')){
    isHttps.value = true
  }
  const play = (type)=>{
    if(type==1){
      if(platform.value=='iOS'){
         return window.open(`${isHttps.value?'https://www.shiliucun.com/rbldg_demo_play':'http://websslv112.s3-website.ap-east-1.amazonaws.com/rbldg_demo_play'}`)
      }else{
        show.value = true
        iframe_url.value = isHttps.value?'https://www.shiliucun.com/rbldg_demo_play':'http://websslv112.s3-website.ap-east-1.amazonaws.com/rbldg_demo_play';
      }
    }else{
      if(platform.value=='iOS'){
        return window.open(`${isHttps.value?"https://www.shiliucun.com/azcty_demo_play":"http://websslv112.s3-website.ap-east-1.amazonaws.com/azcty_demo_play"}`)
      }else{
        show.value = true
        iframe_url.value = isHttps.value?"https://www.shiliucun.com/azcty_demo_play":"http://websslv112.s3-website.ap-east-1.amazonaws.com/azcty_demo_play"
      }
    }

};
  const goHome = ()=>{
    window.open('https://phone.shiliucun.com/')
  }

 const getMobileOperatingSystem =()=> {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
    return 'iOS';
  } else if (userAgent.match(/Android/i)) {
    return 'Android';
  } else {
    return false;
  }
}

  const returnPage = ()=>{
    show.value = false
  }
  onMounted(() => {
     platform.value = getMobileOperatingSystem()
  });

  </script>

  <style lang="scss" scoped>
  @import "@/style/mixin.scss";
  a{
    text-decoration: none;
    color: inherit;
  }
  .banner{
    height: 50vw;
    border-radius: 10px;
  }
  .game_icon{
    width:90%;
  }
  .button_block{
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border-top: 1px solid var(--neutral-600, #3B3939);
    height: 8vh;
    width: 100%;
    background: #232222;
    z-index: 1000;
    bottom: 0;
  }
  .icon_block{
    margin-top: 20px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .paly_button{
        height: 40px;
        width: 120px;
        color:#fff;
        position: absolute;
        background:#f00a38;
        line-height:40px;
        text-align: center;
        border-radius: 20px;
        opacity: 0.7;
        bottom:10px
    }
  }
  .iframe{
    position: relative;
    transform: rotate(90deg);
  }
  .return_activity{
    top:10px;
    left:5px;
    height: 40px;
    width: 60px;
    color:#fff;
    position: absolute;
    background:#f00a38;
    line-height:40px;
    text-align: center;
    border-radius: 20px;
    opacity: 0.7;
    bottom:10px;
    z-index: 1000;
  }
  .button_footer{
    width: 50%;
    text-align: center;
    color:#686767;
    line-height:7vh;
    &:active{
        opacity: 0.8;
    }
  }
  </style>
