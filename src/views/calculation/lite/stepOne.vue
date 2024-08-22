<template>
  <div>
    <h4 :class="ns.b('h4')">
      基本信息<span>请完善真实的企业项目信息，有利于最后生成完整报告</span>
    </h4>
    <el-form
      ref="formRef"
      :model="basicInfo"
      label-width="auto"
      :class="ns.b('form')"
    >
      <el-form-item
        v-for="item in stepOneBasicsList"
        :key="item.prop"
        :prop="item.prop"
        :rules="item.rules"
        :label="item.title"
      >
        <Select
          :type="item.type"
          :defaultValue="basicInfo[item.prop]"
          :inputText="item.inputText"
          :valueKey="item.valueKey ? item.valueKey : 'value'"
          :labelKey="item.labelKey ? item.labelKey : 'label'"
          width="100%"
          :options="item.options"
          @onChange="
            ($event) => {
              onAreaChange($event, item.prop);
            }
          "
        />
      </el-form-item>
      <h4 :class="ns.b('h4')">用电信息</h4>
      <el-form-item
        v-for="item in stepOneElectricity"
        :key="item.prop"
        :prop="item.prop"
        :rules="item.rules"
        :label="item.title"
      >
        <Select
          :type="item.type"
          :defaultValue="basicInfo[item.prop]"
          :inputText="item.inputText"
          width="100%"
          :options="item.options"
          :valueKey="item.valueKey ? item.valueKey : 'value'"
          :labelKey="item.labelKey ? item.labelKey : 'label'"
          @onChange="
            ($event) => {
              onAreaChange($event, item.prop);
            }
          "
        />
      </el-form-item>
    </el-form>
    <div :class="ns.b('imageBox')">
      <el-button type="primary" :class="ns.be('imageBox', 'btn')"
        >点击切换</el-button
      >
      <img src="" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted } from "vue";
import useNamespace from "@/utils/nameSpace";
import { stepOneBasics, stepOneElectricity } from "./index";
import { getRegionColorApi, getTechnologyType_V2Api } from "@/api/calculation";
const ns = useNamespace("liteStepOne");
const stepOneBasicsList: Ref<Array<any>> = ref(stepOneBasics);
const regionList: Ref<Array<any>> = ref([]); // 地区列表
const basicInfo: Ref<any> = ref({
  projectName: "",
  regionName: "",
  electricityTypeOneName: "",
  transformerInformation: 2,
  industry: "轻工业",
});
// 获取地区数据
async function getRegionColor() {
  const { datas, resp_code } = await getRegionColorApi();
  if (resp_code === 0) {
    regionList.value = datas;
    basicInfo.value.regionName = datas[0].regionName;
    basicInfo.value.electricityTypeOneName =
      datas[0].reInvestmentElectricityType[0].paramName;
    stepOneBasicsList.value.map((item) => {
      item.prop === "regionName" && (item.options = datas);
      item.prop === "electricityTypeOneName" &&
        (item.options = datas[0].reInvestmentElectricityType);
    });
    getElectricityTypeTwo();
  }
}
// 修改地区，获取用电类型1
function onAreaChange(val: any, prop: string) {
  const _basicInfo = basicInfo.value;
  const _regionList = regionList.value;
  _basicInfo[prop] = val;
  if (prop === "regionName") {
    _regionList.map((item) => {
      if (item.prop === "electricityTypeOneName") {
        item.options = item.reInvestmentElectricityType;
        _basicInfo.electricityTypeOneName =
          item.reInvestmentElectricityType[0].paramName;
      }
    });
    getElectricityTypeTwo();
  }
}
// 获取用电类型2
async function getElectricityTypeTwo() {
  const { electricityTypeOneName, regionName } = basicInfo.value;
  const { datas, resp_code } = await getTechnologyType_V2Api({
    electricityTypeOneName,
    regionName,
  });
  if (resp_code === 0) {
    basicInfo.value.electricityTypeTwoName = datas[0].paramName;
    basicInfo.value.tariffLevelId = datas[0].voltageLevel[0].paramName;
    stepOneBasicsList.value.map((item) => {
      item.prop === "electricityTypeTwoName" && (item.options = datas);
      item.prop === "tariffLevelId" && (item.options = datas[0].voltageLevel);
    });
  }
}

onMounted(() => {
  getRegionColor();
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-liteStepOne-h4 {
  width: 100%;
  margin-bottom: 20px;
  margin: 25px 0 20px;
  span {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-left: 8px;
  }
}
.es-liteStepOne-form {
  width: 100%;
  @include flex(flex-start, space-between, wrap);
}
.es-liteStepOne-filter {
  @include flex(center, space-between, wrap);
}
.es-liteStepOne-filter__item {
  @include flex(center, flex-start, nowrap);
  margin-bottom: 16px;
  span {
    width: 70px;
    margin-right: 16px;
  }
  span[required]::before {
    content: "*"; /* 添加一个星号作为标识符 */
    color: red; /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
  span[required="false"]::before {
    content: "";
    width: 5px;
    display: inline-block;
    margin-right: 4px;
  }
  &:nth-of-type(2n) {
    span {
      margin-left: 24px;
    }
  }
}
.es-liteStepOne-imageBox {
  @include widthAndHeight(564px, 317px);
  background: rgba(255, 255, 255, 0);
  border-radius: 4px;
  border: 1px solid #244bf1;
  position: relative;
  @include flex(center, center, nowrap);
  img {
    @include widthAndHeight(433px, 266px);
  }
}
.es-liteStepOne-imageBox__btn {
  @include absolute(1, 0, 0, none, none);
}
</style>
<style lang="scss">
.es-liteStepOne-imageBox {
  button {
    border-radius: 0;
  }
}
.es-liteStepOne-form {
  .el-form-item {
    width: 48%;
  }
}
</style>
