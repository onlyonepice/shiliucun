<template>
     <div :class="[ns.b(), 'es-commonPage']">
        <div :class="ns.b('main')">
            <div :class="ns.bm('main', 'title')">月报季报。</div>
            <div :class="ns.b('list')">
                <TimeList :list="listItem"  v-for="(listItem, index) in templateList" :key="index"/>
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
const ns = useNamespace('quarterlyMonthly');
const templateList = ref([
    {
        pic: weeklyPic,
        list: [{
        id: 1,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    },
    {
        id: 2,
        title: '储能项目招标&中标信息(20240207~ 0221)',
        date: '2024-02-21'
    }, {
        id: 3,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 4,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 5,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 6,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 7,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 8,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 9,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    },]
    },
    {
        pic: monthlyPic,
        list: [{
        id: 1,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    },
    {
        id: 2,
        title: '储能项目招标&中标信息(20240207~ 0221)',
        date: '2024-02-21'
    }, {
        id: 3,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 4,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 5,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 6,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 7,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 8,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 9,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    },]
    },
    {
        pic: quarterlyPic,
        list: [{
        id: 1,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    },
    {
        id: 2,
        title: '储能项目招标&中标信息(20240207~ 0221)',
        date: '2024-02-21'
    }, {
        id: 3,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 4,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 5,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 6,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 7,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 8,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    }, {
        id: 9,
        title: '储能项目招标&中标信息(20240221~ 0229)',
        date: '2024-02-28'
    },]
    },
])
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