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
      <template v-if="!loading">
        <div
          :class="[ns.b('empty'), 'animate__animated animate__fadeIn']"
          v-if="isEmpty"
        >
          <img :src="MessageCenterEmptyIcon" alt="" />
          <h3>暂无消息</h3>
        </div>
        <div
          :class="ns.b('list')"
          v-for="(item, index) in messageList"
          :key="index"
        >
          <div :class="ns.be('list', 'top')">
            <img :src="AvatarIcon" alt="" />
            <h5>{{ item.user.realName }}</h5>
            <p>{{ item.content }}</p>
          </div>
          <div :class="ns.be('list', 'time')">2024-09-10</div>
          <div
            :class="ns.be('list', 'detail')"
            v-if="item.title && item.description"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import MessageCenterEmptyIcon from "@/assets/img/common/message-center-empty.png";
import AvatarIcon from "@/assets/img/common/avatar-icon.png";
import { getMessageListApi } from "@/api/home";
const ns = useNamespace("messageCenter");
const loading: Ref<boolean> = ref(false); // 加载中
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
const pageInfo: Ref<any> = ref({
  limit: 10,
  page: 1,
});
const messageList: Ref<Array<any>> = ref([]); // 消息列表
const isEmpty: Ref<boolean> = ref(true); // 是否显示空页面

const onHandleClick = (id: number) => {
  choseTabs.value = id;
  getMessageList();
};
// 获取消息列表
async function getMessageList() {
  loading.value = true;
  const { datas, resp_code }: any = await getMessageListApi(
    Object.assign(pageInfo.value, { type: null, userType: choseTabs.value }),
  );
  if (resp_code === 0) {
    messageList.value = datas.records;
  }
  isEmpty.value = datas.records.length === 0;
  loading.value = false;
}
getMessageList();
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-messageCenter {
  padding-bottom: 80px;
}
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
.es-messageCenter-list {
  margin-top: 24px;
}
.es-messageCenter-list__top {
  height: 24px;
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(24px, 24px);
    margin-right: 12px;
  }
  h5 {
    margin-right: 16px;
    line-height: 14px;
  }
  p {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 14px);
  }
}
.es-messageCenter-list__time {
  @include font(14px, 400, rgba(0, 0, 0, 0.4), 14px);
  margin: 5px 0 16px 36px;
}
.es-messageCenter-list__detail {
  width: calc(100% - 24px);
  background: #f2f3f5;
  border-radius: 4px;
  margin-left: 36px;
  padding: 24px;
  h3 {
    margin-bottom: 8px;
  }
  p {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  }
}
</style>
