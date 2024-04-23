<template>
  <div class="select" :style="{ width: width }">
    <span
      v-if="props.title !== ''"
      class="select__title"
      :style="{ width: titleWidth + 'px' }"
      >{{ props.title }}</span
    >
    <el-select
      v-if="props.type === 'select'"
      v-model="value"
      placeholder="请选择"
      class="select__content"
      @change="handleChange"
      @visible-change="handleVerifyLogin"
      :disabled="props.disabled"
      :multiple="multiple"
    >
      <el-option
        v-for="item in options"
        :key="item[valueKey]"
        :label="item[labelKey]"
        :value="item[valueKey]"
      />
    </el-select>
    <div v-if="props.type === 'input'" class="select__input select__content">
      <el-input
        v-model="value"
        placeholder="请输入"
        :type="props.specialType"
        :disabled="props.disabled"
        :maxlength="maxlength"
        @input="handleChange"
        @focus="handleFocusVerifyLogin"
        :show-word-limit="specialType === 'textarea'"
        :rows="3"
      />
      <span v-if="inputText !== ''" class="select__input-desc">{{
        inputText
      }}</span>
    </div>
    <div v-if="props.type === 'number'" class="select__input select__content">
      <el-input-number
        v-model="value"
        placeholder="请输入"
        controls-position="right"
        :disabled="props.disabled"
        @focus="handleFocusVerifyLogin"
        @input="handleChange"
      />
    </div>
    <div v-if="props.type === 'cascader'" class="select__input select__content">
      <el-cascader
        v-model="value"
        placeholder="请选择"
        :options="options"
        :props="cascaderOption"
        :disabled="props.disabled"
        @change="handleChange"
        @visible-change="handleVerifyLogin"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, ref } from "vue";
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
  placeholder: {
    type: String,
    default: "请选择",
  },
  options: {
    type: Array,
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
    type: [Number, String],
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
  maxlength: {
    type: Number,
    default: 999999,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
});
const value: any = ref(""); // 选中值
const model = defineModel();
watch(
  () => props.defaultValue,
  (val) => {
    console.log(val);
    value.value = val;
  },
  { immediate: true, deep: true },
);
// 通过onChange事件传递值给父组件
function handleChange(data) {
  emit("onChange", data);
  model.value = data;
}
function handleVerifyLogin(data: any) {
  if (data) {
    emit("triggerForm");
  }
}
function handleFocusVerifyLogin() {
  emit("triggerForm");
}
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
  text-align: right;
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
</style>
