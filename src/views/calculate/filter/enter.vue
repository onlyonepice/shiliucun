<template>
  <div class="filter__top">
    <h1>工商业测算。</h1>
    <div class="filter__right">
      <el-button @click="onReset">重置</el-button>
      <el-button type="primary" @click="onAnalysis">开始分析</el-button>
    </div>
  </div>
  <div class="filter">
    <div class="filter__left">
      <h4 class="filter__title-margin">模式分析</h4>
      <div class="filter__patternAnalysis">
        <div
          class="filter__patternAnalysis-item"
          v-for="item in patternAnalysis"
          :key="item.id"
          @click="onPatternAnalysis(item.id)"
        >
          <img
            :src="
              filterData.patternAnalysis === item.id
                ? HasChoseRadio
                : NoChoseRadio
            "
            alt=""
          />
          <span v-text="item.text" />
        </div>
      </div>
      <!-- 用户参数 -->
      <div>
        <h4 class="filter__title-margin">用户参数</h4>
      </div>
      <div class="filter__content filter__content-half">
        <p class="filter__content-disabled" v-if="disabledUser" />
        <Select
          title="地区"
          :options="cityData"
          valueKey="regionName"
          :defaultValue="searchParams.regionName"
          width="100%"
          @onChange="
            ($event) => {
              onAreaChange($event, 'regionName');
            }
          "
        />
        <Select
          title="用电类型I"
          :options="electricityType1"
          valueKey="paramName"
          labelKey="paramDesc"
          width="100%"
          :defaultValue="searchParams.electricityTypeOneName"
          @onChange="
            ($event) => {
              onElectricityTypeOneName($event, 'electricityTypeOneName');
            }
          "
        />
        <Select
          title="用电类型II"
          :options="electricityType2"
          valueKey="paramName"
          labelKey="paramDesc"
          width="100%"
          :defaultValue="searchParams.electricityTypeTwoName"
          @onChange="
            ($event) => {
              onElectricityTypeTwoName($event, 'electricityTypeTwoName');
            }
          "
        />
        <Select
          title="电压等级"
          :options="voltageLevel"
          valueKey="paramName"
          labelKey="paramDesc"
          width="100%"
          :defaultValue="searchParams.tariffLevelId"
          @onChange="
            ($event) => {
              onChangeData($event, 'tariffLevelId');
            }
          "
        />
      </div>
      <div v-if="!disabledUser && tipsInfo.chargeDischargeStrategy">
        <p
          class="tips"
          v-if="
            searchParams.electricityTypeTwoName === 'BUSINESS_NDUSTRY' &&
            tipsInfo.chargeDischargeStrategy.BUSINESS_NDUSTRY !== null
          "
        >
          {{ tipsInfo.chargeDischargeStrategy.BUSINESS_NDUSTRY }}
        </p>
        <p
          class="tips"
          v-if="
            searchParams.electricityTypeTwoName ===
              'GENERAL_INDUSTRY_COMMERCE' &&
            tipsInfo.chargeDischargeStrategy.GENERAL_INDUSTRY_COMMERCE !== null
          "
        >
          {{ tipsInfo.chargeDischargeStrategy.GENERAL_INDUSTRY_COMMERCE }}
        </p>
        <p
          class="tips"
          v-if="
            searchParams.electricityTypeTwoName === 'LARGE_INDUSTRY' &&
            tipsInfo.chargeDischargeStrategy.LARGE_INDUSTRY !== null
          "
        >
          {{ tipsInfo.chargeDischargeStrategy.LARGE_INDUSTRY }}
        </p>
      </div>
      <!-- 产品参数 -->
      <h4 class="filter__title-margin filter__title-subsidy">产品参数</h4>
      <div>
        <p class="filter__content-disabled" v-if="disabledProduct" />
        <div class="filter__content">
          <Select
            title="选择产品"
            type="cascader"
            :options="productList"
            :cascaderOption="cascaderOption"
            @onChange="
              ($event) => {
                onChoseProduct($event, 'choseProduct');
              }
            "
            :defaultValue="searchParams.choseProduct"
          />
          <Select
            title="配置数量"
            type="input"
            inputText="台"
            :defaultValue="searchParams.number"
            @onChange="
              ($event) => {
                onChangeData($event, 'number');
              }
            "
          />
        </div>
        <div class="filter__content-product">
          <div class="filter__content-product__left">
            <Select
              title="系统单价"
              type="input"
              inputText="元/度"
              :defaultValue="searchParams.systemUnitPrice"
              width="100%"
              @onChange="
                ($event) => {
                  onChangeData($event, 'systemUnitPrice');
                }
              "
            />
            <Select
              title="系统容量"
              type="input"
              inputText="度"
              :defaultValue="searchParams.systemEnergyCapacity"
              width="100%"
              @onChange="
                ($event) => {
                  onChangeData($event, 'systemEnergyCapacity');
                }
              "
            />
            <Select
              title="系统综合效率"
              type="input"
              inputText="%"
              titleWidth="84px"
              :defaultValue="searchParams.systemEfficiency"
              width="100%"
              @onChange="
                ($event) => {
                  onChangeData($event, 'systemEfficiency');
                }
              "
            />
            <Select
              title="放电深度"
              type="input"
              inputText="度"
              :defaultValue="searchParams.dischargeDepth"
              width="100%"
              @onChange="
                ($event) => {
                  onChangeData($event, 'dischargeDepth');
                }
              "
            />
            <Select
              title="年衰减率"
              type="input"
              inputText="度"
              :defaultValue="searchParams.annualDecay"
              width="100%"
              @onChange="
                ($event) => {
                  onChangeData($event, 'annualDecay');
                }
              "
            />
            <Select
              title="年维护费用"
              type="input"
              inputText="度"
              :defaultValue="searchParams.annualMaintenance"
              width="100%"
              @onChange="
                ($event) => {
                  onChangeData($event, 'annualMaintenance');
                }
              "
            />
          </div>
          <!-- 下面需要筛选项都做完 -->
          <div class="product-desc">
            <p>产品图片</p>
            <div class="product-desc__info">
              <el-image
                class="product-desc__img"
                :src="useUserStore().fileUrl + searchParams.picture"
                fit="contain"
                alt=""
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><icon-picture /></el-icon>
                  </div>
                </template>
              </el-image>
              <div class="product-desc__info__btn">
                <div @click="onLinkTo()">联系企业</div>
                <div>产品入驻</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, defineEmits, onMounted } from "vue";
