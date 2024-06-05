<template>
  <div :class="ns.b()">
    <div
      :class="[
        ns.b('common'),
        ns.b('default'),
        choseTabs === 1 ? ns.b('common-active') : '',
      ]"
      @click="choseTabs = 1"
    >
      默认
    </div>
    <div
      :class="[
        ns.b('common'),
        ns.b('default'),
        choseTabs === 2 ? ns.b('common-active') : '',
      ]"
      @click="choseTabs = 2"
    >
      价格
      <div :class="ns.b('common-sorting')">
        <img
          :src="upOrDown === false ? SortingUpShow : SortingUp"
          alt=""
          @click="upOrDown = false"
        />
        <img
          :src="upOrDown === true ? SortingDownShow : SortingDown"
          alt=""
          @click="upOrDown = true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import SortingUp from "@/assets/img/common/sorting-up.png";
import SortingUpShow from "@/assets/img/common/sorting-up-show.png";
import SortingDown from "@/assets/img/common/sorting-down.png";
import SortingDownShow from "@/assets/img/common/sorting-down-show.png";
const ns = useNamespace("searchProduct-sorting");
const emits = defineEmits(["onChangeSorting"]);
const choseTabs: Ref<number> = ref(1); // 1: 默认 2: 价格
const upOrDown: Ref<boolean> = ref(null); // false升序/true降序
// 是否选择价格排序
watch(
  () => choseTabs.value,
  (val) => {
    if (val === 2) {
      upOrDown.value = false;
    } else {
      upOrDown.value = null;
    }
  },
);
// 改变价格排序
watch(
  () => upOrDown.value,
  (val) => {
    emits("onChangeSorting", choseTabs.value, val);
  },
);
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-sorting {
  @include widthAndHeight(100%, 40px);
  background: #f2f3f5;
  border-radius: 4px;
  margin: 24px 0 0 0;
  @include flex(center, flex-start, nowrap);
  @include relative(0);
}
.es-searchProduct-sorting-common {
  background: rgba(255, 255, 255, 0);
  &:hover {
    background: #dbdce2;
  }
  &:nth-of-type(1):hover {
    border-radius: 4px 0 0 4px;
  }
}
.es-searchProduct-sorting .es-searchProduct-sorting-common-active {
  background: #ffffff;
  border: 1px solid #244bf1;
  @include font(14px, 400, #244bf1, 22px);
  @include relative(1);
  &:nth-of-type(1) {
    border-radius: 4px 0 0 4px;
  }
}
.es-searchProduct-sorting-common-sorting {
  @include widthAndHeight(16px, 32px);
  @include flex(center, center);
  img {
    @include widthAndHeight(16px, 16px);
  }
}
.es-searchProduct-sorting-default {
  @include widthAndHeight(80px, 40px);
  @include flex(center, center);
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  cursor: pointer;
  @include relative(1);
}
</style>
