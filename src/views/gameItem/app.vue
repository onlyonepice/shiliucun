<template>
  <div class="content">
    <div class="left_block">
      <div class="game_iframe">
        <img class="full_screen"  v-if="show" :src="full_screen" @click="fullScreen"/>
        <iframe
          v-if="show"
          allowfullscreen
          id="gameIframe"
          frameborder="0"
          style="border-radius: 20px; height: 34.94792vw; width: 100%"
          @onload="getHight"
          scrolling="auto"
          :src="iframe_url"
        >
        </iframe>
        <img
          v-show="showUrl && !showUrl?.includes('.mp4') && !show"
          class="game_iframe"
          :src="showUrl"
        />
        <video
          controls
          v-show="showUrl && showUrl?.includes('.mp4') && !show"
          class="game_iframe"
          :src="showUrl"
        ></video>
      </div>
      <div class="card_block">
        <div class="item_block">
          <div
            v-for="item in info?.intro_img_list"
            :key="item"
            @click="showBlock(item)"
          >
            <img class="card_img" v-if="!item?.includes('.mp4')" :src="item" />
            <video controls v-if="item?.includes('.mp4')" class="card_img">
              <source :src="item" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
    <div class="right_block">
      <div class="detail_block">
        <div class="title">{{ info.name }}</div>
        <img v-if="info.icon" :src="info.icon" />
        <!-- <div class="action">
              <div class="icon">
                  <img class="tips_icon" :src="heart">
                  <div>{{info?.hot_num}}</div>
              </div>
              <div class="icon">
                  <img class="tips_icon" :src="star">
                  <div>愿望清单</div>
              </div>
              <div class="icon">
                  <img class="tips_icon" :src="copy">
                  <div>分享</div>
              </div>
          </div> -->
        <div class="pay_success" v-if="info.lock == 1 && info.price > 0">
          <img class="tips_icon" :src="success_icon" />您已购买此游戏
        </div>
        <template v-if="route.query.time === 'now'">
          <div>
            <el-button @click="info.lock==0?payGame():play(true)" class="btn-play">{{info.lock==0?'立即购买':'立即玩' }}</el-button>
          </div>
          <div>
            <el-button v-if="info.lock == 0" @click="play" class="btn-play"
              >试玩</el-button
            >
          </div>
          <div>
            <el-button @click="wait" class="btn-play"
              >畅玩4K</el-button>
          </div>
        </template>
      </div>
      <div class="introduction">
        <div class="title">游戏介绍</div>
        <div class="intro_body">
          <!-- <div class="intro_tips">
              <div class="tag">限制级</div>
              <div class="tag">MASOBU精选
                </div>
              <div class="tag">知名女优
                </div>
            </div> -->
          <div class="intro_content">
            {{ info.intro }}
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
import full_screen from "@/assets/img/full_screen.png";
import success_icon from "@/assets/img/success-filling.png";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { onMounted, ref, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { gameInfo } from "@/api/index";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const game_id = route.query.game_id;
const info = ref<any>({ route: "", game_id: "" });
const show = ref<any>(false);
const iframe_url = ref<any>("");
const showUrl = ref<any>("");
const token = getToken();
const wait = ()=>{
  ElMessage({
    message: '敬请期待',
    type: 'info',
    plain: true,
  })
}
const openDialog = (type: string) => {
  useUserStoreHook().openLogin(true, type);
};
const payGame = ()=>{
  if(!token){
    return openDialog()
  }
  useUserStoreHook().openPayGame(true, info.value);
}
const fullScreen = ()=>{
  let iframes = document.getElementById("gameIframe") as HTMLIFrameElement;
    iframes.requestFullscreen().catch(err => {
        console.error(err);
    });
}
const handleMessage = (event: MessageEvent) => {
  let data = null;
  data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
  console.log('data.action===>',data.action)
  if (data.action == "agree") {
    return useUserStoreHook().openPayGame(true, info.value);
  }
  if (data.action == "disagree") {
    return router.push("/home");
  }

  try {
    let iframeRef = document.getElementById("gameIframe") as HTMLIFrameElement;
    let params = {
      token: token || 123,
      game_id: info.value.game_id,
    };
    iframeRef?.contentWindow?.postMessage(
      JSON.stringify(params),
      "*", // 支持跨域
    );
  } catch (error) {
    console.error("Error parsing iframe message:", error);
  }
};
const play = (flag) => {
  if (!token) {
    return openDialog();
  }
  show.value = false;
  setTimeout(() => {
    iframe_url.value = flag ? info.value?.route : info.value?.demo_route;
    show.value = true;
  }, 10);
};

const showBlock = (item: any) => {
  show.value = false;
  showUrl.value = item;
};
const getHight = () => {
  let iframes = window.parent.document.getElementsByTagName("gameIframe");
  for (var i = 0, j = iframes.length; i < j; ++i) {
    iframes[i].setAttribute(
      "height",
      iframes[i].contentWindow.document.body.scrollHeight,
    );
  }
};

onMounted(() => {
  gameInfo({ game_id }).then((res) => {
    showUrl.value = res.data.info.intro_img_list[0];
    info.value = res.data.info;
  });
  window.addEventListener("message", handleMessage);
  // window.addEventListener('agree', handleMessage);
  // window.addEventListener('disagree', handleMessage);

  document.getElementById("myframe")?.contentWindow.location.reload();
});
onUnmounted(() => {
  console.log("页面即将销毁");
  window.removeEventListener("message", handleMessage);
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.full_screen{
  &:hover{
    opacity: 0.8;
  }
  height:2vw;
  width: 2vw;
  z-index: 10000;
  position: absolute;
  bottom:20px;
  right: 20px;
}
.success_icon {
  width: 16.25vw;
  height: 9.16667vw;
  object-fit: cover;
  border-radius: 0.625vw;
  border-radius: var(--md, 0.625vw);
}
.pay_success {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625vw;
  font-weight: 500;
  color: #5bd493;
  grid-gap: 0.20833vw;
  gap: 0.20833vw;
  margin: 10px;
}
.introduction {
  padding: 0.625vw 1.25vw;
  padding: var(--xs, 0.625vw) var(--lg, 1.25vw);
  border-radius: 1.25vw;
  border-radius: var(--lg, 1.25vw);
  background: #171616;
  background: var(--neutral-950, #171616);
  margin-top: 0.625vw;
  margin-top: var(--xs, 0.625vw);
  .title {
    display: flex;
    padding: 0.625vw 1.25vw;
    padding: var(--xs, 0.625vw) var(--lg, 1.25vw);
    color: #f0eded;
    color: var(--neutral-50, #f0eded);
    font-size: 1.25vw;
    font-weight: 400;
    line-height: 1.66667vw;
  }
  .intro_body {
    padding: 0.625vw 1.25vw;
    display: flex;
    flex-direction: column;
    grid-gap: 0.625vw;
    gap: 0.625vw;
  }
  .intro_tips {
    display: flex;
    flex-wrap: wrap;
    grid-gap: 0.20833vw;
    gap: 0.20833vw;
  }
  .intro_content {
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    max-height: 26.04167vw;
    overflow-y: auto;
    font-size: 0.72917vw;
  }
  .tag {
    display: flex;
    padding: 0.20833vw 0.41667vw;
    padding: var(--5xs, 0.20833vw) var(--3xs, 0.41667vw);
    border-radius: 0.20833vw;
    border-radius: var(--5xs, 0.20833vw);
    background: #222121;
    background: var(--neutral-900, #222121);
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: 0.625vw;
    font-weight: 400;
    line-height: 1.04167vw;
  }
}
.detail_block {
  position: relative;
  padding: 0.625vw 1.25vw;
  padding: var(--md, 0.625vw) var(--3xl, 1.25vw) var(--xs, 0.625vw)
    var(--3xl, 1.25vw);
  border-radius: 1.25vw;
  border-radius: var(--lg, 1.25vw);
  border: 0.5px solid #3b3939;
  border: 0.5px solid var(--neutral-600, #3b3939);
  background: #171616;
  background: var(--neutral-950, #171616);
  -webkit-backdrop-filter: blur(1.04167vw);
  backdrop-filter: blur(1.04167vw);
  overflow: hidden;
  .title {
    padding: 0.8vw 0;
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
  button {
    width: 100%;
    height: 2.5vw;
    font-size: 0.83333vw;
    font-weight: 500;
    border-radius: 0.41667vw;
    margin-bottom: 0.5vw;
  }
  img {
    width: 16.25vw;
    height: 9.16667vw;
    object-fit: cover;
    border-radius: 0.625vw;
    border-radius: var(--md, 0.625vw);
  }

  .btn-play {
    margin-top: 0.6vw;
    height: 2.58333vw;
    font-size: 0.92917vw;
    line-height: 1.5vw;
    padding: 1.04167vw;
    justify-content: center;
  }
  .action {
    display: flex;
    align-items: center;
  }
  .icon {
    flex: 1 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.3125vw;
    grid-gap: 0.3125vw;
    gap: 0.3125vw;
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: 0.625vw;
    font-weight: 400;
    line-height: 1.04167vw;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .tips_icon {
    width: 1.04167vw;
    height: 1.04167vw;
  }
}
::-webkit-scrollbar {
  display: none;
}
.game_iframe {
  position: relative;
  width: calc(100% - 20px);
  height: 34.94792vw;
  width: 100%;
  border-radius: 20px;
}
.content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.card_block {
  margin-top: 1.5vw;
  width: 100%;

  width: calc(100% - 20px);
  .item_block {
    display: flex;
    flex-direction: row;
    grid-gap: 0.625vw;
    gap: 0.625vw;
    grid-gap: var(--xs, 0.625vw);
    gap: var(--xs, 0.625vw);
    overflow-x: auto;
  }
}
.right_block {
  width: 18.75vw;
}
.left_block {
  padding-left: 1.8vw;
  width: 61.45833vw;
}
.card_img {
  width: 14.58333vw;
  height: 8.17708vw;
  object-fit: cover;
  border-radius: 0.625vw;
  border-radius: var(--md, 0.625vw);
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
