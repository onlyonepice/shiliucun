<template>
  <div :class="[ns.b(), 'animate__animated animate__fadeIn']">
    <img
      :class="ns.b('icon')"
      :style="{ width: size, height: size }"
      :src="EmptyProduct"
      alt=""
    />
    <p :class="ns.b('desc')" :style="{ 'font-size': fontSize }">
      产品图片正在更新
    </p>
  </div>
</template>

<script setup lang="ts">
import EmptyProduct from "@/assets/img/common/empty-product-img.png";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("emptyProduct");
defineProps({
  size: {
    type: String,
    default: "214px",
  },
  fontSize: {
    type: String,
    default: "14px",
  },
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-emptyProduct {
  text-align: center;
  @include flex();
  flex-direction: column;
  margin: 0 auto;
}
.es-emptyProduct-desc {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
}
</style>
