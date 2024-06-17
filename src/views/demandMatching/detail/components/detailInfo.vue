<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <el-button>立即报名</el-button>
      <el-button>分享</el-button>
    </div>
    <div :class="ns.be('top', 'line')" />
    <div :class="ns.be('info', 'head')">
      <h3>{{ detailInfo.title }}</h3>
    </div>
    <h4 :class="ns.be('info', 'description')">{{ detailInfo.description }}</h4>
    <img
      :class="ns.be('info', 'img')"
      v-for="item in getImgList"
      :key="item"
      :src="useUserStore().fileUrl + item"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("demandMatching-detail");
const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => ({}),
  },
});
const getImgList = computed(() => {
  return props.detailInfo.imageUrls
    ? props.detailInfo.imageUrls.split(",")
    : [];
});
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatching-detail {
  @include widthAndHeight(760px, auto);
  padding: 29px 24px 208px 24px;
  background: #ffffff;
  border-radius: 4px;
  margin-right: 24px;
  margin-bottom: 80px;
}
.es-demandMatching-detail-top {
  @include widthAndHeight(100%, 56px);
}
.es-demandMatching-detail-top__line {
  @include widthAndHeight(712px, 1px);
  background: #dbdce2;
  margin-bottom: 24px;
}
.es-demandMatching-detail-info__head {
  h3 {
    margin-right: 8px;
  }
}
.es-demandMatching-detail-info__description {
  font-weight: 400;
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.4);
  line-height: 22px;
  margin-bottom: 24px;
}
.es-demandMatching-detail-info__img {
  @include widthAndHeight(144px, 144px);
  border-radius: 4px;
  border: 1px solid #dbdce2;
  margin-right: 16px;
  margin-bottom: 16px;
}
</style>
