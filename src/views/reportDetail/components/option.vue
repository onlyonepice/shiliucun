<template>
  <div :class="ns.b()">
    <h4>{{ detail.reportName }}</h4>
    <div :class="ns.b('tab')">
      <span :class="ns.bm('tab', 'top')">置顶</span>
      <span v-for="item in detail.reportTag" :key="item">{{ item }}</span>
    </div>
    <h4 :class="ns.b('author')" v-if="detail.author">
      分析师：{{ detail.author.join("、") }}
    </h4>
    <p :class="ns.b('write')">撰写时间：{{ detail.writingTime }}</p>
    <el-button :class="ns.be('button', 'big')" type="primary"
      >立即购买</el-button
    >
    <div :class="ns.be('button', 'list')">
      <el-button :class="ns.be('button', 'collection')">收藏</el-button>
      <el-button :class="ns.be('button', 'share')">分享</el-button>
    </div>
    <div :class="ns.be('score', 'head')">
      <h5>报告评分</h5>
      <span v-if="score !== -1">{{ scoreTextList[score] }}</span>
    </div>
    <div :class="ns.be('score', 'content')" @mouseleave="score = -1">
      <div
        v-for="item in 5"
        :key="item"
        @mouseenter="onMouseScore(item)"
        @click="onScore(item)"
      >
        <img
          :class="ns.be('score', 'chose')"
          v-if="item <= score + 1"
          :src="StarFull"
          alt=""
        />
        <img :src="StarEmpty" alt="" />
      </div>
    </div>
    <el-button :class="ns.be('button', 'big')">内容纠错</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import StarEmpty from "@/assets/img/reportDetail/i-Report-star.png";
import StarFull from "@/assets/img/reportDetail/i-Report-star-fill.png";
const ns = useNamespace("reportDetailOption");
const scoreTextList = ref(["比较差", "较差", "一般", "较好", "比较好"]);
const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
});
const score: Ref<number> = ref(
  props.detail.reportScoring === 0 ? -1 : props.detail.reportScoring,
);
// 确定分数
const scoreSure: Ref<number> = ref(props.detail.reportScoring);

// 鼠标移入选择
const onMouseScore = (item: number) => {
  if (scoreSure.value === 0) {
    score.value = item - 1;
  }
};
// 打分
const onScore = (item: number) => {
  score.value = item;
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-reportDetailOption {
  @include widthAndHeight(100%, 440px);
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  h4 {
    @include textOverflow(2);
    margin-bottom: 4px;
    line-height: 24px;
  }
}
.es-reportDetailOption-tab {
  @include flex(center, flex-start);
  padding-bottom: 15px;
  border-bottom: 1px solid #dbdce2;
  .es-reportDetailOption-tab--top {
    background: #f75964;
    border: 1px solid #f75964;
    color: rgba(255, 255, 255, 0.9);
  }
  span {
    border-radius: 4px;
    @include font(12px, 400, #ff8d32, 20px);
    @include flex();
    margin-right: 8px;
    border: 1px solid #ff8d32;
    background: #fff3ea;
    padding: 2px 8px;
    box-sizing: border-box;
  }
}
.es-reportDetailOption-author {
  margin: 16px 0 4px;
}
.es-reportDetailOption-write {
  @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
}
.es-reportDetailOption-button__big {
  @include widthAndHeight(222px, 32px);
  margin-bottom: 8px;
  margin-top: 16px;
}
.es-reportDetailOption-button__list {
  @include flex(center, space-between, nowrap);
  margin-bottom: 32px;
}
.es-reportDetailOption-button__collection {
  @include widthAndHeight(107px, 32px);
}
.es-reportDetailOption-button__share {
  @include widthAndHeight(107px, 32px);
}
.es-reportDetailOption-score__head {
  height: 22px;
  @include flex(center, space-between, nowrap);
  span {
    @include font(14px, 400, #ff8d32, 22px);
  }
}
.es-reportDetailOption-score__content {
  @include flex(center, flex-start, nowrap);
  margin: 8px 0 24px;
  div {
    @include widthAndHeight(32px, 32px);
    cursor: pointer;
    @include relative();
    margin-right: 12px;
  }
  img {
    @include absolute();
  }
  .es-reportDetailOption-score__chose {
    @include absolute(2);
  }
}
</style>
