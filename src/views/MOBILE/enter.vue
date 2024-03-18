<template>
  <div class="page-h5">
    <div class="position-top">
      <div class="title">
        <img class="title-logo" :src="EnergyLogo" />
        <img @click="handleBackClick" v-if="documentTitle === '分析结果' && currentPage === 0"
          src="@/assets/img/icon_return.png" alt="">
      </div>
      <div class="tab">
        <div class="tab-item" v-for="(item, index)  in  tabList" :key="item.name">
          <p @click="handleChangeTab(index)" :class="currentPage === index ? 'item_text active' : 'item_text'">{{
            item.name
          }}</p>
          <p class="item_line" v-if="currentPage === index"></p>
        </div>
      </div>
    </div>
    <div class="page-content">
      <InvestmentMini ref="investmentMiniRef" @changePageType="changePageTypeInvestmentMini" @onAnalysis="onAnalysis"
        v-show="currentPage === 0" />
      <PriceTracking v-if="priceTrackingShow" v-show="currentPage === 1" />
    </div>
    <a href="https://wxaurl.cn/r27EvMBu1oi" class="iReport-href"><span>储能领跑者联盟</span>提供技术支持</a>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import InvestmentMini from './investmentMini/enter.vue'
import PriceTracking from './priceTracking/enter.vue'
import EnergyLogo from '@/assets/img/energy-logo-mb.png'
const tabList: Ref<Array<any>> = ref([
  {
    name: '投资回报性分析',
  },
  {
    name: '代理购电价格追踪',
  }
])
const priceTrackingShow = ref(false)
let currentPage: Ref<number> = ref(0)
const handleChangeTab = (index: number) => {
  currentPage.value = index
}
watch(
  () => currentPage.value,
  (val) => {
    if (val === 1) {
      priceTrackingShow.value = true
    }
  }
)
const documentTitle = ref('iReport储能云报告')
const onAnalysis = () => {
  documentTitle.value = '分析结果'
}
const changePageTypeInvestmentMini = (res) => {
  if (res === 'filter') {
    documentTitle.value = 'iReport储能云报告'
  } else {
    documentTitle.value = '分析结果'
  }
}
const investmentMiniRef = ref(null)

const handleBackClick = () => {
  documentTitle.value = 'iReport储能云报告'
  investmentMiniRef.value.pageType = 'filter'
}
watch(() => documentTitle.value, (res) => {
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  })

})
</script>

<style lang="scss"  scoped>
.title .title-logo {
  width: 43.4rem;
  height: 6rem;
  position: relative;
  margin: 0 auto;
}

.page-h5 {
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
}

.position-top {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 2;
}

.page-content {
  width: 100%;
  margin-top: 18.4rem;
  overflow-y: auto;
  flex: 1;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 3.6rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
  position: relative;
  padding: 1.5rem;

  img {
    position: absolute;
    left: 2.8rem;
    top: 2rem;
    width: 4rem;
    height: 4rem;
  }
}



.tab {
  width: 100%;
  display: flex;
  height: 9.6rem;

  .tab-item {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .item_text {
      font-size: 3.2rem;
      font-weight: 400;
      color: #666666;
      line-height: 4.8rem;
      margin-bottom: 0.8rem;
    }

    .active {
      font-weight: 600;
      color: #165DFF;
    }


    .item_line {
      width: 6.4rem;
      height: 0.4rem;
      background-color: #244BF1;
      border-radius: 0.1rem;
    }
  }
}

.iReport-href {
  width: 100%;
  text-align: center;
  margin-top: 3.2rem;
  margin-bottom: 6.4rem;
  font-size: 2.4rem;
  font-weight: 400;
  color: rgba(153, 153, 153, 0.9);
  line-height: 3.4rem;
  display: inline-block;

  span {
    color: #165DFF;
  }
}
</style>