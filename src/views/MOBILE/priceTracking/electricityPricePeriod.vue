<template>
  <div class="electricityPricePeriod">
    <div class="export-img" @click="downloadImg(imgUrl)">导出图片</div>
    <img :src="imgUrl" alt="">
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { getPeakAndValleyImage } from "@/api/priceTracking";
const imgUrl = ref('')
async function getPeakAndValley() {
  const { data: { url } } = await getPeakAndValleyImage()
  imgUrl.value = url
}
function downloadImg(url) {
  const link = document.createElement('a');
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobURL = window.URL.createObjectURL(blob);
      link.href = blobURL;
      link.download = '各省峰谷时段.png';
      link.click();
      window.URL.revokeObjectURL(blobURL);
    });
}
getPeakAndValley()
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.electricityPricePeriod {
  @include box(3.2rem, (3.2rem 0 0 0), #fff, 0);

  img {
    width: 100%;
    object-fit: cover;
  }

  .export-img {
    @include margin(0, 0, 3rem, auto);
  }
}
</style>