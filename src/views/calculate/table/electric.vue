<template>
  <div class="common-title common-title-margin">
    充放电量<span>/万KWh</span>
  </div>
  <el-table
    :data="dischargeList"
    style="width: 100%"
    header-row-class-name="table-class"
    empty-text="暂无数据"
  >
    <el-table-column prop="variationFactor" label="年数" />
    <el-table-column prop="annualCharge" label="年充电量">
      <template #default="scope">
        <span
          v-if="scope.row.annualCharge"
          :class="{
            'color-red': scope.row.annualCharge.indexOf('-') > -1,
          }"
          >{{ scope.row.annualCharge }}</span
        >
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="annualDischarge" label="年放电量">
      <template #default="scope">
        <span
          v-if="scope.row.annualDischarge"
          :class="{
            'color-red': scope.row.annualDischarge.indexOf('-') > -1,
          }"
          >{{ scope.row.annualDischarge }}</span
        >
        <span v-else>-</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
defineProps({
  dischargeList: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
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
