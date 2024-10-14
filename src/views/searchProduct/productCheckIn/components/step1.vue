<template>
  <div :class="[ns.b()]">
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item
        label="产品分类"
        prop="productType"
        :class="ns.b('filter')"
        :rules="[
          { required: true, message: '请选择产品分类', trigger: 'change' },
        ]"
      >
        <el-cascader
          :options="typeList"
          :popper-class="ns.b('filter-cascader')"
          :popper-append-to-body="false"
          @expand-change="onExpandChange"
          v-model="form.productType"
        >
          <template #default="{ node, data }">
            <Select
              v-if="data.label === ''"
              type="input"
              style="width: 256px"
              :defaultValue="inputContent"
              placeholder="请输入产品的产品具体类型,回车确认"
              ref="productTypeRef"
              @onChange="
                (val) => {
                  return onChangeInput(val);
                }
              "
              @handleEnter="onHandleEnter"
            />
            <el-tooltip
              effect="dark"
              :content="data.describe"
              placement="top"
              v-if="data.describe"
              style="width: 170px"
            >
              <img :class="ns.b('filter-icon')" :src="LamentIcon" />
            </el-tooltip>
            <div
              v-if="data.tiers === 2 && !data.describe"
              class="box-item-empty"
            />
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
          </template>
        </el-cascader>
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
import { Ref, ref, watch, nextTick } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getProductTypeListApi } from "@/api/searchProduct";
import LamentIcon from "@/assets/img/common/lament_icon.png";
const prop = defineProps({
  draftData: {
    type: Object,
    default: null,
  },
});
const formRef = ref();
const productTypeRef: Ref<any> = ref();
const typeList = ref([]); // 产品类型列表
const form = ref<any>({
  productType: "",
});
const inputContent: Ref<String> = ref(""); // 输入框内容
const ns = useNamespace("step1");
const emits = defineEmits(["next"]);
const expandList: Ref<Array<any>> = ref([0, 0, 0]); // 展开数据
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

function onChangeInput(val: String) {
  inputContent.value = val;
}
function onHandleEnter() {
  const _typeList = typeList.value;
  const _expandList = expandList.value;
  _typeList[_expandList[0]].children[_expandList[1]].children.push({
    label: inputContent.value,
    tiers: 3,
    disabled: false,
  });
  inputContent.value = "";
}
function handleNext(formRefName) {
  formRefName.validate((valid) => {
    if (valid) {
      emits("next", form.value);
    } else {
      return;
    }
  });
}
function onExpandChange(val) {
  typeList.value.forEach((item, index) => {
    if (item.label === val[0]) {
      expandList.value[0] = index;
    }
    item.label === val[0] &&
      item.children.forEach((child, childIndex) => {
        if (child.label === val[1]) {
          expandList.value[1] = childIndex;
        }
      });
  });
}

// 获取产品类型
async function getProductTypeList() {
  const { datas, resp_code }: any = await getProductTypeListApi();
  if (resp_code === 0) {
    typeList.value = datas;
    typeList.value.forEach((item) => {
      item.children.forEach((_item) => {
        _item.tiers = 2;
        _item.children.unshift({ label: "", tiers: 3, disabled: true });
      });
    });
  }
}
getProductTypeList();
</script>
<style lang="scss">
@import "@/style/mixin.scss";
.es-step1 {
  max-width: 490px;
  margin: 0 auto;
  &-filter-cascader {
    .el-scrollbar {
      width: 256px;
    }
    .el-cascader-node {
      padding: 0 !important;
      margin: 0 8px;
      height: 36px;
    }
    .el-cascader-node__label {
      display: inline-block;
      @include flex(center, flex-start, nowrap);
      padding: 0;
      width: 240px;
      overflow: visible;
    }
    .el-cascader-node__prefix {
      left: 220px;
    }
  }
}
.box-item {
  width: 170px;
}
.box-item-empty {
  @include widthAndHeight(16px, 16px);
  margin-right: 4px;
}
.es-step1-filter-icon {
  @include widthAndHeight(16px, 16px);
  margin-right: 4px;
}
.es-step1-filter-text {
  display: inline-block;
  padding-left: 12px;
}
.es-step1-filter-cascader {
  .el-scrollbar:nth-of-type(3) {
    .el-cascader-node:nth-of-type(1) {
      margin-bottom: 10px;
      .select__input:hover {
        background: #f4f5f7 !important;
      }
    }
  }
}
</style>
