
<template>
    <div class="content">
      <div class="left_block">
        <div class="game_iframe">
        <iframe id="gameIframe" frameborder="0" style="border-radius: 20px; height: 34.94792vw;width:100%" @onload="getHight"  scrolling="auto" src="https://www.baidu.com/"></iframe>
      </div>
      <div class="card_block">
        
        <div class="item_block">
          <div  v-for="item in fileList" :key="item" >
            <img class="card_img" :src="test"/>
          </div>
        </div>
      </div>
      </div>
      <div class="right_block">
        <div class="detail_block">
            <div class="title">涩点点《超色气女仆 永井すみれ》网页游玩</div>
            <img :src="test"/>
            <div class="action">
                <div class="icon">
                    <img class="tips_icon" :src="heart">
                    <div>3</div>
                </div>
                <div class="icon">
                    <img class="tips_icon" :src="star">
                    <div>愿望清单</div>
                </div>
                <div class="icon">
                    <img class="tips_icon" :src="copy">
                    <div>分享</div>
                </div>
            </div>
            <el-button @click="openDialog('register')" class="btn-play">立即免费玩</el-button>
        </div> 
        <div class="introduction">
            <div class="title">游戏介绍</div>
            <div class="intro_body">
              <div class="intro_tips">
                <div class="tag">限制级</div>
                <div class="tag">MASOBU精选
                  </div>
                <div class="tag">知名女优
                  </div>
              </div>
              <div class="intro_content">
                溫熱的泡沫逐漸滑落，露出她誘人的曲線。當她靠近時，空氣中瀰漫著緊張與欲望，「主人，您需要好好放鬆吧？」每個字都充滿挑逗，直擊你的心靈。 她跨坐在你身上，指尖在你的肌膚上遊走，帶來如電流般的悸動。每一滴水流的滑落，都撩動你內心的渴望。「這樣舒服嗎，主人？」她的低語令你迷失在這場遊戲中。 隨著她股間逐漸向下，你感受到她的體溫與形狀。「主人，我會讓您滿意的。」語音剛落，下面傳來的包覆感讓你徹底陷入誘惑的漩渦，無法自拔。





                遊戲提示： 

                1.目前不支持Iphone10以下或iOS17以下的軟體版本。

                2.網頁版目前無法支持隨電腦螢幕調整尺寸，建議使用手機進行遊玩體驗。

                3.支付部分目前不支持IPhone 10或iOS 17以下的軟體版本；若其他機型，無法顯示支付方式，可以進入「設定」>「App」>「Safari」· 開啟或關閉「阻擋彈出式視窗」，即可支付。

                4.iphone目前支持safari瀏覽器，Chrome的部分將排入下次更版優化。
                遊戲提示： 

                1.目前不支持Iphone10以下或iOS17以下的軟體版本。

                2.網頁版目前無法支持隨電腦螢幕調整尺寸，建議使用手機進行遊玩體驗。

                3.支付部分目前不支持IPhone 10或iOS 17以下的軟體版本；若其他機型，無法顯示支付方式，可以進入「設定」>「App」>「Safari」· 開啟或關閉「阻擋彈出式視窗」，即可支付。

                4.iphone目前支持safari瀏覽器，Chrome的部分將排入下次更版優化。
                遊戲提示： 

                1.目前不支持Iphone10以下或iOS17以下的軟體版本。

                2.網頁版目前無法支持隨電腦螢幕調整尺寸，建議使用手機進行遊玩體驗。

                3.支付部分目前不支持IPhone 10或iOS 17以下的軟體版本；若其他機型，無法顯示支付方式，可以進入「設定」>「App」>「Safari」· 開啟或關閉「阻擋彈出式視窗」，即可支付。

                4.iphone目前支持safari瀏覽器，Chrome的部分將排入下次更版優化。
              </div>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import star from "@/assets/img/star.svg";
  import heart from "@/assets/img/heart.svg";
  import copy from "@/assets/img/copy.png";
  import test from "@/assets/img/test.jpg";
  import { useUserStoreHook } from "@/store/modules/user";
  import { ref } from "vue";
  const openDialog = (type: string) => {
    useUserStoreHook().openLogin(true, type);
  };
  const fileList = ref([1,2,3,4,5,6,7,8])
  
  const getHight = ()=>{
    let iframes = window.parent.document.getElementsByTagName('gameIframe');
    for (var i = 0, j = iframes.length; i < j; ++i) {
      iframes[i].setAttribute('height', iframes[i].contentWindow.document.body.scrollHeight)
      }
    }
  </script>
  
  <style lang="scss" scoped>
  @import "@/style/mixin.scss";
  
  .introduction {
    padding: .625vw 1.25vw;
    padding: var(--xs, .625vw) var(--lg, 1.25vw);
    border-radius: 1.25vw;
    border-radius: var(--lg, 1.25vw);
    background: #171616;
    background: var(--neutral-950, #171616);
    margin-top: .625vw;
    margin-top: var(--xs, .625vw);
    .title{
      display: flex
;
    padding: .625vw 1.25vw;
    padding: var(--xs, .625vw) var(--lg, 1.25vw);
    color: #f0eded;
    color: var(--neutral-50, #f0eded);
    font-size: 1.25vw;
    font-weight: 400;
    line-height: 1.66667vw;
    }
    .intro_body {
    padding: .625vw 1.25vw;
    display: flex;
    flex-direction: column;
    grid-gap: .625vw;
    gap: .625vw;
}
  .intro_tips {
      display: flex
  ;
      flex-wrap: wrap;
      grid-gap: .20833vw;
      gap: .20833vw;
  }
  .intro_content{
    color: #b6b3b3;
      color: var(--neutral-100, #b6b3b3);
      max-height: 26.04167vw;
      overflow-y: auto;
      font-size: .72917vw;
  }
  .tag{
    display: flex
;
    padding: .20833vw .41667vw;
    padding: var(--5xs, .20833vw) var(--3xs, .41667vw);
    border-radius: .20833vw;
    border-radius: var(--5xs, .20833vw);
    background: #222121;
    background: var(--neutral-900, #222121);
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: .625vw;
    font-weight: 400;
    line-height: 1.04167vw;
  }
}
  .detail_block{
    position: relative;
    padding: .625vw 1.25vw;
    padding: var(--md, .625vw) var(--3xl, 1.25vw) var(--xs, .625vw) var(--3xl, 1.25vw);
    border-radius: 1.25vw;
    border-radius: var(--lg, 1.25vw);
    border: .5px solid #3b3939;
    border: .5px solid var(--neutral-600, #3b3939);
    background: #171616;
    background: var(--neutral-950, #171616);
    -webkit-backdrop-filter: blur(1.04167vw);
    backdrop-filter: blur(1.04167vw);
    overflow: hidden;
    .title{
        padding: .8vw 0;
        color: #f0eded;
        color: var(--neutral-50, #f0eded);
        font-size: 1.45833vw;
        font-weight: 400;
        line-height: 1.875vw;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        }
    button{
        width: 100%;
        height: 2.5vw;
        font-size: .83333vw;
        font-weight: 500;
        border-radius: .41667vw;
        margin-bottom: .5vw;

    }
    img{
      width: 16.25vw;
      height: 9.16667vw;
      object-fit: cover;
      border-radius: .625vw;
      border-radius: var(--md, .625vw);
    }
 
    .btn-play {
      margin-top: .6vw;
      height: 2.58333vw;
      font-size: 0.92917vw;
      line-height: 1.5vw;
      padding: 1.04167vw ;
      justify-content: center;
    }
    .action{
        display: flex;
        align-items: center;
    }
    .icon{
        flex: 1 1;
    display: flex
;
    align-items: center;
    justify-content: center;
    padding: .3125vw;
    grid-gap: .3125vw;
    gap: .3125vw;
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: .625vw;
    font-weight: 400;
    line-height: 1.04167vw;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    }
    .tips_icon{
        width: 1.04167vw;
        height: 1.04167vw;
    }
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .game_iframe{
    width:calc(100% - 20px);
  }
  .content{
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .card_block{
    margin-top:1.5vw;
    width: 100%;
   
    width:calc(100% - 20px);
    .item_block{
      display: flex;
      flex-direction: row;
      grid-gap: .625vw;
      gap: .625vw;
      grid-gap: var(--xs, .625vw);
      gap: var(--xs, .625vw);
      overflow-x: auto;
  
    }
  }
  .right_block{
    width: 18.75vw;
  }
  .left_block{
    padding-left:1.8vw;
    width: 61.45833vw;
  }
  .card_img{
    width: 14.58333vw;
    height: 8.17708vw;
    object-fit: cover;
    border-radius: .625vw;
    border-radius: var(--md, .625vw);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .demonstration {
    color: var(--el-text-color-secondary);
  }
  </style>
  