<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']" v-if="productDetail.id">
      <div :class="[ns.b('content-top')]">
        <div :class="[ns.b('content-top-title')]">
          <div :class="[ns.be('info-left', 'bigImg-box')]">
            <img
              :class="[ns.be('info-left', 'bigImg')]"
              v-if="productDetail.image"
              :src="useUserStoreHook().$state.fileUrl + productDetail.image[0]"
              alt=""
            />
          </div>
          <div :class="[ns.b('info-right')]">
            <h3 :class="[ns.b('info-right-title')]">
              {{ productDetail.name }}
            </h3>
            <p
              :class="[ns.b('info-right-company')]"
              @click="onConnectCompany(productDetail.enterpriseId)"
            >
              {{ productDetail.enterprise }}
            </p>
            <div :class="[ns.b('info-right-price')]">
              <p v-if="productDetail.price">
                参考价<span>{{ productDetail.price || "-" }}/kWh起</span>
              </p>
            </div>
            <template v-if="productDetail.models">
              <p
                :class="[ns.b('info-right-common')]"
                v-for="item in productDetailInfo"
                :key="item.label"
              >
                {{ item.label }}{{ item.value }}
              </p>
              <div
                :class="[ns.b('info-right-common')]"
                v-if="productDetail.specificationDocumentFile"
              >
                产品说明书/产品文档：
                <div>
                  <div
                    v-for="item in productDetail.specificationDocumentFile"
                    :key="item"
                  >
                    {{ item.name }}
                    <el-link
                      type="primary"
                      :href="useUserStoreHook().$state.fileUrl + item.path"
                      :download="item.name"
                      :underline="false"
                      style="margin-left: 8px; color: #244bf1"
                      >下载</el-link
                    >
                  </div>
                </div>
              </div>
            </template>
            <div :class="[ns.b('info-right-connect')]">
              <el-button
                type="primary"
                @click="onConnectCompany(productDetail.enterpriseId)"
                >联系厂商</el-button
              >
              <el-button @click="productConnectVisible = true"
                >修改信息</el-button
              >
            </div>
          </div>
        </div>
        <!-- 产品参数 -->
        <div :class="[ns.b('content-detail')]">
          <h3>产品参数</h3>
          <Tabs
            :tabsList="tabsList"
            @onHandleClick="onHandleClick"
            :defaultId="choseTabs"
          />
          <template v-if="choseTabs === 0">
            <el-table
              :data="tableData"
              style="width: 100%"
              :border="true"
              :span-method="arraySpanMethod"
            >
              <el-table-column fixed prop="name" label="" width="160">
                <template #default="scope">
                  <p
                    v-if="route.query.productType === 'INDUSTRY_ENERGY_STORAGE'"
                    :style="{
                      'text-align': 'right',
                      color: 'rgba(0, 0, 0, 0.9)',
                      'font-weight':
                        scope.$index === 1 ||
                        scope.$index === 5 ||
                        scope.$index === 8
                          ? 600
                          : 400,
                    }"
                  >
                    {{ scope.row.name }}
                  </p>
                  <p
                    v-else
                    style="
                      text-align: right;
                      color: &quot;rgba(0, 0, 0, 0.9)&quot;;
                    "
                  >
                    {{ scope.row.name }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="info1"
                v-for="item in tableData[0].info.length"
                :key="item"
                label=""
                :width="
                  943 / tableData[0].info.length < 300
                    ? 300
                    : 943 / tableData[0].info.length
                "
              >
                <template #default="scope">
                  <detailTable
                    v-if="scope.row.info[item - 1]"
                    :index="scope.$index"
                    :info="scope.row.info[item - 1] || {}"
                    :productType="route.query.productType"
                    :merge="findCommonValueKeys(...productDetail.models)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <DetailCompany :companyInfo="companyInfo" />
          </template>
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
              v-if="item.logoUrl"
              :class="[ns.be('item', 'icon')]"
              :src="useUserStoreHook().$state.fileUrl + item.logoUrl"
              alt=""
            />
            <div
              :class="[ns.be('item', 'logo-box')]"
              v-if="item.image.length > 0"
            >
              <img
                :class="[ns.be('item', 'logo')]"
                :src="useUserStoreHook().$state.fileUrl + item.image[0]"
                alt=""
              />
            </div>
            <div :class="[ns.be('item', 'price')]" v-if="item.price">
              <p>
                参考价<span>{{ item.price }}/kWh起</span>
              </p>
            </div>
            <p :class="[ns.be('item', 'product')]">{{ item.name }}</p>
            <p :class="[ns.be('item', 'company')]">{{ item.enterprise }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ProductConnect
    :visible="productConnectVisible"
    @onHandleClose="productConnectVisible = false"
  />
</template>

<script lang="ts" setup>
import { Ref, ref, computed } from "vue";
import useNamespace from "@/utils/nameSpace";
import {
  getProductDetailApi,
  getProductDetailListApi,
} from "@/api/searchProduct";
import { useRoute, useRouter } from "vue-router";
import detailTable from "./components/detailTable.vue";
import DetailCompany from "./components/detailCompany.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { cloneDeep } from "lodash";
import { getEnterpriseDetailApi } from "@/api/searchProduct";
const companyInfo: Ref<any> = ref({}); // 获取企业信息
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
const productConnectVisible: Ref<boolean> = ref(false); // 修改企业弹窗
const router = useRouter();
const ns = useNamespace("searchProductDetail");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "查产品", path: "/searchProduct" },
  { text: "", path: "" },
]);
const choseTabs: Ref<number> = ref(0); // 默认选中tab
const tabsList: Ref<Array<any>> = ref([
  { id: 0, name: "产品参数" },
  { id: 1, name: "企业信息" },
]);
const tabNameList = ref([
  "产品型号",
  "电池参数",
  "电芯类型",
  "电池系统能量/kWh",
  "放电深度/%",
  "PCS参数",
  "标称电压/V",
  "额定功率/kW",
  "系统参数",
  "产品形态",
  "系统综合效率/%",
  "年衰减率/%",
  "冷却方式",
  "尺寸/m*m*m",
  "产品单价/元/kWh",
]);
const tabNameListEn = ref([
  "modelName",
  "a",
  "batteryTypeName",
  "batterySystemEnergy",
  "dischargeDepth",
  "b",
  "nominalVoltage",
  "ratedPower",
  "c",
  "productFormName",
  "systemOverallEfficiency",
  "annualDecayRate",
  "coolingMethodName",
  "size",
  "energyStorageSystemProductUnitPrice",
]);
const tabNameList2 = ref([
  "产品型号",
  "形态",
  "容量/Ah",
  "充/放电倍率",
  "能量密度",
  "循环寿命",
  "尺寸",
  "产品单价（元/Wh）",
]);
const tableData: Ref<any> = ref([]);
const route = useRoute();
const productDetail: Ref<any> = ref({}); // 产品详情
const productDetailList: Ref<any> = ref({});
const productDetailInfo = computed(() => {
  const _data = [];
  if (route.query.productType === "INDUSTRY_ENERGY_STORAGE") {
    _data.push(
      {
        label: "额定功率：",
        value: productDetail.value.models[0].ratedPower + "kW" || "-",
      },
      {
        label: "电池系统能量：",
        value: productDetail.value.models[0].batterySystemEnergy
          ? productDetail.value.models[0].batterySystemEnergy + "kWh"
          : "-",
      },
      {
        label: "系统综合效率：",
        value: productDetail.value.models[0].systemOverallEfficiency
          ? productDetail.value.models[0].systemOverallEfficiency + "%"
          : "-",
      },
      {
        label: "冷却方式：",
        value:
          productDetail.value.models[0].coolingMethodName.join("，") || "-",
      },
    );
  } else {
    _data.push(
      {
        label: "形态：",
        value: productDetail.value.models[0].shapeName
          ? productDetail.value.models[0].shapeName
          : "-",
      },
      {
        label: "能量密度：",
        value: productDetail.value.models[0].energyDensity
          ? productDetail.value.models[0].energyDensity
          : "-",
      },
      {
        label: "容量：",
        value: productDetail.value.models[0].batteryCapacity
          ? productDetail.value.models[0].batteryCapacity + "Ah"
          : "-",
      },
      {
        label: "循环寿命：",
        value: productDetail.value.models[0].cycleLife
          ? productDetail.value.models[0].cycleLife
          : "-",
      },
    );
  }
  return _data;
});
const onHandleClick = (id: number) => {
  choseTabs.value = id;
};
const getCompanyInfo = async (id: string) => {
  const { datas, resp_code }: any = await getEnterpriseDetailApi({
    id,
    isVagueSearch: false,
  });
  if (resp_code === 0) {
    companyInfo.value = datas;
  }
};
// 寻找出相同的key
function findCommonValueKeys(...arrays) {
  if (arrays.length === 0) return [];

  // Function to filter out invalid values
  const isValidValue = (value) =>
    value !== null &&
    value !== undefined &&
    value !== "" &&
    !(Array.isArray(value) && value.length === 0);

  // Initialize an object to track common keys and their values
  const commonKeys = {};

  // Get keys from the first object as a base for comparison
  const keys = Object.keys(arrays[0]);

  // Initialize commonKeys with all keys from the first object
  keys.forEach((key) => {
    if (isValidValue(arrays[0][key])) {
      commonKeys[key] = arrays[0][key];
    }
  });

  // Compare each array with the first one
  for (let i = 1; i < arrays.length; i++) {
    const currentObj = arrays[i];
    keys.forEach((key) => {
      if (commonKeys[key] !== undefined && !isValidValue(currentObj[key])) {
        commonKeys[key] = undefined;
      } else if (
        commonKeys[key] !== undefined &&
        commonKeys[key] !== currentObj[key]
      ) {
        commonKeys[key] = undefined;
      }
    });
  }

  // Filter out keys that are not common
  return Object.keys(commonKeys).filter((key) => commonKeys[key] !== undefined);
}
// 合并单元格
/* eslint-disable */
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (route.query.productType === "INDUSTRY_ENERGY_STORAGE") {
    if (rowIndex === 1 || rowIndex === 5 || rowIndex === 8) {
      // if (columnIndex === 1) {
      //   return [1, productDetail.value.models.length]; // 合并第一行第二列和第三列单元格
      // } else if (columnIndex === 2) {
      //   return [0, 0]; // 被合并的单元格设置为[0, 0]
      // }
    } else {
      let _columnIndex = [];
      // for (const key in productDetail.value.models[0]) {

      // }
      tabNameListEn.value.map((item, index) => {
        const _itemIndex = new Array(productDetail.value.models.length).fill(0);
        for (
          let _index = 0;
          _index < productDetail.value.models.length - 1;
          _index++
        ) {
          if (
            JSON.stringify(productDetail.value.models[_index][item]) ===
            JSON.stringify(productDetail.value.models[_index + 1][item])
          ) {
            index !== 1 &&
              index !== 5 &&
              index !== 8 &&
              (_itemIndex[_index] = _itemIndex[_index] + 1);
          }
        }
        _columnIndex.push(_itemIndex);
      });
      const _list = [];
      productDetail.value.models.map((item) => {
        var _data = {};
        tabNameListEn.value.map((_item) => {
          _data[_item] = item[_item] || "";
        });
        _list.push(_data);
      });
      console.log(compareObjectsByKeys(_list));
      // const _columnIndex = [];
      // tabNameListEn.value.map((item, index) => {
      //   findCommonValueKeys(...productDetail.value.models).map((_item) => {
      //     if (item === _item) {
      //       _columnIndex.push(index);
      //     }
      //   });
      // });
      // if (!_columnIndex.indexOf(rowIndex)) {
      //   if (columnIndex === 1) {
      //     return [1, productDetail.value.models.length]; // 合并第一行第二列和第三列单元格
      //   } else if (columnIndex === 2) {
      //     return [0, 0]; // 被合并的单元格设置为[0, 0]
      //   }
      // }
      if (columnIndex === 1) {
        return {
          rowspan: 1,
          colspan: _columnIndex[rowIndex][0] + 1,
        }; // 合并第一行第二列和第三列单元格
      }
      if (columnIndex === 2) {
        return {
          rowspan: 1,
          colspan: 1,
        }; // 被合并的单元格设置为[0, 0]
      }
    }
  }
};
function compareObjectsByKeys(arr) {
  // 获取对象中所有键的列表（假设所有对象的键相同）
  const keys = Object.keys(arr[0]);
  const keyCount = keys.length;
  const objCount = arr.length;

  // 初始化一个二维数组，每个子数组的大小为对象的数量，初始值为0
  const result = Array.from({ length: keyCount }, () =>
    Array(objCount).fill(0),
  );

  // 外层循环：遍历对象数组中的每个对象
  for (let i = 1; i < objCount; i++) {
    // 内层循环：遍历每个对象的每个键
    for (let j = 0; j < keyCount; j++) {
      const key = keys[j];
      for (let k = 0; k < i; k++) {
        // 如果当前对象的键值与之前某个对象的键值相同
        if (arr[i][key] === arr[k][key]) {
          result[j][i - 1]++;
        }
      }
    }
  }

  return result;
}

