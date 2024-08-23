<template>
  <div
    :style="{
      'margin-right': addAreaType ? '24px' : '0',
    }"
  >
    <div
      class="revenue-estimate"
      :style="{
        width: addAreaType ? '800px' : '',
      }"
    >
      <div class="common-title common-title-margin">{{ title }}</div>
      <div class="estimate-info">
        <span>IRR(内部收益率)：</span>
        <span
          :class="{
            'color-red':
              searchResult.contentYield &&
              searchResult.contentYield.indexOf('-') > -1,
          }"
          >{{
            searchResult.contentYield === null
              ? "IRR过低"
              : searchResult.contentYield + "%"
          }}</span
        >
      </div>
    </div>
    <el-table
      :data="ownerRevenueEstimateList"
      style="width: 100%"
      header-row-class-name="table-class"
      ref="proprietor"
      :style="{
        width: addAreaType ? '800px' : '',
      }"
      row-key="variationFactor"
      :expand-row-keys="expands"
    >
      <el-table-column type="expand" width="1">
        <template #default>
          <div class="table-expand">
            <div class="table-expand--head">
              <div>
                <span>未来一年收益估算（元）</span>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="指根据过去一年该省份每个月峰谷价差估算的未来收益"
                  placement="top-start"
                >
                  <img :src="TipsIcon" alt="" />
                </el-tooltip>
              </div>
              <div>
                合计：<span
                  >¥{{
                    searchResult.revenueEstimationResps.futureIncome[
                      searchResult.revenueEstimationResps.futureIncome.length -
                        1
                    ]
                  }}/元</span
                >
              </div>
            </div>
            <div class="table-expand--body">
              <div v-for="item in 12" :key="item">
                <p>
                  {{
                    searchResult.revenueEstimationResps.futureYears[item - 1]
                  }}
                </p>
                <span
                  >¥{{
                    searchResult.revenueEstimationResps.futureIncome[item - 1]
                  }}</span
                >
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="variationFactor" label="年数">
        <template #default="scope">
          <span
            style="cursor: pointer; display: flex; align-items: center"
            @click="
              scope.row.variationFactor === '1' ? onClickExpand(scope.row) : ''
            "
          >
            <img
              v-if="scope.row.variationFactor === '1'"
              style="width: 12px; height: 12px; margin-right: 10px"
              :src="expands.length === 0 ? ExpandIcon : PutAwayIcon"
              alt=""
            />
            {{ scope.row.variationFactor }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="financialCost" label="现金流/元">
        <template #default="scope">
          <span
            :class="{
              'color-red': scope.row.financialCost.indexOf('-') > -1,
            }"
            >¥{{ scope.row.financialCost }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="innerReturnRate" label="NPV（净现值/元）">
        <template #default="scope">
          <span
            :class="{
              'color-red': scope.row.innerReturnRate.indexOf('-') > -1,
            }"
            >¥{{ scope.row.innerReturnRate }}</span
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import TipsIcon from "@/assets/img/common/lament_icon.png";
import ExpandIcon from "@/assets/img/common/icon_expand.png";
import PutAwayIcon from "@/assets/img/common/icon_put away.png";
const proprietor = ref(null);
defineProps({
  addAreaType: {
    type: Boolean,
    default: false,
  },
  ownerRevenueEstimateList: {
    type: Object,
    default: () => {},
  },
  searchResult: {
    type: Object,
    default: () => {},
  },
  title: {
    type: String,
    default: "",
  },
});
const expands = ref([]); // 默认展开行
const onClickExpand = () => {
  expands.value = expands.value.length === 0 ? ["1"] : [];
};
onMounted(() => {
  onClickExpand();
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.table-expand--head {
  padding: 0 24px 0 24px;
  @include flex(center, space-between, nowrap);
  height: 38px;
  img {
    @include widthAndHeight(16px, 16px);
  }
  div {
    @include flex(center, flex-start, nowrap);
    @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
}
.table-expand--body {
  height: 144px;
  padding: 0 24px 0 24px;
  background: #f2f3f5;
  border-radius: 4px;
  @include flex(center, space-between);
  div {
    width: 28%;
    @include flex(center, flex-start);
    p {
      @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
      margin-right: 32px;
    }
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
}
.revenue-estimate {
  @include flex(center, space-between);

  .estimate-info {
    @include font(14px, 600, #1c232f, 22px);

    span:nth-of-type(2n) {
      @include font(14px, 400, #1c232f, 22px);
    }

    span:nth-of-type(2) {
      @include margin(0, 32px, 0, 0);
    }
  }
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
