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
    <!-- 筛选项 -->
    <SearchProductSorting
      @onChangeSorting="onChangeSorting"
      @onChangeArrangement="changeArrangement"
    />
    <div :class="ns.b('content')">
      <Loading v-if="loading" />
      <template v-else>
        <template v-if="productList.length !== 0">
          <div
            :class="ns.be('content', 'list')"
            v-for="item in productList"
            :key="item.id"
          >
            <SearchProductCard
              @onCompared="onCompared"
              :product="item"
              :comparedList="comparedList"
              :cardType="cardType"
            />
          </div>
        </template>
        <EmptyData v-else :class="ns.be('content', 'empty')" />
      </template>
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
import { ref, Ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import {
  getCoolDownApi,
  getProductFilterApi,
  getProductListApi,
} from "@/api/searchProduct.ts";
import { useUserStoreHook } from "@/store/modules/user";
import SearchProductCard from "./components/card.vue";
import SearchProductFilter from "./components/filter.vue";
import SearchProductCompared from "./components/compared.vue";
import SearchProductSorting from "./components/sorting.vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash";
const ns = useNamespace("searchProduct");
const tabsList: Ref<Array<TabsList>> = ref([
  { id: 1, name: "工商业一体机", code: "INDUSTRY_ENERGY_STORAGE" },
  // { id: 2, name: "电芯" },
  // { id: 3, name: "储能变流器" },
  // { id: 4, name: "大型储能柜" },
]);
const filterInfo: Ref<any> = ref({
  page: 1,
  limit: 16,
  coolingMethodIds: [],
  enterpriseIds: [],
  productType: "", // 产品类型
  sortType: 0,
  sortMethod: null,
});
const showCompared: Ref<boolean> = ref(false); // 是否显示对比
const showComparedDelay: Ref<boolean> = ref(false); // 是否显示对比
const productList: Ref<any> = ref([]); // 产品列表
const comparedList: Ref<any> = ref([]); // 已对比列表
const total: Ref<number> = ref(0);
const loading: Ref<boolean> = ref(false); // 加载状态
const cardType: Ref<string> = ref("card"); // 卡片展示方式
// 筛选项数组
const filterList: Ref<Array<any>> = ref([
  { id: 1, type: "txt", title: "冷却方式", data: [] },
  { id: 2, type: "img", title: "品牌选择", data: [] },
]);
const choseTabs: Ref<number> = ref(1); // 选中的tabs
watch(
  () => comparedList.value,
  (val) => {
    useUserStoreHook().setComparedList(val);
  },
  { deep: true },
);
// 选择标签栏
const onHandleClick = (id: number) => {
  choseTabs.value = id;
};
// 修改卡片展示样式
const changeArrangement = (type: string) => {
  cardType.value = type;
};
// 排序方式改变
const onChangeSorting = (id: number, type: boolean) => {
  filterInfo.value.sortType = id;
  filterInfo.value.sortMethod = type;
  getProductList();
};
// 查询冷却方式
const getCoolDown = async () => {
  const { datas }: any = await getCoolDownApi({
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
  getProductList();
};
// 筛选项改变
const onChoseFilter = (item: any, type: string) => {
  const _type =
    type === "冷却方式"
      ? filterInfo.value.coolingMethodIds
      : filterInfo.value.enterpriseIds;
  if (_type.indexOf(item.id) === -1) {
    _type.push(item.id);
  } else {
    _type.splice(_type.indexOf(item.id), 1);
  }
  getProductList();
};
// 查询产品
const getProductList = async () => {
  loading.value = true;
  const _data = cloneDeep(filterInfo.value);
  _data.coolingMethodIds.length === 0
    ? (_data.coolingMethodIds = null)
    : _data.coolingMethodIds;
  _data.enterpriseIds.length === 0
    ? (_data.enterpriseIds = null)
    : _data.enterpriseIds;
  const { datas, resp_code } = await getProductListApi(Object.assign(_data));
  if (resp_code === 0) {
    productList.value = datas.content;
    total.value = datas.totalElements;
  }
  loading.value = false;
};
getProductList();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct {
  padding-top: 80px;
}
.es-searchProduct-content {
  width: 100%;
  @include flex(flex-start, flex-start, wrap);
}
.es-searchProduct-content__list {
  margin-right: 24px;
  &:nth-child(4n) {
    margin-right: 0;
  }
}
.es-searchProduct-content__empty {
  margin: 0 auto;
}
</style>
