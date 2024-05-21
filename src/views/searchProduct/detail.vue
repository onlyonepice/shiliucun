<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']">
      <div :class="[ns.b('content-top')]">
        <div :class="[ns.be('info-left', 'bigImg-box')]">
          <img
            :class="[ns.be('info-left', 'bigImg')]"
            :src="useUserStoreHook().$state.fileUrl + productDetail.image"
            alt=""
          />
        </div>
        <div :class="[ns.b('info-right')]">
          <h3 :class="[ns.b('info-right-title')]">
            {{ productDetail.name }}
          </h3>
          <p :class="[ns.b('info-right-company')]">
            {{ productDetail.enterprise }}
          </p>
          <p :class="[ns.b('info-right-price')]">
            参考价<span>{{ productDetail.price }}/kWh起</span>
          </p>
          <template v-if="productDetail.models">
            <p :class="[ns.b('info-right-common')]">
              额定功率：{{ productDetail.models[0].ratedPower }}kW
            </p>
            <p :class="[ns.b('info-right-common')]">
              电池系统能量：{{ productDetail.models[0].batterySystemEnergy }}kWh
            </p>
            <p :class="[ns.b('info-right-common')]">
              系统综合效率：{{
                productDetail.models[0].systemOverallEfficiency
              }}%
            </p>
            <p :class="[ns.b('info-right-common')]">
              冷却方式：{{
                productDetail.models[0].coolingMethodName.join("，")
              }}
            </p>
          </template>
          <el-button
            :class="[ns.b('info-right-connect')]"
            type="primary"
            @click="onConnectCompany(productDetail.enterpriseId)"
            >联系厂商</el-button
          >
        </div>
      </div>
      <div
        :class="[ns.b('content-list')]"
        v-if="productDetailList.length !== 0"
      >
        <h3>公司其他产品</h3>
        <div style="display: flex">
          <div
            :class="[ns.be('content', 'item')]"
            v-for="item in productDetailList"
            :key="item.id"
            @click="goProductDetail(item.id)"
          >
            <img
              :class="[ns.be('item', 'icon')]"
              :src="useUserStoreHook().$state.fileUrl + item.logoUrl"
              alt=""
            />
            <div :class="[ns.be('item', 'logo-box')]">
              <img
                :class="[ns.be('item', 'logo')]"
                :src="useUserStoreHook().$state.fileUrl + item.image"
                alt=""
              />
            </div>
            <p :class="[ns.be('item', 'price')]">
              参考价<span>1200/kWh起</span>
            </p>
            <p :class="[ns.be('item', 'product')]">{{ item.name }}</p>
            <p :class="[ns.be('item', 'company')]">{{ item.enterprise }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import {
  getProductDetailApi,
  getProductDetailListApi,
} from "@/api/searchProduct";
import { useRoute, useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
const router = useRouter();
const ns = useNamespace("searchProductDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "查产品", path: "/searchProduct" },
  { text: "", path: "" },
]);
const route = useRoute();
const productDetail: Ref<any> = ref({}); // 产品详情
const productDetailList: Ref<any> = ref({});

// 获取产品详情
const getProductDetail = async () => {
  const { datas, resp_code }: any = await getProductDetailApi({
    id: route.query.id,
  });
  if (resp_code === 0) {
    productDetail.value = datas;
    breadcrumbList.value[1].text = datas.name;
  }
};
// 获取产品列表
const getProductDetailList = async () => {
  const { datas, resp_code }: any = await getProductDetailListApi({
    id: route.query.id,
  });
  if (resp_code === 0) {
    productDetailList.value = datas;
  }
};
// 跳转其他产品详情
const goProductDetail = (id: string) => {
  // 跳转当前页
  if (route.query.id === id) {
    return;
  }
  router.replace(`/searchProductDetail?id=${id}`);
  setTimeout(() => {
    router.go(0);
  }, 200);
};
getProductDetail();
getProductDetailList();
// 联系厂商
const onConnectCompany = (id: string) => {
  window.open(
    `${VITE_INDUSTRIALMAP_URL}/home?enterpriseId=${id}`,
    "externalWindow",
  );
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProductDetail-content {
  padding-top: 24px;
  width: 1152px;
  padding-bottom: 80px;
}
.es-searchProductDetail-content-top {
  width: 100%;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  @include flex(flex-start, space-between, nowrap);
}
.es-searchProductDetail-info-right {
  @include widthAndHeight(680px, 400px);
  position: relative;
}
.es-searchProductDetail-info-left__bigImg-box {
  @include widthAndHeight(400px, 400px);
  overflow: hidden;
  @include flex();
}
.es-searchProductDetail-info-left__bigImg {
  height: 400px;
  margin: 0 24px 0 0;
  object-fit: contain;
}
.es-searchProductDetail-info-right-title {
  @include textOverflow(2);
  margin-bottom: 4px;
}
.es-searchProductDetail-info-right-company {
  @include font(14px, 400, #244bf1, 22px);
}
.es-searchProductDetail-info-right-price {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-top: 24px;
  margin-bottom: 32px;
  span {
    @include font(24px, 600, #f75964, 32px);
    &::before {
      content: "￥";
      margin: 0 4px 0 8px;
      @include font(14px, 600, #f75964, 22px);
    }
  }
}
.es-searchProductDetail-info-right-common {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 20px);
  margin-bottom: 8px;
}
.es-searchProductDetail-info-right-connect {
  @include absolute(1, none, none, 0, 0);
}
.es-searchProductDetail-content-list {
  @include widthAndHeight(100%);
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
  h3 {
    margin-bottom: 16px;
  }
}
.es-searchProductDetail-content__item {
  @include widthAndHeight(208px, 342px);
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dbdce2;
  box-shadow: none;
  transition: all 0.3s;
  cursor: pointer;
  text-align: center;
  overflow: hidden;
  margin-right: 16px;
  position: relative;
  &:hover {
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  }
}
.es-searchProductDetail-item__icon {
  @include widthAndHeight(80px, 32px);
  @include absolute(1, 0, none, none, 0);
}
.es-searchProductDetail-item__logo-box {
  @include widthAndHeight(176px, 176px);
  @include flex();
  overflow: hidden;
  margin: 32px auto 16px;
}
.es-searchProductDetail-item__logo {
  height: 176px;
  object-fit: contain;
  margin-bottom: 16px;
}
.es-searchProductDetail-item__price {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-bottom: 16px;
  span {
    @include font(20px, 600, #f75964, 28px);
    &::before {
      content: "¥";
      margin: 0 2px 0 4px;
      @include font(14px, 600, #f75964, 22px);
    }
  }
}
.es-searchProductDetail-item__product {
  @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
  @include textOverflowOne();
  width: 176px;
  margin: 0 auto;
}
.es-searchProductDetail-item__company {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  @include textOverflowOne();
  width: 176px;
  margin: 0 auto;
}
</style>
