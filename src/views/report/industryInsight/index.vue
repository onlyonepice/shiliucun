<template>
    <div :class="[ns.b(), 'es-commonPage']">
        <div :class="ns.b('main')">
            <div :class="ns.bm('main', 'title')">行业洞察。</div>
            <div :class="ns.b('list')">
                <IndustryInsightList v-for="item in industryInsightList" :pageData="item" />
            </div>
            <div :class="ns.b('paging')">
                <span :class="ns.bm('paging', 'total')">共计 {{ industryTotal  }} 条</span>
                <el-pagination
                v-model:current-page="currentPage1"
                :page-size="10"
                :background="background"
                layout="prev, pager, next"
                :total="industryTotal"
                @current-change="handleCurrentChange"
                 />
            </div>
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
import {getReNewsInformations} from '@/api/report'
import { onMounted, reactive, ref, Ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
import IndustryInsightList from '@/components/Common/IndustryInsightList.vue'
const ns = useNamespace('industryInsight')
const currentPage1 = ref(1)
const background = ref(true)
const industryTotal = ref(0)
const industryQueryData = ref({
   page: 1,
   limit: 10
})
const industryInsightList: Ref<Array<List>> = ref([])
const handleCurrentChange = (val: number) => {
  industryQueryData.value.page  = val;
  getReNewsInfoList()
}
// 获取行业洞察列表数据
const getReNewsInfoList = async() => {
    const res = await getReNewsInformations(industryQueryData.value)
    if (res.resp_code === 0) {
        industryInsightList.value = res.datas.records;
        industryTotal.value = res.datas.total;
    }
}
onMounted(() => {
    getReNewsInfoList()
})
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-industryInsight {
    @include margin(56px, auto, 0, auto);
    background: #fff;
}
.es-industryInsight-main {
    max-width: 1152px;
    @include margin(0, auto, 0, auto);
    @include padding(80px, 0, 0, 0);
    @media (max-width: 1250px) {
        width: 96%;
        margin: 0 auto;
    }
    .es-industryInsight-main--title {
        @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    }
}
.es-industryInsight-list {
    @include margin(32px, 0, 0, 0)
}
.es-industryInsight-paging {
    @include widthAndHeight(100%, 64px);
    @include flex(center, flex-end);
    @include padding(0,0,80px,0);
    .es-industryInsight-paging--total {
        @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
        @include margin(0,16px,0,0)
    }
}
</style>
<style lang="scss">
.es-industryInsight {
    .el-pagination.is-background .el-pager li.is-active {
        background: #DEE8FF;
        border-radius: 4px;
        color: #244BF1;
    }
    .el-pagination.is-background .btn-prev:disabled,
    .el-pagination.is-background .btn-next:disabled,
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev {
        background: none !important;
    }
    .el-pagination.is-background .el-pager li  {
        background: none;
    }
}
</style>