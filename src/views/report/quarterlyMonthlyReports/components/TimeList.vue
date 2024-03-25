<template>
    <div :class="ns.bm('list', 'item')" @mouseenter="onEnterBox" @mouseleave="onLeaveBox">
        <div :class="ns.bm('item', 'header')">
            <img :src="list.pic" alt="">
        </div>
        <div :class="ns.b('body')">
            <div :class="ns.bm('body', 'item')" v-for="(item, index) in list.list" :key="item.id" v-infinite-scroll="handleDropdownLoading" infinite-scroll-distance="20">
                <div :class="[ns.bm('item', 'index'), index + 1 === 1 ? 'first' : index + 1 === 2 ? 'second' : index + 1 === 3 ? 'three' : 'default']">
                    {{ index + 1 }}
                </div>
                <div :class="ns.bm('item', 'main')">
                    <p class="item-title">{{ item.reportName }}</p>
                    <p class="item-date">{{ item.writingTime }}</p>
                </div>
            </div>
        </div>
        <div :class="ns.b('footer')">- The End -</div>
    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('timeList')
const props = defineProps({
    list: {
        type: Object,
        default: () => {}
    }
})
const operateItem = ref('')
const emits = defineEmits(['dropdownLoading']);
const handleDropdownLoading = () => {
    emits('dropdownLoading', operateItem.value);
}
const onEnterBox = () => {
    operateItem.value = props.list.type;
}
const onLeaveBox = () => {
    operateItem.value = '';
}

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
                    width: 292px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    @media (max-width: 1250px) {
                        width: 278px;
                    }
                    @media (max-width: 1180px) {
                        width: 248px;
                    }
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
    .es-timeList-footer {
        @include flex();
        @include font(14px,400,#5b6985,28px);
    }
}
</style>