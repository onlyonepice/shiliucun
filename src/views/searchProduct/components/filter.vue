<template>
  <div :class="ns.b()">
    <p :class="ns.b('total')">
      共找到<span>{{ total }}</span
      >款产品
    </p>
    <el-button type="primary" @click="handleProductCheckIn">产品入驻</el-button>
  </div>
  <div :class="[ns.b('filter'), 'animate__animated animate__fadeIn']">
    <div
      :class="ns.be('filter', 'item')"
      v-for="item in filterList"
      :key="item.id"
    >
      <template v-if="item.show">
        <h5
          :style="{
            padding:
              item.title === '产品分类'
                ? '8px 0'
                : item.title === '冷却方式'
                  ? '2px 0'
                  : '',
          }"
        >
          {{ item.title }}
        </h5>
        <div
          :class="[
            ns.be('filter', 'box'),
            item.data.length < 16 ? ns.be('filter', 'little') : '',
            item.type === 'img' && !showMore && item.data.length > 16
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
          <template v-if="item.type === 'img'">
            <div
              v-for="_item in !showMore ? item.data.slice(0, 16) : item.data"
              :key="_item.id"
              @click="onChoseFilter(_item, item.title)"
              :class="[
                ns.be('filter', 'img'),
                getEnterpriseId(_item.id) ? ns.is('active') : '',
              ]"
            >
              <img
                :src="useUserStoreHook().$state.fileUrl + _item.data"
                alt=""
              />
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
          <template v-if="item.type === 'classification'">
            <div :class="ns.b('productType')">
              <div
                v-for="item in productList"
                :key="item.id"
                @click="onChoseProduct(item.label)"
              >
                <div
                  :class="[
                    choseProduct === item.label
                      ? ns.bm('product', 'active')
                      : '',
                    ns.b('product'),
                  ]"
                >
                  {{ item.label }}
                </div>
                <div
                  :class="[ns.b('detail')]"
                  v-if="choseProduct === item.label"
                >
                  <div
                    :class="ns.b('detail-item')"
                    v-for="_item in item.children"
                    :key="_item.id"
                  >
                    <h4>{{ _item.label }}</h4>
                    <img :src="MoreDataRight" alt="" />
                    <span
                      v-for="__item in _item.children"
                      :key="__item.id"
                      @click.stop="onChoseFilterType(__item.label)"
                      :class="
                        confirmType === __item.label
                          ? ns.bm('detail-item', 'active')
                          : ''
                      "
                      >{{ __item.label }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
  <!-- <MiniAppNeed
    :visible="productVisible"
    type="product"
    @onHandleClose="productVisible = false"
  /> -->
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import { getToken } from "@/utils/auth";
import { useRouter } from "vue-router";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import MoreData from "@/assets/img/reportDetail/icon_expand_nor.png";
import SearchProductIcon from "@/assets/img/common/search-product-icon.png";
import { getProductTypeListApi } from "@/api/searchProduct";
import MoreDataRight from "@/assets/img/home/chose-next-icon.png";
const ns = useNamespace("searchProduct-filter");
const emits = defineEmits(["onChoseFilter", "onChoseProduct"]);
const showMore: Ref<boolean> = ref(false); // 是否展开更多
const router = ref(useRouter());
const productList: Ref<any> = ref([]); // 产品分类
const choseProduct: Ref<string> = ref(""); // 选择的产品分类
const confirmType: Ref<String> = ref(""); // 确认
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
  productType: {
    type: String,
    default: "INDUSTRY_ENERGY_STORAGE",
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
// 产品入驻
function handleProductCheckIn() {
  window.trackFunction("pc_Product_ProductEntry_click");
  if (!getToken()) {
    return useUserStoreHook().openLogin(true);
  }
  router.value.push("/searchProductProductCheckIn");
}
// 获取产品分类
const getProductTypeList = async () => {
  const { datas, resp_code }: any = await getProductTypeListApi();
  if (resp_code === 0) {
    productList.value = datas;
  }
};
getProductTypeList();
// 选择产品分类
const onChoseProduct = (type: string) => {
  choseProduct.value = choseProduct.value === type ? "" : type;
};
// 确认选择产品分类
const onChoseFilterType = (type: String) => {
  confirmType.value = type;
  choseProduct.value = "";
  switch (type) {
    case "工商业一体机":
      emits("onChoseProduct", 0);
      break;
    case "储能变流器":
      emits("onChoseProduct", 2);
      break;
    case "电芯":
      emits("onChoseProduct", 1);
      break;
    default:
      emits("onChoseProduct", type);
      break;
  }
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
  @include flex(flex-start, flex-start, wrap);
  @include relative();

  h5 {
    margin-right: 16px;
    width: 56px;
    line-height: 24px;
  }
}

.es-searchProduct-filter-filter__box {
  @include widthAndHeight(1032px, auto);
  @include flex(flex-start, flex-start, wrap);
  &:nth-last-child(1) {
    padding-bottom: 16px;
  }
}
.es-searchProduct-filter-filter__box--img {
  height: 254px;
  &::after {
    content: "";
    display: inline-block;
    @include widthAndHeight(100%, 144px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 13%,
      #ffffff 100%
    );
    @include absolute(1, none, 0, 0, none);
  }
  &:nth-last-child(1) {
    padding-bottom: 16px;
  }
}
.es-searchProduct-filter-filter__little {
  height: auto;
}
.es-searchProduct-filter-filter__more {
  @include widthAndHeight(16px, 16px);
  @include absolute(1, 0, 0, none, none);
  cursor: pointer;
  transition: all 0.3s;
}
.es-searchProduct-filter-filter__little {
  height: auto;
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
  height: 122px;
  margin: 0 8px 8px 0;
  border: 1px solid #dbdce2;
  background: #ffffff;
  border-radius: 4px;
  display: flex;
  align-items: center !important;
  padding: 8px;
  cursor: pointer;
  @include relative();
  flex: 0 0 122px;
  overflow: hidden;
  img {
    width: 100%;
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
.es-searchProduct-filter-productType {
  @include flex(center, flex-start, wrap);
  @include relative();
}
.es-searchProduct-filter-product {
  padding: 9px 12px;
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  cursor: pointer;
  width: auto;
  border: 1px solid rgba(0, 0, 0, 0);
}
.es-searchProduct-filter-product--active {
  background: #eaedfe;
  border-radius: 4px;
  border: 1px solid #244bf1;
}
.es-searchProduct-filter-detail {
  @include widthAndHeight(1072px, auto);
  padding: 16px 77px 16px 18px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #dbdce2;
  @include absolute(99999, 50px, none, none, 0);
  background: #ffffff;
  // @include flex(center, flex-start, wrap);
  .es-searchProduct-filter-detail-item {
    @include flex(center, flex-start, wrap);
    margin-bottom: 8px;
    min-height: 22px;
    h4 {
      width: 162px;
      text-align: right;
      display: inline-block;
    }
    img {
      @include widthAndHeight(16px, 16px);
      margin-right: 22px;
    }
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      cursor: pointer;
    }
  }
  .es-searchProduct-filter-detail-item--active {
    color: #244bf1 !important;
  }
}
</style>
