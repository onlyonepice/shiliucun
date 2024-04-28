<template>
  <p :class="ns.b('total')">
    共找到<span>{{ total }}</span
    >款产品
  </p>
  <div :class="ns.b('filter')">
    <div
      :class="ns.be('filter', 'item')"
      v-for="item in filterList"
      :key="item.id"
    >
      <h5>{{ item.title }}</h5>
      <div :class="ns.be('filter', 'box')">
        <template v-if="item.type === 'txt'">
          <p
            v-for="_item in item.data"
            @click="onChoseFilter(_item, item.title)"
            :key="_item.id"
            :class="[
              ns.be('filter', 'txt'),
              _item.id === filterInfo.coolingMethod ? ns.is('active') : '',
            ]"
          >
            {{ _item.label }}
          </p>
        </template>
        <template v-else-if="item.type === 'img'">
          <div
            v-for="_item in item.data"
            :key="_item.id"
            @click="onChoseFilter(_item, item.title)"
            :class="[
              ns.be('filter', 'img'),
              _item.id === filterInfo.enterpriseId ? ns.is('active') : '',
            ]"
          >
            <img :src="useUserStoreHook().$state.fileUrl + _item.data" alt="" />
            <img
              :class="ns.be('filter', 'img-active')"
              :src="SearchProductIcon"
              v-if="_item.id === filterInfo.enterpriseId"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SearchProductIcon from "@/assets/img/common/search-product-icon.png";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
const ns = useNamespace("searchProduct-filter");
const emits = defineEmits(["onChoseFilter"]);
defineProps({
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
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-searchProduct-filter-total {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-bottom: 17px;
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
  @include flex(center, center);
  padding: 20px 21px;
  cursor: pointer;
  @include relative();
  flex: 0 0 122px;
  img {
    @include widthAndHeight(80px, 23px);
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
