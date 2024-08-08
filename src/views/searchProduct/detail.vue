<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']" v-if="productDetail.id">
      <div :class="[ns.b('content-top')]">
        <div :class="[ns.b('content-top-title')]">
          <div :class="[ns.be('info-left', 'bigImg-box')]">
            <img
              v-if="productDetail.image && productDetail.image.length !== 0"
              :class="[ns.be('info-left', 'bigImg')]"
              :src="useUserStoreHook().$state.fileUrl + productDetail.image[0]"
              alt=""
            />
            <EmptyProduct v-else size="120px" />
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
      </div>
      <div :class="[ns.b('content-top')]" style="margin-top: 24px">
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
              type="index"
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
                    v-if="route.query.productType === 'ENERGY_STORAGE_INVERTER'"
                    :style="{
                      'text-align': 'right',
                      color: 'rgba(0, 0, 0, 0.9)',
                      'font-weight':
                        scope.$index === 1 ||
                        scope.$index === 4 ||
                        scope.$index === 9
                          ? 600
                          : 400,
                    }"
                  >
                    {{ scope.row.name }}
                  </p>
                  <p
                    v-if="route.query.productType === 'ELECTRIC_CORE'"
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
                v-for="item in tableData[0].info.length"
                :key="item"
                :prop="'info' + item"
                label=""
                :width="
                  943 / tableData[0].info.length < 300
                    ? 300
                    : 943 / tableData[0].info.length
                "
              >
                <template #default="scope">
                  <detailTable
                    :index="scope.$index"
                    :info="scope.row.info[item - 1] || {}"
                    :productType="route.query.productType"
                  />
                  <div>{{ scope.$rowIndex }}</div>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <DetailCompany :companyInfo="companyInfo" />
          </template>
          <img
            v-for="item in productDetail.productIntroductionFile"
            :key="item"
            :src="useUserStore().fileUrl + item"
            :class="ns.b('productIntroductionFile')"
          />
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
            <div :class="[ns.be('item', 'logo-box')]">
              <img
                v-if="item.image.length > 0"
                :class="[ns.be('item', 'logo')]"
                :src="useUserStoreHook().$state.fileUrl + item.image[0]"
                alt=""
              />
              <EmptyProduct v-else size="120px" />
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
import { useUserStore } from "@/store/modules/user";
import { useRoute, useRouter } from "vue-router";
import detailTable from "./components/detailTable.vue";
import DetailCompany from "./components/detailCompany.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { cloneDeep } from "lodash";
import { getEnterpriseDetailApi } from "@/api/searchProduct";
import { ElMessage } from "element-plus";
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
const tabNameList2En = ref([
  "modelName",
  "shapeName",
  "batteryCapacity",
  "chargeDischargeRate",
  "energyDensity",
  "cycleLife",
  "size",
  "productPrice",
]);
const tabNameList3 = ref([
  "产品型号",
  "直流侧参数",
  "直流电压范围",
  "最大直流电流/A",
  "交流侧参数",
  "额定输出功率/kW",
  "额定交流电压/V",
  "额定交流电流/A",
  "额定交流频率",
  "系统参数",
  "最大效率/%",
  "工作温度范围",
  "相对湿度范围",
  "海拔高度",
  "冷却方式",
  "尺寸（W*H*D）/mm",
  "重量/kg",
  "产品单价/元/台",
]);
const tabNameList3En = ref([
  "modelName",
  "a",
  "dcVoltageRange",
  "maximumDirectCurrent",
  "b",
  "ratedOutputPower",
  "ratedACVoltage",
  "ratedAlternatingCurrent",
  "ratedACFrequency",
  "c",
  "maximumEfficiency",
  "operatingTemperatureRange",
  "relativeHumidityRange",
  "altitude",
  "coolingMethod",
  "size",
  "weight",
  "productPrice",
]);
const tableData: Ref<any> = ref([]);
const route = useRoute();
const productDetail: Ref<any> = ref({}); // 产品详情
const productDetailList: Ref<any> = ref({});
const productDetailInfo = computed(() => {
  const _productType = route.query.productType;
  const _data = [];
  if (_productType === "INDUSTRY_ENERGY_STORAGE") {
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
  } else if (_productType === "ENERGY_STORAGE_INVERTER") {
    _data.push(
      {
        label: "直流电压范围：",
        value:
          productDetail.value.models[0].dcVoltageRange.length === 0
            ? "-"
            : productDetail.value.models[0].dcVoltageRange[0] +
              "-" +
              productDetail.value.models[0].dcVoltageRange[1] +
              "v",
      },
      {
        label: "最大直流电流：",
        value: productDetail.value.models[0].maximumDirectCurrent
          ? productDetail.value.models[0].maximumDirectCurrent + "A"
          : "-",
      },
      {
        label: "额定功率：",
        value: productDetail.value.models[0].ratedOutputPower
          ? productDetail.value.models[0].ratedOutputPower + "kW"
          : "-",
      },
      {
        label: "额定交流电压：",
        value: productDetail.value.models[0].ratedACVoltage
          ? productDetail.value.models[0].ratedACVoltage + "V"
          : "-",
      },
      {
        label: "最大效率：",
        value: productDetail.value.models[0].maximumEfficiency
          ? productDetail.value.models[0].maximumEfficiency + "%"
          : "-",
      },
      {
        label: "频率：",
        value: productDetail.value.models[0].ratedACFrequency
          ? productDetail.value.models[0].ratedACFrequency
          : "-",
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
    datas === null && (tabsList.value = [{ id: 0, name: "产品参数" }]);
  }
};
// 寻找出相同的key
function generateComparisonMatrix(data) {
  if (data.length === 0) return [];

  const keys = Object.keys(data[0]);
  const matrix = [];

  keys.forEach((key) => {
    const valueOccurrences = {};
    const row = new Array(data.length).fill(0);

    // Collect occurrences of each value
    data.forEach((item, index) => {
      const value = item[key];
      if (!valueOccurrences[value]) {
        valueOccurrences[value] = [];
      }
      valueOccurrences[value].push(index);
    });

    // Populate the result row based on occurrences
    Object.values(valueOccurrences).forEach((indices) => {
      indices.forEach((index, i) => {
        if (i === 0) {
          row[index] = indices.length;
        } else {
          row[index] = 0;
        }
      });
    });

    matrix.push(row);
  });

  return matrix;
}
// 合并单元格
/* eslint-disable */
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (route.query.productType === "INDUSTRY_ENERGY_STORAGE") {
    if (rowIndex === 1 || rowIndex === 5 || rowIndex === 8) {
      if (columnIndex === 1) {
        return [1, productDetail.value.models.length]; // 合并第一行第二列和第三列单元格
      } else if (columnIndex === 2) {
        return [0, 0]; // 被合并的单元格设置为[0, 0]
      }
    }
  }
  const _list = [];
  productDetail.value.models.map((item) => {
    var _data = {};
    const _value =
      route.query.productType === "INDUSTRY_ENERGY_STORAGE"
        ? tabNameListEn.value
        : route.query.productType === "ENERGY_STORAGE_INVERTER"
          ? tabNameList3En.value
          : tabNameList2En.value;
    _value.map((_item) => {
      _data[_item] = item[_item] || "";
    });
    _list.push(_data);
  });
  if (columnIndex > 0) {
    return {
      rowspan: 1,
      colspan: generateComparisonMatrix(_list)[rowIndex][columnIndex - 1],
    };
  }
};
// 获取产品详情
const getProductDetail = async () => {
  const { datas, resp_code }: any = await getProductDetailApi({
    id: route.query.id,
    productType: route.query.productType,
  });
  if (resp_code === 0) {
    const _productType = route.query.productType;
    getCompanyInfo(datas.enterpriseId);
    if (
      _productType === "INDUSTRY_ENERGY_STORAGE" ||
      _productType === "ENERGY_STORAGE_INVERTER"
    ) {
      const collator = new Intl.Collator("zh-CN", { sensitivity: "base" });
      datas.models.map((item) => {
        item.coolingMethodName = item.coolingMethodName.sort(collator.compare);
      });
    }
    productDetail.value = datas;
    productDetail.value.image === null &&
      (productDetail.value.image =
        datas.models[0].image && datas.models[0].image.length > 0
          ? [datas.models[0].image[0]]
          : null);
    breadcrumbList.value[1].text = datas.name;

    const _length =
      _productType === "INDUSTRY_ENERGY_STORAGE"
        ? 15
        : _productType === "ENERGY_STORAGE_INVERTER"
          ? 18
          : 8;
    const _value =
      _productType === "INDUSTRY_ENERGY_STORAGE"
        ? tabNameList.value
        : _productType === "ENERGY_STORAGE_INVERTER"
          ? tabNameList3.value
          : tabNameList2.value;
    for (let index = 0; index < _length; index++) {
      tableData.value.push({
        name: _value[index],
        info: cloneDeep(datas.models),
      });
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
  id === null && ElMessage.warning("该企业暂未入驻");
  id &&
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
  margin-left: 24px;
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
.es-searchProductDetail-productIntroductionFile {
  width: 100%;
  height: auto;
  &:nth-of-type(1) {
    margin-top: 24px;
  }
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
  .el-table__body {
    .el-table__row {
      td {
        text-align: center;
      }
      td[colspan="1"] {
        div {
          text-align: left;
        }
        p {
          text-align: left;
        }
      }
    }
  }
}
</style>
