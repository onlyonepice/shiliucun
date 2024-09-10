<template>
  <template v-if="prop === ''">
    <div />
  </template>
  <swiper
    v-else
    :slidesPerView="1"
    :navigation="true"
    class="mySwiper"
    :space-between="32"
    v-bind="swiperOption"
    @slideChange="onSlideChange"
    :allowTouchMove="false"
  >
    <swiper-slide v-for="(item, index) in info" :key="index">{{
      getProp(prop, item[prop])
    }}</swiper-slide>
  </swiper>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import { Navigation } from "swiper/modules";
const emits = defineEmits(["onSlideChange"]);
defineProps({
  info: {
    type: Array,
    default: () => [],
  },
  prop: {
    type: String,
    default: "",
  },
});
const swiperOption = ref({
  direction: "horizontal",
  effect: "fade",
  slidesPerView: "auto",
  navigation: {
    nextEl: ".swiperINDUSTRY-next",
    prevEl: ".swiperINDUSTRY-prev",
  },
  modules: [Navigation],
});
const getProp = computed(() => {
  return (prop: string, data: any) => {
    let _data = data || "-";
    switch (prop) {
      case "coolingMethodName":
        _data = data.join("，");
        break;
      case "dcVoltageRange":
        _data = data.join("，");
        break;
      case "nominalVoltage":
        _data = data.join("-");
        break;
      default:
        break;
    }
    return _data;
  };
});
function onSlideChange({ realIndex }) {
  emits("onSlideChange", realIndex);
}
</script>
<style scoped lang="scss">
@import "@/style/mixin.scss";
.swiper-slide {
  width: 118px !important;
  text-align: center;
}
</style>
