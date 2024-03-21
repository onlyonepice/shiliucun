<template>
  <div :class="[ns.b()]">
    <div class="title">
      <p class="title_text">行业数据。</p>
      <img :src="rightArrow" alt="" />
    </div>
    <div class="content">
      <div class="tab-box">
        <p @click="handleTabClick(key)" v-for="(value, key) in tabList">
          <span :class="currentTab === key ? 'active' : ''">{{ value.name }}</span>
          <img v-if="currentTab === key" :src="tagActiveBg" alt="" />
        </p>
      </div>
      <div class="content_wrapper">
        <div v-if="currentTab === 'biddingDynamics'">
          <BiddingDynamicsList v-for="(item, index) in pageData" :key="index" :pageData="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import useNamespace from '@/utils/nameSpace'
import rightArrow from '@/assets/img/right-arrow.png'
import tagActiveBg from '@/assets/img/tag-active-bg.png'
import BiddingDynamicsList from '@/components/Common/BiddingDynamicsList.vue'
import { getLatestTender } from '@/api/home'
const ns = useNamespace('home-industryData')
const tabList = ref<object>({
  biddingDynamics: {
    name: '招标动态',
  },
  newPolicy: {
    name: '最新政策',
  }
})
const pageData = ref<array>([])
const currentTab = ref(Object.keys(tabList.value)[0])
const getLatestTenderFn = async () => {
  const data = await getLatestTender({
    keyword: '',
    limit: 5,
    page: 1,
    hideError: true
  })
  if (data.resp_code === 0) {
    pageData.value = data.datas.records
  }
}
const handleTabClick = (key) => {
  currentTab.value = key
}
function disableScroll(event) {
  var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
  const dom = document.querySelector('.es-home-industryData')
  const domTop = dom.getBoundingClientRect().top
  const domHeight = dom.getBoundingClientRect().height
  console.log(domTop, event)
  if (domTop <= 70 && domTop >= 0) {
    event.preventDefault();
    console.log(event.offsetY)
    const index = Object.keys(tabList.value).findIndex(item => {
      return item === currentTab.value
    })
    // 在此处理滚轮事件
    if (delta > 0) {
      currentTab.value = index === 0 ? Object.keys(tabList.value)[0] : Object.keys(tabList.value)[index - 1]
    } else if (delta < 0) {
      const lastIndex = tabList.value.length - 1
      currentTab.value = index === lastIndex ? Object.keys(tabList.value)[lastIndex] : Object.keys(tabList.value)[index + 1]
    }
    console.log(currentTab.value)

  }

};
onMounted(() => {

  window.addEventListener('scroll', function () {
    // 在这里编写需要执行的代码
    console.log('页面正在滚动');
  });
  window.addEventListener('wheel', disableScroll, { passive: false });
  // 方式一：使用addEventListener函数监听鼠标滚轮事件
})
getLatestTenderFn()
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryData {
  width: 60vw;
  min-width: 1080px;
  padding-bottom: 64px;

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;

    .title_text {
      @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px)
    }

    img {
      @include widthAndHeight(48px, 48px)
    }
  }

  .content {
    width: 100%;
    display: flex;

    .tab-box {
      width: 172px;
      margin-right: 24px;

      p {
        @include widthAndHeight(100%, 48px);
        margin-bottom: 16px;
        display: flex;
        margin-bottom: 16px;
        align-items: center;
        padding-left: 24px;
        position: relative;
        cursor: pointer;

        span {
          @include font(20px, 400, rgba(0, 0, 0, 0.6), 28px);
        }

        img {
          @include widthAndHeight(100%, 100%);
          @include absolute(-1, 0, none, none, 0)
        }

        .active {
          @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
        }
      }
    }

    .content_wrapper {
      flex: 1;
    }

  }
}
</style>