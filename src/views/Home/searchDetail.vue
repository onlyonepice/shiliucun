<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('content'), 'es-commonPage']">
      <Breadcrumb :breadcrumbList="breadcrumbList" />
      <div class="search-box">
        <div :class="ns.b('homeTopSearch')">
          <el-input v-model="searchContent" placeholder="请输入关键字…" @keyup.enter="onSearch"></el-input>
          <div :class="ns.b('homeTopSearchIcon')" @click.stop="onSearch">
            <span>搜索</span>
            <img :src="searchIcon" alt="" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, Ref, } from 'vue'
import useNamespace from '@/utils/nameSpace'
import searchIcon from '@/assets/img/common/search-icon.png'
const ns = useNamespace('searchDetail')
const breadcrumbList = [
  { text: '首页', path: '/home' },
  { text: '搜索详情', path: '' },
]
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

.es-searchDetail {
  width: 100vw;
  padding-top: 104px;

  .es-searchDetail-content {
    .search-box {
      width: 100%;
      padding: 64px 0 24px 0;

      .es-searchDetail-homeTopSearch {
        @include widthAndHeight(956px, 48px);
        border-radius: 24px;
        @include margin(0, auto, 0, auto);
        overflow: hidden;
        @include relative();
      }

      .es-searchDetail-homeTopSearchIcon {
        @include widthAndHeight(96px, 100%);
        @include absolute(1, 0, 0, 0, none);
        background: #244BF1;
        @include flex(center, center);

        span {
          @include font(14px, 400, rgba(255, 255, 255, 0.9), 22px);
          margin-right: 4px
        }

        img {
          @include widthAndHeight(20px, 20px);
        }
      }

    }
  }
}
</style>
<style lang="scss">
.es-searchDetail {
  .es-searchDetail-content {
    .search-box {
      .es-searchDetail-homeTopSearch {
        .el-input {
          height: 48px;

          .el-input__inner {
            text-indent: 13px;

          }
        }
      }
    }
  }
}
</style>
