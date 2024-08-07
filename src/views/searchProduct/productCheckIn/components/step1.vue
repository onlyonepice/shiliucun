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
const productSubtypeOption = ref([]);
const form = ref<any>({});
watch(
  () => prop.draftData,
  () => {
    if (prop.draftData) {
      form.value.productType = prop.draftData.productType;
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
    if (val === "INDUSTRY_ENERGY_STORAGE") {
      productSubtypeOption.value = [
        { label: "一体机", value: "IntegrateMachine" },
      ];
    } else {
      productSubtypeOption.value = [{ label: "储能变流器", value: "PCS2" }];
    }
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
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-step1 {
  max-width: 490px;
  margin: 0 auto;
}
</style>