import NoChoseRadio from "@/assets/img/common/i-Report-radio-false.png";
import HasChoseRadio from "@/assets/img/common/i-Report-radio-true.png";
import { PATTERNANALYSIS, FILTERDATA } from "./data";
import { PatternAnalysis } from "./data";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
import { getToken } from "@/utils/auth";
import {
  apiAreaData,
  apiStrategy,
  apiElectricityType,
  apiProductList,
  apiProductDetail,
} from "@/api/investment";
const emit = defineEmits(["onAnalysis", "onReset"]);

const filterData: Ref<FILTERDATA> = ref({
  patternAnalysis: 0,
});
// 筛选项
const searchParams: Ref<any> = ref({
  regionName: "", // 地区
  electricityTypeOneName: "", // 用电类型1
  electricityTypeTwoName: "", // 用电类型2
  tariffLevelId: "", // 期望接入电压等级
  expectedCapacity: "", // 期望装配储能容量
  choseProduct: "", // 选择产品
  number: null, // 配置数量
  systemUnitPrice: "", // 系统单价
  systemEnergyCapacity: "", // 系统容量
  systemEfficiency: "", // 系统综合效率
  dischargeDepth: "", // 放电深度
  annualDecay: "", // 年衰减率
  annualMaintenance: "", // 年维护费用
  picture: "", // 产品图片
  chargeDischargeIdentifying: "",
});
const subsidyData = ref({
  subsidyAmount: "", // 补贴金额
  subsidyYear: "", // 补贴年限
});
// 筛选项后端需求多传无用字段
const searchParamsDefault: any = ref({});
const cityData = ref([]); // 地区数据
const tipsInfo: any = ref({}); // 提示文案
const electricityType1 = ref([]); // 用电类型1
const electricityType2 = ref([]); // 用电类型2
const voltageLevel = ref([]); // 接入电压等级
const productList = ref([]); // 产品列表
const cascaderOption: any = ref({
  value: "id",
  label: "name",
  children: "secondLevelRespList",
  expandTrigger: "hover",
});

const patternAnalysis: Ref<Array<PATTERNANALYSIS>> = ref(PatternAnalysis);

// 用户参数筛选项是否可以修改
const disabledUser: Ref<boolean> = ref(true);
// 产品参数筛选项是否可以修改
const disabledProduct: Ref<boolean> = ref(true);
// 筛选项都填完
const filterFinish: Ref<boolean> = ref(false);
// 选择模式分析
const onPatternAnalysis = (id: number) => {
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
  filterData.value.patternAnalysis = id;
  disabledUser.value = false;
};

onMounted(() => {
  getAreaData();
});

