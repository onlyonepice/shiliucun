<template>
  <nav :class="[ns.b(), choseExtra ? ns.m('open') : '']">
    <!-- 子菜单栏展开背景图 -->
    <div :class="[ns.b('extra'), choseExtra ? ns.bm('extra', 'open') : '']" />
    <div :class="['es-commonPage', ns.b('content')]">
      <img
        :src="choseExtra || !opacityBg ? LogoIconBlue : LogoIcon"
        alt=""
        @click="onBackHome"
      />
      <div :class="[ns.b('list')]">
        <div
          v-for="item in navList"
          :key="item.id"
          @mouseleave="onChoseLeave()"
          @mouseenter="onChoseNav(item.id, item.path)"
          :class="[
            ns.bm('list', 'item'),
            optionChildren ? ns.bm('list--item', 'chose') : '',
          ]"
        >
          <div :class="ns.bm('item', 'title')" @click="onToHome(item)">
            <span>{{ item.text }}</span>
            <div :class="[ns.b('underline')]" />
          </div>
          <div :class="ns.bm('item', 'box')">
            <div v-for="_item in item.children" :key="_item.id">
              <div
                :class="ns.bm('item', 'text')"
                @click="onChoseChildTab(_item)"
              >
                {{ _item.text }}
              </div>
            </div>
          </div>
        </div>
        <!-- 登录/注册 -->
        <div v-if="showLogin" @mouseleave="showAvatar = false">
          <img
            :class="ns.b('avatar')"
            @mouseenter="showAvatar = true"
            :src="PersonalAvatar"
            alt=""
          />
          <div
            :class="[
              ns.b('extraAvatar'),
              showAvatar ? ns.bm('extraAvatar', 'show') : '',
            ]"
          >
            <p
              v-for="item in extraAvatar"
              :key="item.id"
              @click="onPersonal(item.path)"
            >
              {{ item.text }}
            </p>
          </div>
        </div>
        <p v-else :class="ns.b('login')" @click="onLogin">登录/注册</p>
      </div>
    </div>
    <Logout :visible="visible" @onHandleClose="onHandleClose" />
    <MiniAppNeed
      :visible="miniAppVisible"
      @onHandleClose="miniAppVisible = false"
    />
  </nav>
</template>

