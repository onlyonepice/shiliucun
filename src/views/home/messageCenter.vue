<template>
  <Breadcrumb :breadcrumbList="breadcrumbList" />
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('content')">
      <div :class="ns.be('content', 'top')">
        <Tabs
          :tabsList="tabsList"
          @onHandleClick="onHandleClick"
          :defaultId="choseTabs"
        />
        <p>全部已读</p>
      </div>
      <div
        :class="[ns.b('empty'), 'animate__animated animate__fadeIn']"
        v-if="isEmpty"
      >
        <img :src="MessageCenterEmptyIcon" alt="" />
        <h3>暂无消息</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import MessageCenterEmptyIcon from "@/assets/img/common/message-center-empty.png";
const ns = useNamespace("messageCenter");
const tabsList: Ref<Array<any>> = ref([
  { id: 0, name: "收到的回复" },
  { id: 1, name: "发出的评论" },
]);
const choseTabs: Ref<number> = ref(0); // 默认选中
const breadcrumbList: Ref<Array<any>> = ref([
  {
    text: "首页",
    path: "/home",
  },
  {
    text: "消息中心",
    path: "",
  },
]);
const isEmpty: Ref<boolean> = ref(true); // 是否显示空页面

const onHandleClick = (id: number) => {
  choseTabs.value = id;
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-messageCenter-content {
  @include widthAndHeight(100%, auto);
  background: #ffffff;
  border-radius: 4px;
  margin-top: 24px;
  padding: 8px 32px;
}
.es-messageCenter-content__top {
  height: 50px;
  @include flex(center, space-between, nowrap);
  border-bottom: 2px solid #e6e6e6;
  padding-top: 10px;
  p {
    @include font(14px, 400, #244bf1, 22px);
    cursor: pointer;
  }
}
.es-messageCenter-empty {
  margin: 150px auto;
  width: 150px;
  text-align: center;
  img {
    @include widthAndHeight(120px, 120px);
  }
}
</style>
