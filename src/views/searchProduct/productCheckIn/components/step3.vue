<template>
  <div :class="[ns.b()]">
    <div :class="[ns.e('header')]">
      <div :class="[ns.e('header-prompt')]">
        <img src="@/assets/img/searchProduct/prompt.png" alt="" />
        <p>产品参数填写越完整，越容易获得客户的信任，以提高咨询率。</p>
      </div>
      <!-- 限制十个型号 -->
      <el-button :disabled="tableForm.length === 10" @click="handleAddModel">
        添加型号
      </el-button>
    </div>
    <el-form ref="formRef" :model="tableForm" label-width="auto">
      <el-table :data="tableField" style="width: 100%">
        <el-table-column fixed="left" label="" prop="label" width="160px" />
        <el-table-column
          v-for="(item, index) in tableForm"
          :key="item.id"
          label=""
          prop="type"
          min-width="310px"
        >
          <template #default="scope">
            <div
              class="input-box"
              v-if="stepField[scope.$index].type !== 'title'"
            >
              <el-form-item
                :label="' '"
                :prop="`[${index}].${stepField[scope.$index].prop}`"
                :rules="
                  stepField[scope.$index].required
                    ? stepField[scope.$index].rules
                    : []
                "
              >
                <el-input
                  v-if="stepField[scope.$index].type === 'input'"
                  v-model="tableForm[index][stepField[scope.$index].prop]"
                  placeholder="请输入"
                />
                <el-input-number
                  v-if="stepField[scope.$index].type === 'number'"
                  v-model="tableForm[index][stepField[scope.$index].prop]"
                  placeholder="请输入"
                  controls-position="right"
                  :controls="false"
                />
                <el-select
                  v-if="stepField[scope.$index].type === 'select'"
                  v-model="tableForm[index][stepField[scope.$index].prop]"
                  placeholder="请选择"
                  :multiple="stepField[scope.$index].multiple"
                >
                  <el-option
                    v-for="option in stepField[scope.$index].options"
                    :label="option.value"
                    :value="option.id"
                    :key="option.value"
                  />
                </el-select>
                <template v-if="stepField[scope.$index].type === 'inputs'">
                  <el-input
                    v-model="tableForm[index][stepField[scope.$index].prop1]"
                    placeholder="请输入"
                  />
                  <div class="inputs-line">-</div>
                  <el-input
                    v-model="tableForm[index][stepField[scope.$index].prop2]"
                    placeholder="请输入"
                  />
                </template>
              </el-form-item>
              <div
                v-if="scope.$index === 0"
                :class="[
                  'close',
                  tableForm.length === 1 ? 'close-disabled' : '',
                ]"
                @click="handleDelate(index)"
              >
                删除
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div :class="ns.e('footer')">
      <div :class="ns.e('footer-btns')">
        <el-button @click="handleBack">上一步</el-button>
        <el-button @click="handleSubmit(formRef)" type="primary">
          完成
        </el-button>
        <el-button @click="handleSaveDraft">保存草稿</el-button>
      </div>
      <div :class="ns.e('footer-prompt')">
        <img
          v-if="isAgreement"
          @click="isAgreement = !isAgreement"
          src="@/assets/img/common/icon_checked.png"
        />
        <img
          v-if="!isAgreement"
          @click="isAgreement = !isAgreement"
          src="@/assets/img/common/icon_check.png"
        />
        请您确认以上产品信息是否正确，并同意将该信息用于平台展示。
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { step3Field } from "./data";
import { ElMessage } from "element-plus";
import { ref, onMounted, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getSelectByTypeApi } from "@/api/user";

const prop = defineProps({
  draftData: {
    type: Object,
    default: null,
  },
  data: {
    type: Object,
    default: null,
  },
});

watch(
  () => prop.draftData,
  () => {
    if (prop.draftData?.models) {
      tableForm.value = prop.draftData.models.map((item) => {
        let object = {};
        for (const key in item) {
          item[key] && (object[key] = item[key]);
        }
        return object;
      });
    }
  },
  {
    immediate: true,
  },
);
const formRef = ref(null);
const tableField = ref([]);
const isAgreement = ref(false);
const ns = useNamespace("step3");
const stepField = ref<any>(step3Field);
const tableForm = ref<any[]>([{}]);
const emits = defineEmits(["submit", "back", "saveDraft"]);

