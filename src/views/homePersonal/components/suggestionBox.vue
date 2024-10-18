<template>
  <div :class="[ns.b()]">
    <h3>意见信箱</h3>
    <div :class="ns.b('desc')">
      <p>您可以在这里留下您关于产品的任何反馈。</p>
      <p>投诉、吐槽、建议……</p>
      <p>我们会竭尽可能优化我们的产品。</p>
    </div>
    <Select
      type="select"
      specialType="textarea"
      :defaultValue="form.functionModel"
      title="意见建议"
      textAlign="left"
      style="width: 488px; margin-bottom: 16px"
      :rows="4"
      @onChange="
        (val) => {
          return onChangeInfo(val, 'functionModel');
        }
      "
    />
    <Select
      type="input"
      :defaultValue="form.functionModel"
      title="功能模块"
      textAlign="left"
      specialType="textarea"
      style="width: 488px"
      @onChange="
        (val) => {
          return onChangeInfo(val, 'functionModel');
        }
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("suggestionBox");
const form: Ref<any> = ref({}); // 表单数据

// 修改用户信息
const onChangeInfo = (value: any, type: string) => {
  form.value[type] = value;
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-suggestionBox {
  padding: 104px 149px 130px;
  h3 {
    margin-bottom: 8px;
  }
  .el-textarea__inner {
    background-color: #f4f5f7;
    box-shadow: none;
  }
}
.es-suggestionBox-desc {
  margin-bottom: 32px;
  p {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  }
}
</style>
