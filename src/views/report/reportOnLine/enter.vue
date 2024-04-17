<template>
  <div :class="[ns.b(''), 'es-commonPage']">
    <p class="page-title">在线报告。</p>
    <div class="filter-box">
      <div class="year-box filter_item">
        <p class="filter_title">年份</p>
        <div class="filter_value">
          <p
            :class="
              checkedYearIds.includes(item.value)
                ? 'filter_value_item active_item'
                : 'filter_value_item'
            "
            v-for="item in filterData.years"
            :key="item.value"
            @click="handleFilterChange(item, 'checkedYearIds')"
          >
            {{ item.label }}
          </p>
        </div>
      </div>
      <div class="tags-box filter_item">
        <p class="filter_title">标签</p>
        <div class="filter_value">
          <p
            :class="
              checkedTagIds.includes(item.value)
                ? 'filter_value_item active_item'
                : 'filter_value_item'
            "
            v-for="item in filterData.tags"
            :key="item.value"
            @click="handleFilterChange(item, 'checkedTagIds')"
          >
            {{ item.label }}
          </p>
        </div>
      </div>
    </div>
    <div class="content" v-loading="loading">
      <div class="report-wrapper">
        <p class="title" v-if="topReportList.length > 0">付费专区</p>
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
const loading = ref(false);
const topReportList = ref([]);
const freeReportList = ref([]);
const checkedTagIds = ref(["all"]);
const checkedYearIds = ref(["all"]);
const filterData: any = ref({});
const getReportTagListFn = async () => {
  const data = await getOnlineReportFilters();
  if (data.resp_code === 0) {
    filterData.value = data.datas;
    filterData.value.years = filterData.value.years.map((item) => {
      item = {
        label: item.paramDesc,
        value: item.paramValue,
      };
      return item;
    });
    filterData.value.years.unshift({
      label: "全部",
      value: "all",
    });
    filterData.value.tags = filterData.value.tags.map((item) => {
      item = {
        label: item.paramDesc,
        value: item.paramValue,
      };
      return item;
    });
    filterData.value.tags.unshift({
      label: "全部",
      value: "all",
    });
  }
};

const getTopOnlineReportSelectedFn = async () => {
  const data = await getTopOnlineReportSelected({
    limit: 40,
    page: 1,
    keyword: "",
    tagIds: checkedTagIds.value.join(","),
    years: checkedYearIds.value.join(","),
  });
  if (data.resp_code === 0) {
    topReportList.value = data.datas.records;
  }
};
const getFreeOnlineReportSelectedFn = async () => {
  try {
    const data = await getFreeOnlineReportSelected({
      keyword: "",
      tagIds: checkedTagIds.value.join(","),
      years: checkedYearIds.value.join(","),
    });
    if (data.resp_code === 0) {
      freeReportList.value = data.datas.records;
    }
    const _data = await getOnlineReportSelected({
      limit: 1000,
      page: 1,
      keyword: "",
      tagIds: checkedTagIds.value.join(","),
      years: checkedYearIds.value.join(","),
    });
    if (_data.resp_code === 0) {
      freeReportList.value.push(..._data.datas.records);
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};
const handleFilterChange = (row, current) => {
  if (current === "checkedTagIds") {
    checkedTagIds.value = computedFilter(row, checkedTagIds.value);
  } else {
    checkedYearIds.value = computedFilter(row, checkedYearIds.value);
  }
  getPageData();
};
const computedFilter = (row, current) => {
  if (row.value === "all") {
    current = ["all"];
    return current;
  }
  const index = current.indexOf(row.value);
  if (index !== -1) {
    current.splice(index, 1);
  } else {
    current.push(row.value);
  }
  if (current.length === 0) {
    current = ["all"];
  }
  if (current.includes("all") && current.length > 1) {
    current.splice(current.indexOf("all"), 1);
  }
  return current;
};
const getPageData = () => {
  loading.value = true;
  getFreeOnlineReportSelectedFn();
  getTopOnlineReportSelectedFn();
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
    min-height: 300px;

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
  .filter-box {
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 24px;
    border-bottom: 1px solid #e8eaef;
    .filter_item {
      width: 100%;
      display: flex;
      .filter_title {
        @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
      }
      .filter_value {
        flex: 1;
        display: flex;
        align-items: center;
        .filter_value_item {
          margin-left: 16px;
          margin-bottom: 16px;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0);
          border-radius: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
          @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
          flex-wrap: wrap;
          cursor: pointer;

          &:hover {
            background: #f2f3f5;
            border-radius: 4px;
            color: #244bf1;
          }
        }
        .active_item {
          background: #dee8ff;
          border-radius: 4px;
          color: #244bf1;
        }
      }
    }
  }
}
</style>
