<template>
  <div :class="[ns.b()]">
    <p class="name">{{ pageData.tenderName }}</p>
    <div class="tag-box">
      <div class="left">
        <img v-if="pageData.isNew" class="new" :src="redNew" alt="" />
        <p class="tag" v-if="pageData.categoryName || pageData.contentName">
          <span>
            {{ pageData.categoryName }}
          </span>
          <span v-if="pageData.categoryName">|</span>
          <span>{{ pageData.contentName }}</span>
        </p>
      </div>
      <span class="right">{{ pageData.countdown }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import redNew from '@/assets/img/red_new.png'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('biddingDynamicsList')
const props = defineProps({
  pageData: {
    type: Object,
    default: () => { { } }
  }
})
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-biddingDynamicsList {
  width: 100%;
  border-bottom: 1px solid #DBDCE2;
  padding-bottom: 16px;
  margin-bottom: 16px;
  cursor: pointer;

  &:hover {
    .name {
      color: #244BF1;
    }
  }

  .name {
    @include textOverflow(1);
    width: 100%;
    @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
    margin-bottom: 8px;
  }

  .tag-box {
    width: 100%;
    @include flex(center, space-between);

    .left {
      display: flex;

      .new {
        @include widthAndHeight(41px, 24px);
        margin-right: 8px;
      }

      .tag {
        padding: 2px 8px;
        background: #FFF3EA;
        border-radius: 4px;
        border: 1px solid #FF8D32;
        @include font(12px, 400, #FF8D32, 20px)
      }
    }

    .right {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px)
    }
  }
}
</style>