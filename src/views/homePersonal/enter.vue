<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="['es-commonPage', ns.b('content')]">
      <h1>个人中心。</h1>
      <div :class="ns.b('box')">
        <div :class="ns.be('box', 'left')">
          <div :class="ns.be('left', 'tab')">
            <div
              v-for="item in tabList"
              :key="item.id"
              :class="
                choseTab === item.id ? ns.bem('left', 'tab', 'chose') : ''
              "
              @click="onClickTab(item.id)"
            >
              <img
                :src="choseTab === item.id ? item.iconChose : item.icon"
                alt=""
              />
              <p>{{ item.text }}</p>
            </div>
          </div>
          <div :class="ns.bm('left', 'list')">
            <h5>系列产品</h5>
            <div
              :class="ns.bm('left', 'item')"
              v-for="item in seriesList"
              :key="item.id"
              @click="onToPage(item.path)"
            >
              <img :src="item.icon" alt="" />
              <div>
                <h5>{{ item.title }}</h5>
                <p v-if="!item.time" :class="ns.bm('item', 'tab')">待体验</p>
                <p v-else :class="ns.bm('item', 'time')">
                  上次使用时间：{{ item.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          :class="ns.bm('box', 'right')"
          v-if="useUserStoreHook().$state.userInfo.id !== undefined"
        >
          <infoComponent v-if="choseTab === 1" />
          <collectionComponent v-if="choseTab === 2" />
          <orderComponent v-if="choseTab === 3" />
          <passwordComponent v-if="choseTab === 4" />
        </div>
      </div>
    </div>
    <Logout :visible="visible" @onHandleClose="onHandleClose" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import useNamespace from "@/utils/nameSpace";
import { getSeriesApi } from "@/api/user";
import Info from "@/assets/img/homePersonal/info.png";
import InfoChose from "@/assets/img/homePersonal/info-chose.png";
import Collection from "@/assets/img/homePersonal/collection.png";
import CollectionChose from "@/assets/img/homePersonal/collection-chose.png";
import Order from "@/assets/img/homePersonal/order.png";
import OrderChose from "@/assets/img/homePersonal/order-chose.png";
import Password from "@/assets/img/homePersonal/password.png";
import PasswordChose from "@/assets/img/homePersonal/password-chose.png";
import LogoutImg from "@/assets/img/homePersonal/logout.png";
import MapIcon from "@/assets/img/common/map-logo.png";
import ClassRoomIcon from "@/assets/img/common/classroom-logo.png";
import { useUserStoreHook } from "@/store/modules/user";
import infoComponent from "./components/info.vue";
import collectionComponent from "./components/collection.vue";
import orderComponent from "./components/order.vue";
import passwordComponent from "./components/password.vue";
const ns = useNamespace("homePersonal");
const { VITE_INDUSTRIALMAP_URL, VITE_CLASSROOM_URL } = import.meta.env;
const route = useRoute();
const router = useRouter();
const seriesList: Ref<Array<any>> = ref([
  {
    id: 1,
    path: VITE_INDUSTRIALMAP_URL,
    icon: MapIcon,
    title: "产业链地图",
    time: "",
  },
  {
    id: 2,
    path: VITE_CLASSROOM_URL,
    icon: ClassRoomIcon,
    title: "储能云课堂",
    time: "",
  },
]);
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "首页", path: "/home" },
  { text: "个人中心", path: "" },
]);
const tabList: Ref<Array<any>> = ref([
  { id: 1, text: "基本信息", iconChose: InfoChose, icon: Info },
  { id: 2, text: "我的收藏", iconChose: CollectionChose, icon: Collection },
  { id: 3, text: "我的订单", iconChose: OrderChose, icon: Order },
  { id: 4, text: "修改密码", iconChose: PasswordChose, icon: Password },
  { id: 5, text: "退出登录", icon: LogoutImg },
]);
const choseTab: Ref<number> = ref(1);
const visible: Ref<boolean> = ref(false);
watch(
  () => route.query.id,
  (val: string) => {
    choseTab.value = Number(val);
  },
  { immediate: true },
);
// 点击系列产品跳转页面
const onToPage = (path: string) => {
  window.open(path, "externalWindow");
};
// 获取系列产品
onMounted(async () => {
  const { resp_code, datas }: any = await getSeriesApi();
  if (resp_code === 0) {
    datas.forEach((item: any) => {
      seriesList.value[item.project === "industrial-map" ? 0 : 1].time =
        item.time;
    });
  }
});
// 点击左侧边栏
const onClickTab = (id: number) => {
  if (id !== 5) {
    choseTab.value = id;
  } else {
    visible.value = true;
  }
};
// 退出登录
const onHandleClose = (type: boolean) => {
  visible.value = false;
  if (type) {
    useUserStoreHook().logOut();
    router.push({ path: "/home" });
  }
};
// 监听路由变化
onMounted(() => {
  choseTab.value = Number(route.query.id);
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonal-content {
  @include padding(56px, 0, 80px, 0);
}
.es-homePersonal-box {
  @include flex(flex-start, flex-start, nowrap);
  @include margin(32px, 0, 0, 0);
}
.es-homePersonal-left--list {
  @include padding(16px, 16px, 20px, 16px);
  background-color: #ffffff;
  margin-top: 24px;
  border-radius: 8px;
  h5 {
    line-height: 22px;
  }
}
.es-homePersonal-left--item {
  @include widthAndHeight(246px, 58px);
  @include padding(5px, 4px, 5px, 4px);
  margin-bottom: 13px;
  @include flex(center, flex-start, nowrap);
  cursor: pointer;
  border-radius: 4px;
  img {
    @include widthAndHeight(48px, 48px);
    margin-right: 8px;
  }
  &:active {
    background: #f2f3f5;
  }
  &:nth-of-type(1) {
    margin-top: 12px;
  }
  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
.es-homePersonal-item--tab {
  @include widthAndHeight(52px, 24px);
  @include font(12px, 400, #ff8d32, 24px);
  border: 1px solid #ff8d32;
  border-radius: 4px;
  text-align: center;
  margin-top: 4px;
}
.es-homePersonal-item--time {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-top: 4px;
}
.es-homePersonal-box__left {
  @include widthAndHeight(270px);
  @include margin(0, 24px, 0, 0);
}
.es-homePersonal-box--right {
  background: #ffffff;
  border-radius: 8px;
  @include padding(24px, 24px, 24px, 24px);
  flex: 1;
}
.es-homePersonal-left__tab {
  @include widthAndHeight(100%, 296px);
  background: #ffffff;
  border-radius: 8px;
  @include padding(24px, 16px, 24px, 16px);
  div {
    @include widthAndHeight(238px, 32px);
    @include margin(0, auto, 8px, auto);
    @include padding(5px, 0, 5px, 8px);
    @include flex(center, flex-start);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    cursor: pointer;
    img {
      @include widthAndHeight(20px, 20px);
      @include margin(0, 8px, 0, 0);
    }
    &:nth-last-of-type(1) {
      @include margin(64px, 0, 0, 0);
    }
  }
  .es-homePersonal-left__tab--chose {
    @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
  }
}
</style>
