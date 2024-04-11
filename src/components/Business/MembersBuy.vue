<template>
  <!-- 会员支付弹窗 -->
  <div
    v-if="productList"
    class="membersBuy animate__animated"
    :class="showDialog ? 'animate__fadeIn' : 'animate__fadeOut'"
  >
    <div
      class="membersBuy-dialog animate__animated"
      :class="noPay ? 'membersBuy-dialog__small' : ''"
    >
      <img
        class="membersBuy-dialog__cancel"
        :src="cancel_icon"
        alt=""
        @click="onCancel"
      />
      <div class="membersBuy-dialog__head">
        <img class="bg" :src="members_buy_header_bg" alt="" />
        <div class="head_info">
          <p class="head_info_user">
            {{ userStore.userInfo.nickname }} | {{ userStore.userInfo.mobile }}
          </p>
          <p class="head_info_hint">
            支付成功后可在“个人中心-我的订单”开具发票
          </p>
        </div>
      </div>
      <div class="membersBuy-dialog__body">
        <div class="membersBuy-dialog__body-left">
          <div class="membersBuy-dialog__body-left__box">
            <div
              v-for="(item, index) in productList.productSkuFrontList"
              :key="item.productSkuNo"
              class="membersBuy-dialog__body-left__item"
              :class="
                index === choseType
                  ? 'membersBuy-dialog__body-left__item-chose'
                  : ''
              "
              @click="onChoseMember(index)"
            >
              <img
                v-if="index === choseType && productList.activityName !== null"
                class="members_buy_price_bg"
                :src="members_buy_price_bg"
                alt=""
              />
              <div
                class="membersBuy-dialog__body-left__item-lose"
                :class="
                  index === choseType && productList.activityName !== null
                    ? 'membersBuy-dialog__body-left__item-lose-bg'
                    : ''
                "
              >
                已减 ¥{{ item.preferentialPriceCount }}
              </div>
              <div class="membersBuy-dialog__body-left__item-desc">
                {{
                  item.type === 1 ? "月度" : item.type === 2 ? "季度" : "年度"
                }}VIP
              </div>
              <div class="membersBuy-dialog__body-left__item-price">
                {{ item.preferentialPrice }}
              </div>
              <div class="membersBuy-dialog__body-left__item-original">
                ¥{{ item.originalPrice }}
              </div>
            </div>
          </div>
        </div>
        <div v-show="!noPay" class="membersBuy-dialog__body-pay">
          <div class="membersBuy-dialog__body-pay_price">
            <p class="membersBuy-dialog__body-left__item-price">
              {{ productList.productSkuFrontList[choseType].preferentialPrice }}
            </p>
            <p class="membersBuy-dialog__body-pay_price_hint">
              使用 微信/支付宝 扫码支付
            </p>
          </div>
          <div
            v-for="(item, index) in payContent"
            :key="item.id"
            class="membersBuy-dialog__body-right-code"
            :style="{ marginRight: index === 0 ? '16px' : '' }"
          >
            <img
              v-if="payExpired"
              class="membersBuy-dialog__body-right-mask animate__animated animate__fadeIn"
              :src="membersBuy_dialog_code_mask"
              @click="onResetQRCode"
            />
            <div v-loading="loading" class="membersBuy-dialog__body-pay__box">
              <canvas :id="item.QRCode" />
            </div>
            <div class="membersBuy-dialog__body-right-weChat">
              <img v-if="item.id === 0" :src="weChat_icon" />
              <img v-else :src="ali_icon" />
              <span :style="`color: ${item.borderColor}`">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onDeactivated, onMounted } from "vue";
