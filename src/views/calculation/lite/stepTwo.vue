<template>
  <div>
    <h4 :class="ns.b('h4')">容量推荐</h4>
    <div :class="ns.be('filter', 'item')">
      <span required>设备数量</span>
      <Select
        type="input"
        :defaultValue="basic.projectName"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'projectName');
          }
        "
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("liteStepTwo");
const basic: Ref<any> = ref({
  projectName: "",
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-liteStepTwo-h4 {
  margin-bottom: 20px;
  margin: 25px 0 20px;
  span {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-left: 8px;
  }
}
</style>
