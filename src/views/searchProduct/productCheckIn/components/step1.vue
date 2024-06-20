<template>
  <div :class="[ns.b()]">
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item
        label="产品分类"
        prop="productType"
        :rules="[
          { required: true, message: '请选择产品分类', trigger: 'change' },
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
          { required: true, message: '请选择产品类型', trigger: 'change' },
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
import { ref, watch } from "vue";
import { getSelectByTypeApi } from "@/api/user";
import useNamespace from "@/utils/nameSpace";

const prop = defineProps({
  draftData: {
    type: Object,
    default: null,
  },
});
watch(
  () => prop.draftData,
  () => {
    if (prop.draftData) {
      form.value.productType = prop.draftData.productType;
      form.value.productSubtype = prop.draftData.productSubtype;
    }
  },
  {
    immediate: true,
  },
);
const formRef = ref();
const productTypeOption = ref([]);
const productSubtypeOption = ref([]);
const form = ref<any>({});
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
async function getOptions() {
  Promise.all([
    getSelectByTypeApi({
      type: "PRODUCT_CATEGORY",
    }),
    getSelectByTypeApi({
      type: "product_type",
    }),
  ]).then((res) => {
    productTypeOption.value = res[0].datas.map((item) => {
      return {
        label: item.value,
        value: item.code,
      };
    });
    productSubtypeOption.value = res[1].datas.map((item) => {
      return {
        label: item.value,
        value: item.id,
      };
    });
  });
}
getOptions();
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-step1 {
  max-width: 490px;
  margin: 0 auto;
}
</style>
