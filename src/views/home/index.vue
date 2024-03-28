<template>
  <div :class="[ns.b()]">
    <img :class="ns.b('homeBg')" src="https://share.eesaexpo.com/report/3.0/home-head-bg.png" alt="">
    <img :class="ns.b('homeTopIcon')" :src="homeTopIcon" alt="" />
    <div :class="ns.b('homeTopSearch')" v-if="else">
      <el-input v-model="searchContent" placeholder="请输入关键字…" @keyup.enter="onSearch"></el-input>
      <div :class="ns.b('homeTopSearchIcon')" @click.stop="onSearch">
        <img :src="searchIcon" alt="">
      </div>
    </div>
    <div :class="ns.b('homeCenter')">
      <!-- 行业洞察 -->
      <industryInsight />
      <!-- 行业数据 -->
      <industryData />
    </div>
    <!-- 行业分析 -->
    <industryAnalysis />
    <!-- 行业报告 -->
    <industryReport />
  </div>

</template>


<script lang="ts" setup>
import { ref, Ref, } from 'vue'
import useNamespace from '@/utils/nameSpace'
import homeTopIcon from '@/assets/img/common/home-top-icon.png'
import searchIcon from '@/assets/img/common/search-icon.png'
import industryInsight from './homeComponents/industryInsight.vue'
import industryData from './homeComponents/industryData.vue'
import industryAnalysis from './homeComponents/industryAnalysis.vue'
import industryReport from './homeComponents/industryReport.vue'
const ns = useNamespace('home')
const searchContent: Ref<string> = ref('')

// 搜索事件
const onSearch = () => {
  if (searchContent.value === '') {
    return
  }
}
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home {
  min-height: 100vh;
  @include padding(344px, 0, 0, 0);
  @include relative();
}

.es-home-homeBg {
  @include widthAndHeight(100vw, 640px);
  @include absolute(0, 0, 0, none, 0);
}

.es-home-homeTopIcon {
  @include widthAndHeight(580px, 115px);
  @include absolute(1, 216px, 0, 0, 0);
  @include margin(0, auto, 0, auto);
}

.es-home-homeTopSearch {
  @include widthAndHeight(564px, 40px);
  border-radius: 40px 40px 40px 40px;
  background-color: red;
  @include margin(0, auto, 0, auto);
  overflow: hidden;
  @include relative();
}

.es-home-homeTopSearchIcon {
  @include widthAndHeight(64px, 40px);
  @include absolute(1, 0, 0, 0, none);
  background: #244BF1;
  @include flex(center, center);

  img {
    @include widthAndHeight(20px, 20px);
  }
}

.es-home-homeCenter {
  @include widthAndHeight(100vw, 1396px);
  margin-top: 256px;
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<style lang="scss">
.es-home-homeTopSearch {
  .el-input {
    height: 40px;
  }

  .el-input__wrapper.is-focus {
    box-shadow: none;
  }

  .el-input__wrapper:hover {
    box-shadow: none;
  }

  .el-input__wrapper {
    padding: 8px 64px 8px 24px;
  }
}
</style>
