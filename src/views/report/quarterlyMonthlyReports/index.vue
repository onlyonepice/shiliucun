<template>
     <div :class="[ns.b(), 'es-commonPage']">
        <div :class="ns.b('main')">
            <div :class="ns.bm('main', 'title')">月报季报。</div>
            <div :class="ns.b('list')">
                <TimeList :list="listItem"  v-for="(listItem, index) in templateList" :key="index" @dropdownLoading="dropdownLoading" @detailReport="onDetailReport" />
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
import TimeList from './components/TimeList.vue'
import weeklyPic from '@/assets/img/report/weekly-bg-pic.png'
import monthlyPic from '@/assets/img/report/month-bg-pic.png'
import quarterlyPic from '@/assets/img/report/quarterly-bg-pic.png'
import { reportList } from '@/api/report'
import { ElMessage } from 'element-plus'
const { VITE_IREPOET_URL } = import.meta.env
const ns = useNamespace('quarterlyMonthly');
const templateList = ref([
    {
        pic: weeklyPic,
        type: 'weekly',
        pages: 0,
        total: 0,
        data: {
            page: 1,
            limit: 12,
        },
        list: [],
        isEnd: false
    },
    {
        pic: monthlyPic,
        type: 'monthly',
        pages: 0,
        total: 0,
        data: {
            page: 1,
            limit: 12,
        },
        list: [],
        isEnd: false
    },
    {
        pic: quarterlyPic,
        type: 'quarterly',
        pages: 0,
        total: 0,
        data: {
            page: 1,
            limit: 12,
        },
        list: [],
        isEnd: false
    },
])
// 获取报告列表
const getReportList = async(index, type) => {
    const queryData = {
        page: templateList.value[index].data.page,
        limit: templateList.value[index].data.limit,
        type: type
    }
    const res = await reportList(queryData);
    if (res.resp_code === 0) {
        res.datas.records.forEach(item => {
            templateList.value[index].list.push(item);
        })
        templateList.value[index].pages = res.datas.pages;
        templateList.value[index].total = res.datas.total;
        if (templateList.value[index].list.length === res.datas.total) {
            templateList.value[index].isEnd = true;
        } else {
            templateList.value[index].isEnd = false;
        }
    } else {
        ElMessage.error(res.resp_msg);
    }
}
const reportTypesMap = {
  'weekly': 0,
  'monthly': 1,
  'quarterly': 2,
};
// 下拉加载
const dropdownLoading = (type) => {
    const index = reportTypesMap[type];
    if (index == null) return;
    const listData = templateList.value[index].data;
    if (listData.page * listData.limit < templateList.value[index].total) {
        listData.page += 1;
        getReportList(index, `${type.toUpperCase()}_REPORT`);
    }
}
// 跳转报告详情
const onDetailReport = (item) => {
    window.open(`${VITE_IREPOET_URL}/#/report-detail-pdf_V2?id=${item.id}&parent=季报月报&moduleName=${item.moduleName}&from=/alliance-insight/white-paper`,'_blank')
}
onMounted(() => {
    Promise.all([
        getReportList(0,'WEEKLY_REPORT'),
        getReportList(1,'MONTHLY_REPORT'),
        getReportList(2,'QUARTERLY_REPORT')
    ])
})
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
    @include margin(32px,0,0,0);
    @include padding(0, 0, 80px, 0);
    display: flex;
    justify-content: space-between;
}
</style>