<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('top')">
      <h1>行业数据库。</h1>
      <el-button type="primary" @click="visibleApply = true"
        >立即申请</el-button
      >
    </div>
    <div :class="[ns.b('content'), 'animate__animated animate__fadeIn']">
      <img :src="ContentLeft" alt="" />
      <img :src="ContentRight" alt="" />
    </div>
    <Dialog
      :visible="visibleApply"
      width="400px"
      height="368px"
      @onHandleClose="visibleApply = false"
    >
      <template #content>
        <img :class="ns.b('apply')" :src="ApplyImg" alt="" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import ContentLeft from "@/assets/img/dataBase/dataBase-content-left.png";
import ContentRight from "@/assets/img/dataBase/dataBase-content-right.png";
import ApplyImg from "@/assets/img/dataBase/apply-img.png";
const ns = useNamespace("dataBase");
const visibleApply: Ref<boolean> = ref(false);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-dataBase {
  padding-top: 80px;
  padding-bottom: 80px;
}
.es-dataBase-top {
  @include flex(center, space-between, nowrap);
  margin-bottom: 32px;
}
.es-dataBase-content {
  @include flex(center, space-between, nowrap);
  img {
    @include widthAndHeight(564px, 656px);
    margin-right: 24px;
    &:nth-last-of-type(1) {
      margin-right: 0;
    }
  }
}
.es-dataBase-apply {
  @include widthAndHeight(400px, 368px);
  @include absolute(0, 0, 0, none, none);
}
</style>
