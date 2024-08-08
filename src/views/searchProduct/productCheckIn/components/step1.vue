<template>
  <div :class="[ns.b()]">
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item
        label="产品分类"
        prop="productType"
        :rules="[
          { required: true, message: '请选择产品分类', trigger: 'blur' },
        ]"
      >
        <el-select v-model="form.productType" placeholder="请选择">
          <el-option
            v-for="item in productTypeOption"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="产品类型"
        prop="productSubtype"
        :rules="[
          { required: true, message: '请选择产品类型', trigger: 'blur' },
        ]"
      >
        <el-select v-model="form.productSubtype" placeholder="请选择">
          <el-option
            v-for="item in productSubtypeOption"
            :label="item.label"
            :value="item.code"
            :key="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.productType === 'INDUSTRY_ENERGY_STORAGE'"
        label="展示渠道"
        prop="displayChannels"
        :rules="[
          { required: true, message: '请选择展示渠道', trigger: 'blur' },
        ]"
      >
        <el-select multiple v-model="form.displayChannels" placeholder="请选择">
          <el-option
            v-for="item in displayChannelsOptions"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label=" ">
        <el-button @click="handleNext(formRef)" type="primary">
          下一步
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getProductTypeApi } from "@/api/searchProduct";
const prop = defineProps({
  draftData: {
    type: Object,
    default: null,
  },
});
const formRef = ref();
const productTypeOption = ref([
  { label: "工商业储能", value: "INDUSTRY_ENERGY_STORAGE" },
  { label: "储能变流器", value: "ENERGY_STORAGE_INVERTER" },
]);
const displayChannelsOptions = ref([
  { label: "工商业测算", value: "INDUSTRIAL_CALCULATION" },
  { label: "产品库展示", value: "SHOW_FOR_PRODUCT" },
]);
const productSubtypeOption = ref([]);
const form = ref<any>({
  productType: "",
  productSubtype: "",
  displayChannels: [],
});

watch(
  () => prop.draftData,
  () => {
    if (prop.draftData) {
      form.value.productType = prop.draftData.productType;
      form.value.displayChannels = prop.draftData.displayChannels;
      nextTick(() => {
        form.value.productSubtype = prop.draftData.productSubtype;
      });
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => form.value.productType,
  (val) => {
    getProductType(
      val === "INDUSTRY_ENERGY_STORAGE"
        ? "product_type"
        : "product_energy_storage_inverter_type",
    );
    form.value.productSubtype = "";
  },
);
const ns = useNamespace("step1");
const emits = defineEmits(["next"]);

function handleNext(formRefName) {
  formRefName.validate((valid) => {
    if (valid) {
      emits("next", form.value);
    } else {
      return;
    }
  });
}

async function getProductType(type: string) {
  const { datas, resp_code }: any = await getProductTypeApi({ type });
  if (resp_code === 0) {
    productSubtypeOption.value = datas;
  }
}
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-step1 {
  max-width: 490px;
  margin: 0 auto;
}
</style>
