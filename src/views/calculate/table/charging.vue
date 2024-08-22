<!-- 充放电策略 -->
<template>
  <div :class="ns.b()">
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
import { Ref, ref, computed } from "vue";
import { getChargeDischargePolicy } from "@/api/data";
import { setColor, setChargeColor } from "@/utils/charging";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("calculateCharging");
const tableData: Ref<Array<any>> = ref([]); // 充放电策略表格数据
const props = defineProps({
  searchParamsShow: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
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
// 获取充放电策略数据
function getChargeDischargePolicyAreaData() {
  const {
    electricityTypeOneName,
    electricityTypeTwoName,
    regionName,
    tariffLevelId,
  } = props.searchParamsShow;
  getChargeDischargePolicy({
    electricityTypeOneName,
    electricityTypeTwoName,
    regionName,
    tariffLevelId,
  }).then((res) => {
    tableData.value = res.datas;
  });
}
getChargeDischargePolicyAreaData();
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";

.es-calculateCharging-title-time {
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
    &:last-child {
      border-right: none;
    }
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.es-calculateCharging {
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
