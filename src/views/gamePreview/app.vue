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
    <div class="gamesBox___jKqpI">
      <div v-for="(item, index) in list" :key="index" class="gamesBox___item">
        <img class="gamesBox___img" src="" alt="" />
        <p class="gamesBox___title">123</p>
        <p class="gamesBox___price">免费</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/pagination";
const list = ref([
  {
    id: 0,
  },
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 2,
  },
  {
    id: 2,
  },
  {
    id: 2,
  },
  {
    id: 2,
  },
  {
    id: 2,
  },
  {
    id: 2,
  },
]);
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
.gamesBox___jKqpI {
  margin-top: 1.04167vw;
  padding: 1.25vw;
  border-radius: 1.25vw;
  background: #171616;
  display: flex;
  gap: 0.625vw;
  flex-wrap: wrap;
}
.gamesBox___item {
  width: 14.42708vw;
  padding: 0.41667vw;
  border-radius: 0.625vw;
  background-color: #222121;
  background-image: url("@/assets/img/list-item-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.gamesBox___img {
  @include widthAndHeight(100%, 7.65625vw);
}
.gamesBox___title {
  @include font(0.72917vw, 400, #f0eded, 0.83333vw);
}
.gamesBox___price {
  @include font(1.04167vw, 400, #f00a38, 1.04167vw);
  margin-top: 4.20833vw;
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
