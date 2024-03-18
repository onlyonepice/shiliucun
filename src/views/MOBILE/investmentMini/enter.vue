<template>
  <div class="investment-mini-page">
    <div class="analysis-page" v-show="pageType === 'filter'">
      <div class="analysis-page_content">
        <p class="title">
          <img class="icon_filter" src="@/assets/img/icon_filter.png" alt="" />
          <span>工商业投资回报性</span>
        <p class="line"></p>
        </p>
        <Filter ref="filterRef" @onAnalysis="onAnalysis" />
      </div>
    </div>
    <div class="result-page" v-show="pageType === 'result'">
      <Result ref="resultRef" @onReset="onReset" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Filter from './filter/enter.vue'
import Result from './result/enter.vue'
const emit = defineEmits(['onAnalysis', 'changePageType'])
const resultRef = ref(null)
const filterRef = ref(null)
let pageType = ref('filter')
const onAnalysis = (data: any, tipsInfoText: string) => {
  pageType.value = 'result'
  resultRef.value.onAnalysis(data, tipsInfoText)
  emit('onAnalysis')
}
const onReset = () => {
  pageType.value = 'filter'
  emit('changePageType', pageType.value)
  filterRef.value.onReset()
}

defineExpose({
  pageType
})
</script>


<style lang="scss"  scoped>
@import "@/style/mixin.scss";


.investment-mini-page {
  width: 100vw;
}

.result-page {
  width: 100vw;

}

.analysis-page {
  width: 100%;
  box-sizing: border-box;

  .analysis-page_content {
    width: 100%;
    background-color: #F2F3F5;
    padding: 3.2rem 3.2rem 0 3.2rem;
    box-sizing: border-box;

  }
}



.title {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 3.2rem;
  background-color: white;
  position: relative;

  .icon_filter {
    width: 3.2rem;
    height: 3.2rem;
    margin-right: 0.8rem;
  }

  span {
    font-size: 3.2rem;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.9);
    line-height: 4.8rem;
  }
}

.line {
  width: calc(100% - 6.4rem);
  height: 1px;
  background-color: #DBDCE2;
  left: 3.2rem;
  position: absolute;
  bottom: 0;
}
</style>