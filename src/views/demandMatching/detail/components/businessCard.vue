<template>
  <div :class="ns.b('content')" :style="{ width: width }">
    <div :class="ns.be('content', 'left')">
      <h4>
        <p>{{ info.realName }}</p>
        <p v-if="info.position">｜{{ info.position }}</p>
      </h4>
      <h6>{{ info.company }}</h6>
      <div :class="ns.be('content', 'line')" />
    </div>
    <img
      :class="ns.be('content', 'right')"
      :src="
        !!info.companyLogo
          ? useUserStore().fileUrl + info.companyLogo
          : 'https://cdn.eesaenergy.com/mini-app/i-report/v1.0/no_img.png'
      "
    />
    <h6>手机：{{ info.mobile === null ? "***********" : info.mobile }}</h6>
    <h6>邮箱：{{ info.email === null ? "**********" : info.email }}</h6>
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("demandMatching-businessCard");
defineProps({
  info: {
    type: Object,
    default: () => ({}),
  },
  showExtra: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "320px",
  },
});
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-demandMatching-businessCard-content {
  @include widthAndHeight(320px, 158px);
  background: linear-gradient(rgba(36, 75, 241, 0.1), #ffffff);
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #dbdce2;
  padding: 16px;
  @include relative(1);
  h4 {
    font-weight: 400;
    margin-bottom: 6px;
    line-height: 24px;
  }
  h6 {
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 4px;
  }
}
.es-demandMatching-businessCard-content__line {
  @include widthAndHeight(70%, 1px);
  background: #dbdce2;
  margin-bottom: 16px;
}
.es-demandMatching-businessCard-content__left {
  flex: 1;
  h4 {
    @include flex(center, flex-start, nowrap);
    p {
      max-width: 100px;
      @include textOverflowOne();
    }
  }
  h6 {
    margin-bottom: 15px;
  }
}
.es-demandMatching-businessCard-content__right {
  @include widthAndHeight(80px, 80px);
  background: #ffffff;
  border-radius: 4px;
  @include absolute(1, 16px, 16px, none, none);
  object-fit: contain;
}
</style>
