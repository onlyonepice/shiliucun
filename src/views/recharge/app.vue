<template>
  <div class="recharge animate__animated animate__fadeIn">
    <div
      class="pageAside-coin"
      @click="
        drawer = true;
        getHistoryList();
      "
    >
      <div>
        <p class="coin-text">{{ useUserStoreHook().$state.userInfo.coin }}币</p>
        <div class="coin-icon">
          <img :src="MoneyCoin" alt="" />
          <span>Mode Coin</span>
        </div>
      </div>
      <img class="more-icon" :src="MoreIcon" alt="" />
    </div>
    <div class="recharge-desc">
      <img src="@/assets/img/tips-icon.png" alt="" />
      您可以使用M币购买本平台的游戏，可通过充值获得M币。汇率结算单位：美元（实时汇率）
    </div>
    <div class="recharge-list">
      <div
        v-for="(item, index) in rechargeList"
        :key="index"
        class="recharge-list__item"
        @click="
          rechargeVisible = true;
          rechargeId = index;
          chosePayType = item.channel[0];
        "
      >
        <img
          :src="item.img_url"
          alt=""
          class="animate__animated animate__fadeIn"
        />
        <p>{{ item.num }}M币</p>
        <el-button style="width: 100%; text-align: center"
          >¥{{ item.price }}</el-button
        >
      </div>
    </div>
  </div>
  <el-dialog
    v-if="rechargeVisible"
    v-model="rechargeVisible"
    title="交易概览"
    class="recharge-dialog"
  >
    <template v-if="!payLoading">
      <div class="recharge-header">
        <span>项目</span>
        <span>{{ rechargeList[rechargeId].num }}M 币</span>
      </div>
      <div class="recharge-header">
        <span>价格</span>
        <span>¥{{ rechargeList[rechargeId].price }}</span>
      </div>
      <div class="recharge-title">择支付方式</div>
      <div class="recharge-img">
        <div
          v-for="(item, index) in rechargeList[rechargeId].channelList"
          :key="index"
          :class="chosePayType === item.code ? 'recharge-img-chose' : ''"
          @click="chosePayType = item.code"
        >
          <img :src="item.url" alt="" />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-loading="payLoading"
        class="payLoading"
        element-loading-text="Loading..."
      />
    </template>
    <template #footer>
      <div class="dialog-footer">
        <template v-if="!payLoading">
          <el-button @click="handleClose(true)" class="btn-foot-1"
            >确认支付</el-button
          >
          <div @click="handleClose(false)" class="btn-foot-2">取消</div>
        </template>
        <template v-else>
          <div @click="handleClose(false)" class="btn-foot-2">返回</div>
        </template>
      </div>
    </template>
  </el-dialog>
  <el-drawer
    v-model="drawer"
    title="历史记录"
    direction="rtl"
    :before-close="drawerClose"
  >
    <div class="tab___2eg2T">
      <div
        @click="historyType !== 1 && (historyType = 1)"
        :class="historyType === 1 ? 'tab-chose' : ''"
      >
        M币记录
      </div>
      <div
        @click="historyType !== 2 && (historyType = 2)"
        :class="historyType === 2 ? 'tab-chose' : ''"
      >
        充值记录
      </div>
    </div>
    <div class="history-list" v-for="(item, index) in historyList" :key="index">
      <p>{{ item.message || item.coin + " M币" }}</p>
      <p>日期 {{ item.created_at }}</p>
      <p>
        {{ historyType === 2 ? "¥" : "" }}{{ item.num || item.orderAmt
        }}{{ historyType === 1 ? " M币" : "" }}
      </p>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import {
  getPayListApi,
  createPayApi,
  getRechargeListApi,
  getRechargeRecordApi,
  getPayRecordApi,
} from "@/api/index";
import AliPay from "@/assets/img/ali-pay.png";
import WeChatPay from "@/assets/img/wechat-pay.png";
import UsdtPay from "@/assets/img/usdt-pay.jpg";
import MoneyCoin from "@/assets/img/money-coin.png";
import MoreIcon from "@/assets/img/more-icon.png";
import { useUserStoreHook } from "@/store/modules/user";
const rechargeList = ref([]); // 支付列表
const rechargeVisible = ref(false); // 支付弹窗
const rechargeId = ref(null); // 支付id
const chosePayType = ref(""); // 支付类型
const payLoading = ref(false); // 支付按钮loading
const drawer = ref(false); // 侧边栏
const historyList = ref([]); // 支付记录
const historyType = ref(1); // 1:M币记录 2:充值记录
const rechargeImgList = ref([
  {
    id: 0,
    url: WeChatPay,
    show: false,
    code: "wx",
  },
  {
    id: 1,
    url: AliPay,
    show: false,
    code: "zfb",
  },
  {
    id: 2,
    url: UsdtPay,
    show: false,
    code: "usdt",
  },
]);
watch(
  () => historyType.value,
  (val) => {
    getHistoryList();
  },
);
// 获取支付列表
const getPayList = () => {
  getPayListApi().then((res: any) => {
    rechargeList.value = res.data.list;
    rechargeList.value.map((item) => {
      item.channelList = [];
      rechargeImgList.value.map((_item) => {
        item.channel.includes(_item.code) &&
          (item.channelList = [...item.channelList, _item]);
      });
    });
  });
};
getPayList();
// 关闭记录弹窗
const drawerClose = () => {
  drawer.value = false;
};
// guide 弹窗关闭
const handleClose = (type: Boolean) => {
  console.log(type);
  if (!type) {
    chosePayType.value = "";
    rechargeId.value = -1;
    payLoading.value = false;
    return (rechargeVisible.value = false);
  } else {
    payLoading.value = true;
    createPay();
  }
};
// M币记录/充值记录
const getHistoryList = async () => {
  historyList.value = [];
  const { data, code }: any =
    historyType.value === 1
      ? await getRechargeRecordApi()
      : await getPayRecordApi();
  if (code === 200) {
    historyList.value = data.list;
  }
};
const timer = ref(null);
// 创建支付订单
const createPay = async () => {
  const { data, code }: any = await createPayApi({
    wd_id: rechargeList.value[rechargeId.value].id,
    channel: chosePayType.value,
  });
  console.log(data, code);
  if (code === 200) {
    // 轮训支付结果
    timer.value = setInterval(() => {
      checkPayStatus(data.order_id);
      window.open(data.payurl, "externalWindow");
    }, 1000);
  }
};
// 轮训支付结果
const checkPayStatus = async (orderId: String) => {
  const { data, code }: any = await getRechargeListApi({ orderId });
  if (code === 200) {
    if (data.status === 1) {
      // 支付成功
      payLoading.value = false;
      rechargeVisible.value = false;
      chosePayType.value = "";
      clearInterval(timer.value);
    }
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.recharge {
  width: 62.5vw;
  padding: 1.25vw;
  border-radius: 1.25vw;
  background-color: #171616;
  margin: 0 auto;
}
.recharge-desc {
  padding: 0.83333vw;
  border: 1px solid #3b3939;
  color: #6f6d6d;
  font-size: 0.625vw;
  border-radius: 0.625vw;
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(1.25vw, 1.25vw);
    margin-right: 0.425vw;
  }
}
.recharge-list {
  display: flex;
  gap: 0.625vw;
  flex-wrap: wrap;
  margin-top: 2vw;
}
.recharge-list__item {
  padding: 0.41667vw;
  box-sizing: border-box;
  background-color: #222121;
  background-image: url("@/assets/img/list-item-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  img {
    @include widthAndHeight(13.69792vw, 9.11458vw);
    border-radius: 0.3125vw;
    object-fit: contain;
  }
  p {
    @include font(0.9375vw, 400, #f00a38, 1.25vw);
    text-align: center;
    margin: 1.20833vw 0 3vw;
  }
  .el-button {
    @include flex(center, center, row);
  }
}
.recharge-dialog {
  width: 23.64583vw;
}
.btn-foot-1 {
  width: 100%;
  @include font(0.72917vw, 400, #b6b3b3, 1.04167vw);
  @include flex(center, center, row);
  span {
    display: inline-block;
    width: 100%;
    text-align: center;
  }
}
.btn-foot-2 {
  width: 100%;
  height: 2.5vw;
  background-color: #222121;
  @include font(0.72917vw, 400, #b6b3b3, 1.04167vw);
  margin-top: 0.25vw;
  @include flex(center, center, row);
  cursor: pointer;
}
.recharge-header {
  @include flex(center, space-between, nowrap);
  span:nth-of-type(1) {
    @include font(0.72917vw, 500, #6f6d6d, 1vw);
    margin-bottom: 0.625vw;
  }
  span:nth-of-type(2) {
    @include font(0.83333vw, 500, #fff, 1vw);
  }
}
.recharge-title {
  @include font(0.9375vw, 400, #fff, 1.25vw);
  margin-bottom: 0.625vw;
}
.recharge-img {
  @include flex(center, flex-start, wrap);
  div {
    width: calc(50% - 0.41667vw);
    cursor: pointer;
    @include flex(center, center, wrap);
    padding: 0.083333vw;
    margin-bottom: 0.8vw;
    border: 1px solid rgba(0, 0, 0, 0);
    &:nth-of-type(2n-1) {
      margin-right: 0.8vw;
    }
    img {
      width: 100%;
    }
  }
}
.recharge-img-chose {
  border: 1px solid #f00a38 !important;
}
.payLoading {
  width: 100%;
  height: 10vw;
  .el-loading-mask {
    background-color: rgba(0, 0, 0, 0);
  }
}
.el-drawer {
  background-color: #171616;
  .el-drawer__title {
    color: #fff;
  }
  .el-drawer__header {
    margin-bottom: 0;
  }
}
.tab___2eg2T {
  @include flex(center, space-between, row);
  div {
    background-color: #222121;
    padding: 0.3125vw 0.625vw;
    @include font(0.625vw, 400, #fff, 1.04167vw);
    border-radius: 0.20833vw;
    width: 48%;
    text-align: center;
    border: 1px solid #3b3939;
    cursor: pointer;
  }
  .tab-chose {
    background-color: #323030;
  }
}
.history-list {
  padding: 0.83333vw;
  border-radius: 0.625vw;
  border: 1px solid #3b3939;
  background-color: #222121;
  margin-top: 0.45vw;
  p:nth-of-type(1) {
    @include font(0.72917vw, 400, #b6b3b3, 0.83333vw);
  }
  p:nth-of-type(2) {
    @include font(0.625vw, 400, #6f6d6d, 1.04167vw);
    margin-top: 0.25vw;
  }
  p:nth-of-type(3) {
    @include font(0.72917vw, 400, #b6b3b3, 1.04167vw);
  }
}
</style>
