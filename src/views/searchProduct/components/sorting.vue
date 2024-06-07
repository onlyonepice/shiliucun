<template>
  <div :class="ns.b()">
    <div :class="ns.b('left')">
      <div
        :class="[
          ns.b('common'),
          ns.b('default'),
          choseTabs === 0 ? ns.b('common-active') : '',
        ]"
        @click="changeChoseTabs(0)"
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
        @click="changeChoseTabs(item.id)"
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
            @click="changeUpOrDown(false)"
          />
          <img
            :src="
              upOrDown === true && choseTabs === item.id
                ? SortingDownShow
                : SortingDown
            "
            alt=""
            @click="changeUpOrDown(true)"
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
import { Ref, ref } from "vue";
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
const choseTabs: Ref<number> = ref(0); // 0: 默认 1: 价格 2: 额定功率 3: 系统容量
const upOrDown: Ref<boolean> = ref(false); // false升序/true降序
const arrangementType: Ref<String> = ref("card"); // 卡片排列还是列表
const sortingList: Ref<Array<any>> = ref([
  {
    id: 1,
    text: "价格",
    desc: "inPriceSort",
  },
  // {
  //   id: 2,
  //   text: "额定功率",
  //   desc: "inPriceSort",
  // },
  // {
  //   id: 3,
  //   text: "系统容量",
  //   desc: "inPriceSort",
  // },
]);
const changeChoseTabs = (id: number) => {
  if (id === choseTabs.value) {
    return;
  }
  choseTabs.value = id;
  upOrDown.value = false;
  emits("onChangeSorting", id, upOrDown.value);
};
const changeUpOrDown = (type: boolean) => {
  upOrDown.value = type;
  emits("onChangeSorting", choseTabs.value, type);
};
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
