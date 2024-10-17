<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('content')">
      <Loading v-if="loading" />
      <div :class="ns.e('tab-list')">
        <template v-for="(item, index) in tabs" :key="item.value">
          <template v-if="item.show">
            <div :class="ns.e('tab-item')">
              <div
                :class="[
                  ns.e('tab-item-line'),
                  item.value === tabVal ? ns.e('tab-item-line-active') : '',
                ]"
              >
                <p v-if="tabVal <= item.value">
                  {{ item.value }}
                </p>
                <img
                  v-else
                  src="@/assets/img/searchProduct/success.png"
                  alt=""
                />
              </div>
              <span>{{ item.title }}</span>
            </div>
            <div
              v-if="index < tabs.length - 1 && tabs[index + 1].show"
              :class="ns.e('tab-list-line')"
            />
          </template>
        </template>
      </div>
      <div :class="ns.b('settlement')" v-if="!companyInfo || !companyInfo.id">
        <h4>请优先完成企业入驻</h4>
        <el-button type="primary" @click="onCompanySettlement()"
          >企业入驻</el-button
        >
      </div>
      <div :class="ns.b('hasSettlement')" v-else>
        <div>
          <p>企业：</p>
          <h4>{{ companyInfo.nameCn }}</h4>
        </div>
        <template
          v-if="
            tabVal === 2 &&
            form.productType === 'OTHERS' &&
            form.productTypeContent
          "
        >
          <div>
            <p>产品分类：</p>
            <h4>{{ form.productTypeContent.join(" / ") }}</h4>
          </div>
        </template>
        <template v-else>
          <div>
            <p>产业链环节：</p>
            <h4>{{ companyInfo.mainBusiness }}</h4>
          </div>
        </template>
      </div>
      <div :class="ns.b('form')">
        <Step1
          v-show="tabVal === 1"
          :draftData="draftData"
          :typeList="typeList"
          :disabled="!companyInfo || !companyInfo.id"
          @next="handleNext"
        />
        <Step2
          v-show="tabVal === 2"
          :draftData="draftData"
          :productType="form.productType"
          @saveDraft="saveDraft"
          @next="handleNext"
          @back="handleBack"
          @submit="step2Submit"
        />
        <template v-if="form.productType && form.productType !== 'OTHERS'">
          <Step3
            :data="form"
            :productType="form.productType"
            v-show="tabVal === 3"
            :draftData="draftData"
            @submit="handleSubmit"
            @saveDraft="saveDraft"
            @back="handleBack"
          />
        </template>
      </div>
    </div>
    <el-dialog :show-close="false" v-model="dialogVisible">
      <div class="prompt-dialog">
        <img
          class="prompt-dialog-img"
          src="@/assets/img/searchProduct/prompt-dialog.png"
          alt=""
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { fieldAll } from "./data";
import { ref, onMounted, Ref } from "vue";
import { ElMessage } from "element-plus";
import Step1 from "./components/step1.vue";
import Step2 from "./components/step2.vue";
import Step3 from "./components/step3.vue";
import useNamespace from "@/utils/nameSpace";
import { step2Field } from "./components/data";
import { useRoute, useRouter } from "vue-router";

import {
  getProductDetailsEditApi,
  productCheckInSaveOrUpdateApi,
  getProductTypeListApi,
} from "@/api/searchProduct";
import { getCompanyInfoApi } from "@/api/user";
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
const id = ref(null);
const loading = ref(false);
const form = ref<any>({});
const tabVal = ref(1);
const route = useRoute();
const router = useRouter();
const draftData = ref(null);
const dialogVisible = ref(false);
const companyInfo: Ref<any> = ref(); // 产业链环节
const typeList = ref([]); // 产品类型列表
const ns = useNamespace("productCheckIn");

const tabs = ref([
  { title: "选择产品分类", value: 1, show: true },
  { title: "填写产品信息", value: 2, show: true },
  { title: "填写产品参数", value: 3, show: true },
]);

function handleNext(data) {
  form.value = { ...form.value, ...data };
  tabs.value[2].show = form.value.productType !== "OTHERS";
  tabVal.value += 1;
}
function step2Submit(data: any) {
  form.value = { ...form.value, ...data };
  handleSubmit();
}

function handleBack() {
  tabVal.value -= 1;
}

