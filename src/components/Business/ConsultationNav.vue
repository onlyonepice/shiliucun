<template>
  <div :class="ns.b()" v-if="useUserStore().$state.showConsultationNav">
    <div v-for="(item, index) in navList" :key="index" :class="ns.b('item')">
      <div :class="ns.be('item', 'img-box')">
        <img :src="item.icon" alt="" />
        <div :class="ns.be('item', 'text')">{{ item.name }}</div>
        <div v-if="item.iconHover" :class="ns.be('item', 'hover')">
          <img :src="item.iconHover" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import customerService from "@/assets/img/consultationNav/customerService.png";
import miniApp from "@/assets/img/consultationNav/miniApp.png";
import weChat from "@/assets/img/consultationNav/weChat.png";
import miniAppHover from "@/assets/img/consultationNav/miniApp-hover.png";
import weChatHover from "@/assets/img/consultationNav/weChat-hover.png";
import customerServiceHover from "@/assets/img/consultationNav/customerService-hover.png";
const ns = useNamespace("consultation-nav");
const showConsultation: Ref<boolean> = ref(true);
const navList = ref([
  {
    name: "掌上\n储能",
    icon: miniApp,
    iconHover: miniAppHover,
  },
  {
    name: "储能云",
    icon: weChat,
    iconHover: weChatHover,
  },
  {
    name: "客服\n咨询",
    icon: customerService,
    iconHover: customerServiceHover,
  },
]);
watch(
  () => useUserStore().$state.showConsultationNav,
  (newVal) => {
    showConsultation.value = newVal;
  },
  {
    immediate: true,
  },
);
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
  @include widthAndHeight(64px, auto);
  @include flex();
  padding: 11px 4px;

  .es-consultation-nav-item {
    @include flex();
    flex-direction: column;
    margin-bottom: 2px;

    &:last-child {
      margin-bottom: 0;
    }

    .es-consultation-nav-item__img-box {
      @include flex();
      @include widthAndHeight(40px, auto);
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      font-weight: 400;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 18px;
      padding: 5px 0;
      position: relative;
      .es-consultation-nav-item__text {
        white-space: pre-line;
      }
      .es-consultation-nav-item__hover {
        animation-duration: 0.3s;
        animation-fill-mode: both;
        animation-name: fadeOutLeft;
        position: absolute;
        top: 50%;
        transform: translate(0%, -50%);
        right: 0;
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
  }
}
@keyframes fadeInLeft {
  0% {
    display: block;
    opacity: 0;
    right: 40px;
  }

  100% {
    display: block;
    opacity: 1;
    right: 58px;
  }
}

@keyframes fadeOutLeft {
  0% {
    display: block;
    opacity: 1;
    right: 58px;
  }

  100% {
    display: none;
    opacity: 0;
    right: 40px;
  }
}
</style>
