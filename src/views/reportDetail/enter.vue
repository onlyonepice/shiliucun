<template>
  <div :class="ns.b()">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <Loading v-if="loading" />
    <div class="es-commonPage" v-if="!loading">
      <Skeleton v-if="skeletonShow" />
      <template v-else>
        <div :class="[ns.b('content')]" v-if="reportDetail.id">
          <div :class="ns.be('content', 'left')">
            <ReportInfo
              :detail="reportDetail"
              @onBuy="onBuy(true)"
              :is-need-buy="reportDetail.needToBuy"
            />
          </div>
          <div :class="ns.be('content', 'right')">
            <ReportOption
              :detail="reportDetail"
              @onBuy="onBuy(true)"
              :is-need-buy="reportDetail.needToBuy"
            />
            <ReportRecommend @getInfo="getReportDetail()" />
          </div>
        </div>
      </template>
    </div>
  </div>
  <Dialog
    title=""
    :visible="buyDialogVisible"
    width="400px"
    height="402px"
    :showFoot="false"
    :class="ns.b('buyDialog')"
    @onHandleClose="onBuy(false)"
  >
    <template #content>
      <img :class="ns.be('buyDialog', 'bg')" :src="BuyDialogBg" alt="" />
      <p :class="ns.be('buyDialog', 'desc')">
        请在<span>15分钟</span>内支付，过时将自动关闭
      </p>
      <p :class="ns.be('buyDialog', 'price')">{{ reportDetail.price }}</p>
      <p :class="ns.be('buyDialog', 'title')">
        您正在购买报告 <br />{{ reportDetail.reportName }}
      </p>
      <div :class="ns.be('buyDialog', 'pay')">
        <div
          :class="ns.be('pay', 'item')"
          v-for="item in payInfo"
          :key="item.id"
        >
          <canvas :class="ns.be('pay', 'img')" :id="item.desc" />
          <div :class="ns.be('pay', 'title')">
            <img :src="item.icon" alt="" />
            <p :name="item.title">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import {
  getPayResultApi,
  getReportDetailApi,
  getReportPayInfoListApi,
} from "@/api/reportDetail";

import QRCode from "qrcode";
import Skeleton from "./components/skeleton.vue";
import { ref, Ref, onMounted } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useRoute, useRouter } from "vue-router";
import { reportStore } from "@/store/modules/report";
import ReportInfo from "./components/info.vue";
import ReportOption from "./components/option.vue";
import ReportRecommend from "./components/recommend.vue";
import { getTimesApi } from "@/api/user";
import AliPay from "@/assets/img/common/ali-pay.png";
import WeChatPay from "@/assets/img/common/weChat-pay.png";
import BuyDialogBg from "@/assets/img/common/buy-dialog-bg.png";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
const skeletonShow = ref(true);
const buyDialogVisible: Ref<boolean> = ref(false); // 购买报告弹窗
const route = useRoute();
const router = useRouter();
const ns = useNamespace("reportDetail");
const payTimer = ref(null); // 支付定时器

const breadcrumbList: Ref<Array<any>> = ref([
  { text: "周/月/季报", path: "/quarterlyMonthlyReports" },
  { text: "", path: "" },
]);
const payInfo: Ref<any> = ref([
  { id: 1, title: "微信支付", desc: "weChat", icon: WeChatPay, payImg: "" },
  { id: 2, title: "支付宝支付", desc: "ali", icon: AliPay, payImg: "" },
]);
// 支付信息
const reportDetail: Ref<any> = ref({}); // 报告详情
const loading: Ref<boolean> = ref(false); // 加载状态

// 获取报告详情
const getReportDetail = async () => {
  loading.value = true;
  try {
    const { datas, resp_code }: any = await getReportDetailApi({
      id: Number(route.query.id),
      moduleName: route.query.moduleName,
    });
    if (resp_code === 0) {
      if (datas.moduleName === "QUARTERLY_AND_MONTHLY_REPORTS" && getToken()) {
        const _datas = await getTimesApi({
          moduleName: "QUARTERLY_AND_MONTHLY_REPORTS",
        });
        if (_datas.datas !== null) {
          ElMessage({
            message: `<div style="display: flex;align-items: center;"><img width="17.5" height="17.5" style="margin-right: 9px;" src="https://eesa-mini-app.oss-rg-china-mainland.aliyuncs.com/i-report/v1.0/iReport3_icon_comment.png" /><span>剩余使用次数：${datas}次</span></div>`,
            type: "info",
            dangerouslyUseHTMLString: true,
            duration: 2000,
          });
        }
      }
      breadcrumbList.value[breadcrumbList.value.length - 1].text =
        datas.reportName;
      // 取前三个标签
      datas.reportTag = datas.reportTag.slice(0, 3);
      reportDetail.value = datas;
    }
    loading.value = false;
  } catch (error) {
    loading.value = false;
  } finally {
    skeletonShow.value = false;
  }
};

