<template>
  <div :class="ns.b()">
    <h4>需求方名片</h4>
    <div :class="ns.b('content')">
      <div :class="ns.be('content', 'left')">
        <h4>张牧之｜中高层管理者</h4>
        <h6>中天科技集团有限公司</h6>
        <div :class="ns.be('content', 'line')" />
      </div>
      <img :class="ns.be('content', 'right')" />
      <h6>手机：</h6>
      <h6>邮箱：</h6>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("demandMatching-businessCard");
</script>
<style lang="scss">
@import "@/style/mixin.scss";

.es-demandMatching-businessCard {
  @include widthAndHeight(368px, 246px);
  background: #ffffff;
  border-radius: 4px;
  padding: 24px;
}
.es-demandMatching-businessCard-content {
  @include widthAndHeight(320px, 158px);
  background: linear-gradient(rgba(36, 75, 241, 0.1), #ffffff);
  // filter: blur(30px);
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid #dbdce2;
  margin-top: 16px;
  padding: 16px;
  @include relative();
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
  width: 192px;
  height: 1px;
  background: #dbdce2;
  margin-bottom: 16px;
}
.es-demandMatching-businessCard-content__left {
  h6 {
    margin-bottom: 15px;
  }
}
.es-demandMatching-businessCard-content__right {
  @include widthAndHeight(80px, 80px);
  background: #ffffff;
  border-radius: 4px;
  @include absolute(1, 16px, 16px, none, none);
}
</style>
