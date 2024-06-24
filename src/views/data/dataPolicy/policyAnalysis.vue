<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <div :class="ns.be('top', 'left')">
        <div>
          <span :class="ns.be('top', 'title')">时间</span>
          <Select
            width="256px"
            :options="contentFilter"
            labelKey="paramDesc"
            valueKey="paramValue"
            @onChange="onChangeFilter"
            :defaultValue="policyReleased"
          />
        </div>
      </div>
      <div :class="ns.be('top', 'right')">
        <el-button type="primary" @click="exportResult">下载图片</el-button>
      </div>
    </div>
    <div v-loading="loading" :class="ns.b('content')">
      <PolicyRegionAnalysis
        ref="policyRegionAnalysisImg"
        :year="year"
        :data="echartVal.mapAnalysis"
      />
      <div :class="ns.b('footer')">
        <PolicyLevel
          :year="year"
          ref="policyLevelImg"
          :data="echartVal.publishLevel"
        />
        <PolicyType
          :year="year"
          ref="policyTypeImg"
          :data="echartVal.policyType"
        />
      </div>
    </div>
    <ExportCanvasDialog
      :visible="exportVisible"
      :img-url="exportImgUrl"
      @close="exportVisible = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { policyAnalysis, getPolicyReleased } from "@/api/data";
import PolicyType from "./component/policyType.vue";
import PolicyLevel from "./component/policyLevel.vue";
import PolicyRegionAnalysis from "./component/policyRegionAnalysis.vue";

const echartVal = ref<any>({
  mapAnalysis: null,
  policyType: null,
  publishLevel: null,
});
const policyReleased = ref("");
const policyLevelImg = ref(null);
const policyTypeImg = ref(null);
const policyRegionAnalysisImg = ref(null);

const contentFilter = ref([]);

const loading = ref(true);
// 导出图片相关
const exportImgUrl = ref<Array<{ png: any; jpg: any }>>([]); // 导出图片地址
const exportVisible: Ref<boolean> = ref(false); // 是否打开导出图片弹窗
const ns = useNamespace("policyAnalysis");

const year = ref("");

function onChangeFilter(val: any) {
  year.value = contentFilter.value.find(
    (item) => item.paramValue === val,
  ).paramDesc;
  policyReleased.value = val;
  getPolicyAnalysisData();
}

// 导出图片
function exportResult() {
  exportImgUrl.value = [
    policyRegionAnalysisImg.value.exportImg(),
    policyLevelImg.value.exportImg(),
    policyTypeImg.value.exportImg(),
  ];
  exportVisible.value = true;
}

async function getPolicyAnalysisData() {
  loading.value = true;
  try {
    const {
      datas: { mapAnalysis, policyType, publishLevel },
    } = await policyAnalysis({ policyReleased: policyReleased.value });
    echartVal.value = {
      mapAnalysis: mapAnalysis.map((item) => {
        return {
          name: item.name,
          value: isNaN(Number(item.quantity)) ? 0 : Number(item.quantity),
        };
      }),
      policyType: policyType
        .sort((a, b) => {
          return Number(b.quantity) - Number(a.quantity);
        })
        .map((item) => {
          return {
            name: item.name,
            value: isNaN(Number(item.quantity)) ? 0 : Number(item.quantity),
          };
        }),
      publishLevel: publishLevel
        .sort((a, b) => {
          return Number(b.quantity) - Number(a.quantity);
        })
        .map((item) => {
          return {
            name: item.name,
            value: isNaN(Number(item.quantity)) ? 0 : Number(item.quantity),
          };
        }),
    };
  } catch (err) {
    return err;
  } finally {
    loading.value = false;
  }
}
async function getYear() {
  const { datas } = await getPolicyReleased();
  contentFilter.value = datas;
  year.value = datas[0].paramDesc;
  policyReleased.value = datas[0].paramValue;
  getPolicyAnalysisData();
}
getYear();
window.trackFunction("pc_Policy_SearchCalculation_click");
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-policyAnalysis-top {
  @include flex(center, space-between, nowrap);

  .es-policyAnalysis-top__left {
    @include flex(center, flex-start, nowrap);

    & > div {
      @include flex(center, flex-start, nowrap);
      margin-right: 24px;
    }

    .es-policyAnalysis-top__title {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
      margin-right: 16px;
      flex: 1;
    }
  }

  .es-policyAnalysis-top__right {
    @include flex(center, flex-start, nowrap);

    .es-policyAnalysis-top__line {
      @include widthAndHeight(1px, 24px);
      display: inline-block;
      background: #dbdce2;
      margin-right: 24px;
    }
  }
}

.es-policyAnalysis-footer {
  margin-top: 24px;
  display: flex;
}
</style>
