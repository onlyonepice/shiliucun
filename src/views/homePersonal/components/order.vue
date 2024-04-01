<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的订单</h3>
      <el-button
        type="primary"
        :class="ns.be('top', 'button')"
        @click="onInvoicing()"
        >我要开票</el-button
      >
    </div>
    <el-table
      class="animate__animated animate__fadeIn"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      header-row-class-name="table-class"
    >
      <el-table-column prop="outTradeNo" label="订单编号" width="220" />
      <el-table-column prop="productDesc" label="订单名称" width="150" />
      <el-table-column prop="createTime" label="购买时间" width="200" />
      <el-table-column prop="totalAmount" label="订单金额" />
      <el-table-column label="操作">
        <slot>
          <p :class="[ns.b('buy')]" @click="onPay">再次购买</p>
        </slot>
      </el-table-column>
    </el-table>
    <Pagination :total="total" @onchangeCurrent="onchangeCurrent" />
  </div>
  <Dialog
    title="我要开票"
    :visible="invoicingVisible"
    :showFoot="false"
    width="560px"
    height="420px"
    @onHandleClose="onHandleClose"
  >
    <template #content>
      <img :class="[ns.b('invoicing')]" :src="InvoicingDesc" alt="" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
interface PAGEINFO {
  page: Number;
  limit: Number;
}
import { ref, Ref } from "vue";
import { myOrderListApi } from "@/api/user";
import useNamespace from "@/utils/nameSpace";
import InvoicingDesc from "@/assets/img/homePersonal/invoicing-desc.png";
const ns = useNamespace("homePersonalOrder");
const { VITE_I_REPORT_URL } = import.meta.env;
const tableData: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false); // 加载数据
const total: Ref<number> = ref(0); // 数据总数
const invoicingVisible: Ref<boolean> = ref(false); // 我要开票弹窗
const pageInfo: Ref<PAGEINFO> = ref({
  page: 1,
  limit: 10,
});
const onInvoicing = () => {
  console.log("onInvoicing");
  invoicingVisible.value = true;
};
// 关闭弹窗
const onHandleClose = () => {
  invoicingVisible.value = false;
};
// 页数改变
const onchangeCurrent = (val: number) => {
  pageInfo.value.page = val;
  getOrderList();
};
// 获取我的订单列表
const getOrderList = async () => {
  loading.value = true;
  const { resp_code, datas }: any = await myOrderListApi(pageInfo.value);
  if (resp_code === 0) {
    tableData.value = datas.records;
    total.value = datas.total;
    loading.value = false;
  }
};
getOrderList();
// 支付
const onPay = () => {
  window.open(
    VITE_I_REPORT_URL + "#/relation-servicer?name=订阅会员",
    "externalWindow",
  );
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalOrder-top {
  @include flex(center, space-between, nowrap);
  @include padding(0, 0, 24px, 0);
}
.es-homePersonalOrder-buy {
  @include font(14px, 400, #244bf1, 22px);
  cursor: pointer;
}
.es-homePersonalOrder-invoicing {
  @include widthAndHeight(512px, 312px);
}
</style>