// 开始分析
const onAnalysis = () => {
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
  if (filterData.value.patternAnalysis === 0) {
    return ElMessage({ message: "请选择模式分析", type: "warning" });
  }
  if (searchParams.value.regionName === "") {
    return ElMessage({ message: "请选择地区", type: "warning" });
  }
  if (searchParams.value.choseProduct === "") {
    return ElMessage({ message: "请选择产品", type: "warning" });
  }
  let electricityTypeOneNameText = ""; // 用电类型1选中项的文案
  let electricityTypeTwoNameText = ""; // 用电类型2选中项的文案
  let tariffLevelIdText = ""; // 期待接入的电压等级的文案
  let choseProductText = ""; // 选择产品的文案
  electricityType1.value.forEach((item) => {
    item.paramName === searchParams.value.electricityTypeOneName &&
      (electricityTypeOneNameText = item.paramDesc);
  });
  electricityType2.value.forEach((item) => {
    item.paramName === searchParams.value.electricityTypeTwoName &&
      (electricityTypeTwoNameText = item.paramDesc);
  });
  voltageLevel.value.forEach((item) => {
    item.paramName === searchParams.value.tariffLevelId &&
      (tariffLevelIdText = item.paramDesc);
  });
  productList.value.forEach((item) => {
    item.paramName === searchParams.value.choseProduct &&
      (choseProductText = item.paramDesc);
  });
  filterFinish.value = true;
  // 需要深拷贝防止数据污染
  const _searchParams = JSON.parse(JSON.stringify(searchParams.value));
  const _filterData = JSON.parse(JSON.stringify(filterData.value));
  const _searchParamsDefault = JSON.parse(
    JSON.stringify(searchParamsDefault.value),
  );
  const _data = Object.assign(
    _searchParamsDefault,
    _filterData,
    _searchParams,
    {
      electricityTypeOneNameText,
      electricityTypeTwoNameText,
      tariffLevelIdText,
      choseProductText,
    },
  );
  Object.assign(_data, subsidyData.value);
  emit(
    "onAnalysis",
    _data,
    tipsInfo.value.chargeDischargeStrategy[
      searchParams.value.electricityTypeTwoName
    ],
  );
};