// arraySpanMethod({});
// 获取产品详情
const getProductDetail = async () => {
  const { datas, resp_code }: any = await getProductDetailApi({
    id: route.query.id,
    productType: route.query.productType,
  });
  if (resp_code === 0) {
    getCompanyInfo(datas.enterpriseId);
    productDetail.value = datas;
    breadcrumbList.value[1].text = datas.name;
    if (route.query.productType === "INDUSTRY_ENERGY_STORAGE") {
      for (let index = 0; index < 15; index++) {
        tableData.value.push({
          name: tabNameList.value[index],
          info: cloneDeep(datas.models),
        });
      }
    } else {
      productDetail.value.image = datas.models[0].image || "";
      for (let index = 0; index < 8; index++) {
        tableData.value.push({
          name: tabNameList2.value[index],
          info: cloneDeep(datas.models),
        });
      }
    }
  }
};
// 获取产品列表
const getProductDetailList = async () => {
  const { datas, resp_code }: any = await getProductDetailListApi({
    id: route.query.id,
    productType: route.query.productType,
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
  router.replace(
    `/searchProductDetail?id=${id}&productType=${route.query.productType}`,
  );
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
}
.es-searchProductDetail-content-top-title {
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
  cursor: pointer;
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
  @include flex(flex-start, flex-start, wrap);
  span {
    @include font(12px, 400, #244bf1, 20px);
    cursor: pointer;
  }
  a {
    text-decoration: none;
  }
}
.es-searchProductDetail-info-right-connect {
  @include absolute(1, none, none, 0, 0);
}
.es-searchProductDetail-content-detail {
  h3 {
    margin-top: 32px;
    margin-bottom: 17px;
  }
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
  height: 28px;
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
<style lang="scss">
@import "@/style/mixin.scss";
.es-searchProductDetail {
  .el-table__header-wrapper {
    height: 0;
  }
  .el-table .el-table__cell {
    padding: 0;
    height: auto !important;
    padding: 9px 15px 7px 15px;
  }
  .el-table .cell {
    padding: 0;
  }
  .el-table__row td:nth-of-type(1) {
    background: #f2f3f5;
    text-align: right;
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    border-right: none !important;
  }
}
</style>