import QRCode from "qrcode";
import { useUserStoreHook } from "@/store/modules/user";
import { getMemberPayInfo, getPayResult, getMemberPayInfoALi } from "@/api/vip";
import members_buy_header_bg from "@/assets/img/vip/members_buy_header_bg.png";
import cancel_icon from "@/assets/img/common/cancel-icon.png";
const userStore = useUserStoreHook();
import members_buy_price_bg from "@/assets/img/vip/members_buy_price_bg.png";
import membersBuy_dialog_code_mask from "@/assets/img/vip/membersBuy-dialog-code-mask.png";
import weChat_icon from "@/assets/img/vip/membersBuy-dialog-weChat-icon.png";
import ali_icon from "@/assets/img/vip/membersBuy-dialog-ali-icon.png";
import { ElMessage } from "element-plus";
import { getPayInfoList } from "@/api/vip";
import { throttle } from "lodash";
const loading = ref(false);
const productList: any = ref(null);
const showDialog = ref(false); // 弹窗动画控制器
const payContent = ref([
  {
    id: 0,
    QRCode: "weChat",
    borderColor: "#50B142",
    icon: "../../../../../assets/image/member-buy/membersBuy-dialog-weChat-icon.png",
    text: "微信支付",
  },
  {
    id: 1,
    QRCode: "ali",
    borderColor: "#3875F6",
    icon: "../../../../../assets/image/member-buy/membersBuy-dialog-weChat-icon.png",
    text: "支付宝支付",
  },
]); // 支付相关图片文字配置
const timer = ref(null); // 定时器
const countDown = ref(null); // 支付倒计时定时器
const payExpired = ref(false); // 支付过期
const weChatQRCodeHistory = ref(["", "", ""]); // 微信支付信息缓存
const aliQRCodeHistory = ref(["", "", ""]); // 支付宝支付信息缓存
const payInfoHistory = ref([{}, {}, {}]); // 支付信息
const noPay = ref(false); // 无支付信息
const choseType = ref(0); // 选中的哪一种会员

// 取消支付
const onCancel = () => {
  showDialog.value = false;
  payExpired.value = false;
  clearInterval(timer.value);
  clearTimeout(countDown.value);
  userStore.openMembersBuy(false);
};
// 获取用户信息
const getMemberInfo = async () => {
  try {
    const _res = (await getPayInfoList()) as any;
    _res.datas.productSkuFrontList.forEach((item) => {
      item.originalPrice =
        item.originalPrice < 100
          ? (item.originalPrice / 100).toFixed(2)
          : Math.floor(item.originalPrice / 100);
      item.preferentialPrice =
        item.preferentialPrice < 100
          ? (item.preferentialPrice / 100).toFixed(2)
          : Math.floor(item.preferentialPrice / 100);
      item.preferentialPriceCount =
        item.preferentialPriceCount < 100
          ? (item.preferentialPriceCount / 100).toFixed(2)
          : Math.floor(item.preferentialPriceCount / 100);
    });
    productList.value = _res.datas;
    onChoseMember(0);
    showDialog.value = true;
  } catch (error) {
    console.error(error);
  }
};
// 选择支付金额
const onChoseMember = throttle(async (index) => {
  choseType.value = index;
  clearInterval(timer.value);
  clearTimeout(countDown.value);
  if (weChatQRCodeHistory.value[choseType.value] !== "") {
    noPay.value = false;
  }
  if (
    weChatQRCodeHistory.value[choseType.value] === "" ||
    aliQRCodeHistory.value[choseType.value] === ""
  ) {
    await getPayChatMsg("weChat");
  }
  if (
    weChatQRCodeHistory.value[choseType.value] !== "" ||
    aliQRCodeHistory.value[choseType.value] !== ""
  ) {
    getQRCode("weChat");
    getQRCode("ali");
    countDown.value = setTimeout(
      () => {
        payExpired.value = true;
      },
      1000 * 60 * 10,
    );
  }
  !noPay.value &&
    (timer.value = setInterval(() => {
      getPayResultFn();
    }, 2000));
}, 800);
// 刷新支付码
const onResetQRCode = () => {
  payExpired.value = false;
  onChoseMember(choseType);
};
// 获取后端支付内容，绘制二维码
const getPayChatMsg = async (type) => {
  loading.value = true;
  try {
    const _data = {
      tradeType: "NATIVE",
      productSkuNo:
        productList.value.productSkuFrontList[choseType.value].productSkuNo,
    };
    const res: any =
      type === "weChat"
        ? await getMemberPayInfo(_data)
        : await getMemberPayInfoALi(_data);
    const { orderNo, skuNo, codeUrl } = res.datas;
    noPay.value = false;
    type === "weChat" && (weChatQRCodeHistory[choseType.value] = codeUrl);
    type === "ali" && (aliQRCodeHistory.value[choseType.value] = codeUrl);
    payInfoHistory.value[choseType.value] = { orderNo, skuNo };
    aliQRCodeHistory.value[choseType.value] === "" &&
      (await getPayChatMsg("ali"));
  } catch (error) {
    console.log(error);
    error.resp_code === 10107 && (noPay.value = true);
  }
  // 绘制二维码
  if (!noPay.value) {
    getQRCode(type);
    countDown.value = setTimeout(
      () => {
        clearInterval(timer.value);
        clearTimeout(countDown.value);
        payExpired.value = true;
      },
      1000 * 60 * 10,
    );
  }
  loading.value = false;
};
// 绘制二维码
const getQRCode = (type) => {
  const opts = {
    errorCorrectionLevel: "H", // 容错级别
    type: "image/png", // 生成的二维码类型
    quality: 0.3, // 二维码质量
    margin: 0, // 二维码留白边距
    width: 96, // 宽
    height: 96, // 高
    color: {
      dark: "#333333", // 前景色
      light: "#fff", // 背景色
    },
  };
  const msg = document.getElementById(type);
  // 将获取到的数据（val）画到msg（canvas）
  QRCode.toCanvas(
    msg,
    type === "weChat"
      ? weChatQRCodeHistory[choseType.value]
      : aliQRCodeHistory.value[choseType.value],
    opts,
  );
  loading.value = false;
};
// 获取支付结果
const getPayResultFn = async () => {
  try {
    const res = (await getPayResult(
      payInfoHistory.value[choseType.value],
    )) as any;
    if (res.datas) {
      userStore.handleGetUserInfo();
      ElMessage.success("会员开通成功");
      onCancel();
    }
  } catch (error) {
    ElMessage.error("会员开通失败，请再此尝试或联系客服");
    console.error(error);
  }
};

