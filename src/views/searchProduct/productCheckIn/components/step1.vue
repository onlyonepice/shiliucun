<template>
  <div :class="[ns.b()]">
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item
        label="产品分类"
        prop="productTypeContent"
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
          v-model="form.productTypeContent"
          :disabled="disabled"
        >
          <template #default="{ node, data }">
            <Select
              v-if="data.label === ''"
              type="input"
              style="width: 256px"
              :defaultValue="inputContent"
              placeholder="请输入产品的具体类型，回车确认"
              ref="productTypeRef"
              :inputConfirmIcon="true"
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
            <span v-if="!node.isLeaf">
              ({{
                data.tiers === 2
                  ? data.children.length - 1
                  : data.children.length
              }})
            </span>
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
import LamentIcon from "@/assets/img/common/lament_icon.png";
const prop = defineProps({
  draftData: {
    type: Object,
    default: null,
  },
  typeList: {
    type: Array as () => any[],
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const formRef = ref();
const productTypeRef: Ref<any> = ref();

const form = ref<any>({
  productTypeContent: [],
  productClassification: null,
});
const inputContent: Ref<String> = ref(""); // 输入框内容
const ns = useNamespace("step1");
const emits = defineEmits(["next"]);
const expandList: Ref<Array<any>> = ref([0, 0, 0]); // 展开数据
watch(
  () => prop.draftData,
  () => {
    if (prop.draftData) {
      if (prop.draftData.productTypeContent) {
        form.value.productTypeContent = prop.draftData.productTypeContent;
        console.log(prop.typeList);
      }
      form.value.displayChannels = prop.draftData.displayChannels;
      nextTick(() => {
        form.value.productSubtype = prop.draftData.productSubtype;
      });
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

function onChangeInput(val: String) {
  inputContent.value = val;
}
function onHandleEnter(type: boolean) {
  const _typeList = prop.typeList;
  const _expandList = expandList.value;
  _typeList[_expandList[0]].children[_expandList[1]].children.push({
    label: inputContent.value,
    tiers: 3,
    disabled: false,
  });
  type && (inputContent.value = "");
}
function handleNext(formRefName) {
  formRefName.validate((valid) => {
    if (valid) {
      const _form = form.value;
      _form.productTypeContent[2] === undefined &&
        (_form.productTypeContent[2] = inputContent.value);
      _form.productType =
        _form.productTypeContent[2] === "储能变流器"
          ? "ENERGY_STORAGE_INVERTER"
          : _form.productTypeContent[2] === "工商业一体机"
            ? "INDUSTRY_ENERGY_STORAGE"
            : "OTHERS";
      if (_form.productType === "OTHERS") {
        prop.typeList.map((item) => {
          item.children.forEach((child) => {
            child.label === _form.productTypeContent[1] &&
              (_form.productClassification = child.id);
          });
        });
        _form.productOthersType = _form.productTypeContent[2];
      }
      emits("next", form.value);
    } else {
      return;
    }
  });
}
function onExpandChange(val) {
  prop.typeList.forEach((item, index) => {
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
      padding: 0 12px !important;
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
      left: 216px;
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
      padding: 0 !important;
      .select__input:hover {
        background: #f4f5f7 !important;
      }
    }
  }
}
</style>
