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
          :controls="item.controls"
          :precision="item.precision"
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
      <el-button
        type="primary"
        :class="ns.be('imageBox', 'btn')"
        @click="imgDialog = true"
        >点击切换</el-button
      >
      <img
        :src="
          'https://cdn.eesaenergy.com/mini-app/i-report/v1.0/' +
          choseImgSure.src
        "
        alt=""
      />
    </div>
  </div>
  <Dialog
    :visible="imgDialog"
    title="选择图表"
    :width="'560px'"
    @onHandleClose="onHandleClose"
  >
    <template #content>
      <div
        style="display: flex; justify-content: space-between; flex-wrap: wrap"
      >
        <div
          :class="[
            ns.be('image', 'list'),
            choseImg.src === item.src ? ns.bm('image', 'active') : '',
          ]"
          v-for="item in imgList"
          :key="item.chartId"
          @click="choseImg = item"
        >
          <img
            v-if="choseImg.src === item.src"
            :class="ns.b('image-icon')"
            :src="ImageChoseIcon"
            alt=""
          />
          <img
            :src="
              'https://cdn.eesaenergy.com/mini-app/i-report/v1.0/' + item.src
            "
            alt=""
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { stepOneBasics, stepOneElectricity } from "./index";
import ImageChoseIcon from "@/assets/img/common/image-chose-icon.png";
import { getRegionColorApi, getTechnologyType_V2Api } from "@/api/calculation";
import { useUserStore } from "@/store/modules/user";
import { useRoute } from "vue-router";
const route = useRoute();
const ns = useNamespace("liteStepOne");
const emit = defineEmits(["onNext"]);
const stepOneBasicsList: Ref<Array<any>> = ref(stepOneBasics);
const regionList: Ref<Array<any>> = ref([]); // 地区列表
const basicInfo: Ref<any> = ref({
  projectName: "",
  region: "",
  enterpriseName: "",
  annualElectricityConsumption: null,
  transformerCapacity: null,
  photovoltaicInstalledCapacity: null,
  electricityUsageType1: "",
  transformerInformation: 2,
  industry: "轻工业",
  chartId: null,
});
const props = defineProps({
  filterInfo: {
    type: Object,
    default: () => {},
  },
});
const formRef = ref(); // 表单
const imgList: Ref<Array<any>> = ref([]); // 图片列表
const choseImgSure: Ref<any> = ref({}); // 选中的图片
const choseImg: Ref<any> = ref({}); // 选中的图片
const imgDialog: Ref<boolean> = ref(false); // 图片弹窗
watch(
  () => basicInfo.value.industry,
  (val) => {
    stepOneElectricity.length &&
      stepOneElectricity.map((item) => {
        item.prop === "industry" &&
          item.options.map((_item) => {
            _item.label === val && (imgList.value = _item.list);
          });
      });
    choseImg.value = imgList.value[0];
    choseImgSure.value = imgList.value[0];
  },
  {
    immediate: true,
  },
);
watch(
  () => choseImgSure.value,
  (val) => {
    basicInfo.value.chartId = val.chartId;
  },
  { immediate: true },
);
watch(
  () => props.filterInfo,
  (val) => {
    if (route.query.id && val.id) {
      basicInfo.value = val;
      stepOneElectricity.map((item) => {
        item.prop === "industry" &&
          item.options.map((_item) => {
            _item.label === val.industry &&
              _item.list.map((__item) => {
                if (__item.chartId === val.chartId) {
                  choseImg.value = __item;
                  choseImgSure.value = __item;
                }
              });
          });
      });
    }
  },
  { immediate: true },
);
// 获取地区数据
async function getRegionColor() {
  const { datas, resp_code } = await getRegionColorApi();
  if (resp_code === 0) {
    regionList.value = datas;
    basicInfo.value.region = datas[0].regionName;
    basicInfo.value.electricityUsageType1 =
      datas[0].reInvestmentElectricityType[1].paramName;
    stepOneBasicsList.value.map((item) => {
      item.prop === "region" && (item.options = datas);
      item.prop === "electricityUsageType1" &&
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
  if (prop === "region") {
    _regionList.map((item) => {
      if (item.prop === "electricityUsageType1") {
        item.options = item.reInvestmentElectricityType;
        _basicInfo.electricityUsageType1 =
          item.reInvestmentElectricityType[0].paramName;
      }
    });
  }
  if (prop === "region" || prop === "electricityUsageType1") {
    getElectricityTypeTwo();
  }
  const _data = basicInfo.value;
  stepOneBasics.map((item) => {
    if (item.prop === "electricityUsageType1") {
      _data.typeOneName = item.options.filter(
        (v) => v.paramName === _data.electricityUsageType1,
      )[0].paramDesc;
    }
    if (item.prop === "electricityUsageType2") {
      _data.typeTwoName = item.options.filter(
        (v) => v.paramName === _data.electricityUsageType2,
      )[0].paramDesc;
    }
    if (item.prop === "voltageLevel") {
      _data.tariffLevelName = item.options.filter(
        (v) => v.paramName === _data.voltageLevel,
      )[0].paramDesc;
    }
  });
}
// 关闭弹窗
function onHandleClose(type: boolean) {
  imgDialog.value = false;
  if (type) {
    choseImgSure.value = choseImg.value;
  } else {
    choseImg.value = choseImgSure.value;
  }
}
// 获取用电类型2
async function getElectricityTypeTwo() {
  const { electricityUsageType1, region } = basicInfo.value;
  const { datas, resp_code } = await getTechnologyType_V2Api({
    electricityTypeOneName: electricityUsageType1,
    regionName: region,
  });
  if (resp_code === 0) {
    basicInfo.value.electricityUsageType2 = datas[0].paramName;
    basicInfo.value.voltageLevel = datas[0].voltageLevel[0].paramName;
    stepOneBasicsList.value.map((item) => {
      item.prop === "electricityUsageType2" && (item.options = datas);
      item.prop === "voltageLevel" && (item.options = datas[0].voltageLevel);
    });
  }
}

function handleNext() {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    } else {
      emit("onNext");
    }
  });
}

onMounted(() => {
  !route.query.id && getRegionColor();
  basicInfo.value.enterpriseName = useUserStore().userInfo.company;
});

// 暴露方法
defineExpose({ handleNext, basicInfo });
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
.es-liteStepOne-image__list {
  @include widthAndHeight(252px, 142px);
  @include flex(center, center, nowrap);
  border-radius: 4px;
  border: 1px solid #dbdce2;
  margin-bottom: 8px;
  cursor: pointer;
  @include relative();
  img {
    @include widthAndHeight(195px, 120px);
  }
  .es-liteStepOne-image-icon {
    @include widthAndHeight(24px, 24px);
    @include absolute(1, 0, 0, none, none);
  }
}
.es-liteStepOne-image--active {
  border: 1px solid #244bf1;
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
  .el-form-item__label {
    justify-content: flex-start;
  }
}
</style>
