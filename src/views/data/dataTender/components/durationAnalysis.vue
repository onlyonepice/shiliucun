<template>
  <div class="duration-analysis">
    <div class="filter">
      <Select
        title="招标内容"
        :options="contentList"
        valueKey="regionName"
        :defaultValue="searchParams.c1"
        @triggerForm="handleTriggerForm"
        @on-change="(val) => handleChange(val, 'c1')"
      />
      <Select
        title="发布日期"
        :options="dateList"
        valueKey="paramName"
        labelKey="paramDesc"
        :defaultValue="searchParams.c2"
        @triggerForm="handleTriggerForm"
        @on-change="(val) => handleChange(val, 'c2')"
      />
      <Select
        title="招标地区"
        :options="regionList"
        valueKey="paramName"
        labelKey="paramDesc"
        :defaultValue="searchParams.c3"
        @triggerForm="handleTriggerForm"
        @on-change="(val) => handleChange(val, 'c3')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Select from "@/components/Common/Select.vue";
import { ref } from "vue";
const contentList = ref([]);
const dateList = ref([]);
const regionList = ref([]);
const searchParams = ref({ c1: "", c2: "", c3: "" });

// 用户触发表单
function handleTriggerForm() {}

// 筛选项发生变化时
function handleChange(val, key) {
  searchParams.value[key] = val;
}
</script>

<style lang="scss" scoped>
.duration-analysis {
  margin-top: 9px;
  .filter {
    display: flex;
  }
}
</style>
