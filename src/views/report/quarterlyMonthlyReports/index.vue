<template>
     <div :class="[ns.b(), 'es-commonPage']">
        <div :class="ns.b('main')">
            <div :class="ns.bm('main', 'title')">月报季报。</div>
            <div :class="ns.b('list')">
                <TimeList />
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
import TimeList from './components/TimeList.vue'
const ns = useNamespace('quarterlyMonthly')
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-quarterlyMonthly {
    // height: calc(50vh - 56px);
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
</style>