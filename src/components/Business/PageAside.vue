<template>
  <aside class="pageAside">
    <div class="pageAside-top">
      <template v-if="hasToken">
        <div class="userInfo___1qh4o">
          <img :src="useUserStoreHook().$state.userInfo.avatar_url" alt="">
          <div>
            <p class="userInfo___1qh4o-id">{{ useUserStoreHook().$state.userInfo.nickname }}</p>
            <p class="userInfo___1qh4o-name">UID {{ useUserStoreHook().$state.userInfo.uid }}</p>
          </div>
        </div>
        <div class="pageAside-coin" @click="choseMenu = 1">
          <div>
            <p class="coin-text">{{ useUserStoreHook().$state.userInfo.coin }}币</p>
            <div class="coin-icon">
              <img :src="MoneyCoin" alt="" />
              <span>Mode Coin</span>
            </div>
          </div>
          <img class="more-icon" :src="MoreIcon" alt="">
        </div>
      </template>
      <div class="menusTitle___19IQ3">MENU</div>
      <div
        v-for="item in menuList"
        :key="item.title"
        :class="[
          'menusItemLeft___Si0Uw',
          choseMenu === item.id ? 'pageAside-active' : '',
        ]"
        @click="choseMenu = item.id"
      >
        <img :src="item.icon" alt="" />
        <p>{{ item.title }}</p>
      </div>
    </div>
    <div class="pageAside-bottom">
      <div class="menusTitle___19IQ3">账户</div>
      <template v-if="!hasToken">
        <div class="menusItemLeft___Si0Uw" @click="openDialog('login')">
          <img :src="GamePreview" alt="" />
          <p>登录</p>
        </div>
        <el-button class="btn-no-account" @click="openDialog('register')"
          ><img
            :src="RegisterIcon"
            style="width: 1.25vw; height: 1.25vw; margin-right: 0.25vw"
          />建立免费账号</el-button
        >
      </template>
      <template v-else>
        <div class="menusItemLeft___Si0Uw" @click="openDialog('login')">
          <img :src="LogoutIcon" alt="" />
          <p>登出</p>
        </div>
      </template>
    </div>
  </aside>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import GamePreview from "@/assets/img/game-preview.png";
import ChargeCenter from "@/assets/img/charge-center.png";
import RegisterIcon from "@/assets/img/register-icon.png";
import LogoutIcon from "@/assets/img/logout-icon.png";
import { useRouter, useRoute } from "vue-router";
import MoneyCoin from "@/assets/img/money-coin.png";
import MoreIcon from "@/assets/img/more-icon.png";
const router = useRouter();
const route = useRoute();
const hasToken = ref(false);
const menuList = ref([
  {
    id: 0,
    icon: GamePreview,
    title: "游戏一览",
    link: "/gamePreview",
  },
  {
    id: 1,
    icon: ChargeCenter,
    title: "充值中心",
    link: "/recharge",
  },
]);
const choseMenu = ref(0);
watch(
  () => choseMenu.value,
  (val) => {
    router.push(menuList.value[val].link);
  },
);
watch(
  () => useUserStoreHook().$state.token,
  (val) => {
    hasToken.value = val !== "";
  },
  { immediate: true }
);
watch(
  () => route.path,
  (val) => {
    choseMenu.value = menuList.value.findIndex((item) => item.link === val);
  },
  { immediate: true },
);
const openDialog = (type: string) => {
  useUserStoreHook().openLogin(true, type);
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.pageAside {
  @include widthAndHeight(16.66667vw, calc(100vh - 6.25vw));
  background-color: #171616;
  padding: 1.25vw;
  background-image: url("@/assets/img/transparent-bg.png");
  background-position: 100% 100%;
  background-size: 200%;
  background-repeat: no-repeat;
  border-radius: 1.25vw;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.menusTitle___19IQ3 {
  color: #6f6d6d;
  font-size: 0.625vw;
  font-weight: 400;
  line-height: 1.04167vw;
  margin-bottom: 0.625vw;
}
.menusItemLeft___Si0Uw {
  @include flex(center, flex-start, nowrap);
  padding: 0.41667vw;
  cursor: pointer;
  margin-bottom: 0.25vw;
  img {
    @include widthAndHeight(1.25vw, 1.25vw);
    margin-right: 0.25vw;
  }
  p {
    color: #b6b3b3;
    @include font(0.72917vw, 400, #b6b3b3, 1.04167vw);
  }
}
.pageAside-active {
  // background-color: #323030;
  background: linear-gradient(to right, rgba(237, 161, 69, 0), #323030);
  border-radius: 0.625vw;
}
.pageAside-top {
  width: 100%;
  display: block;
}
.btn-no-account {
  @include widthAndHeight(100%, 2.08333vw);
  @include font(0.72917vw, 400, #b6b3b3, 1.04167vw);
  text-align: left;
}
.userInfo___1qh4o {
  @include flex(center, space-between, nowrap);
  margin-bottom: 0.83333vw;
  img {
    width: 2.5vw;
    height: 2.5vw;
    border: 0cap solid #fff;
    border-radius: 50%;
    object-fit: cover;
    flex: 0;
    margin-right: 0.83333vw;
  }
  div {
    flex: 1;
  }
  .userInfo___1qh4o-id {
    color: #f0eded;
    font-size: 0.83333vw;
    line-height: 1.04167vw;
    margin-bottom: 0.20833vw;
  }
  .userInfo___1qh4o-name {
    @include font(0.625vw, 400, #6f6d6d, 1.04167vw);
  }
}
.pageAside-coin {
  padding: 0.41667vw 0.41667vw 0.41667vw 0.83333vw;
  cursor: pointer;
  @include flex(center, space-between, nowrap);
  background-color: #222121;
  border: 0.5px solid #3b3939;
  margin-bottom: 0.41667vw;
  .coin-text {
    @include font(0.83333vw, 400, #f00a38, 1.04167vw);
    margin-bottom: 0.04167vw;
  }
  .coin-icon {
    @include flex(center, center, nowrap);
    img {
      @include widthAndHeight(1.04167vw, 1.04167vw);
      margin-right: 0.20833vw;
    }
    span {
      @include font(0.625vw, 400, #6f6d6d, 1.04167vw);
    }
  }
}
.more-icon {
  @include widthAndHeight(1.25vw, 1.25vw);
}
</style>
