<!-- 充放电策略 -->
<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <Select
        :options="regionNameList"
        width="364px"
        labelKey="paramDesc"
        valueKey="paramName"
        title="省份选择"
        @onChange="changeElectricityTypes"
        :defaultValue="regionName"
      />
    </div>
    <el-table :data="tableData" style="width: 100%; margin-top: 24px">
      <el-table-column prop="month" label="月份" width="120" fixed="left" />
      <el-table-column width="1300">
        <template #header>
          <div>
            <span
              style="width: 50px; display: inline-block"
              :class="ns.b('title-time')"
              v-for="item in 25"
              :key="item"
              >{{ `${item - 1 < 10 ? `0${item - 1}` : item - 1}:00` }}</span
            >
          </div>
        </template>
        <template #default="scope">
          <div class="bucketType">
            <p
              v-for="(item, index) in scope.row.data"
              :key="index"
              :style="getBucketType('bucket', item)"
              :title="item.startTime + '-' + item.endTime"
            >
              {{ item.bucketType }}
            </p>
          </div>
          <div class="bucketType">
            <p
              v-for="(item, index) in scope.row.data"
              :key="index"
              :style="getBucketType('charge', item)"
              :title="item.startTime + '-' + item.endTime"
            >
              {{ item.chargeDischargeStrategy }}
            </p>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, computed, watch } from "vue";
import {
  getChargeDischargePolicyArea,
  getChargeDischargePolicy,
} from "@/api/data";
import { setColor, setChargeColor } from "@/utils/charging";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("chargingStrategy");
const regionName: Ref<string> = ref(""); // 选择的地区名称
const regionNameList: Ref<Array<any>> = ref([]); // 地区筛选项
const tableData: Ref<Array<any>> = ref([]); // 充放电策略表格数据
const getBucketType = computed(() => {
  return (type: string, data: any) => {
    const {
      endIdentifying,
      startIdentifying,
      bucketType,
      chargeDischargeStrategy,
    } = data;
    console.log(chargeDischargeStrategy);
    const _width = (endIdentifying - startIdentifying) / 2;
    return `width: ${50 * _width}px;${type === "bucket" ? setColor(bucketType) : setChargeColor(chargeDischargeStrategy)};border-right: ${chargeDischargeStrategy === "" && type === "charge" ? "" : "1px solid #d0d6e2"}`;
  };
});
watch(
  () => regionName.value,
  (val) => {
    val !== "" && getChargeDischargePolicyAreaData();
  },
  {
    immediate: true,
  },
);
// 获取充放电策略筛选项
function getChargeDischargePolicyAreaList() {
  getChargeDischargePolicyArea().then((res) => {
    regionNameList.value = res.datas;
    regionName.value = res.datas[0].paramName;
  });
}
getChargeDischargePolicyAreaList();
// 地区筛选项发生改变
function changeElectricityTypes(val) {
  regionName.value = val;
}
// 获取充放电策略数据
function getChargeDischargePolicyAreaData() {
  getChargeDischargePolicy({ regionName: regionName.value }).then((res) => {
    tableData.value = res.datas;
  });
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.es-chargingStrategy-top {
  margin: 24px 0 0 0;
}

.es-chargingStrategy-title-time {
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
}
.bucketType {
  height: 48px;
  display: flex;
  line-height: 48px;
  text-align: center;
  margin-bottom: 8px;
  padding-left: 20px;
  p {
    width: 50px;
    // border-right: 1px solid #d0d6e2;
    &:last-child {
      border-right: none;
    }
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.es-chargingStrategy {
  .el-table.is-scrolling-left th.el-table-fixed-column--left {
    background: #f2f3f5;
  }
  .el-table__header-wrapper tr th.el-table-fixed-column--left,
  .el-table__header-wrapper tr th.el-table-fixed-column--right {
    background: #f2f3f5;
    text-align: center;
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  }
  .el-table_1_column_1 {
    .cell {
      text-align: center;
    }
  }
}
</style>
