<template>
  <div :class="ns.b()">
    <div :class="ns.b('left')">
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
        v-for="item in sortingList"
        :key="item.id"
        :class="[
          ns.b('common'),
          ns.b('default'),
          choseTabs === item.id ? ns.b('common-active') : '',
        ]"
        @click="choseTabs = item.id"
      >
        {{ item.text }}
        <div :class="ns.b('common-sorting')">
          <img
            :src="
              upOrDown === false && choseTabs === item.id
                ? SortingUpShow
                : SortingUp
            "
            alt=""
            @click="upOrDown = false"
          />
          <img
            :src="
              upOrDown === true && choseTabs === item.id
                ? SortingDownShow
                : SortingDown
            "
            alt=""
            @click="upOrDown = true"
          />
        </div>
      </div>
    </div>
    <div :class="ns.b('right')">
      <img
        :src="
          arrangementType === 'card' ? ArrangementCardShow : ArrangementCard
        "
        alt=""
        @click="changeArrangement('card')"
      />
      <img
        :src="
          arrangementType === 'list' ? ArrangementListShow : ArrangementList
        "
        alt=""
        @click="changeArrangement('list')"
      />
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
import ArrangementCardShow from "@/assets/img/common/arrangement-card-show.png";
import ArrangementListShow from "@/assets/img/common/arrangement-list-show.png";
import ArrangementCard from "@/assets/img/common/arrangement-card.png";
import ArrangementList from "@/assets/img/common/arrangement-list.png";
const ns = useNamespace("searchProduct-sorting");
const emits = defineEmits(["onChangeSorting", "onChangeArrangement"]);
const choseTabs: Ref<number> = ref(1); // 1: 默认 2: 价格
const upOrDown: Ref<boolean> = ref(null); // false升序/true降序
const arrangementType: Ref<String> = ref("card"); // 卡片排列还是列表
const sortingList: Ref<Array<any>> = ref([
  {
    id: 2,
    text: "价格",
    desc: "inPriceSort",
  },
  {
    id: 3,
    text: "额定功率",
    desc: "inPriceSort",
  },
  {
    id: 4,
    text: "系统容量",
    desc: "inPriceSort",
  },
]);
// 是否选择价格排序
watch(
  () => choseTabs.value,
  (val) => {
    if (val !== 1) {
      upOrDown.value = false;
    } else {
      upOrDown.value = null;
    }
  },
);
// 改变排序
watch(
  () => upOrDown.value,
  (val) => {
    emits("onChangeSorting", choseTabs.value, val);
  },
);
const changeArrangement = (type: string) => {
  arrangementType.value = type;
  emits("onChangeArrangement", type);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-sorting {
  @include widthAndHeight(100%, 40px);
  background: #f2f3f5;
  border-radius: 4px;
  margin: 24px 0 0 0;
  @include flex(center, space-between, nowrap);
  @include relative(0);
}
.es-searchProduct-sorting-left {
  @include flex(center, flex-start, nowrap);
}
.es-searchProduct-sorting-right {
  img {
    @include widthAndHeight(24px, 24px);
    margin-right: 8px;
    cursor: pointer;
  }
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
  box-sizing: border-box;
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
  @include widthAndHeight(auto, 40px);
  @include flex(center, center);
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  cursor: pointer;
  @include relative(1);
  padding: 0 12px 0 16px;
  border: 1px solid rgba(0, 0, 0, 0);
}
</style>
