<template>
  <div class="select" :style="{ width: width }">
    <span
      v-if="props.title !== ''"
      class="select__title"
      :style="{ width: titleWidth + 'px', textAlign: textAlign }"
      >{{ props.title }}</span
    >
    <el-select
      v-if="props.type === 'select'"
      v-model="value"
      :placeholder="placeholder !== '' ? placeholder : '请选择'"
      class="select__content"
      @change="handleChange"
      @visible-change="handleVerifyLogin"
      :disabled="props.disabled"
      :multiple="multiple"
      :multiple-limit="multipleLimit"
      ref="selectDom"
    >
      <template v-if="showSelectHead" #header>
        <slot name="header" />
      </template>
      <el-option
        v-for="item in options"
        :key="item[valueKey]"
        :label="item[labelKey]"
        :value="item[valueKey]"
      >
        <div class="select__key">
          {{ item[labelKey] }}<img v-if="item.lock" :src="SelectKey" />
        </div>
      </el-option>
    </el-select>
    <div v-if="props.type === 'input'" class="select__input select__content">
      <el-input
        v-model="value"
        :placeholder="placeholder !== '' ? placeholder : '请输入'"
        :type="props.specialType"
        :disabled="props.disabled"
        :maxlength="maxlength"
        @input="handleChange"
        resize="none"
        @focus="handleFocusVerifyLogin"
        :show-word-limit="specialType === 'textarea' || specialType === 'text'"
        :rows="3"
      />
      <span v-if="inputText !== ''" class="select__input-desc">{{
        inputText
      }}</span>
    </div>
    <div v-if="props.type === 'number'" class="select__input select__content">
      <el-input-number
        v-model="value"
        :placeholder="placeholder !== '' ? placeholder : '请输入'"
        controls-position="right"
        :controls="controls"
        :disabled="props.disabled"
        :precision="precision"
        @focus="handleFocusVerifyLogin"
        @input="handleChange"
      />
      <span v-if="inputText !== ''" class="select__input-desc">{{
        inputText
      }}</span>
    </div>
    <div v-if="props.type === 'cascader'" class="select__input select__content">
      <el-cascader
        v-model="value"
        :placeholder="placeholder !== '' ? placeholder : '请选择'"
        :options="options"
        :props="cascaderOption"
        :disabled="props.disabled"
        @change="handleChange"
        @visible-change="handleVerifyLogin"
        :show-all-levels="props.showAllLevels"
      />
    </div>
    <div v-if="props.type === 'date'" class="select__input select__content">
      <el-date-picker
        v-model="value"
        :type="props.dateType"
        :range-separator="props.rangeSeparator"
        :editable="false"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleDateChange"
        @visible-change="handleVerifyLogin"
        :clearable="false"
        :disabled-date="disabledDate"
      />
    </div>
    <div v-if="props.type === 'radio'" class="select__content select__radio">
      <el-radio-group v-model="value">
        <el-radio
          :value="item[valueKey]"
          size="small"
          v-for="item in options"
          :key="item[valueKey]"
          @change="handleChange"
          >{{ item[labelKey] }}</el-radio
        >
      </el-radio-group>
    </div>
    <div v-if="props.type === 'slider'" class="select__content select__slider">
      <span class="select__slider-text" v-if="props.sliderText.length">{{
        props.sliderText[0]
      }}</span>
      <el-slider v-model="value" @change="handleChange" />
      <span class="select__slider-text" v-if="props.sliderText.length">{{
        props.sliderText[1]
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
import SelectKey from "@/assets/img/common/select-key-icon.png";
const emit = defineEmits(["onChange", "triggerForm"]);
const props = defineProps({
  // 筛选项宽度
  width: {
    type: String,
    default: "48%",
  },
  // 标题宽度
  titleWidth: {
    type: Number,
    default: 70,
  },
  // 暗文
  placeholder: {
    type: String,
    default: "",
  },
  // 标题对其方式
  textAlign: {
    type: String,
    default: "right",
  },
  precision: {
    type: Number,
    default: 2,
  },
  // 自定义下拉菜单的头部
  showSelectHead: {
    type: Boolean,
    default: false,
  },
  // 输入框/选择器标题
  title: {
    type: String,
    default: "",
  },
  // 输入框右边文字
  inputText: {
    type: String,
    default: "",
  },
  // 筛选项还是输入框
  type: {
    type: String,
    default: "select",
  },
  specialType: {
    type: String,
    default: "text",
  },
  options: {
    type: Array as any,
    default: () => [],
  },
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: "label",
  },
  defaultValue: {
    type: [Number, String, Array],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  cascaderOption: {
    type: Object,
    default: () => {},
  },
  // 仅显示最后一级
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  maxlength: {
    type: Number,
    default: 999999,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  multipleLimit: {
    type: Number,
    default: 0,
  },
  // 选择范围时的分隔符
  rangeSeparator: {
    type: String,
    default: "至",
  },
  // date 显示类型
  dateType: {
    type: String,
    default: "monthrange",
  },
  disabledDate: {
    type: Function,
    default: null,
  },
  // 滑块描述
  sliderText: {
    type: Array,
    default: () => [],
  },
  // 是否使用控制按钮
  controls: {
    type: Boolean,
    default: true,
  },
  step: {
    type: Number,
    default: 1,
  },
  stepStrictly: {
    type: Boolean,
    default: true,
  },
});
const value: any = ref("" || []); // 选中值
const selectDom = ref(); // 获取select组件
const model = defineModel();
watch(
  () => props.defaultValue,
  (val) => {
    value.value = val;
  },
  { immediate: true, deep: true },
);
// 通过onChange事件传递值给父组件
function handleChange(data) {
  emit("onChange", data);
  model.value = data;
}
function handleDateChange(data) {
  emit("onChange", data);
}
function handleVerifyLogin(data: any) {
  if (data) {
    emit("triggerForm");
  }
}
function handleFocusVerifyLogin() {
  emit("triggerForm");
}

function onBlur() {
  selectDom.value.blur();
}

defineExpose({
  onBlur,
});
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.select {
  @include widthAndHeight(30%, 32px);
  @include flex(center, flex-start);
}

.select__title {
  width: 84px;
  @include margin(0, 16px, 0, 0);
  @include font(14px, 400, rgba(0, 0, 00.6), 22px);
  text-align: left;
}
.select__key {
  @include flex(center, flex-start);
  img {
    @include widthAndHeight(16px, 16px);
    margin-left: 8px;
  }
}
.select__content {
  flex: 1;
}

.select__input {
  @include widthAndHeight(48%, 32px);
  @include relative();
  border-radius: 4px;
  background-color: #f4f5f7;

  &:hover {
    box-shadow: none;
    background-color: #e5e6ec;
  }
}

.select__input-desc {
  @include widthAndHeight(auto, 32px);
  @include absolute(1, 0, 0, none, none);
  @include box(5px 16px, none, none, 0);
  @include font(14px, 400, #1c232f, 22px);
  border-left: 1px solid #e5e6ea;
}

.select__slider {
  @include flex(center, space-between, nowrap);
  .select__slider-text {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    &:nth-of-type(1) {
      margin-right: 16px;
    }
    &:nth-of-type(2) {
      margin-left: 16px;
    }
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.select .select__radio {
  @include widthAndHeight(30%, 32px);
  @include flex(center, flex-start);
  .el-radio.el-radio--small .el-radio__inner {
    @include widthAndHeight(16px, 16px);
    border: 1px solid #dbdce2;
  }
  .el-radio-group {
    .is-checked {
      .el-radio__inner {
        background-color: #ffffff !important;
        border: 1px solid #244bf1 !important;
        &::after {
          @include widthAndHeight(8px, 8px);
          background-color: #244bf1;
        }
      }
    }
  }
}
.select .select__slider {
  .el-slider {
    flex: 1;
  }
  .el-slider__runway {
    height: 1px;
    background: #dbdce2;
  }
  .el-slider__button-wrapper {
    margin-top: -3px;
  }
  .el-slider__button {
    @include widthAndHeight(16px, 16px);
    border: 2px solid #244bf1;
  }
  .el-slider__bar {
    height: 1px;
    background: #dbdce2;
  }
}
</style>
