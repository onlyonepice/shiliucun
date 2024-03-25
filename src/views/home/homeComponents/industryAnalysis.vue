<template>
  <div :class="[ns.b()]">
    <img :class="ns.b('header-bg')" :src="selected_articles_bg" alt="" />
    <div class="content">
      <p :class="ns.b('title')">行业分析。</p>
      <div :class="ns.b('tab-list')">
        <div class="tab-item" @click="handleTabClick(index)" v-for="( item, index ) in  tabData ">
          <p class="tab-name" :class="currentTab === index ? 'active' : ''">
            {{ item.name }}
          </p>
          <p v-if="currentTab === index" class="line"></p>
        </div>
      </div>
      <swiper @swiper="setControlledSwiper" :modules="modules" :control="controlledSwiper" :width="bannerWidth"
        :loop="true" :space-between="50" class="swiperBox" @slideChange="onSlideChange">
        <swiper-slide v-for=" item  in  tabData " :key="item.name">
          <div :class="ns.b('carousel-item')">
            <img class="banner-img" :src="item.img" alt="">
          </div>
        </swiper-slide>
      </swiper>
    </div>

  </div>

</template>

<script setup lang="ts">
//页面引入vue-awesome-swiper 及其样式
import { Swiper, SwiperSlide, } from 'swiper/vue';
import 'swiper/css';
import { ref, onMounted } from 'vue'
import useNamespace from '@/utils/nameSpace'
import { Controller } from 'swiper/modules';
import selected_articles_bg from '@/assets/img/selected_articles_bg.png'
import diagram_business_and_industry from '@/assets/img/diagram/diagram_business_and_industry.png'
const ns = useNamespace('home-industryAnalysis')
const modules = [Controller];
const tabData = ref([
  {
    name: '工商业投资回报性分析',
    img: diagram_business_and_industry
  },
  {
    name: '电价分析',
    img: diagram_business_and_industry

  },
  {
    name: '招标地区分析',
    img: diagram_business_and_industry

  },
  {
    name: '招标月度分析',
    img: diagram_business_and_industry

  },
  {
    name: '招标企业分析',
    img: diagram_business_and_industry

  },
  {
    name: '中标价格分析',
    img: diagram_business_and_industry

  },
  {
    name: '中标企业分析',
    img: diagram_business_and_industry

  },
])
const controlledSwiper = ref(null);
const currentTab = ref(0)
const setControlledSwiper = (swiper: any) => {
  controlledSwiper.value = swiper;
};
const onSlideChange = (e) => {
  currentTab.value = e.activeIndex
}
const handleTabClick = (index) => {
  currentTab.value = index
  controlledSwiper.value?.slideTo(index, 500)
}
const bannerWidth = ref<number>(0)
onMounted(() => {
  bannerWidth.value = document.querySelector('.banner-img').clientWidth
})
</script>
<style lang="scss">
.swiperBox {
  width: 100%;
  overflow-x: hidden;
}

.swiper-slide {
  @media screen and (max-width: 1250px) {
    width: 1080px !important;
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryAnalysis {
  position: relative;
  height: 1080px;
  padding: 144px 0 80px 0;

  .content {
    width: 1536px;
    height: 100%;
    justify-content: flex-end;
    margin: 0 0 0 auto;

    @media screen and (max-width: 1536px) {
      width: 1152px;
      margin: 0 auto;

    }

    @media screen and (max-width: 1250px) {
      width: 1080px;
      margin: 0 auto;

    }
  }

  .es-home-industryAnalysis-header-bg {
    width: 100vw;
    height: 480px;
    @include absolute(-1, 0, none, none, 0)
  }

  .es-home-industryAnalysis-title {
    margin-bottom: 33px;
    @include font(36px, 600, rgba(255, 255, 255, 0.9), 44px)
  }

  .es-home-industryAnalysis-tab-list {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    .tab-item {
      margin-right: 8px;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      height: 56px;
      cursor: pointer;

      .tab-name {
        @include font(14px, 400, rgba(255, 255, 255, 0.55), 22px);
        margin-top: 17px
      }

      .active {
        @include font(14px, 600, rgba(255, 255, 255, 0.9), 22px);
      }

      .line {
        width: 172px;
        height: 2px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 2px 2px 0px 0px;
      }
    }

  }

  .es-home-industryAnalysis-carousel-item {
    @include widthAndHeight(100%, 698px);
    cursor: pointer;

    img {
      @include widthAndHeight(100%, 100%);
      min-width: 1080px;
      max-width: 1150px;
    }
  }
}
</style>