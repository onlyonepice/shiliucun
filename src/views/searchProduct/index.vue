<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
    <p :class="ns.b('total')">共找到<span>1222</span>款产品</p>
    <div :class="ns.b('filter')">
      <div
        :class="ns.be('filter', 'item')"
        v-for="item in filterList"
        :key="item.id"
      >
        <h5>{{ item.title }}</h5>
        <div :class="ns.be('filter', 'box')">
          <template v-if="item.type === 'txt'">
            <p v-for="_item in item.data" :key="_item.id">{{ _item.label }}</p>
          </template>
          <template v-else-if="item.type === 'img'">
            <div
              :class="ns.be('filter', 'img')"
              v-for="_item in item.data"
              :key="_item.id"
            >
              <img
                :src="useUserStoreHook().$state.fileUrl + _item.data"
                alt=""
              />
            </div>
          </template>
        </div>
      </div>
    </div>
    <div :class="ns.b('content')">
      <SearchProductCard v-for="item in 16" :key="item" />
    </div>
    <Pagination :total="100" :pageSize="16" />
  </div>
</template>

<script lang="ts" setup>
interface TabsList {
  id: number;
  name: string;
}
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getCoolDownApi, getProductFilterApi } from "@/api/searchProduct.ts";
import { useUserStoreHook } from "@/store/modules/user";
import SearchProductCard from "./components/card.vue";
const ns = useNamespace("searchProduct");
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "工商业一体机", code: "INDUSTRY_ENERGY_STORAGE" },
  { id: 2, name: "电芯" },
  { id: 3, name: "储能变流器" },
  { id: 4, name: "大型储能柜" },
]);
// 筛选项数组
const filterList: Ref<Array<any>> = ref([
  { id: 1, type: "txt", title: "冷却方式", data: [] },
  { id: 2, type: "img", title: "品牌选择", data: [] },
]);
const choseTabs: Ref<number> = ref(1); // 选中的tabs
// 选择标签栏
const onHandleClick = (id: number) => {
  choseTabs.value = id;
};
// 查询冷却方式
const getCoolDown = async () => {
  const { datas } = await getCoolDownApi({
    isSelectByHide: true,
    pid: 0,
    type: "product_cooling_method",
  });
  filterList.value[0].data = datas;
};
// 查产品筛选项
const getProductFilter = async () => {
  const _data = tabsList.value.filter((item) => {
    return item.id === choseTabs.value;
  });
  const { datas } = await getProductFilterApi({
    energyStorageProductCode: _data[0].code,
  });
  const _list: any = [];
  for (const key in datas) {
    _list.push({ id: key, data: datas[key] });
  }
  filterList.value[1].data = _list;
};
getCoolDown();
getProductFilter();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct {
  padding-top: 80px;
}
.es-searchProduct-total {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-bottom: 17px;
  span {
    @include font(14px, 600, #ff892e, 22px);
    margin: 0 8px 0 8px;
  }
}
.es-searchProduct-filter {
  padding-bottom: 7px;
  border-bottom: 1px solid #e8eaef;
}
.es-searchProduct-filter__item {
  margin-bottom: 16px;
  @include flex(flex-start, flex-start, wrap);
  h5 {
    margin-right: 16px;
    width: 56px;
  }
  div {
    flex: 1;
    @include flex(flex-start, flex-start, wrap);
  }
  p {
    padding: 2px 8px;
    margin-right: 16px;
    cursor: pointer;
  }
  .es-searchProduct-filter__img {
    @include widthAndHeight(122px, 64px);
    margin: 0 8px 8px 0;
    border: 1px solid #dbdce2;
    background: #ffffff;
    border-radius: 4px;
    flex: 0;
    @include flex(center, center);
    padding: 20px 21px;
    cursor: pointer;
    img {
      @include widthAndHeight(80px, 23px);
    }
  }
}
.es-searchProduct-filter__box {
  @include flex(flex-start, flex-start, wrap);
}
.es-searchProduct-content {
  @include flex(flex-start, space-between, wrap);
}
</style>
