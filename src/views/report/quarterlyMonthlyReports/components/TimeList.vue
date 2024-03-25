<template>
    <div :class="ns.bm('list', 'item')">
        <div :class="ns.bm('item', 'header')">
            <img :src="list.pic" alt="">
        </div>
        <div :class="ns.b('body')">
            <div :class="ns.bm('body', 'item')" v-for="item in list.list" :key="item.id">
                <div :class="[ns.bm('item', 'index'), item.id === 1 ? 'first' : item.id === 2 ? 'second' : item.id === 3 ? 'three' : 'default']">
                    {{ item.id }}
                </div>
                <div :class="ns.bm('item', 'main')">
                    <p class="item-title">{{ item.title }}</p>
                    <p class="item-date">{{ item.date }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('timeList')
defineProps({
    list: {
        type: Object,
        default: () => {}
    }
})
// const emits = defineEmits(['handleDropdownLoading']);

</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-timeList-list--item {
    max-width: 368px;
    @include widthAndHeight(32%, 676px);
    background: #FFFFFF;
    border-radius: 8px;
    border: 1px solid #DBDCE2;
    overflow: hidden;

    .es-timeList-item--header {
        img {
            @include widthAndHeight(100%, 72px);
        }
    }

    .es-timeList-body {
        height: 600px;
        @include padding(16px, 24px, 16px, 24px);
        overflow-y: scroll;
        .es-timeList-body--item {
             @include flex(flex-start, flex-start);
             @include margin(0,0,8px,0);
             @include padding(9px,0,9px,0);
             flex-wrap: nowrap;
             &:last-child {
                @include margin(0,0,0,0);
             }
             .es-timeList-item--index {
                @include flex();
                @include widthAndHeight(20px, 20px);
                border-radius: 10px;
                @include margin(0,8px,0,0);
                min-width: 20px;
             }
             .first {
                @include font(14px,600,#F75964,22px);
                background: linear-gradient(315deg, #FF3D64 -60%, rgba(255, 64, 68, 0) 42%);
             }
             .second {
                @include font(14px,600,#FF8D32,22px);
                background: linear-gradient( 315deg, #FF8D32 -60%, rgba(255,141,50,0) 42%);
             }
             .three {
                @include font(14px,600,#FFC138,22px);
                background: linear-gradient( 315deg, #FFC138 -60%, rgba(255,193,56,0) 42%);
             }
             .default {
                @include font(14px,600,rgba(0,0,0,0.26),22px);
             }
             .es-timeList-item--main {
                .item-title {
                    @include font(14px,400,rgba(0,0,0,0.9),22px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    
                }
                .item-date {
                    @include font(12px,400,rgba(0,0,0,0.6),20px);
                    @include margin(4px,0,0,0);
                }
             }
             &:hover {
                cursor: pointer;
             }
        }
    }
    &:hover {
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    }
}
</style>