<script lang="ts" setup>
interface NavList {
  children?: Array<NavList>;
  id: number;
  text: string;
  path: Array<string> | string;
}
import { onMounted, Ref, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import LogoIcon from "@/assets/img/common/logo-icon.png";
import LogoIconBlue from "@/assets/img/common/logo-icon-blue.png";
import PersonalAvatar from "@/assets/img/common/personal-avatar.png";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
const { VITE_IREPOET_URL, VITE_INDUSTRIALMAP_URL } = import.meta.env;
const ns = useNamespace("pageNav");
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["onLogin"]);
const choseNav: Ref<string> = ref(""); // 选中的导航标签
const choseNavId: Ref<number> = ref(1); // 选中的导航栏id
const choseExtra: Ref<boolean> = ref(false); // 打开下拉菜单
const choseExtraContent: Ref<boolean> = ref(false); // 打开下拉菜单
const showAvatar: Ref<boolean> = ref(false); // 展开个人中心页面
const showLogin: Ref<boolean> = ref(false); // 展示登录按钮
const miniAppVisible: Ref<boolean> = ref(false); // 小程序二维码
defineProps({
  opacityBg: {
    type: Boolean,
    default: false,
  },
});
const extraAvatar: Ref<any> = ref([
  { id: 1, text: "基本信息", path: "/homePersonal?id=1" },
  { id: 2, text: "我的收藏", path: "/homePersonal?id=2" },
  { id: 3, text: "我的订单", path: "/homePersonal?id=3" },
  { id: 4, text: "修改密码", path: "/homePersonal?id=4" },
  { id: 5, text: "退出登录", path: "" },
]);
// 导航栏数组
const navList: Ref<Array<NavList>> = ref([
  {
    id: 1,
    text: "首页",
    path: ["/home"],
    children: [],
  },
  {
    id: 2,
    text: "报告",
    path: ["/report", "/reportDetail", "", "", ""],
    children: [
      { id: 1, text: "行业洞察", path: "/industryInsight" },
      { id: 2, text: "季报月报", path: "/quarterlyMonthlyReports" },
      { id: 3, text: "在线报告", path: "/reportOnLine?source=在线报告" },
      { id: 4, text: "白皮书", path: "/reportWhitePaper" },
    ],
  },
  {
    id: 3,
    text: "数据",
    path: ["/data"],
    children: [
      {
        id: 1,
        text: "招标",
        path: VITE_IREPOET_URL + "#/stored-leading/tenderDynamics",
      },
      { id: 2, text: "中标", path: VITE_IREPOET_URL + "#/bid-price-tracking" },
      {
        id: 3,
        text: "电价",
        path: VITE_IREPOET_URL + "#/stored-leading/electricity-price",
      },
      {
        id: 4,
        text: "政策",
        path: VITE_IREPOET_URL + "#/stored-leading/policy-trace",
      },
      {
        id: 5,
        text: "行业数据库",
        path: VITE_IREPOET_URL + "#/relation-servicer?name=企业数据服务",
      },
    ],
  },
  {
    id: 4,
    text: "分析",
    path: ["/analyze"],
    children: [
      {
        id: 1,
        text: "工商业测算",
        path: VITE_IREPOET_URL + "#/stored-leading/invest-ROE/business",
      },
    ],
  },
  {
    id: 5,
    text: "企业",
    path: ["/enterprise"],
    children: [{ id: 1, text: "产业链地图", path: VITE_INDUSTRIALMAP_URL }],
  },
  {
    id: 6,
    text: "资源",
    path: ["/resource"],
    children: [
      {
        id: 1,
        text: "融资方案",
        path: VITE_IREPOET_URL + "#/stored-leading/financing-plan",
      },
      { id: 2, text: "供需对接", path: "" },
    ],
  },
  {
    id: 7,
    text: "开通VIP",
    path: [VITE_IREPOET_URL + "#/relation-servicer?name=订阅会员"],
    children: [],
  },
]);
const visible: Ref<boolean> = ref(false);
// 选择导航栏
const onChoseNav = (id: number, path: Array<string> | string) => {
  choseNavId.value = id;
  choseExtra.value = true;
  choseExtraContent.value = true;
};
// 选择子菜单
const onChoseChildTab = (item: any) => {
  if (item.path.indexOf("http") !== -1) {
    optionChildren.value = true;
    onChoseLeave();
    setTimeout(() => {
      optionChildren.value = false;
    });
    return window.open(item.path, "externalWindow");
  } else if (item.path !== "") {
    router.push(item.path);
  } else {
    miniAppVisible.value = true;
  }
  onChildrenPath(item.path);
};
// 跳转个人中心
const onPersonal = (path: string) => {
  if (path !== "") {
    router.push(path);
  } else {
    visible.value = true;
  }
  showAvatar.value = false;
};
// 退出登录
const onHandleClose = (type: boolean) => {
  visible.value = false;
  if (type) {
    useUserStoreHook().logOut();
    router.push({ path: "/home" });
  }
};
const onBackHome = () => {
  router.push("/home");
};
const onChoseLeave = () => {
  choseExtra.value = false;
};
// 跳转首页
const onToHome = (data: any) => {
  if (data.children.length !== 0) {
    return;
  }
  data.path[0].indexOf("http") === -1 && router.push({ path: data.path[0] });
  data.path[0].indexOf("http") !== -1 &&
    window.open(data.path[0], "externalWindow");
  onChoseLeave();
};
const optionChildren: Ref<boolean> = ref(false);
// 子路由跳转
const onChildrenPath = (path: string | Array<string>) => {
  optionChildren.value = true;
  if (route.path !== path || route.path !== path[0]) {
    router.push(Array.isArray(path) ? path[0] : path);
    onChoseLeave();
    setTimeout(() => {
      optionChildren.value = false;
    });
  }
};
// 监听路由改变
watch(
  () => route.path,
  (path) => {
    choseNav.value = path;
  },
  { immediate: true },
);
// 监听登录
watch(
  () => useUserStoreHook().$state.token,
  (token) => {
    showLogin.value = token !== "";
  },
  { immediate: true },
);
// 判断是否要选中某个导航
const isChoseNav = computed(() => {
  return (list: any) => {
    return list.some((item: string) => item.includes(choseNav.value));
  };
});
const onLogin = () => {
  emit("onLogin");
};
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.es-pageNav {
  height: 56px;
  background-color: rgba(255, 255, 255, 1);
  @include flex();
  transition: all 0.2s linear;
}