watch(
  () => prop.data,
  (val) => {
    // 额外添加必填项名单
    const requiredList = [
      "dischargeDepth", // 放电深度
      "annualDecayRate", // 年衰减率
      "systemOverallEfficiency", // 系统综合效率
      "energyStorageSystemProductUnitPrice", // 产品单价
    ];
    // INDUSTRIAL_CALCULATION 是否用于工商业测算 需要额外添加必填项
    // INDUSTRY_ENERGY_STORAGE 是否为储能行业
    if (
      val.productType === "INDUSTRY_ENERGY_STORAGE" &&
      val?.displayChannels?.includes("INDUSTRIAL_CALCULATION")
    ) {
      stepField.value.forEach((item) => {
        if (requiredList.includes(item.prop)) {
          item.required = true;
        }
      });
    } else {
      stepField.value.forEach((item) => {
        if (requiredList.includes(item.prop)) {
          item.required = false;
        }
      });
    }
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  stepField.value.forEach((item) => {
    tableField.value.push({
      label: item.label,
    });
  });
});
function handleAddModel() {
  tableForm.value.push({});
}
function handleDelate(index) {
  tableForm.value.length !== 1 && tableForm.value.splice(index, 1);
}
function handleBack() {
  emits("back");
}
function handleSubmit(formRefName) {
  formRefName.validate((valid) => {
    if (valid) {
      if (!isAgreement.value) {
        return ElMessage.error("请确认并同意产品信息用于平台展示");
      }
      emits("submit", {
        models: [...tableForm.value],
      });
    } else {
      return ElMessage.error("为保证你的产品信息完整，请填写所有必填项");
    }
  });
}
function getOptions() {
  Promise.all([
    // 电芯类型
    getSelectByTypeApi({ type: "product_battery_type" }),
    // 产品形态
    getSelectByTypeApi({ type: "product_form" }),
    // 冷却方式
    getSelectByTypeApi({ type: "product_cooling_method" }),
  ]).then((res) => {
    res.forEach(({ datas }, index) => {
      if (index === 0) {
        stepField.value.forEach((_item) => {
          if (_item.prop === "batteryType") {
            _item.options = datas;
          }
        });
      }
      if (index === 1) {
        stepField.value.forEach((_item) => {
          if (_item.prop === "productForm") {
            _item.options = datas;
          }
        });
      }
      if (index === 2) {
        stepField.value.forEach((_item) => {
          if (_item.prop === "coolingMethod") {
            _item.options = datas;
          }
        });
      }
    });
  });
}
function handleSaveDraft() {
  emits("saveDraft", {
    models: [...tableForm.value],
  });
}
getOptions();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-step3 {
  ::v-deep(.el-form-item) {
    flex: 1;
    margin-bottom: 0px;
    .el-input,
    .el-select {
      .el-select__wrapper,
      .el-input__wrapper {
        background-color: #f4f5f7 !important;
      }
    }
    .el-form-item__error {
      background: #f4f5f7;
      left: 12px;
      top: 9px;
      pointer-events: none;
    }
    .el-form-item__label {
      padding: 0;
      &::before {
        line-height: 32px;
      }
    }
  }
  .es-step3__header {
    @include flex(center, space-between);
    .es-step3__header-prompt {
      height: 32px;
      border-radius: 4px;
      @include flex(center);
      background: #eaedfe;
      padding: 0 16px 0 8px;

      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }

      p {
        @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
      }
    }
  }
  .input-box {
    @include flex(center);
    .el-input {
      flex: 1;
    }
    .close {
      margin-left: 12px;
      color: #f75964;
      cursor: pointer;
      user-select: none;
      &:hover {
        color: #f73b47;
      }
      &:active {
        color: #f00;
      }
    }
    .close-disabled {
      color: rgba(247, 89, 100, 0.8);
      cursor: not-allowed;
      &:hover {
        color: rgba(247, 89, 100, 0.8);
      }
      &:active {
        color: rgba(247, 89, 100, 0.8);
      }
    }
  }
  ::v-deep(.el-table) {
    margin-top: 22px;
    .el-table__header-wrapper {
      height: 0;
    }
    .el-table__cell {
      padding: 0;
      height: auto !important;
      padding: 9px 24px 7px 15px;
    }
    .cell {
      padding: 0;
    }
    .el-table__inner-wrapper:before {
      background-color: #dbdce2;
    }
    td.el-table__cell {
      border-bottom: 1px solid #dbdce2;
      border-left: 1px solid #dbdce2;
      &:last-child {
        border-right: 1px solid #dbdce2;
      }
    }
    tr {
      &:first-child {
        td.el-table__cell {
          border-top: 1px solid #dbdce2;
        }
      }
      &:nth-child(2),
      &:nth-child(6),
      &:nth-child(9) {
        td.el-table__cell {
          border-left: 1px solid transparent;
          &:nth-child(1),
          &:nth-child(2) {
            border-left: 1px solid #dbdce2;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.9);
          }
        }
      }
      &:hover {
        td {
          background: #fff;
        }
      }
    }
    .el-table__row td:nth-of-type(1) {
      background: #f2f3f5;
      text-align: right;
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      border-right: none !important;
    }
  }
  .es-step3__footer {
    margin-top: 40px;
    .es-step3__footer-btns {
      display: flex;
      .el-button {
        &:last-child {
          margin-left: auto;
        }
      }
    }
    .es-step3__footer-prompt {
      margin-top: 8px;
      @include flex(center, flex-start);
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      img {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }
    }
  }
  .inputs-line {
    margin: 0 8px;
  }
}
</style>
