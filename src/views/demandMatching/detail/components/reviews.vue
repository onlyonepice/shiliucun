<template>
  <div :class="ns.b()">
    <h4>请对需求进行评价<span>您的评价会被所有人看到哦！</span></h4>
    <div :class="ns.b('list')">
      <div
        v-for="item in reviewsList"
        :key="item.id"
        @click="choseReviews = choseReviews === item.id ? -1 : item.id"
        :style="{
          border:
            choseReviews === item.id ? reviewsList[choseReviews].border : '',
          background:
            choseReviews === item.id
              ? reviewsList[choseReviews].background
              : '',
        }"
      >
        <img
          :src="choseReviews === item.id ? item.hasImg : item.noneImg"
          alt=""
        />
        <span
          :style="{
            color:
              choseReviews === item.id ? reviewsList[choseReviews].color : '',
          }"
          >{{ item.text }}</span
        >
      </div>
    </div>
    <h4>评价原因</h4>
    <div :class="ns.b('submit')">
      <el-button type="primary">提交评价</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import GoodReviewsNone from "@/assets/img/common/good-reviews-none.png";
import GoodReviewsImg from "@/assets/img/common/good-reviews.png";
import BadReviewsNone from "@/assets/img/common/bad-reviews-none.png";
import BadReviewsImg from "@/assets/img/common/bad-reviews.png";
const ns = useNamespace("demandMatching-reviews");
const reviewsList: Ref<Array<any>> = ref([
  {
    id: 0,
    text: "点赞",
    noneImg: GoodReviewsNone,
    hasImg: GoodReviewsImg,
    color: "#244BF1",
    background: "#EAEDFE",
    border: "1px solid #244BF1",
  },
  {
    id: 1,
    text: "倒赞",
    noneImg: BadReviewsNone,
    hasImg: BadReviewsImg,
    color: "#F75964",
    background: "#FEEFF0",
    border: "1px solid #F75964",
  },
]);
const choseReviews: Ref<number> = ref(-1);
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-demandMatching-reviews {
  @include widthAndHeight(368px, auto);
  padding: 24px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 24px;
  h4 {
    @include flex(center, flex-start, nowrap);
    line-height: 22px;
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      margin-left: 8px;
    }
  }
}
.es-demandMatching-reviews-list {
  @include flex(center, space-between, nowrap);
  padding: 0 16px;
  margin: 24px 0;
  div {
    @include widthAndHeight(136px, 48px);
    @include flex(center, center, nowrap);
    background: #f2f3f5;
    border-radius: 4px;
    cursor: pointer;
    @include font(16px, 400, rgba(0, 0, 0, 0.6), 24px);
    img {
      @include widthAndHeight(24px, 24px);
      margin-right: 4px;
    }
  }
}
.es-demandMatching-reviews-submit {
  @include flex(center, flex-end, nowrap);
  margin-top: 24px;
}
</style>
