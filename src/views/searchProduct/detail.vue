<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']">
      <div :class="[ns.b('content-left')]">
        <div :class="[ns.be('content-left', 'info')]">
          <img :class="[ns.be('info-left', 'bigImg')]" src="" alt="" />
          <div :class="[ns.b('info-right')]">
            <h3 :class="[ns.b('info-right-title')]">
              {{ productDetail.name }}
            </h3>
            <p :class="[ns.b('info-right-company')]">
              {{ productDetail.enterprise }}
            </p>
          </div>
        </div>
      </div>
      <div :class="[ns.b('content-right')]">
        <h3>公司其他产品</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getProductDetailApi } from "@/api/searchProduct";
import { useRoute } from "vue-router";
const ns = useNamespace("searchProductDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "查产品", path: "/searchProduct" },
  { text: "", path: "" },
]);
const route = useRoute();
const productDetail: Ref<any> = ref({}); // 产品详情

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
getProductDetail();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProductDetail-content {
  @include flex(flex-start, center, nowrap);
  padding-top: 24px;
}
.es-searchProductDetail-content-left {
  width: 858px;
  margin-right: 24px;
}
.es-searchProductDetail-content-right {
  width: 270px;
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  h3 {
    margin-bottom: 16px;
  }
}
.es-searchProductDetail-content-left__info {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  @include flex(flex-start, center, nowrap);
}
.es-searchProductDetail-info-right {
  width: 418px;
}
.es-searchProductDetail-info-left__bigImg {
  @include widthAndHeight(368px, 368px);
  margin: 0 24px 8px 0;
}
.es-searchProductDetail-info-left__list {
  @include widthAndHeight(86px, 86px);
  background: rgba(255, 255, 255, 0);
  border-radius: 4px;
  border: 1px solid #dbdce2;
  margin-right: 8px;
  &:nth-of-type(4n) {
    margin-right: 0;
  }
}
.es-searchProductDetail-info-right-title {
  @include textOverflow(2);
  margin-bottom: 4px;
}
.es-searchProductDetail-info-right-company {
  @include font(14px, 400, #244bf1, 22px);
}
</style>
