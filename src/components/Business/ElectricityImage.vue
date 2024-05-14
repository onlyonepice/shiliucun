<template>
  <img :class="ns.b()" :src="ElectricityImage" alt="" @click="handleClick" />
</template>
<script lang="ts" setup>
import ElectricityImage from "@/assets/img/dataBase/electricity-image.png";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("electricityImage");
const { VITE_DATABASE_URL } = import.meta.env;
const handleClick = () => {
  window.open(`${VITE_DATABASE_URL}/#/ApiPage`, "externalWindow");
};
</script>
<style lang="scss" scoped>
@import "@/style";
.es-electricityImage {
  @include widthAndHeight(1152px, 80px);
  margin-bottom: 16px;
  cursor: pointer;
}
</style>
