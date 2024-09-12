<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div class="wrapper">
      <div class="item" v-for="item in accountList" :key="item.id">
        <img
          v-if="item.background"
          class="item_bg"
          :src="item.background"
          alt=""
        />
        <img class="item_log" :src="item.topIcon" alt="" />
        <div :class="ns.b('price')">
          <p :class="ns.be('price', 'number')">{{ item.price.number }}</p>
          <p :class="ns.be('price', 'desc')">{{ item.price.desc }}</p>
          <div
            :class="ns.be('price', 'btn')"
            v-if="item.btnConfig"
            :style="{
              background: item.btnConfig.bgColor,
              color: item.btnConfig.color,
            }"
            @click="handleClick(item)"
          >
            {{ item.btnConfig.text }}
          </div>
        </div>
        <template v-if="item.id === 0 && vipConfigList[0]">
          <div
            v-for="(itemData, indexData) in vipConfigList[0].moduleTypes"
            :key="indexData"
            :class="ns.b('config')"
          >
            <p>{{ itemData.moduleCode }}</p>
            <p
              v-for="(_item, _index) in itemData.modulePermissions"
              :key="_index"
              style="color: rgba(0, 0, 0, 0.6)"
            >
              {{ _item.moduleName }}
            </p>
          </div>
        </template>
        <template v-else>
          <div
            v-for="(itemData, indexData) in item.list"
            :key="indexData"
            :class="ns.b('config')"
          >
            <p :class="ns.b('empty')" />
            <div
              v-for="(_item, _index) in itemData.modulePermissions"
              :key="_index"
            >
              <p v-if="_item.conditions !== null">{{ _item.conditions }}</p>
              <img
                v-else
                :src="_item.isPermission ? VipTick : VipFork"
                alt=""
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <openDialog
    title="开通VIP"
    :visible="QRvisible"
    @onClose="QRvisible = false"
  />
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import VipCOnfig from "@/assets/img/vip/vip-config.png";
import VipTopl from "@/assets/img/vip/vip-1.png"; // 普通会员
import VipTop2 from "@/assets/img/vip/vip-2.png"; // EESA普通会员
import VipTop3 from "@/assets/img/vip/vip-3.png"; // EESA理事普通会员
import VipTop4 from "@/assets/img/vip/vip-4.png"; // EESA副理事长普通会员
import Bg1 from "@/assets/img/vip/bg-1.png";
import Bg3 from "@/assets/img/vip/bg-3.png";
import Bg4 from "@/assets/img/vip/bg-4.png";
import Bg5 from "@/assets/img/vip/bg-5.png";
import VipTick from "@/assets/img/vip/vip-tick.png";
import VipFork from "@/assets/img/vip/vip-fork.png";
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
    topIcon: VipCOnfig,
    code: "PERSON_ORDINARY_USER",
    background: Bg1,
    price: {
      number: null,
    },
    list: [],
  },
  {
    id: 1,
    topIcon: VipTopl,
    code: "PERSON_ORDINARY_USER",
    forFree: true,
    price: {
      number: "免费版",
    },
    list: [],
  },
  {
    id: 2,
    topIcon: VipTop2,
    code: "ENTERPRISE_EESA_MEMBER_USER",
    background: Bg3,
    btnConfig: {
      color: "rgba(255,255,255,0.9)",
      bgColor: "#244BF1",
      text: "立即开通",
    },
    price: {
      number: "¥ 11000/年",
    },
    list: [],
  },
  {
    id: 3,
    topIcon: VipTop3,
    code: "CHAIRMAN_MEMBER",
    background: Bg4,
    btnConfig: {
      color: "#E5BC68",
      bgColor: "#412F1B",
      text: "立即开通",
    },
    price: {
      number: "¥ 25000/年",
    },
    list: [],
  },
  {
    id: 4,
    topIcon: VipTop4,
    code: "VICE_CHAIRMAN_MEMBER",
    background: Bg5,
    btnConfig: {
      color: "#F3EEE1",
      bgColor: "#191923",
      text: "立即开通",
    },
    price: {
      number: "¥ 50000/年",
    },
    list: [],
  },
]);

const handleClick = (item) => {
  const _id = item.id;
  window.trackFunction(
    _id === 1
      ? "pc_OrdinaryMember_click"
      : _id === 2
        ? "pc_IndividualMember_click"
        : "pc_CorporateMember_click",
  );
  if (_id !== 0 && !getToken()) {
    return useUserStore().openLogin(true);
  }
  if (_id === 0) {
    router.push("/home");
  } else {
    QRvisible.value = true;
  }
  // if (_id === 1) {
  //   useUserStore().openMembersBuy(true);
  // } else {
  //   _id === 0 && router.push("/home");
  //   _id === 2 && (QRvisible.value = true);
  // }
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
    @include flex(flex-start, center, nowrap);
    .item {
      width: 232px;
      position: relative;
      .item_bg {
        @include absolute(-1, 0, 0, none, none);
        @include widthAndHeight(100%, 100%);
      }
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
}
.es-vip-price {
  @include widthAndHeight(100%, 154px);
  padding: 24px 0;
}
.es-vip-price__number {
  @include font(24px, 600, rgba(0, 0, 0, 0.9), 32px);
  text-align: center;
}
.es-vip-config {
  padding-left: 16px;
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 40px);
  margin-bottom: 8px;
  div {
    height: 40px;
    @include flex(center, center, nowrap);
    p {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 40px);
    }
    img {
      @include widthAndHeight(24px, 24px);
    }
  }
}
.es-vip-empty {
  height: 40px;
}
.es-vip-price__desc {
  @include font(14px, 600, rgba(0, 0, 0, 0.6), 22px);
  text-align: center;
  margin-top: 4px;
}
.es-vip-price__btn {
  @include widthAndHeight(200px, 40px);
  margin: 32px auto 24px;
  text-align: center;
  line-height: 40px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
