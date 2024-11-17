<template>
  <div class="gamePreview">
    <Swiper
      :slides-per-view="1"
      @swiper="onSwiper"
      :autoplay="{ delay: 1000 }"
      pagination
      @slideChange="onSlideChange"
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
    </Swiper>
  </div>
</template>

<script lang="ts" setup>
// import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
console.log("gamePreview");
const onSwiper = (swiper) => {
  console.log(swiper);
};
const onSlideChange = () => {
  console.log("slide change");
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.gamePreview {
  width: 62.5vw;
  margin: 0 auto;
  color: red;
}
</style>

<style lang="scss">
@import "@/style/mixin.scss";
.gamePreview {
  .swiper {
    @include widthAndHeight(100%, 35.15625vw);
  }
  .swiper-slide {
    background: #fff;
  }
}
</style>