// 重置筛选项
const onReset = () => {
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
  filterData.value = {
    patternAnalysis: 0,
  };
  searchParams.value = {
    regionName: "", // 地区
    electricityTypeOneName: "", // 用电类型1
    electricityTypeTwoName: "", // 用电类型2
    tariffLevelId: "", // 期望接入电压等级
    expectedCapacity: "", // 期望装配储能容量
    choseProduct: "", // 选择产品
    number: 1, // 配置数量
    systemUnitPrice: "", // 系统单价

    chargeDischargeIdentifying: "",
  };
  disabledUser.value = true;
  disabledProduct.value = true;
  filterFinish.value = false;
  searchParamsDefault.value = {};
  emit("onReset");
};
// 链接跳转
const onLinkTo = () => {
  window.open(
    `${VITE_INDUSTRIALMAP_URL}/home?enterpriseId=${productList.value[0].id}`,
    "externalWindow",
  );
};
// 获取地区数据
async function getAreaData() {
  try {
    const res: any = await apiAreaData();
    cityData.value = res.datas;
  } catch (error) {
    console.error(error);
  }
}
// 获取产品列表
async function getProductList() {
  try {
    const res: any = await apiProductList();
    productList.value = res.datas;
  } catch (error) {
    console.error(error);
  }
}
// 地区筛选项改变
async function onAreaChange(data: string, type: string) {
  onChangeData(data, type);
  cityData.value.forEach((item) => {
    if (item.regionName === data) {
      electricityType1.value = item.reInvestmentElectricityType;
      searchParams.value.electricityTypeOneName =
        item.reInvestmentElectricityType[0].paramName;
    }
  });
  onGetElectricityInfo();
  disabledProduct.value = false;
  getProductList();
}
// 用电类型1改变
async function onElectricityTypeOneName(data: string, type: string) {
  onChangeData(data, type);
  onGetElectricityInfo();
}
// 用电类型2改变
async function onElectricityTypeTwoName(data: string, type: string) {
  onChangeData(data, type);
  electricityType2.value.forEach((item) => {
    if (item.paramDesc === data) {
      voltageLevel.value = item.voltageLevel;
    }
  });
}
// 获取用电类型与电压等级
async function onGetElectricityInfo() {
  try {
    const _data = {
      region: searchParams.value.regionName,
      electricityTypeOneName: searchParams.value.electricityTypeOneName,
      regionName: searchParams.value.regionName,
    };
    const res: any = await apiStrategy(_data);
    tipsInfo.value = res.datas;
    searchParams.value.chargeDischargeIdentifying =
      res.datas.chargeDischargeIdentifying;
    const res1: any = await apiElectricityType(_data);
    electricityType2.value = res1.datas;
    searchParams.value.electricityTypeTwoName = res1.datas[0].paramName;
    voltageLevel.value = res1.datas[0].voltageLevel;
    searchParams.value.tariffLevelId = res1.datas[0].voltageLevel[0].paramName;
  } catch (error) {
    console.error(error);
  }
}
// 选择产品修改
async function onChoseProduct(data: any, type: string) {
  onChangeData(data, type);
  let name = "";
  productList.value.forEach((item) => {
    item.secondLevelRespList.forEach((_item) => {
      if (_item.id === data[1]) {
        name = _item.secondLevelRespList[0].name;
      }
    });
  });
  const { datas, resp_code }: any = await apiProductDetail({
    id: data[1],
    name,
  });
  if (resp_code === 0) {
    searchParams.value.number = 1;
    searchParams.value.systemUnitPrice = datas.systemUnitPrice; // 系统单价
    searchParams.value.systemEnergyCapacity = datas.systemEnergyCapacity; // 系统容量
    searchParams.value.systemEfficiency = datas.systemEfficiency; // 系统综合效率
    searchParams.value.dischargeDepth = datas.dischargeDepth; // 放电深度
    searchParams.value.annualDecay = datas.annualDecay; // 年衰减率
    searchParams.value.annualMaintenance = datas.annualMaintenance; // 年维护费用
    searchParams.value.picture = datas.picture;
  }
}
// 改变值
async function onChangeData(data: string, type: string) {
  searchParams.value[type] = data;
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.filter {
  @include flex();
  @include relative();
  @include padding(0, 0, 24px, 0);
}
.filter__top {
  height: 44px;
  @include flex(center, space-between);
}

.filter__left {
  @include widthAndHeight(90%, 100%);
  @include padding(0, 24px, 0, 0);
  flex: 1;
}
.filter__right {
  @include flex();
  .filter__right-start {
    @include widthAndHeight(80px, 32px);
    @include font(14px, 400, #ffffff, 22px);
  }
  .filter__right-reset {
    @include widthAndHeight(80px, 32px);
    @include font(14px, 400, #5b6985, 22px);
  }
}

.filter__title {
  @include font(14px, 600, #5b6985, 22px);
}

.filter__title-margin {
  @include margin(24px, 0, 16px, 0);
}

.filter__title-subsidy {
  @include margin(8px, 0, 16px, 0);
}

.filter__content {
  @include flex(center, space-between);
  @include relative();
}

.filter__content-half {
  width: 48%;
  margin-right: 2%;
}

.filter__content-disabled {
  @include widthAndHeight(100%, 100%);
  @include absolute(2);
  cursor: no-drop;
}

.filter__patternAnalysis {
  @include flex(center, flex-start);
}

.filter-subsidy {
  @include margin(0, 0, 16px, 0);
}
.filter__patternAnalysis-item {
  @include flex(center, flex-start);
  @include margin(0, 16px, 0, 0);
  @include font(14px, 400, #5b6985, 22px);
  cursor: pointer;

  img {
    @include widthAndHeight(24px, 24px);
    @include margin(0, 4px, 0, 0);
  }
}

.tips {
  width: 48%;
  display: inline-block;
  @include font(12px, 400, #5b6985, 20px);
  @include relative();
  @include padding(6px, 26px, 6px, 26px);
  background: #eff4ff;
  border-radius: 4px;
  margin-bottom: 24px;

  &::before {
    content: "";
    @include widthAndHeight(16px, 16px);
    display: inline-block;
    background-image: url("@/assets/img/common/lament_icon.png");
    background-size: 16px 16px;
    background-repeat: no-repeat;
    @include margin(0, 2px, 0, 0);
    @include absolute(1, 8px, 0, 0, 8px);
  }
}

.product-desc {
  @include widthAndHeight(48%, 272px);
  @include flex(flex-start, flex-start, no-wrap);
  margin-top: 16px;
  p {
    width: 70px;
    @include margin(0, 16px, 0, 0);
    @include font(14px, 400, rgba(0, 0, 00.6), 22px);
    text-align: right;
  }
  .product-desc__img {
    @include widthAndHeight(224px, 224px);
    @include margin(0, 16px);
    background: #f2f3f5;
    border-radius: 8px;
  }
}
.filter__content-product {
  @include flex(flex-start, space-between);
  .filter__content-product__left {
    width: 48%;
  }
}
.product-desc__info__btn {
  @include flex(flex-start, flex-start);
  div {
    @include widthAndHeight(88px, 32px);
    border-radius: 4px;
    text-align: center;
    margin-top: 16px;
    cursor: pointer;
  }
  div:nth-of-type(1) {
    border: 1px solid #244bf1;
    @include font(14px, 400, #244bf1, 32px);
    margin-right: 8px;
  }
  div:nth-of-type(2) {
    border: 1px solid #dbdce2;
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 32px);
  }
}
</style>
