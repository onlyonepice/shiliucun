<template>
  <div :class="ns.b()">
    <img :class="ns.b('img')" src="" alt="" />
    <p :class="ns.b('price')">参考价<span>1200/kWh起</span></p>
    <h4 :class="ns.b('name')">Aqua-E系列工商储能产品 233</h4>
    <p :class="ns.b('company')">深圳陆科电子科技股份有限公司</p>
    <div :class="ns.b('btn')">
      <el-button type="primary">联系厂商</el-button>
      <el-button @click="onCompared()">
        <img :src="ComparedIcon" alt="" />
        <span>产品对比</span>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ComparedIcon from "@/assets/img/common/compared-icon.png";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("searchProduct-card");
const emits = defineEmits(["onCompared"]);
const onCompared = () => {
  emits("onCompared", true);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-card {
  @include widthAndHeight(270px, 444px);
  background: rgba(255, 255, 255, 0);
  border-radius: 8px;
  border: 1px solid #dbdce2;
  margin-top: 24px;
  box-shadow: none;
  transition: all 0.3s;
  cursor: pointer;
  padding: 16px 16px 24px 16px;
  text-align: center;
  &:hover {
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  }
}
.es-searchProduct-card-img {
  @include widthAndHeight(238px, 238px);
}
.es-searchProduct-card-price {
  margin: 16px 0 0 8px;
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  span {
    @include font(20px, 600, #f75964, 28px);
    &::before {
      content: "¥";
      display: inline-block;
      @include font(14px, 600, #f75964, 22px);
      margin-left: 4px;
    }
  }
}
.es-searchProduct-card-name {
  margin: 16px 0 4px 0;
}
.es-searchProduct-card-company {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
}
.es-searchProduct-card-btn {
  margin-top: 24px;
  @include flex(center, space-between, nowrap);
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-searchProduct-card-btn {
  .el-button {
    @include widthAndHeight(116px, 32px);
  }
  img {
    @include widthAndHeight(12px, 12px);
    margin-right: 10px;
  }
}
</style>
