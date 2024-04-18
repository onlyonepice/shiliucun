<template>
  <div :class="ns.b()">
    <div v-for="(item, index) in navList" :key="index" :class="ns.b('item')">
      <div :class="ns.be('item', 'img-box')">
        <img :src="item.icon" alt="" />
        <div v-if="item.iconHover" :class="ns.be('item', 'hover')">
          <img :src="item.iconHover" alt="" />
        </div>
      </div>
      <div :class="ns.be('item', 'line')" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";

import customerService from "@/assets/img/consultationNav/customerService.png";
import miniApp from "@/assets/img/consultationNav/miniApp.png";
import weChat from "@/assets/img/consultationNav/weChat.png";
import miniAppHover from "@/assets/img/consultationNav/miniApp-hover.png";
import weChatHover from "@/assets/img/consultationNav/weChat-hover.png";
const ns = useNamespace("consultation-nav");

const navList = ref([
  { name: "客服", icon: customerService },
  { name: "小程序", icon: miniApp, iconHover: miniAppHover },
  { name: "微信", icon: weChat, iconHover: weChatHover },
]);
</script>
<style lang="scss" scoped>
@import "@/style";

.es-consultation-nav {
  position: fixed;
  bottom: 40px;
  right: 32px;
  @include box(
    0,
    0,
    #ffffff,
    4px,
    1px solid #dbdce2,
    0px 4px 10px 0px rgba(0, 0, 0, 0.1)
  );
  @include widthAndHeight(40px, auto);
  @include flex();
  padding: 4px;

  .es-consultation-nav-item {
    @include flex();
    flex-direction: column;
    margin-bottom: 2px;

    &:last-child {
      margin-bottom: 0;

      .es-consultation-nav-item__line {
        display: none;
      }
    }

    .es-consultation-nav-item__img-box {
      @include flex();
      @include widthAndHeight(32px, 32px);
      border-radius: 4px;
      cursor: pointer;

      .es-consultation-nav-item__hover {
        animation-duration: 0.3s;
        animation-fill-mode: both;
        animation-name: fadeOutLeft;
        position: fixed;
        bottom: 48px;
        right: 80px;
        @include box(
          8px,
          0,
          #ffffff,
          4px,
          1px solid #dbdce2,
          0px 4px 10px 0px rgba(0, 0, 0, 0.1)
        );
        @include widthAndHeight(96px, 96px);
        padding: 4px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      &:hover {
        background: #f2f3f5;

        .es-consultation-nav-item__hover {
          animation-name: fadeInLeft;
        }
      }
    }

    img {
      @include widthAndHeight(20px, 20px);
    }

    .es-consultation-nav-item__line {
      margin-top: 2px;
      @include widthAndHeight(16px, 1px);
      background: #dbdce2;
    }
  }
}
@keyframes fadeInLeft {
  0% {
    display: block;
    opacity: 0;
    right: 66px;
  }

  100% {
    display: block;
    opacity: 1;
    right: 80px;
  }
}

@keyframes fadeOutLeft {
  0% {
    display: block;
    opacity: 1;
    right: 80px;
  }

  100% {
    display: none;
    opacity: 0;
    right: 66px;
  }
}
</style>
