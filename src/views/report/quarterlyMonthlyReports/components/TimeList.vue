<template>
    <div :class="ns.bm('list', 'item')">
        <div :class="ns.bm('item', 'header')">
            <p>储能周报</p>
        </div>
        <div :class="ns.bm('item', 'tip')">
            <p>以周为维度汇总储能招标/中标项目，每周三更新。</p>
        </div>
        <div :class="ns.bm('item', 'body')">
            <p>以周为维度汇总储能招标/中标项目，每周三更新。</p>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('timeList')
</script>

<style lang="scss">
@import "@/style/mixin.scss";
</style>