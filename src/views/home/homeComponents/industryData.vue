<template>
  <div :class="[ns.b(), 'es-commonPage']">
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
        <div v-show="currentTab === 'biddingDynamics'">
          <biddingDynamicsList v-for="(item, index) in biddingDynamicsData" :key="index" :pageData="item" />
        </div>
        <div v-show="currentTab === 'newPolicy'">
          <policyList v-for="(item, index) in policyData" :key="index" :pageData="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
import rightArrow from '@/assets/img/common/right-arrow.png'
import tagActiveBg from '@/assets/img/tag-active-bg.png'
import { getLatestTender, getLatestPolicy } from '@/api/home'
import { windowScrollStore } from "@/store/modules/windowScroll";
const ns = useNamespace('home-industryData')
const tabList = ref({
  biddingDynamics: {
    name: '招标动态',
  },
  newPolicy: {
    name: '最新政策',
  }
})
const policyData = ref([])
const biddingDynamicsData = ref([])
const currentTab = ref(Object.keys(tabList.value)[0])
const getLatestTenderFn = async () => {
  const data = await getLatestTender({
    keyword: '',
    limit: 5,
    page: 1,
    hideError: true
  })
  if (data.resp_code === 0) {
    biddingDynamicsData.value = data.datas.records
  }
}
const getLatestPolicyFn = async () => {
  const data = await getLatestPolicy({
    keyword: '',
    limit: 5,
    page: 1,
    hideError: true
  })
  if (data.resp_code === 0) {
    policyData.value = data.datas.records
  }
}
const handleTabClick = (key) => {
  currentTab.value = key
}

const windowScroll = windowScrollStore()
const scrollTop = ref<number>(0)
watch(windowScroll, (e) => {
  scrollTop.value = e.scrollTop
})

function disableScroll() {
  window.addEventListener('mousewheel', preventDefault, { passive: false }); // Chrome/Safari/Opera
  window.addEventListener('DOMMouseScroll', preventDefault, { passive: false }); // Firefox
}


// 阻止默认行为的函数
function preventDefault(event) {
  event = event || window.event;
  window.scrollBy(0, 200); // 滚动页面
  var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
  const dom = document.querySelector('.es-home-industryData')
  if ((scrollTop.value >= 1320) && scrollTop.value < 1500) {
    const index = Object.keys(tabList.value).findIndex(item => {
      return item === currentTab.value
    })
    // 在此处理滚轮事件
    if (delta > 0) {
      if (index !== 0) {
        currentTab.value = Object.keys(tabList.value)[index - 1]
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
      }
    } else if (delta < 0) {
      const lastIndex = Object.keys(tabList.value).length - 1
      if (index !== lastIndex) {
        currentTab.value = Object.keys(tabList.value)[index + 1]
        if (event.preventDefault) event.preventDefault();
        event.returnValue = false;
      }
    }

  }
}
onMounted(() => {
  disableScroll()
})
getLatestPolicyFn()
getLatestTenderFn()
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home-industryData {
  padding-bottom: 64px;
  min-width: 1080px;

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;

    .title_text {
      @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px)
    }

    img {
      @include widthAndHeight(48px, 48px);
      cursor: pointer;
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