.es-pageNav--opacity {
  .es-pageNav-list {
    div {
      color: rgba(255, 255, 255, 0.55);
    }

    .es-pageNav-list--chose {
      color: rgba(255, 255, 255, 0.9);
    }
  }
  .es-pageNav-login {
    color: rgba(255, 255, 255, 0.55);
  }
}
.es-pageNav-content {
  @include widthAndHeight(1156px, 100%);
  @include margin(0, auto, 0, auto);
  @include flex(center, space-between, nowrap);
  @include relative();
  img {
    @include widthAndHeight(64px, 30px);
    @include relative(10);
  }
  .es-pageNav-list {
    div {
      color: rgba(0, 0, 0, 0.6);
    }
    .es-pageNav-list--chose {
      color: #244bf1;
    }
  }
  .es-pageNav-login {
    color: rgba(0, 0, 0, 0.9);
  }
}
.es-pageNav-extraAvatar {
  @include widthAndHeight(120px, 0);
  @include absolute(2, 38px, 0, none, none);
  background-image: url("@/assets/img/common/avatar-extra.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 10px;
  transition: all 0.2s linear;
  overflow: hidden;
  padding-top: 10px;
  p {
    @include widthAndHeight(104px, 24px);
    margin: 0 auto 4px;
    @include font(12px, 400, rgba(0, 0, 0, 0.6), 24px);
    padding-left: 8px;
    cursor: pointer;
    &:nth-last-of-type(1) {
      @include widthAndHeight(120px, 39px);
      border-top: 1px solid #dbdce2;
      @include font(12px, 400, #f75964, 39px);
      padding-left: 16px;
    }
    &:nth-of-type(1) {
      @include widthAndHeight(104px, 24px);
      margin: 14px auto 4px;
    }
  }
}
.es-pageNav-extraAvatar p:not(:last-child):hover {
  background: #f2f3f5;
  border-radius: 2px;
  color: rgba(0, 0, 0, 0.9);
}
.es-pageNav-extraAvatar--show {
  @include widthAndHeight(120px, 180px);
}
.es-pageNav--open {
  background-color: #ffffff;
  .es-pageNav-list {
    div {
      color: rgba(0, 0, 0, 0.6);
    }

    .es-pageNav-list--chose {
      color: #244bf1;
    }
  }

  .es-pageNav-login {
    color: rgba(0, 0, 0, 0.9);
  }
}

.es-pageNav--open {
  background-color: #ffffff;

  .es-pageNav-list {
    div {
      color: rgba(0, 0, 0, 0.6);
    }

    .es-pageNav-list--chose {
      color: #244bf1;
    }
  }

  .es-pageNav-login {
    color: rgba(0, 0, 0, 0.9);
  }
}

.es-pageNav-list {
  @include flex(center, center, nowrap);
  @include font(14px, 400, rgba(255, 255, 255, 0.55), 22px);
  @include relative();
  transition: all 0.2s ease-out;

  .es-pageNav-list--item {
    @include widthAndHeight(88px, 56px);
    @include flex(flex-start, center, wrap);
    @include padding(0, 16px, 0, 0);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease-out;
    &:nth-of-type(7) {
      @include padding(0, 0, 0, 0);
    }
    .es-pageNav-underline {
      @include widthAndHeight(0, 2px);
      background-color: #244bf1;
      border-radius: 2px 2px 0px 0px;
      will-change: transform;
      overflow: hidden;
      transition: width 0.3s ease-in-out;
      @include margin(0, auto, 0, auto);
    }

    &:hover .es-pageNav-underline {
      @include widthAndHeight(88px, 2px);
    }

    .es-pageNav-item--box {
      height: 0;
      opacity: 0;
      transition: all 0.5s linear;
      overflow: hidden;
    }

    &:hover .es-pageNav-item--box {
      height: auto;
      opacity: 1;
    }
  }

  .es-pageNav-list--item--chose {
    .es-pageNav-item--box {
      height: 0 !important;
      opacity: 0 !important;
    }
  }
}
.es-pageNav-item--title {
  @include widthAndHeight(88px, 56px);
  line-height: 56px;
  @include relative();
}

.es-pageNav-item--text {
  @include widthAndHeight(100%, 46px);
  @include padding(24px, 0, 0, 0);
  text-align: center;
  &:hover {
    font-weight: 600;
  }
}

.es-pageNav-login {
  @include widthAndHeight(95px, 32px);
  @include flex(center, center);
  @include margin(0, 0, 0, 16px);
  @include font(14px, 400, rgba(255, 255, 255, 0.9), 22px);
  will-change: transform;
  transition: all 0.2s ease-out;
  @include relative(10);
  cursor: pointer;
}
.es-pageNav-content .es-pageNav-avatar {
  @include widthAndHeight(24px, 24px);
  cursor: pointer;
  margin-left: 16px;
}

.es-pageNav-extra {
  @include widthAndHeight(100vw, 0);
  background: #ffffff;
  will-change: transform;
  transition: all 0.2s ease-out;
  @include fixed(0, 0, none, none, 0);
  overflow: hidden;
}

.es-pageNav-extra--open {
  @include widthAndHeight(100vw, 376px);
}
</style>
