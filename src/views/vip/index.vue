<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <p class="title">会员中心</p>
    <div class="wrapper">
      <div class="item" v-for="item in accountList" :key="item.id">
        <img class="item_log" :src="item.topIcon" alt="" />
        <div :class="ns.b('content')">
          <div :class="ns.b('price')">
            <span v-if="item.price.number" style="font-size: 20px">¥</span>
            <span
              :style="{
                color: item.price.color,
                'font-size': '32px',
                'font-weight': 600,
              }"
              >{{
                item.price.number === null ? "免费" : item.price.number
              }}</span
            >
            <template v-if="item.price.number">
              <span style="font-size: 20px">{{ item.price.unit }}</span>
              <span
                style="
                  font-size: 16px;
                  color: rgba(0, 0, 0, 0.6);
                  margin-left: 16px;
                "
                >{{ item.price.extraPrice }}</span
              >
            </template>
          </div>
          <div
            @click="handleClick(item)"
            class="item_btn"
            :style="{
              border: `1px solid ${item.btnConfig.borderColor}`,
              color: item.btnConfig.color,
              background: item.btnConfig.bgColor,
            }"
          >
            {{ item.btnConfig.text }}
          </div>
          <div
            :class="ns.b('module')"
            v-for="_item in item.list"
            :key="_item.moduleCode"
          >
            <h5 :class="ns.be('module', 'title')">{{ _item.moduleCode }}</h5>
            <div
              v-for="__item in _item.modulePermissions"
              :key="__item.moduleName"
              :class="ns.be('module', 'content')"
            >
              <div>
                <img :src="__item.isPermission ? VipTick : VipFork" alt="" />
                <h5 :class="ns.be('module_item', 'title')">
                  {{ __item.moduleName }}
                </h5>
              </div>
              <!-- <p>{{ __item.conditions }}</p> -->
            </div>
          </div>
        </div>
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
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import cancel_icon from "@/assets/img/common/icon_clear.png";
import VipTopNormal from "@/assets/img/vip/vip-top-normal.png"; // 普通会员
import VipTopPersonal from "@/assets/img/vip/vip-top-personal.png"; // 个人会员
import VipTopCompany from "@/assets/img/vip/vip-top-company.png"; // 企业会员
import VipTick from "@/assets/img/vip/vip-tick.png";
import VipFork from "@/assets/img/vip/vip-fork.png";
import PayQR from "@/assets/img/vip/pay-member-qr.png";
import { getVipConfigListApi } from "@/api/vip";
import { getToken } from "@/utils/auth";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/user";
const router = useRouter();
const ns = useNamespace("vip");
const QRvisible = ref(false);
const vipConfigList: Ref<Array<any>> = ref([]); // vip列表配置
const accountList = ref([
  {
    id: 0,
    topIcon: VipTopNormal,
    code: "PERSON_ORDINARY_USER",
    btnConfig: {
      color: "rgba(0,0,0,0.9)",
      bgColor: "#ffffff",
      borderColor: "#DBDCE2",
      text: "立即体验",
    },
    price: {
      color: "#5B6985",
      number: null,
    },
    list: [],
  },
  {
    id: 1,
    topIcon: VipTopPersonal,
    code: "ENTERPRISE_EESA_MEMBER_USER",
    btnConfig: {
      color: "rgba(255,255,255,0.9)",
      bgColor: "#244BF1",
      borderColor: "#244BF1",
      text: "立即开通",
    },
    price: {
      number: 299,
      color: "#244BF1",
      unit: "/月",
      extraPrice: "￥879/季 ￥3399/年",
    },
    list: [],
  },
  {
    id: 2,
    topIcon: VipTopCompany,
    code: "CHAIRMAN_MEMBER",
    btnConfig: {
      color: "#E5BC68",
      bgColor: "#412F1B",
      borderColor: "#412F1B",
      text: "立即开通",
    },
    price: {
      number: 10000,
      color: "#412F1B",
      unit: "/3账号/年",
      extraPrice: "",
    },
    list: [],
  },
  {
    id: 3,
    topIcon: VipTopCompany,
    code: "VICE_CHAIRMAN_MEMBER",
    btnConfig: {
      color: "#E5BC68",
      bgColor: "#412F1B",
      borderColor: "#412F1B",
      text: "立即开通",
    },
    price: {
      number: 10000,
      color: "#412F1B",
      unit: "/3账号/年",
      extraPrice: "",
    },
    list: [],
  },
]);
// 账户信息
const handleSkip = () => {
  QRvisible.value = false;
};
const handleClick = (item) => {
  const _id = item.id;
  window.trackFunction(
    _id === 0
      ? "pc_OrdinaryMember_click"
      : _id === 1
        ? "pc_IndividualMember_click"
        : "pc_CorporateMember_click",
  );
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
// 获取vip配置
const getVipConfigList = async () => {
  const { datas, resp_code }: ApiType = await getVipConfigListApi();
  if (resp_code === 0) {
    vipConfigList.value = datas;
    accountList.value.forEach((item) => {
      datas.forEach((_item) => {
        if (item.code === _item.permissionCode) {
          item.list = _item.moduleTypes;
        }
      });
    });
  }
};
getVipConfigList();
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
    justify-content: flex-start;
    .item {
      width: 270px;
      position: relative;
      border: 1px solid #dbdce2;
      border-radius: 8px;
      margin-right: 20px;
      .item_log {
        @include widthAndHeight(100%, 104px);
      }
      .item_btn {
        @include widthAndHeight(220px, 40px);
        border-radius: 4px;
        @include font(16px, 400, rgba(0, 0, 0), 40px);
        text-align: center;
        margin-bottom: 32px;
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
.es-vip-content {
  padding: 40px 24px 28px 24px;
}
.es-vip-price {
  height: 60px;
  margin: 0 auto 16px;
}
.es-vip-module__title {
  color: rgba(0, 0, 0, 0.6);
  line-height: 22px;
  margin-bottom: 8px;
}
.es-vip-module_item__title {
  color: rgba(0, 0, 0, 0.6);
  line-height: 22px;
}
.es-vip-module__content {
  height: 22px;
  margin-bottom: 10px;
  @include flex(center, space-between, nowrap);
  img {
    @include widthAndHeight(18px, 18px);
    flex: 0;
    margin-right: 5px;
  }
  div {
    @include flex(center, flex-start, nowrap);
    h5 {
      font-weight: 400;
    }
  }
  p {
    @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
  }
}
</style>
