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
    <template v-if="choseReviews !== -1">
      <h4 style="margin-bottom: 8px">评价原因</h4>
      <div :class="ns.b('list-box')">
        <div
          v-for="item in reviewsListItem"
          :key="item.id"
          :class="[
            ns.b('list-item'),
            reasonList.includes(item.code)
              ? choseReviews === 0
                ? 'active-good'
                : 'active-bad'
              : '',
          ]"
          @click="onSubmitReason(item.code)"
        >
          {{ item.label }}
        </div>
      </div>
    </template>
    <div :class="ns.b('submit')">
      <el-button type="primary" @click="onSubmit()">提交评价</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import GoodReviewsNone from "@/assets/img/common/good-reviews-none.png";
import GoodReviewsImg from "@/assets/img/common/good-reviews.png";
import BadReviewsNone from "@/assets/img/common/bad-reviews-none.png";
import BadReviewsImg from "@/assets/img/common/bad-reviews.png";
import { getNeedEvaluateApi } from "@/api/demandList";
import { submitEvaluateApi } from "@/api/demandMatching";
import { useRoute } from "vue-router";
const route = useRoute();
const ns = useNamespace("demandMatching-reviews");
const reviewsListItem: Ref<Array<any>> = ref([]); // 评价原因列表
const emits = defineEmits(["onSubmit"]);
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
watch(
  () => choseReviews.value,
  (val) => {
    reasonList.value = [];
    if (val !== -1) {
      reviewsListItem.value =
        val === 0
          ? needEvaluateList.value[0].subset
          : needEvaluateList.value[1].subset;
    } else {
      reviewsListItem.value = [];
    }
  },
);
const needEvaluateList: Ref<Array<any>> = ref([]);
// 获取评价配置
async function getNeedEvaluate() {
  const { datas, resp_code } = await getNeedEvaluateApi({
    type: "APPLY_FEEDBACK",
  });
  if (resp_code === 0) {
    needEvaluateList.value = datas[0].subset;
  }
}
getNeedEvaluate();
const reasonList: Ref<Array<any>> = ref([]);
// 选择评价原因
const onSubmitReason = (id: number) => {
  // 空数组中没有对应id就添加，有就删除
  reasonList.value = reasonList.value.includes(id)
    ? reasonList.value.filter((item) => item !== id)
    : [...reasonList.value, id];
};
// 提交评价
const onSubmit = async () => {
  if (choseReviews.value === -1 || reasonList.value.length === 0) {
    ElMessage.warning("请选择评价原因");
  }
  const { resp_code } = await submitEvaluateApi({
    evaluate: choseReviews.value === 0,
    needId: route.query.id,
    feedbacks: reasonList.value,
  });
  if (resp_code === 0) {
    emits("onSubmit");
  }
};
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
.es-demandMatching-reviews-list-box {
  @include flex(center, space-between, nowrap);
}
.es-demandMatching-reviews-list-item {
  @include widthAndHeight(77px, 32px);
  padding: 5px 10px;
  background: #f2f3f5;
  border-radius: 4px;
  @include flex(center, center, nowrap);
  cursor: pointer;
  @include textOverflowOne();
}
.es-demandMatching-reviews-submit {
  @include flex(center, flex-end, nowrap);
  margin-top: 24px;
}
.active-good {
  background: #eaedfe;
  border-radius: 4px;
  border: 1px solid #244bf1;
  color: #244bf1;
}
.active-bad {
  background: #feeff0;
  border-radius: 4px;
  border: 1px solid #f75964;
  color: #f75964;
}
</style>