// 购买报告
const onBuy = (type: boolean) => {
  buyDialogVisible.value = type;
  if (!type) {
    clearInterval(payTimer.value);
  } else {
    buyInfo();
  }
};

// 调用支付接口获取信息
const buyInfo = async () => {
  const { resp_code, datas }: any = await getReportPayInfoListApi({
    reportId: Number(route.query.id),
    tradeType: "NATIVE",
  });
  if (resp_code === 0) {
    const opts = {
      errorCorrectionLevel: "H", // 容错级别
      quality: 0.3, // 二维码质量
      width: 120, // 宽
      height: 120, // 高
      color: {
        dark: "#333333", // 前景色
        light: "#fff", // 背景色
      },
    };
    QRCode.toCanvas(
      document.getElementById("weChat"),
      datas.wechatPayData.codeUrl,
      opts,
    );
    QRCode.toCanvas(
      document.getElementById("ali"),
      datas.alipayPayData.codeUrl,
      opts,
    );
    payTimer.value = setInterval(() => {
      buyDialogVisible.value && getPayResultFn(datas.orderNo);
    }, 2000);
  }
};

// 获取支付结果
const getPayResultFn = async (orderNo: string) => {
  try {
    const res = (await getPayResultApi({ orderNo })) as any;
    if (res.datas) {
      ElMessage.success("付款成功");
      buyDialogVisible.value = false;
      clearInterval(payTimer.value);
      getReportDetail();
    }
  } catch (error) {
    console.error(error);
  }
};

getReportDetail();

onMounted(() => {
  const _router = router.options.history.state.back as string;
  if (
    _router &&
    (_router.split("?").indexOf("/homePersonal") !== -1 ||
      _router.split("?").indexOf("/dataWinningBid") !== -1)
  ) {
    const _data = reportStore().getReportMapList(
      _router.split("?")[0] as string,
    );
    breadcrumbList.value = [
      { text: _data.ch, path: router.options.history.state.back },
      { text: "", path: "" },
    ];
  } else {
    const _data = reportStore().getReportMapList(
      route.query.moduleName as string,
    );
    breadcrumbList.value[0].text = _data.ch;
    breadcrumbList.value[0].path = _data.path;
  }
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-reportDetail {
  height: calc(100vh);
  background: #f2f3f5;
}

.es-reportDetail-content {
  @include flex(center, space-between, nowrap);
  padding-bottom: 80px !important;
}

.es-reportDetail-content__left {
  @include widthAndHeight(858px, calc(100vh - 56px - 50px));
  background: #ffffff;
  border-radius: 8px;
  margin-right: 24px;
}

.es-reportDetail-content__right {
  width: 270px;
}

.es-reportDetail-buyDialog {
  text-align: center;
}

.es-reportDetail-buyDialog__bg {
  @include widthAndHeight(400px, 120px);
  @include absolute(-1, 0, 0, none, none);
}

.es-reportDetail-buyDialog__desc {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);

  span {
    @include font(14px, 500, #f75964, 22px);
  }
}

.es-reportDetail-buyDialog__price {
  @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
  margin: 7px 0 9px 0;

  &::before {
    content: "￥";
    margin-right: 8px;
    @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
  }
}

.es-reportDetail-buyDialog__title {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-bottom: 24px;
}

.es-reportDetail-buyDialog__pay {
  @include flex(center, center, nowrap);
}

.es-reportDetail-pay__img {
  @include widthAndHeight(120px, 120px);
}

.es-reportDetail-pay__item {
  margin-right: 16px;

  &:last-child {
    margin-right: 0;
  }
}

.es-reportDetail-pay__title {
  @include flex(center, center, nowrap);

  img {
    @include widthAndHeight(20px, 20px);
    margin-right: 4px;
  }

  p[name="微信支付"] {
    @include font(12px, 600, #00c250, 20px);
  }

  p[name="支付宝支付"] {
    @include font(12px, 600, #1777ff, 20px);
  }
}
</style>
