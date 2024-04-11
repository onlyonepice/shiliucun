<template>
  <div :class="ns.b()">
    <div class="report-list" v-loading="loading">
      <div
        class="item"
        @click="onDetail(item)"
        v-for="item in pageData"
        :key="item.reportName"
      >
        <p class="title">{{ item.reportName }}</p>
        <p class="nameAndDate">
          {{ item.authors ? item.authors.join(",") + "|" : ""
          }}{{ item.writingTime }}
        </p>
        <p class="tag">中标</p>
      </div>
    </div>
    <div class="pagination-box">
      <Pagination :total="total" @onchangeCurrent="onchangeCurrent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getWinningReportPageApi } from "@/api/data";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
const ns = useNamespace("winningBidReport");
const requestData = ref({
  page: 1,
  limit: 10,
});
const pageData = ref([]);
const loading = ref(false);
const total = ref(0);
const getData = async () => {
  loading.value = true;
  const data = await getWinningReportPageApi(requestData.value);
  if (data.resp_code === 0) {
    pageData.value = data.datas.records;
    total.value = data.datas.total;
  }
  loading.value = false;
};
const onDetail = (data: any) => {
  if (!getToken()) {
    return useUserStoreHook().openLogin(true);
  }
  router.push(
    `/reportDetail?id=${data.id}&moduleName=${data.moduleName}&source=winningTheBid`,
  );
};
const onchangeCurrent = (val) => {
  requestData.value.page = val;
  getData();
};
getData();
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-winningBidReport {
  width: 100%;

  .report-list {
    width: 100%;
    min-height: 300px;
    .item {
      @include widthAndHeight(100%, 110px);
      border-bottom: 1px solid #dbdce2;
      cursor: pointer;
      &:hover {
        .title {
          color: rgb(36, 75, 241);
        }
      }
      .nameAndDate {
        @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
        margin-bottom: 16px;
      }
      .title {
        @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
        margin-bottom: 4px;
      }
      .tag {
        @include widthAndHeight(40px, 24px);
        background: #fff3ea;
        border-radius: 4px;
        border: 1px solid #ff8d32;
        @include font(12px, 400, #ff8d32, 24px);
        text-align: center;
      }
    }
  }
}
</style>
