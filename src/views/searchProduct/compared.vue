<template>
  <div :class="ns.b()">
    <Breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="['es-commonPage', ns.b('content')]">
      <el-table :data="tableData" style="width: 100%" :border="true">
        <el-table-column fixed prop="name" label="" width="164">
          <template #default="scope">
            <p
              v-if="route.query.productType === 'INDUSTRY_ENERGY_STORAGE'"
              :style="{
                textAlign: 'left',
                color: 'rgba(0, 0, 0, 0.9)',
                'font-weight':
                  scope.$index === 2 || scope.$index === 6 || scope.$index === 9
                    ? 600
                    : 400,
              }"
            >
              {{ scope.row.name }}
            </p>
            <p
              v-if="route.query.productType === 'ENERGY_STORAGE_INVERTER'"
              :style="{
                textAlign: 'left',
                color: 'rgba(0, 0, 0, 0.9)',
                'font-weight':
                  scope.$index === 2 ||
                  scope.$index === 5 ||
                  scope.$index === 10
                    ? 600
                    : 400,
              }"
            >
              {{ scope.row.name }}
            </p>
            <p
              v-if="route.query.productType === 'ELECTRIC_CORE'"
              style="text-align: left; color: rgba(0, 0, 0, 0.9)"
            >
              {{ scope.row.name }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="info1" label="" width="204">
          <template #default="scope">
            <compardTable
              v-if="scope.row.info[0] && scope.row.info[0].show"
              :index="scope.$index"
              :info="scope.row.info[0] || {}"
              :choseIndex="choseIndexList[0]"
              :productType="route.query.productType"
              @onChoseProduct="choseIndexList[0] = $event"
              @onDeleteCompared="onDeleteCompared(0)"
            />
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="info2" label="" width="244">
          <template #default="scope">
            <compardTable
              v-if="scope.row.info[1] && scope.row.info[1].show"
              :index="scope.$index"
              :info="scope.row.info[1] || {}"
              :choseIndex="choseIndexList[1]"
              :productType="route.query.productType"
              @onChoseProduct="choseIndexList[1] = $event"
              @onDeleteCompared="onDeleteCompared(1)"
            />
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="info3" label="" width="244">
          <template #default="scope">
            <compardTable
              v-if="scope.row.info[2] && scope.row.info[2].show"
              :index="scope.$index"
              :info="scope.row.info[2] || {}"
              :choseIndex="choseIndexList[2]"
              :productType="route.query.productType"
              @onChoseProduct="choseIndexList[2] = $event"
              @onDeleteCompared="onDeleteCompared(2)"
            />
            <div v-else />
          </template>
        </el-table-column>
        <el-table-column prop="info4" label="" width="244">
          <template #default="scope">
            <compardTable
              v-if="scope.row.info[3] && scope.row.info[3].show"
              :index="scope.$index"
              :info="scope.row.info[3] || {}"
              :choseIndex="choseIndexList[3]"
              :productType="route.query.productType"
              @onChoseProduct="choseIndexList[3] = $event"
              @onDeleteCompared="onDeleteCompared(3)"
            />
            <div v-else />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getProductComparedApi } from "@/api/searchProduct";
import compardTable from "./components/compardTable.vue";
import { useUserStoreHook } from "@/store/modules/user";
import { cloneDeep } from "lodash";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const ns = useNamespace("searchProductCompared");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "查产品", path: "/searchProduct" },
  { text: "产品对比", path: "" },
]);
const tableData: Ref<Array<any>> = ref([]); // 表格数据
const tabNameList = ref([
  "",
  "产品型号",
  "电池参数",
  "电芯类型",
  "电池系统能量/kWh",
  "放电深度/%",
  "PCS参数",
  "标称电压/V",
  "额定功率/kW",
  "系统参数",
  "产品形态",
  "系统综合效率/%",
  "年衰减率/%",
  "冷却方式",
  "尺寸/m'm",
  "产品单价（元/kWh）",
]);
const tabNameList2 = ref([
  "",
  "产品名称",
  "产品型号",
  "产品形态",
  "容量/Ah",
  "充/放电倍率",
  "能量密度",
  "循环寿命",
  "尺寸",
  "产品单价/元/Wh",
]);
const tabNameList3 = ref([
  "",
  "产品型号",
  "直流侧参数",
  "直流电压范围/V",
  "最大直流电流/A",
  "交流侧参数",
  "额定输出功率/kW",
  "额定交流电压/V",
  "额定交流电流/A",
  "额定交流频率",
  "系统参数",
  "最大效率/%",
  "工作温度范围",
  "相对湿度范围",
  "海拔高度",
  "冷却方式",
  "尺寸（W*H*D）/mm",
  "重量/kg",
  "产品单价/元/台",
]);
const choseIndexList = ref([0, 0, 0, 0]);
// 获取对比列表数据
const getComparedList = async () => {
  if (useUserStoreHook().comparedList.length === 0) {
    return;
  }
  tableData.value = [];
  const _data: any = {
    ids: [],
  };
  useUserStoreHook().comparedList.forEach((item) => {
    _data.ids.push(item.id);
  });
  _data.productType = route.query.productType;
  const { resp_code, datas }: any = await getProductComparedApi(_data);
  if (resp_code === 0) {
    tableData.value = [];
    datas.forEach((item: any) => {
      item.show = true;
      route.query.productType !== "INDUSTRY_ENERGY_STORAGE" &&
        (item.image = item.models[0].image || []);
    });
    const _productType = route.query.productType;
    const _length =
      _productType === "INDUSTRY_ENERGY_STORAGE"
        ? 16
        : _productType === "ENERGY_STORAGE_INVERTER"
          ? 19
          : 10;
    const _value =
      _productType === "INDUSTRY_ENERGY_STORAGE"
        ? tabNameList.value
        : _productType === "ENERGY_STORAGE_INVERTER"
          ? tabNameList3.value
          : tabNameList2.value;
    for (let index = 0; index < _length; index++) {
      tableData.value.push({
        name: _value[index],
        info: cloneDeep(datas),
      });
    }
  }
};
getComparedList();
const onDeleteCompared = (index: number) => {
  // 将vuex中的数据删除
  useUserStoreHook().deleteComparedList(index);
  tableData.value.forEach((item) => {
    item.info.splice(index, 1);
  });
};
onMounted(() => {
  useUserStoreHook().comparedList.length === 0 &&
    router.replace({ name: "SearchProduct" });
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProductCompared {
  padding-bottom: 80px;
}
.es-searchProductCompared-content {
  @include widthAndHeight(1148px);
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  margin-top: 36px !important;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-searchProductCompared {
  .el-table__header-wrapper {
    height: 0;
  }
  .el-table .el-table__cell {
    height: auto !important;
    padding: 9px 15px 7px 15px;
  }
  .el-table .cell {
    padding: 0;
  }
  .el-table__row td:nth-of-type(1) {
    background: #f2f3f5;
    text-align: right;
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    border-right: none !important;
  }
}
</style>
