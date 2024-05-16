<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('main')" v-if="!isSkeleton">
      <div :class="ns.bm('main', 'title')">周/月/季报</div>
      <div :class="ns.b('list')">
        <TimeList
          :list="listItem"
          v-for="(listItem, index) in templateList"
          :key="index"
          @dropdownLoading="dropdownLoading"
          @detailReport="onDetailReport"
        />
      </div>
    </div>
    <el-skeleton style="width: 1152px; margin: 80px auto" animated v-else>
      <template #template>
        <el-skeleton-item
          variant="text"
          style="width: 160px; height: 44px; margin-bottom: 32px"
        />
        <div
          style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 80px;
          "
        >
          <el-skeleton-item
            v-for="i in 3"
            :key="i"
            variant="text"
            style="
              width: 32%;
              height: 676px;
              max-width: 368px;
              border-radius: 8px;
            "
          />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import TimeList from "./components/TimeList.vue";
import weeklyPic from "@/assets/img/report/weekly-bg-pic.png";
import monthlyPic from "@/assets/img/report/month-bg-pic.png";
import quarterlyPic from "@/assets/img/report/quarterly-bg-pic.png";
import { reportList } from "@/api/report";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
import { getTimesApi } from "@/api/user";
const router = useRouter();
// const { VITE_I_REPORT_URL } = import.meta.env;
const ns = useNamespace("quarterlyMonthly");
const isSkeleton = ref(true);
const templateList = ref([
  {
    pic: weeklyPic,
    type: "weekly",
    pages: 0,
    total: 0,
    data: {
      page: 1,
      limit: 12,
    },
    list: [],
    isEnd: false,
    isLoading: false,
  },
  {
    pic: monthlyPic,
    type: "monthly",
    pages: 0,
    total: 0,
    data: {
      page: 1,
      limit: 12,
    },
    list: [],
    isEnd: false,
    isLoading: false,
  },
  {
    pic: quarterlyPic,
    type: "quarterly",
    pages: 0,
    total: 0,
    data: {
      page: 1,
      limit: 12,
    },
    list: [],
    isEnd: false,
    isLoading: false,
  },
]);
// 获取报告列表
const getReportList = async (index, type) => {
  templateList.value[index].isLoading = true;
  const queryData = {
    page: templateList.value[index].data.page,
    limit: templateList.value[index].data.limit,
    type: type,
  };
  const res = await reportList(queryData);
  if (res.resp_code === 0) {
    res.datas.records.forEach((item) => {
      templateList.value[index].list.push(item);
    });
    templateList.value[index].pages = res.datas.pages;
    templateList.value[index].total = res.datas.total;
    templateList.value[index].isEnd =
      templateList.value[index].list.length === res.datas.total;
    templateList.value[index].isLoading = true;
    isSkeleton.value = false;
  } else {
    ElMessage.error(res.resp_msg);
    templateList.value[index].isLoading = false;
    isSkeleton.value = false;
  }
};
const reportTypesMap = {
  weekly: 0,
  monthly: 1,
  quarterly: 2,
};
// 下拉加载
const dropdownLoading = async (type) => {
  const index = reportTypesMap[type];
  if (!index && index !== 0) return;
  const listData = templateList.value[index].data;
  if (listData.page * listData.limit < templateList.value[index].total) {
    listData.page += 1;
    await getReportList(index, `${type.toUpperCase()}_REPORT`);
  }
};
// 跳转报告详情
const onDetailReport = async (item: any) => {
  if (!getToken()) {
    return useUserStoreHook().openLogin(true);
  }
  const { datas } = await getTimesApi({
    moduleName: "QUARTERLY_AND_MONTHLY_REPORTS",
  });
  if (datas !== null && datas > 0) {
    ElMessage({
      message: `<div style="display: flex;align-items: center;"><img width="17.5" height="17.5" style="margin-right: 9px;" src="https://eesa-mini-app.oss-rg-china-mainland.aliyuncs.com/i-report/v1.0/iReport3_icon_comment.png" /><span>剩余使用次数：${datas - 1}次</span></div>`,
      type: "info",
      dangerouslyUseHTMLString: true,
      duration: 2000,
    });
  }
  router.push(`/reportDetail?id=${item.id}&moduleName=${item.moduleName}`);
};
onMounted(() => {
  Promise.all([
    getReportList(0, "WEEKLY_REPORT"),
    getReportList(1, "MONTHLY_REPORT"),
    getReportList(2, "QUARTERLY_REPORT"),
  ]);
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-quarterlyMonthly {
  @include margin(56px, auto, 0, auto);
}
.es-quarterlyMonthly-main {
  max-width: 1152px;
  @include margin(0, auto, 0, auto);
  @include padding(80px, 0, 0, 0);
  @media (max-width: 1250px) {
    width: 96%;
    margin: 0 auto;
  }
  .es-quarterlyMonthly-main--title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
  }
}
.es-quarterlyMonthly-list {
  @include margin(32px, 0, 0, 0);
  @include padding(0, 0, 80px, 0);
  display: flex;
  justify-content: space-between;
}
</style>