// 获取详情（回填表单）
async function getDetails() {
  try {
    loading.value = true;
    const { id, productType } = route.query;
    const { resp_code, datas } = await getProductDetailsEditApi({
      id,
      productType,
    });
    if (resp_code === 0) {
      delete datas?.id;
      draftData.value = datas;
      form.value = datas;
      form.value.productType = productType;
      loading.value = false;
      getProductTypeList();
      if (productType === "OTHERS") {
        tabs.value[2].show = false;
        return (tabVal.value = 2);
      }
      const step2Status = step2Field.every((item) => {
        return datas[item.prop];
      });
      if (step2Status) {
        tabVal.value = 3;
      } else {
        tabVal.value = 2;
      }
    }
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
}

function saveDraft(formData) {
  try {
    loading.value = true;
    if (form.value?.models) {
      form.value.models.map((item: any) => {
        return {
          ...fieldAll.models[0],
          ...item,
        };
      });
    }
    const data = {
      ...fieldAll,
      ...form.value,
      ...formData,
      operate: 1,
      id: id.value,
    };
    if (form.value.productType === "INDUSTRY_ENERGY_STORAGE") {
      data.industrialEnergyStorageModels = data.models;
    } else {
      data.energyStorageInverterModels = data.models;
    }
    if (form.value.productType === "OTHERS") {
      data.enterpriseName = companyInfo.value.nameCn;
      data.enterpriseId = companyInfo.value.id;
    }
    delete data.models;
    productCheckInSaveOrUpdateApi(data)
      .then(({ resp_code, datas }) => {
        id.value = datas;
        loading.value = false;
        resp_code === 0 && ElMessage.success("保存成功");
      })
      .catch(() => {
        loading.value = false;
      });
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
}
// 提交
function handleSubmit(formData = {}) {
  try {
    const data = {
      ...fieldAll,
      ...form.value,
      ...formData,
      operate: 0,
      id: id.value,
    };
    if (form.value.productType === "INDUSTRY_ENERGY_STORAGE") {
      data.industrialEnergyStorageModels = data.models;
    }
    if (form.value.productType === "ENERGY_STORAGE_INVERTER") {
      data.energyStorageInverterModels = data.models;
      data.energyStorageInverterModels.map((item) => {
        item.dcVoltageRange = [item.dcVoltageRangeMin, item.dcVoltageRangeMaX];
      });
    }
    if (form.value.productType === "OTHERS") {
      data.enterpriseName = companyInfo.value.nameCn;
      data.enterpriseId = companyInfo.value.id;
    }
    delete data.models;
    loading.value = true;
    if (
      data.productType !== "INDUSTRY_ENERGY_STORAGE" &&
      data.displayChannels &&
      data.displayChannels.length
    ) {
      delete data.displayChannels;
    }
    productCheckInSaveOrUpdateApi(data)
      .then(({ resp_code }) => {
        if (resp_code === 0) {
          loading.value = false;
          route.query.id ? router.go(-1) : router.push("homePersonal?id=6");
        } else {
          loading.value = false;
        }
      })
      .catch(() => {
        loading.value = false;
      });
  } catch (e) {
    console.error(e);
    loading.value = false;
  }
}
// 获取企业信息
async function getCompanyInfo() {
  const { resp_code, datas } = await getCompanyInfoApi();
  if (resp_code === 0) {
    companyInfo.value = datas;
    !route.query.id && getProductTypeList();
  }
}

onMounted(() => {
  getCompanyInfo();
  if (route.query?.id) {
    getDetails();
    id.value = route.query.id;
  }
});

// 企业入驻
function onCompanySettlement() {
  window.open(`${VITE_INDUSTRIALMAP_URL}/home`);
}

// 获取产品类型
async function getProductTypeList() {
  if (companyInfo.value.id) {
    return;
  }
  const { datas, resp_code }: any = await getProductTypeListApi({
    type: "mainBusiness",
    enterpriseId: companyInfo.value.id,
  });
  if (resp_code === 0) {
    typeList.value = datas;
    typeList.value.forEach((item) => {
      item.children.forEach((_item) => {
        _item.tiers = 2;
        _item.children.unshift({ label: "", tiers: 3, disabled: true });
        // 拼接用户自己输入产品类型，用于渲染第一步数据
        if (
          route.query.id &&
          _item.id === draftData.value.productClassification
        ) {
          draftData.value.productTypeContent = [
            item.label,
            _item.label,
            draftData.value.productOthersType,
          ];
          _item.children.push({
            label: draftData.value.productOthersType,
            value: draftData.value.productOthersType,
            tiers: 3,
            disabled: false,
          });
        }
      });
    });
  }
}
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-productCheckIn {
  padding: 32px 0 80px 0;
  ::v-deep(.el-dialog) {
    margin-top: 25vh;
    width: 400px;
    border-radius: 4px;
    padding: 0;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      height: 360px;
      .prompt-dialog {
        width: 400px;
        height: 360px;
        .prompt-dialog-img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .es-productCheckIn-content {
    background-color: #fff;
    padding: 80px 160px;
    border-radius: 4px;

    .es-productCheckIn__tab-list {
      @include flex(center, space-between);

      .es-productCheckIn__tab-item {
        @include flex();

        .es-productCheckIn__tab-item-line {
          width: 40px;
          height: 40px;
          @include flex();
          border-radius: 50%;
          font-weight: 600;
          font-size: 16px;
          background: #f2f3f5;
          color: rgba(0, 0, 0, 0.6);

          img {
            width: 24px;
            height: 24px;
          }
        }

        .es-productCheckIn__tab-item-line-active {
          background-color: #244bf1;
          color: rgba(255, 255, 255, 0.9);
        }

        span {
          font-weight: 600;
          font-size: 20px;
          color: rgba(0, 0, 0, 0.9);
          line-height: 28px;
          margin-left: 8px;
        }
      }

      .es-productCheckIn__tab-list-line {
        flex: 1;
        height: 1px;
        background-color: #dbdce2;
        margin: 0 32px;
      }
    }

    .es-productCheckIn-form {
      margin-top: 32px;
      min-height: 300px;
    }
  }
}
.es-productCheckIn-settlement {
  @include widthAndHeight(100%, 64px);
  background: #f2f3f5;
  border-radius: 4px;
  margin-top: 32px;
  padding: 24px 16px 24px 24px;
  @include flex(center, space-between, nowrap);
}
.es-productCheckIn-hasSettlement {
  @include widthAndHeight(100%, auto);
  background: #f2f3f5;
  border-radius: 4px;
  margin-top: 32px;
  padding: 16px;
  div {
    @include flex(flex-start, flex-start, nowrap);
  }
  p {
    width: 84px;
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    text-align: right;
  }
  h4 {
    flex: 1;
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  }
}
</style>