onMounted(() => {
  getMemberInfo();
});
onDeactivated(() => {
  clearInterval(timer.value);
  clearTimeout(countDown.value);
});
</script>

<style lang="scss" scoped>
.membersBuy {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.membersBuy-dialog {
  width: 480px;
  height: 400px;
  position: relative;
  z-index: 2;
  background: #ffffff;
  border-radius: 8px;
}
.membersBuy-dialog__small {
  height: 400px;
}
.membersBuy-dialog__cancel {
  width: 24px;
  height: 24px;
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  z-index: 1;
}
.membersBuy-dialog__head {
  height: 80px;
  position: relative;
  padding: 16px;
  .bg {
    width: 100%;
    height: 120px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
  .head_info {
    width: 100%;
    .head_info_user {
      font-weight: 600;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 24px;
      margin-bottom: 4px;
    }
    .head_info_hint {
      font-weight: 400;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 20px;
    }
  }
}
.membersBuy-dialog__body {
  width: 100%;
  height: 320px;
  border-radius: 8px;
  background-color: white;
}
.membersBuy-dialog__body-left {
  width: 100%;
}
.membersBuy-dialog__body-left__box {
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 16px;
}
.membersBuy-dialog__body-left__item {
  width: 144px;
  height: 124px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dbdce2;
  cursor: pointer;
  padding: 16px;
  position: relative;
  .members_buy_price_bg {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
}
.membersBuy-dialog__body-left__item-price {
  font-size: 32px;
  font-weight: 600;
  color: #1c232f;
  line-height: 40px;
  margin-bottom: 4px;
  position: relative;
}
.membersBuy-dialog__body-left__item-price::before {
  content: "¥";
  zoom: 0.7;
}
.membersBuy-dialog__body-left__item-original {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.26);
  line-height: 22px;
  position: relative;
}
.membersBuy-dialog__body-left__item-lose {
  width: 72px;
  height: 24px;
  background: #f2f3f5;
  border-radius: 0px 8px 0px 8px;
  font-weight: 400;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.26);
  line-height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.membersBuy-dialog__body-left__item-lose-bg {
  background: linear-gradient(207deg, #55402a 0%, #3b3433 100%);
  color: #ffd6c1;
}
.membersBuy-dialog__body-left__item-desc {
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 22px;
  text-align: left;
  margin-bottom: 8px;
  position: relative;
}
.membersBuy-dialog__body-left__item-chose {
  transition: all 0.3s;
}
.membersBuy-dialog__body-pay {
  width: 100%;
  position: relative;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  margin-top: 8px;
  padding: 0 16px;
}
.membersBuy-dialog__body-right-weChat {
  width: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  & img {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  & span {
    font-size: 14px;
    font-weight: 400;
    color: #5b6985;
    line-height: 22px;
  }
}
.membersBuy-dialog__body-right-code {
  position: relative;
}
.membersBuy-dialog__body-right-mask {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 96px;
  height: 96px;
  background: rgba(0, 0, 0, 0.7);
  right: 0;
  cursor: pointer;
  z-index: 2;
}
.membersBuy-dialog__body-pay__box {
  width: 112px;
  height: 112px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dbdce2;
}
.membersBuy-dialog__body-pay_price {
  padding-top: 72px;
  margin-right: 62px;
  .membersBuy-dialog__body-left__item-price {
    margin-bottom: 0;
  }
  .membersBuy-dialog__body-pay_price_hint {
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 20px;
    text-align: left;
  }
}
</style>
