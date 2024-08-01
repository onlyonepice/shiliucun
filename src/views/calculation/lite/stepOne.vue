<template>
  <h4 :class="ns.b('h4')">
    基本信息<span>请完善真实的企业项目信息，有利于最后生成完整报告</span>
  </h4>
  <div :class="ns.b('filter')">
    <div :class="ns.be('filter', 'item')">
      <span required>项目名称</span>
      <Select
        type="input"
        :defaultValue="basicInfo.projectName"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'projectName');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>用电类型I</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.electricityUsageType1"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'electricityUsageType1');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required="false">企业信息</span>
      <Select
        type="input"
        :defaultValue="basicInfo.projectName"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'projectName');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>用电类型II</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.electricityUsageType2"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'electricityUsageType2');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>项目地区</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.transformerCapacity"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'transformerCapacity');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>电压等级</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.tariffLevelName"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'tariffLevelName');
          }
        "
      />
    </div>
  </div>
  <h4 :class="ns.b('h4')">用电信息</h4>
  <div :class="ns.b('filter')">
    <div :class="ns.be('filter', 'item')">
      <span required>变压器信息</span>
      <Select
        type="input"
        :defaultValue="basicInfo.projectName"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'projectName');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>变压器容量</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.electricityUsageType1"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'electricityUsageType1');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required="false">年度用电量</span>
      <Select
        type="input"
        :defaultValue="basicInfo.projectName"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'projectName');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>光伏装机量</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.electricityUsageType2"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'electricityUsageType2');
          }
        "
      />
    </div>
    <div :class="ns.be('filter', 'item')">
      <span required>所属行业</span>
      <Select
        :options="[]"
        valueKey="regionName"
        labelKey="regionName"
        :defaultValue="basicInfo.transformerCapacity"
        width="475px"
        @onChange="
          ($event) => {
            onAreaChange($event, 'transformerCapacity');
          }
        "
      />
    </div>
  </div>
  <div :class="ns.b('imageBox')">
    <el-button type="primary" :class="ns.be('imageBox', 'btn')"
      >点击切换</el-button
    >
    <img src="" alt="" />
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("liteStepOne");
const basicInfo: Ref<any> = ref({
  projectName: "",
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-liteStepOne-h4 {
  margin-bottom: 20px;
  margin: 25px 0 20px;
  span {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-left: 8px;
  }
}
.es-liteStepOne-filter {
  @include flex(center, space-between, wrap);
}
.es-liteStepOne-filter__item {
  @include flex(center, flex-start, nowrap);
  margin-bottom: 16px;
  span {
    width: 70px;
    margin-right: 16px;
  }
  span[required]::before {
    content: "*"; /* 添加一个星号作为标识符 */
    color: red; /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
  span[required="false"]::before {
    content: "";
    width: 5px;
    display: inline-block;
    margin-right: 4px;
  }
  &:nth-of-type(2n) {
    span {
      margin-left: 24px;
    }
  }
}
.es-liteStepOne-imageBox {
  @include widthAndHeight(564px, 317px);
  background: rgba(255, 255, 255, 0);
  border-radius: 4px;
  border: 1px solid #244bf1;
  position: relative;
}
.es-liteStepOne-imageBox__btn {
  @include absolute(1, 0, 0, none, none);
}
</style>
