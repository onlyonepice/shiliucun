<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('title')">
      <h1>工商业测算Lite版</h1>
      <el-button type="primary" @click="onNextStep">下一步</el-button>
    </div>
    <div :class="ns.b('step')">
      <template v-for="item in stepList" :key="item.id">
        <div
          :class="[
            ns.be('step', 'number'),
            step === item.id ? ns.bm('step', 'active') : '',
          ]"
        >
          <span v-if="step <= item.id">{{ item.id }}</span>
          <img v-else :src="IconSuccess" alt="" />
        </div>
        <p :class="[ns.b('text'), step === item.id ? ns.b('chose-text') : '']">
          {{ item.name }}
        </p>
        <div :class="ns.be('step', 'line')" v-if="item.id !== 3" />
      </template>
    </div>
    <div v-show="step === 1">
      <StepOne ref="stepOne" @onNext="onNext" />
    </div>

    <StepTwo v-show="step === 2" />
    <StepThree v-show="step === 3" />
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import StepOne from "./stepOne.vue";
import StepTwo from "./stepTwo.vue";
import StepThree from "./stepThree.vue";
import IconSuccess from "@/assets/img/common/icon-success.png";
const ns = useNamespace("calculationLite");
const stepList: Ref<Array<any>> = ref([
  { id: 1, name: "基本信息" },
  { id: 2, name: "容量测算" },
  { id: 3, name: "经济分析" },
]);
const step: Ref<number> = ref(1);
const stepOne: Ref<any> = ref(null); // 获取子组件-第一步
// 点击下一步
const onNextStep = () => {
  if (step.value === 1) {
    stepOne.value.handleNext();
  } else {
    onNext();
  }
};
// 下一步增加步数
const onNext = () => {
  if (step.value < 3) {
    step.value++;
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-calculationLite-title {
  @include flex(center, space-between, nowrap);
  margin: 80px 0 40px;
}
.es-calculationLite-step {
  @include flex(center, center, nowrap);
}
.es-calculationLite-step__number {
  @include widthAndHeight(24px, 24px);
  @include font(16px, 600, rgba(0, 0, 0, 0.6), 24px);
  background: #f2f3f5;
  text-align: center;
  border-radius: 50%;
  margin-right: 8px;
  img {
    @include widthAndHeight(24px, 24px);
  }
}
.es-calculationLite-step--active {
  background: #244bf1;
  color: rgba(255, 255, 255, 0.9);
}
.es-calculationLite-text {
  font-size: 16px;
}
.es-calculationLite-chose-text {
  font-weight: 600;
  font-size: 16px;
}
.es-calculationLite-step__line {
  @include widthAndHeight(96px, 1px);
  background: #dbdce2;
  margin: 0 40px;
}
</style>
