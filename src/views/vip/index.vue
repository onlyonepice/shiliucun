<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <p class="title">会员中心</p>
    <div class="wrapper">
      <div class="item" v-for="item in accountList" :key="item.name">
        <img :src="item.bgImg" alt="" />
        <p @click="handleClick(item)" class="item_btn" />
      </div>
    </div>
    <div
      class="dialog-wrapper"
      :style="{ pointerEvents: QRvisible ? 'all' : 'none' }"
      :class="[
        {
          'dialog-wrapper-active': QRvisible,
        },
      ]"
    >
      <div class="dialog">
        <img class="QR" :src="PayQR" />

        <img class="cancel" :src="cancel_icon" @click="handleSkip()" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import cancel_icon from "@/assets/img/common/icon_clear.png";
import account_business_bg from "@/assets/img/vip/account-business-bg.png"; // 企业会员
import account_ordinary_bg from "@/assets/img/vip/account-ordinary-bg.png"; // 普通会员
import account_standard_bg from "@/assets/img/vip/account-standard-bg.png"; // 个人会员
import PayQR from "@/assets/img/vip/pay-member-qr.png";
import { getToken } from "@/utils/auth";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
const router = useRouter();
const ns = useNamespace("vip");
const QRvisible = ref(false);
const accountList = ref([
  { id: 0, name: "普通账户", bgImg: account_ordinary_bg },
  { id: 1, name: "标准账户", bgImg: account_standard_bg },
  { id: 2, name: "企业账户", bgImg: account_business_bg },
]);
// 账户信息
const handleSkip = () => {
  QRvisible.value = false;
};
const handleClick = (item) => {
  const _id = item.id;
  if (_id !== 0 && !getToken()) {
    return useUserStore().openLogin(true);
  }
  if (_id === 1) {
    useUserStore().openMembersBuy(true);
  } else {
    _id === 0 && router.push("/home");
    _id === 2 && (QRvisible.value = true);
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-vip {
  padding: 80px 0;
  .title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    margin-bottom: 32px;
  }
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .item {
      @include widthAndHeight(368px, 1802px);
      position: relative;
      img {
        @include widthAndHeight(100%, 100%);
      }
      .item_btn {
        @include widthAndHeight(324px, 40px);
        @include absolute(2, 200px, 0, 0, 22px);
        cursor: pointer;
      }
    }
  }
  .dialog-wrapper {
    position: fixed;
    left: 0%;
    top: 0%;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: -10;
    opacity: 0;
    transition: all 0.25s;

    .dialog {
      width: min-content;
      height: min-content;
      text-align: center;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      transition: all 0.25s;
      transform: translateY(50px);
      z-index: 9;

      .QR {
        width: 320px;
      }

      .cancel {
        width: 32px;
        height: 32px;
        margin-top: 16px;
        cursor: pointer;
        background-color: transparent;
      }
    }

    &.dialog-wrapper-active {
      z-index: 999;
      opacity: 1;

      .dialog {
        transform: translateY(0px);
      }
    }
  }
}
</style>
