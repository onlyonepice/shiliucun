<template>
  <div class="certification-preview">
    <div v-for="report in data" :key="report.id">
      <!-- 工商业 -->
      <div>
        <div class="resultsDisplay_main">
          <!-- 检索条件 -->
          <div>
            <p
              ref="HTML"
              class="headline"
              style="
                width: 500px;
                font-weight: 600;
                font-size: 14px;
                color: #1c232f;
              "
            >
              检索条件
            </p>
            <p ref="HTML" class="searchCriteria_content">
              <span
                v-for="item in getConditionLabel"
                :key="item.unit"
                class="item"
                style="margin-right: 24px"
              >
                <span
                  style="font-weight: 400; font-size: 14px; color: #939db3"
                  >{{ item.label }}</span
                >
                <span
                  style="
                    font-weight: 400;
                    font-size: 14px;
                    color: #1d232e;
                    padding: 0px 20px 0px 10px;
                  "
                  >{{ item.unit }}</span
                >
              </span>
            </p>
          </div>
          <!-- 投资方案 -->
          <!-- <p
            ref="HTML"
            class="headline"
            style="width:500px;font-weight: 600;font-size: 14px;color: #1C232F;"
          >投资方案</p> -->
          <!-- 收益估算 -->
          <div>
            <table
              ref="HTML"
              class="IRR"
              style="
                width: 100%;
                font-weight: 600;
                font-size: 14px;
                color: #1c232f;
                border: none;
              "
            >
              <template v-if="getMode === '业主自投'">
                <tr>
                  <td
                    class="module-title"
                    style="border: none"
                    cell-header="#ffffff"
                    cell-color="#000000"
                  >
                    收益估算
                  </td>
                  <td
                    class="module-label"
                    style="text-align: right; border: none"
                    cell-header="#ffffff"
                    cell-color="#000000"
                  >
                    IRR（内部收益率）：
                  </td>
                  <td
                    class="module-value"
                    style="text-align: right; border: none"
                    cell-header="#ffffff"
                    :cell-color="
                      IRRFormatter(formatter(getIRR)).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: IRRFormatter(formatter(getIRR)).minus,
                    }"
                    width="50"
                  >
                    {{ IRRFormatter(formatter(getIRR)).text }}
                  </td>
                </tr>
              </template>
              <template v-else-if="getMode === 'EMC合同能源'">
                <tr>
                  <td
                    class="module-title"
                    style="border: none"
                    cell-header="#ffffff"
                    cell-color="#000000"
                  >
                    收益估算
                  </td>
                  <td
                    class="module-label"
                    style="text-align: right; border: none"
                    cell-header="#ffffff"
                    cell-color="#000000"
                  >
                    资方内部收益率（IRR）：
                  </td>
                  <td
                    class="module-value"
                    style="text-align: right; border: none"
                    cell-header="#ffffff"
                    :cell-color="
                      IRRFormatter(formatter(getIRR)).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: IRRFormatter(formatter(getIRR)).minus,
                    }"
                    width="100"
                  >
                    {{ IRRFormatter(formatter(getIRR)).text }}
                  </td>
                  <td
                    class="module-label"
                    style="text-align: right; border: none"
                    cell-header="#ffffff"
                    cell-color="#000000"
                  >
                    动态回收期：
                  </td>
                  <td
                    class="module-value"
                    style="text-align: right; border: none"
                    cell-color="#000000"
                    cell-header="#ffffff"
                    width="100"
                  >
                    {{ getThat.paybackTime }}
                  </td>
                </tr>
              </template>
            </table>
            <div class="regionalStandards_content">
              <table ref="HTML" style="width: 100%; border: none">
                <template v-if="getMode === '业主自投'">
                  <tr>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      年利用天数：{{ getThat.annualDays }}
                    </td>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      贴现率：{{ getThat.bankRate }}%
                    </td>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      测算周期：{{ getThat.calculationPeriod }}年
                    </td>
                  </tr>
                </template>
                <template v-else-if="getMode === 'EMC合同能源'">
                  <tr>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      年利用天数：{{ getThat.annualDays }}
                    </td>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      贴现率：{{ getThat.bankRate }}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      测算周期：{{ getThat.calculationPeriod }}年
                    </td>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      业主分成：{{ getThat.ownersShare }}%
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="33%"
                      style="text-align: center; border: none"
                      cell-color="#000000"
                      cell-header="#ffffff"
                    >
                      投资方分成：{{ getThat.dividedByInvestors }}
                    </td>
                  </tr>
                </template>
              </table>
              <table
                v-if="getMode === '业主自投'"
                ref="HTML"
                style="width: 100%"
              >
                <tr>
                  <th class="year">年数</th>
                  <th class="annualIncome">现金流 /元</th>
                  <th class="accumulatedIncome">NPV（净现值 /元）</th>
                </tr>
                <tr v-for="(item, index) in getVariationFactor" :key="item">
                  <td>{{ item }}</td>
                  <td
                    :cell-color="
                      formatter(getFinancialCost[index]).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: formatter(getFinancialCost[index]).minus,
                    }"
                  >
                    {{ formatter(getFinancialCost[index]).text }}
                  </td>
                  <td
                    :cell-color="
                      formatter(getInnerReturnRate[index]).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: formatter(getInnerReturnRate[index]).minus,
                    }"
                  >
                    {{ formatter(getInnerReturnRate[index]).text }}
                  </td>
                </tr>
              </table>
              <table
                v-else-if="getMode === 'EMC合同能源'"
                ref="HTML"
                style="width: 100%"
              >
                <tr>
                  <th class="year">年数</th>
                  <th class="annualIncome">现金流 /元</th>
                  <th class="accumulated-earnings owner">业主累计收益（元）</th>
                  <th class="accumulated-earnings investor">投资方分享收益</th>
                  <th class="npv">投资方净现值（元）</th>
                </tr>
                <tr v-for="(item, index) in getVariationFactor" :key="item">
                  <td>{{ item }}</td>
                  <td
                    :cell-color="
                      formatter(getFinancialCost[index]).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: formatter(getFinancialCost[index]).minus,
                    }"
                  >
                    {{ formatter(getFinancialCost[index]).text }}
                  </td>
                  <td
                    :cell-color="
                      formatter(getAccumulatedEarnings_owner[index]).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: formatter(getAccumulatedEarnings_owner[index])
                        .minus,
                    }"
                  >
                    {{ formatter(getAccumulatedEarnings_owner[index]).text }}
                  </td>
                  <td
                    :cell-color="
                      formatter(getAccumulatedEarnings_investor[index]).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: formatter(getAccumulatedEarnings_investor[index])
                        .minus,
                    }"
                  >
                    {{ formatter(getAccumulatedEarnings_investor[index]).text }}
                  </td>
                  <td
                    :cell-color="
                      formatter(getInnerReturnRate[index]).minus
                        ? '#FF0000'
                        : '#000000'
                    "
                    :class="{
                      minus: formatter(getInnerReturnRate[index]).minus,
                    }"
                  >
                    {{ formatter(getInnerReturnRate[index]).text }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { REGEXP } from "@/utils/downReport";

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    condition: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 户储
      householdSavingsFieldList: [
        { type: "", label: "系统容量", unit: "kWh", model: "systemCapacity" },
        { type: "", label: "系统功率", unit: "kWp", model: "systemPower" },
        { type: "", label: "区域", unit: "", model: "region" },
        { type: "", label: "电池成本", unit: "€/kWh", model: "batteryCost" },
        { type: "", label: "逆变器成本", unit: "€/kW", model: "inverterCost" },
        {
          type: "",
          label: "太阳能组件成本",
          unit: "€/kW",
          model: "solarModuleCost",
        },
        {
          type: "",
          label: "其他部件成本",
          unit: "€/kWh",
          model: "costOfOtherParts",
        },
        {
          type: "",
          label: "客户年用电量",
          unit: "kWh",
          model: "annualPowerConsumption",
        },
        {
          type: "",
          label: "电费价格",
          unit: "€/kWh",
          model: "electricityPrice",
        },
        {
          type: "",
          label: "年有效光照时长",
          unit: "小时",
          model: "annualEffectiveLightDuration",
        },
        {
          type: "",
          label: "自发自用率",
          unit: "%",
          model: "spontaneousSelfUseRate",
        },
        {
          type: "",
          label: "储能系统效率",
          unit: "%",
          model: "efficiencyOfEnergyStorageSystem",
        },
        {
          type: "",
          label: "安装成本",
          unit: "€/kWp",
          model: "installationCost",
        },
        {
          type: "",
          label: "客户用电量增长",
          unit: "%",
          model: "powerConsumptionGrowth",
        },
        {
          type: "",
          label: "电费价格变动趋势",
          unit: "%",
          model: "electricityPriceVariationTrend",
        },
        { type: "", label: "当地VAT", unit: "%", model: "localVat" },
        {
          type: "",
          label: "渠道占比",
          unit: "%",
          model: "proportionOfChannels",
        },
        {
          type: "",
          label: "运输占比",
          unit: "%",
          model: "proportionOfTransportation",
        },
      ],
    };
  },
  computed: {
    getConditionLabel() {
      const { condition } = this;
      return [
        { label: "地区：", unit: condition.regionName },
        { label: "用电类型I：", unit: condition.electricityTypeOneName },
        { label: "用电类型II：", unit: condition.electricityTypeTwoName },
        { label: "电压等级：", unit: condition.tariffLevelId },
        { label: "选择产品：", unit: condition.choseProduct },
        { label: "配置数量：", unit: condition.number },
        { label: "系统单价：", unit: condition.systemUnitPrice },
        { label: "系统容量：", unit: condition.systemEnergyCapacity },
        { label: "系统综合效率：", unit: condition.systemEfficiency },
        { label: "放电深度：", unit: condition.dischargeDepth },
        { label: "年衰减率：", unit: condition.annualDecay },
        { label: "年维护费用：", unit: condition.annualMaintenance },
      ];
    },
    getThat() {
      const { data } = this;

      return data[0] || {};
    },
    getVariationFactor() {
      const { getThat } = this;

      return getThat.revenueEstimationResps.variationFactor || [];
    },
    getFinancialCost() {
      const { getThat } = this;

      return getThat.revenueEstimationResps.financialCost || [];
    },
    getAccumulatedEarnings_owner() {
      const { getThat } = this;

      return getThat.revenueEstimationResps.ownersAccumulatedIncome;
    },
    getAccumulatedEarnings_investor() {
      const { getThat } = this;

      return getThat.revenueEstimationResps.cumulativeReturnInvestors;
    },
    getInnerReturnRate() {
      const { getThat, getMode } = this;

      const res =
        getMode === "业主自投"
          ? getThat.revenueEstimationResps.innerReturnRate
          : getThat.revenueEstimationResps.investorNetPresentValue;

      return res || [];
    },

    getMode() {
      return this.mode;
    },

    getIRR() {
      const { getThat, getMode } = this;

      return getMode === "业主自投"
        ? getThat.contentYield
        : getThat.internalRateReturn;
    },
  },
  methods: {
    filterEmptyData(val) {
      return val || "-";
    },
    getDom() {
      return this.$refs["HTML"];
    },
    unit(item, unit) {
      if (unit === "€/kW") {
        return `${item.data.sysCurrency.unit}/kW`;
      }
      if (unit === "€/kWp") {
        return `${item.data.sysCurrency.unit}/kWp`;
      }
      if (unit === "€/kWh") {
        return `${item.data.sysCurrency.unit}/kWh`;
      }
      return unit;
    },
    filterId(id, data) {
      return data[data.findIndex((item) => item.id === id)].name;
    },
    formatter(item) {
      const result = REGEXP.minusReg.test(item);

      const temp = {
        text: item,
        minus: false,
      };

      if (result) {
        temp.text = `- ¥${item.slice(1)}`;
        temp.minus = true;
      } else {
        temp.text = `¥${item}`;
      }

      return temp;
    },
    IRRFormatter(item) {
      if (item.minus) item.text = `- ${item.text.slice(3)}%`;
      else item.text = `${item.text.slice(1)}%`;

      if (item.text.includes("无法计算")) item.text = item.text.slice(0, -1);

      return item;
    },
  },
};
</script>

<style lang="scss" scoped>
.certification-preview {
  .regionalStandards_content {
    table {
      width: 100%;
      border-spacing: 0;
      font-size: 14px;
      th {
        padding: 0px 16px;
        box-sizing: border-box;
        background-color: #f2f3f5;
        font-weight: 400;
        color: #1c232f;
      }
      td {
        padding: 0px 16px;
        box-sizing: border-box;
        color: #1c232f;
        border-bottom: 1px solid #e5e6ea;
      }
      tr {
        height: 40px;
      }
    }
  }

  .resultsDisplay_main {
    table {
      th {
        text-align: left;
      }
    }
    .IRR {
      .module-value {
        width: 18%;
      }
    }

    .minus {
      color: red;
    }
  }
}
</style>
