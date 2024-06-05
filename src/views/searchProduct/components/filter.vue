<template>
  <div :class="ns.b()">
    <p :class="ns.b('total')">
      共找到<span>{{ total }}</span
      >款产品
    </p>
    <el-button type="primary" @click="productVisible = true"
      >产品入驻</el-button
    >
  </div>
  <div :class="[ns.b('filter'), 'animate__animated animate__fadeIn']">
    <div
      :class="ns.be('filter', 'item')"
      v-for="item in filterList"
      :key="item.id"
    >
      <h5>{{ item.title }}</h5>
      <div
        :class="[
          ns.be('filter', 'box'),
          item.type === 'img' && !showMore
            ? ns.bem('filter', 'box', 'img')
            : '',
        ]"
      >
        <template v-if="item.type === 'txt'">
          <p
            v-for="_item in item.data"
            @click="onChoseFilter(_item, item.title)"
            :key="_item.id"
            :class="[
              ns.be('filter', 'txt'),
              getCoolingMethodIds(_item.id) ? ns.is('active') : '',
            ]"
          >
            {{ _item.label }}
          </p>
        </template>
        <template v-else-if="item.type === 'img'">
          <div
            v-for="_item in !showMore ? item.data.slice(0, 16) : item.data"
            :key="_item.id"
            @click="onChoseFilter(_item, item.title)"
            :class="[
              ns.be('filter', 'img'),
              getEnterpriseId(_item.id) ? ns.is('active') : '',
            ]"
          >
            <img :src="useUserStoreHook().$state.fileUrl + _item.data" alt="" />
            <img
              :class="ns.be('filter', 'img-active')"
              :src="SearchProductIcon"
              v-if="getEnterpriseId(_item.id)"
            />
          </div>
          <img
            :class="[
              ns.be('filter', 'more'),
              showMore ? ns.bem('filter', 'more', 'show') : '',
            ]"
            :src="MoreData"
            @click="showMore = !showMore"
          />
        </template>
      </div>
    </div>
  </div>
  <MiniAppNeed
    :visible="productVisible"
    type="product"
    @onHandleClose="productVisible = false"
  />
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import SearchProductIcon from "@/assets/img/common/search-product-icon.png";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import MoreData from "@/assets/img/reportDetail/icon_expand_nor.png";
const ns = useNamespace("searchProduct-filter");
const emits = defineEmits(["onChoseFilter"]);
const showMore: Ref<boolean> = ref(false); // 是否展开更多
const productVisible: Ref<boolean> = ref(false); // 产品入驻弹窗
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  filterInfo: {
    type: Object as any,
    default: () => {},
  },
  filterList: {
    type: Array as any,
    default: () => [],
  },
});
const onChoseFilter = (item: any, type: string) => {
  emits("onChoseFilter", item, type);
};
// 获取多选状态
const getCoolingMethodIds = (id: string) => {
  return props.filterInfo.coolingMethodIds.indexOf(id) !== -1;
};
// 获取品牌选择
const getEnterpriseId = (id: string) => {
  return props.filterInfo.enterpriseIds.indexOf(id) !== -1;
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-filter {
  @include flex(center, space-between, nowrap);
  margin-bottom: 17px;
}
.es-searchProduct-filter-total {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  span {
    @include font(14px, 600, #ff892e, 22px);
    margin: 0 8px 0 8px;
  }
}
.es-searchProduct-filter-filter {
  padding-bottom: 7px;
  border-bottom: 1px solid #e8eaef;
}
.es-searchProduct-filter-filter__item {
  margin-bottom: 16px;
  @include flex(flex-start, flex-start, wrap);
  @include relative();

  h5 {
    margin-right: 16px;
    width: 56px;
    line-height: 24px;
  }
  div {
    width: 1032px;
    @include flex(flex-start, flex-start, wrap);
  }
}
.es-searchProduct-filter-filter__box {
  @include flex(flex-start, flex-start, wrap);
  height: auto;
}
.es-searchProduct-filter-filter__box--img {
  height: 144px;
  &::after {
    content: "";
    display: inline-block;
    @include widthAndHeight(100%, 64px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 13%,
      #ffffff 100%
    );
    @include absolute(1, none, 0, 0, none);
  }
}
.es-searchProduct-filter-filter__more {
  @include widthAndHeight(16px, 16px);
  @include absolute(1, 0, 0, none, none);
  cursor: pointer;
  transition: all 0.3s;
}
.es-searchProduct-filter-filter__more--show {
  transform: rotate(180deg);
}
.es-searchProduct-filter-filter__txt {
  padding: 2px 8px;
  margin-right: 16px;
  cursor: pointer;
  line-height: 20px;
}
.es-searchProduct-filter-filter__txt.is-active {
  background: #dee8ff;
  border-radius: 4px;
}
.es-searchProduct-filter-filter__img {
  width: 122px !important;
  height: 64px;
  margin: 0 8px 8px 0;
  border: 1px solid #dbdce2;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center !important;
  padding: 0 20px;
  cursor: pointer;
  @include relative();
  flex: 0 0 122px;
  img {
    width: 82px;
    object-fit: cover;
  }
  &:nth-of-type(8n) {
    margin-right: 0;
  }
}
.es-searchProduct-filter-filter__img.is-active {
  border: 1px solid #244bf1;
}
.es-searchProduct-filter-filter__img
  .es-searchProduct-filter-filter__img-active {
  @include widthAndHeight(16px, 16px);
  @include absolute(1, none, 0, 0, none);
}
</style>
