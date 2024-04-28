<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <Tabs
      :tabsList="tabsList"
      @onHandleClick="onHandleClick"
      :defaultId="choseTabs"
    />
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
              <img
                :src="useUserStoreHook().$state.fileUrl + _item.data"
                alt=""
              />
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
      <div
        :class="[
          ns.b('compared'),
          'animate__animated',
          showCompared ? 'animate__fadeInUp' : 'animate__fadeOutDown',
        ]"
      >
        <div :class="ns.be('compared', 'head')">
          <h3>产品对比</h3>
          <h5 @click="onCloseCompared()">隐藏</h5>
        </div>
        <div :class="ns.be('compared', 'content')">
          <div
            :class="ns.be('compared', 'item')"
            v-for="(item, index) in 4"
            :key="item"
          >
            <div
              :class="ns.be('compared-item', 'box')"
              v-if="comparedList[index] && comparedList[index].id"
              @mouseenter="choseComputed = comparedList[index].id"
              @mouseleave="choseComputed = ''"
            >
              <img
                :src="
                  useUserStoreHook().$state.fileUrl + comparedList[index].image
                "
                alt=""
              />
              <div>
                <h5>{{ comparedList[index].enterprise }}</h5>
                <span>¥ {{ comparedList[index].price }}/kWh起</span>
                <text
                  v-if="choseComputed === comparedList[index].id"
                  class="animate__animated animate__fadeIn"
                  @click="onDelComputed(comparedList[index].id)"
                  >删除</text
                >
              </div>
            </div>
            <div :class="ns.be('compared-item', 'empty')" v-else>
              <div>{{ index + 1 }}</div>
              <p>可继续添加产品</p>
            </div>
          </div>
          <div :class="ns.be('compared', 'btn')">
            <el-button type="primary">对比</el-button>
            <h5 @click="comparedList = []">清空产品</h5>
          </div>
        </div>
      </div>
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
import { useUserStoreHook } from "@/store/modules/user";
import SearchProductCard from "./components/card.vue";
import SearchProductIcon from "@/assets/img/common/search-product-icon.png";
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
const choseComputed: Ref<string> = ref(""); // 选中的产品，用于展示删除按钮
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
  console.log("datas", datas);
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
    line-height: 24px;
  }
  div {
    width: 1032px;
    @include flex(flex-start, flex-start, wrap);
  }
}
.es-searchProduct-filter__box {
  @include flex(flex-start, flex-start, wrap);
}
.es-searchProduct-content {
  @include flex(flex-start, space-between, wrap);
}
.es-searchProduct-compared {
  @include widthAndHeight(1152px, 180px);
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 2px solid #ff892e;
  @include fixed(1, none, none, 24px, 50%);
  margin-left: -576px;
  padding: 24px 24px 32px;
  &__head {
    @include flex(center, space-between, nowrap);
    cursor: pointer;
    margin-bottom: 16px;
    h5 {
      font-weight: 400;
    }
  }
  &__content {
    @include flex(center, flex-start, nowrap);
    @include relative();
    height: 80px;
  }
  &__item {
    @include widthAndHeight(220px, 80px);
    @include flex(flex-start, space-between, nowrap);
    padding-right: 15px;
    border-right: 1px solid #dbdce2;
    margin-right: 16px;
    box-sizing: content-box;
    .es-searchProduct-compared-item__box {
      width: 100%;
      @include flex(flex-start, space-between, nowrap);
    }
    .es-searchProduct-compared-item__empty {
      width: 100%;
      @include flex(center, flex-start, nowrap);
      div {
        @include widthAndHeight(80px, 80px);
        margin-right: 8px;
        @include font();
        background: #f2f3f5;
        border-radius: 4px;
        @include font(40px, 600, rgba(0, 0, 0, 0.26), 48px);
        @include flex(center, center);
      }
      p {
        @include font(14px, 400, rgba(0, 0, 0, 0.4), 22px);
      }
    }
    img {
      @include widthAndHeight(80px, 80px);
    }
    div {
      width: 132px;
    }
    h5 {
      font-weight: 400;
      margin-bottom: 8px;
      line-height: 22px;
    }
    span {
      @include font(12px, 600, #f75964, 20px);
    }
    text {
      @include font(12px, 400, #244bf1, 20px);
      cursor: pointer;
      margin-left: 8px;
    }
  }
  &__btn {
    @include widthAndHeight(88px, 100%);
    @include absolute(1, 0, 0, none, none);
    text-align: center;
    @include flex(center, center, wrap);
    h5 {
      width: 100%;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
.es-searchProduct-filter__txt {
  padding: 2px 8px;
  margin-right: 16px;
  cursor: pointer;
  line-height: 20px;
}
.es-searchProduct-filter__txt.is-active {
  background: #dee8ff;
  border-radius: 4px;
}
.es-searchProduct-filter__img {
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
.es-searchProduct-filter__img.is-active {
  border: 1px solid #244bf1;
}
.es-searchProduct-filter__img .es-searchProduct-filter__img-active {
  @include widthAndHeight(16px, 16px);
  @include absolute(1, none, 0, 0, none);
}
</style>
