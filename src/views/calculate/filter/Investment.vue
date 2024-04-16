<template>
  <div class="common-title common-title-margin">投资方案</div>
  <div class="filter__content investment-filter__check">
    <Select
      width="30%"
      title="年利用天数"
      :options="yearList"
      valueKey="paramName"
      labelKey="paramDesc"
      :defaultValue="searchParams.annualDays"
      @onChange="
        ($event) => {
          onChangeFilter($event, 'annualDays');
        }
      "
    />
    <Select
      width="30%"
      title="贴现率"
      :options="rateList"
      valueKey="paramName"
      labelKey="paramDesc"
      :defaultValue="searchParams.bankRate"
      @onChange="
        ($event) => {
          onChangeFilter($event, 'bankRate');
        }
      "
    />
    <Select
      width="30%"
      title="测算周期"
      :options="periodList"
      valueKey="paramName"
      labelKey="paramDesc"
      :defaultValue="searchParams.calculationPeriod"
      @onChange="
        ($event) => {
          onChangeFilter($event, 'calculationPeriod');
        }
      "
    />
    <Select
      v-if="showInfoList[0][0].value === 'EMC合同能源'"
      width="30%"
      title="业主分成"
      type="number"
      :defaultValue="searchParams.ownersShare"
      @onChange="
        ($event) => {
          onChangeFilter($event, 'ownersShare');
        }
      "
    />
    <Select
      v-if="showInfoList[0][0].value === 'EMC合同能源'"
      width="30%"
      title="投资方分成"
      type="number"
      :defaultValue="searchParams.dividedByInvestors"
      @onChange="
        ($event) => {
          onChangeFilter($event, 'dividedByInvestors');
        }
      "
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { apiYearsList, apiRateList, apiPeriodList } from "@/api/investment";
const yearList = ref([]);
const rateList = ref([]);
const periodList = ref([]);
const emits = defineEmits("onChangeFilter");
defineProps({
  searchParams: {
    type: Object,
    default: () => {},
  },
  showInfoList: {
    type: Array,
    default: () => [],
  },
});
// 投资方案筛选项查找
async function investmentProgramFn(type: string) {
  const { datas }: any =
    type === "年利用"
      ? await apiYearsList()
      : type === "贴现率"
        ? await apiRateList()
        : await apiPeriodList();
  if (type === "年利用") {
    yearList.value = datas;
  }
  if (type === "贴现率") {
    datas.forEach((item) => {
      item.paramDesc = item.paramDesc + "%";
    });
    rateList.value = datas;
  }
  if (type === "测算周期") {
    datas.forEach((item) => {
      item.paramDesc = item.paramDesc + "年";
    });
    periodList.value = datas;
  }
}
investmentProgramFn("年利用");
investmentProgramFn("贴现率");
investmentProgramFn("测算周期");

const onChangeFilter = (value: any, type: string) => {
  emits("onChangeFilter", { value, type });
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.filter__content {
  @include flex(center, flex-start);
}

.common-title {
  @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
  @include flex(center, flex-start);

  span {
    @include font(14px, 400, #5b6985, 22px);
    @include margin(0, 0, 0, 4px);
  }
}
.common-title-margin {
  @include margin(24px, 0, 16px, 0);
}
</style>
