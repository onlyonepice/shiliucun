<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('main')">
      <template v-if="!loading">
        <div :class="ns.bm('main', 'title')">会员动态</div>
        <div :class="ns.b('list')">
          <IndustryInsightList
            v-for="(item, index) in memberNewsList"
            :key="`industry${index}`"
            :pageData="item"
            source="reportIndustryInsight"
          />
        </div>
        <div :class="ns.b('paging')">
          <span :class="ns.bm('paging', 'total')"
            >共计 {{ industryTotal }} 条</span
          >
          <el-pagination
            v-model:current-page="currentPage1"
            :page-size="10"
            :background="background"
            layout="prev, pager, next"
            :total="industryTotal"
            @current-change="handleCurrentChange"
          />
        </div>
      </template>
      <template v-else>
        <Skeleton />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface List {
  id: number;
  date: string;
  time: string;
  isTop: boolean;
  title: string;
  tip: string;
}
import { windowScrollStore } from "@/store/modules/windowScroll";
import Skeleton from "./components/skeleton.vue";
const windowScroll = windowScrollStore();
windowScroll.SET_SCROLL_TOP(0);
import { getMemberNews } from "@/api/vip";
import { onMounted, ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("memberNews");
const currentPage1 = ref(1);
const background = ref(true);
const industryTotal = ref(0);
const industryQueryData = ref({
  page: 1,
  limit: 10,
});
const memberNewsList: Ref<Array<List>> = ref([]);
const handleCurrentChange = (val: number) => {
  industryQueryData.value.page = val;
  getReNewsInfoList();
};
const loading: Ref<boolean> = ref(false);
// 获取行业洞察列表数据
const getReNewsInfoList = async () => {
  loading.value = true;
  const res = await getMemberNews(industryQueryData.value);
  if (res.resp_code === 0) {
    memberNewsList.value = res.datas.records;
    industryTotal.value = res.datas.total;
    loading.value = false;
  }
};
onMounted(() => {
  getReNewsInfoList();
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-memberNews {
  @include margin(56px, auto, 0, auto);
  background: #fff;
}

.es-memberNews-main {
  max-width: 1152px;
  @include margin(0, auto, 0, auto);
  @include padding(80px, 0, 0, 0);

  @media (max-width: 1250px) {
    width: 96%;
    margin: 0 auto;
  }

  .es-memberNews-main--title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
  }
}

.es-memberNews-list {
  @include margin(32px, 0, 0, 0);
}

.es-memberNews-paging {
  @include widthAndHeight(100%, 64px);
  @include flex(center, flex-end);
  @include padding(0, 0, 80px, 0);

  .es-memberNews-paging--total {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    @include margin(0, 16px, 0, 0);
  }
}
</style>
<style lang="scss">
.es-memberNews {
  .el-pagination.is-background .btn-prev:disabled,
  .el-pagination.is-background .btn-next:disabled,
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev {
    background: none !important;
  }

  .el-pagination.is-background .el-pager li {
    background: none;
  }
  .el-pagination.is-background .el-pager li.is-active {
    background: #dee8ff;
    border-radius: 4px;
    color: #244bf1;
  }
}
</style>
