<template>
  <div :class="[ns.b(''), 'es-commonPage']">
    <p class="page-title">在线报告。</p>
    <div class="content">
      <div class="report-wrapper">
        <p class="title">付费专区</p>
        <div class="report-box">
          <onLineReportList
            width="198px"
            v-for="(item, index) in topReportList"
            :page-data="item"
            :key="`topReport${index}`"
          />
        </div>
        <p class="title">会员专区</p>
        <div class="report-box">
          <onLineReportList
            width="198px"
            v-for="item in freeReportList"
            :page-data="item"
            :key="`freeReport${item.id}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("report-onLine");
import { ref } from "vue";
import { windowScrollStore } from "@/store/modules/windowScroll";
const windowScroll = windowScrollStore();
windowScroll.SET_SCROLL_TOP(0);
import {
  getOnlineReportSelected,
  getTopOnlineReportSelected,
  getFreeOnlineReportSelected,
  getOnlineReportFilters,
} from "@/api/report";

const topReportList = ref([]);
const freeReportList = ref([]);
const checkedTagIds = ref([]);
const getReportTagListFn = async () => {
  const data = await getOnlineReportFilters();
  if (data.resp_code === 0) {
    console.log(data);
  }
};

const getOnlineReportSelectedFn = async () => {
  const data = await getOnlineReportSelected({
    limit: 1000,
    page: 1,
    keyword: "",
    tagIds: checkedTagIds.value.join(","),
  });
  if (data.resp_code === 0) {
    reportList.value = data.datas.records;
  }
};
const getTopOnlineReportSelectedFn = async () => {
  const data = await getTopOnlineReportSelected({
    limit: 40,
    page: 1,
    keyword: "",
    tagIds: checkedTagIds.value.join(","),
  });
  if (data.resp_code === 0) {
    topReportList.value = data.datas.records;
  }
};
const getFreeOnlineReportSelectedFn = async () => {
  const data = await getFreeOnlineReportSelected({
    keyword: "",
    tagIds: checkedTagIds.value.join(","),
  });
  if (data.resp_code === 0) {
    freeReportList.value = data.datas.records;
  }
};
const getPageData = () => {
  getFreeOnlineReportSelectedFn();
  getTopOnlineReportSelectedFn();
  getOnlineReportSelectedFn();
};
getReportTagListFn();
getPageData();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-report-onLine {
  padding-top: 80px;
  padding-bottom: 80px;

  .page-title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    margin-bottom: 32px;
  }

  .content {
    width: 100%;
    display: flex;

    .report-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;

      .title {
        @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
        margin-bottom: 16px;
        margin-left: 1.25vw;
      }
    }

    .report-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .white-report-list {
        margin-left: 1.25vw;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
