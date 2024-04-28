<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
    <SearchProductFilter
      :total="total"
      :filterList="filterList"
      :filterInfo="filterInfo"
      @onChoseFilter="onChoseFilter"
    />
    <div :class="ns.b('content')">
      <SearchProductCard
        v-for="item in productList"
        :key="item.id"
        @onCompared="onCompared"
        :product="item"
        :comparedList="comparedList"
      />
    </div>
    <template v-if="showComparedDelay">
      <SearchProductCompared
        :showCompared="showCompared"
        :comparedList="comparedList"
        @onDelComputed="onDelComputed"
        @onCloseCompared="onCloseCompared"
        @onEmptyCompared="comparedList = []"
      />
    </template>
    <Pagination
      :total="total"
      :pageSize="16"
      @onchangeCurrent="onchangeCurrent"
    />
  </div>
</template>

<script lang="ts" setup>
interface TabsList {
  id: number;
  name: string;
}
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import {
  getCoolDownApi,
  getProductFilterApi,
  getProductListApi,
} from "@/api/searchProduct.ts";
import SearchProductCard from "./components/card.vue";
import SearchProductFilter from "./components/filter.vue";
import SearchProductCompared from "./components/compared.vue";
import { ElMessage } from "element-plus";
const ns = useNamespace("searchProduct");
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "工商业一体机", code: "INDUSTRY_ENERGY_STORAGE" },
  { id: 2, name: "电芯" },
  { id: 3, name: "储能变流器" },
  { id: 4, name: "大型储能柜" },
]);
const filterInfo: Ref<any> = ref({
  page: 1,
  limit: 16,
  coolingMethod: null,
  enterpriseId: null,
  productType: "", // 产品类型
});
const showCompared: Ref<boolean> = ref(false); // 是否显示对比
const showComparedDelay: Ref<boolean> = ref(false); // 是否显示对比
const productList: Ref<any> = ref([]); // 产品列表
const comparedList: Ref<any> = ref([]); // 已对比列表
const total: Ref<number> = ref(0);
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
// 添加产品
const onCompared = (data: any) => {
  showCompared.value = true;
  showComparedDelay.value = true;
  let _delete = false;
  comparedList.value.forEach((item, index) => {
    if (item.id === data.id) {
      _delete = true;
      comparedList.value.splice(index, 1);
    }
  });
  if (_delete) {
    return;
  } else {
    if (comparedList.value.length >= 4) {
      return ElMessage.error("最多只能添加4个产品");
    }
    comparedList.value.push(data);
  }
};
// 删除对比产品
const onDelComputed = (id: string) => {
  comparedList.value.forEach((item, index) => {
    if (item.id === id) {
      comparedList.value.splice(index, 1);
    }
  });
};
// 关闭对比
const onCloseCompared = () => {
  showCompared.value = false;
  setTimeout(() => {
    showComparedDelay.value = false;
  }, 300);
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

// 页码改变
const onchangeCurrent = (page: number) => {
  filterInfo.value.page = page;
};
// 筛选项改变
const onChoseFilter = (item: any, type: string) => {
  if (type === "冷却方式") {
    filterInfo.value.coolingMethod =
      filterInfo.value.coolingMethod === item.id ? null : item.id;
  } else {
    filterInfo.value.enterpriseId =
      filterInfo.value.enterpriseId === item.id ? null : item.id;
  }
  getProductList();
};
// 查询产品
const getProductList = async () => {
  const { datas, resp_code } = await getProductListApi(
    Object.assign(filterInfo.value),
  );
  if (resp_code === 0) {
    productList.value = datas.content;
    total.value = datas.totalElements;
  }
};
getProductList();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct {
  padding-top: 80px;
}
.es-searchProduct-content {
  @include flex(flex-start, space-between, wrap);
}
</style>
