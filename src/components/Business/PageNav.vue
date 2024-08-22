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
          <div :class="ns.be('avatar', 'box')">
            <div
              :class="ns.be('avatar', 'box')"
              @mouseenter="showAvatar = true"
            >
              <h4 :class="ns.b('realName')">
                Hi，{{ useUserStoreHook().$state.userInfo.realName }}
              </h4>
              <div :class="ns.b('spread')">
                <img
                  :src="SpreadIcon"
                  alt=""
                  :style="{ transform: showAvatar ? 'rotate(180deg)' : '' }"
                />
              </div>
            </div>
            <template v-if="useUserStoreHook().$state.userInfo.roles">
              <img :class="ns.b('vip')" :src="getVIPIcon" />
            </template>
          </div>
          <div
            :class="[
              ns.b('extraAvatar'),
              showAvatar ? ns.bm('extraAvatar', 'show') : '',
              getVIPIcon === '' ? ns.bm('extraAvatar', 'position') : '',
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
import { Ref, ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import LogoIcon from "@/assets/img/common/logo-icon.png";
import LogoIconBlue from "@/assets/img/common/logo-icon-blue.png";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import PersonalCommonVip from "@/assets/img/vip/personal-common-member.png";
import TryOutVip from "@/assets/img/vip/try-out-vip.png";
import CompanyVip from "@/assets/img/vip/company-vip.png";
import EESAOrdinaryVip from "@/assets/img/vip/eesa-ordinary-vip.png";
import ViceDirectorVip from "@/assets/img/vip/vice-director-vip.png";
import DirectorVip from "@/assets/img/vip/director-vip.png";
import SpreadIcon from "@/assets/img/common/spread-out-icon.png";
import { getToken } from "@/utils/auth";
const { VITE_INDUSTRIALMAP_URL, VITE_DATABASE_URL } = import.meta.env;
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
// 获取vip图标
const getVIPIcon = computed(() => {
  if (
    getToken() !== undefined &&
    useUserStoreHook().$state.userInfo.roles &&
    useUserStoreHook().$state.userInfo.roles.length
  ) {
    const _code = useUserStoreHook().$state.userInfo.roles[0].code;
    return _code === "PERSON_TRIAL_ACCOUNT"
      ? TryOutVip
      : _code === "ENTERPRISE_MEMBER_USER"
        ? CompanyVip
        : _code === "ENTERPRISE_EESA_MEMBER_USER"
          ? EESAOrdinaryVip
          : _code === "VICE_CHAIRMAN_MEMBER"
            ? ViceDirectorVip
            : _code === "CHAIRMAN_MEMBER"
              ? DirectorVip
              : PersonalCommonVip;
  } else {
    return "";
  }
});
const extraAvatar: Ref<any> = ref([
  { id: 1, text: "我的名片", path: "/homePersonal?id=1" },
  { id: 2, text: "我的企业", path: "/homePersonal?id=2" },
  { id: 3, text: "我的产品", path: "/homePersonal?id=6" },
  { id: 3, text: "我的需求", path: "/homePersonal?id=3" },
  { id: 4, text: "修改密码", path: "/homePersonal?id=7" },
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
      { id: 1, text: "专家访谈", path: "/expertInterviews" },
      { id: 2, text: "周月季报", path: "/quarterlyMonthlyReports" },
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
        path: "/dataTender",
      },
      { id: 2, text: "中标", path: "/dataWinningBid" },
      {
        id: 3,
        text: "项目",
        path: "/dataProject",
      },
      {
        id: 4,
        text: "电价",
        path: "/electricityPrice",
      },
      {
        id: 5,
        text: "政策",
        path: "/policy",
      },
      {
        id: 5,
        text: "储能数据库",
        path: `${VITE_DATABASE_URL}/#/home`,
      },
      {
        id: 6,
        text: "电价API",
        path: "/electricityApi",
      },
    ],
  },
  {
    id: 4,
    text: "分析",
    children: [
      {
        id: 1,
        text: "工商业测算",
        path: "/calculate",
      },
    ],
  },
  {
    id: 5,
    text: "企业/产品",
    path: ["/enterprise"],
    children: [
      { id: 1, text: "产业链地图", path: VITE_INDUSTRIALMAP_URL },
      { id: 2, text: "查产品", path: "/searchProduct" },
    ],
  },
  {
    id: 6,
    text: "资源",
    path: ["/resource"],
    children: [
      {
        id: 1,
        text: "融资方案",
        path: ["/financingPlan"],
      },
      { id: 2, text: "供需对接", path: "/demandMatching/list" },
    ],
  },
  {
    id: 7,
    text: "开通VIP",
    path: ["/vip"],
    children: [],
  },
]);
const visible: Ref<boolean> = ref(false);
// 选择导航栏
const onChoseNav = (id: number) => {
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
    }, 100);
    if (item.text === "行业数据库") {
      window.trackFunction("pc_IndustrialDatabase_click");
    }
    if (item.text === "电价API") {
      window.trackFunction("pc_ElecpriceAPI_click");
    }
    if (item.text === "产业链地图") {
      window.trackFunction("pc_EnterpriseMap_click");
    }
    return window.open(item.path, "externalWindow");
  } else if (item.path !== "") {
    onChildrenPath(item.path);
  } else {
    miniAppVisible.value = true;
  }
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
    }, 100);
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
// 监听用户信息
watch(
  () => useUserStoreHook().$state.userInfo,
  (val) => {
    if (getToken() !== undefined) {
      navList.value[6].text =
        val &&
        val.roles &&
        val.roles.length &&
        val.roles[0].code !== "PERSON_ORDINARY_USER"
          ? "续费VIP"
          : "开通VIP";
    }
  },
  { immediate: true },
);
// 判断是否要选中某个导航
computed(() => {
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
  @include absolute(2, 28px, 100px, none, none);
  background-image: url("@/assets/img/common/avatar-extra.png");
  background-size: 100% 190px;
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
  @include widthAndHeight(120px, 200px);
}
.es-pageNav-extraAvatar--position {
  right: 0;
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
    height: 56px;
    width: 88px;
    @include flex(flex-start, center, wrap);
    @include padding(0, 16px, 0, 0);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease-out;
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
  @include widthAndHeight(auto, 56px);
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
  @include font(14px, 400, rgba(255, 255, 255, 0.9), 22px);
  will-change: transform;
  transition: all 0.2s ease-out;
  @include relative(10);
  cursor: pointer;
}
.es-pageNav-avatar__box {
  @include widthAndHeight(auto, 40px);
  @include flex(center, flex-start, nowrap);
}
.es-pageNav-content .es-pageNav-realName {
  cursor: pointer;
  max-width: 120px;
  @include textOverflowOne();
}
.es-pageNav-content .es-pageNav-spread {
  @include widthAndHeight(20px, 20px);
  background: rgba(255, 255, 255, 0);
  border-radius: 4px;
  text-align: center;
  line-height: 20px;
  margin-left: 4px;
  cursor: pointer;
  img {
    @include widthAndHeight(16px, 16px);
  }
}
.es-pageNav-content .es-pageNav-vip {
  @include widthAndHeight(88px, 20px);
  object-fit: contain;
  margin-left: 10px;
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
  @include widthAndHeight(100vw, 386px);
}
</style>
