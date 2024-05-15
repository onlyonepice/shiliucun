<template>
  <div :class="ns.b()">
    <Breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="['es-commonPage', ns.b('content')]">
      <el-table :data="tableData" style="width: 100%" :border="true">
        <el-table-column fixed prop="name" label="" width="124">
          <template #default="scope">
            <p>{{ scope.row.name }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="info1" label="" width="244">
          <template #default="scope">
            <compardTable
              v-if="scope.row.info[0] && scope.row.info[0].show"
              :index="scope.$index"
              :info="scope.row.info[0] || {}"
              :choseIndex="choseIndexList[0]"
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
import { useRouter } from "vue-router";
const router = useRouter();
const ns = useNamespace("searchProductCompared");
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "查产品", path: "/searchProduct" },
  { text: "产品对比", path: "" },
]);
const tableData: Ref<Array<any>> = ref([]); // 表格数据
const tabNameList = ref([
  "",
  "生产公司",
  "产品名称",
  "产品型号",
  "产品形态",
  "额定功率",
  "电池系统能量",
  "标称电压",
  "系统综合效率",
  "放电深度",
  "年衰减率",
  "冷却方式",
  "尺寸",
]);
const choseIndexList = ref([0, 0, 0, 0]);
// 获取对比列表数据
const getComparedList = async () => {
  if (useUserStoreHook().comparedList.length === 0) {
    return;
  }
  tableData.value = [];
  const _data: any = [];
  useUserStoreHook().comparedList.forEach((item) => {
    _data.push(item.id);
  });
  const { resp_code, datas }: any = await getProductComparedApi(_data);
  if (resp_code === 0) {
    datas.forEach((item: any) => {
      item.show = true;
    });
    for (let index = 0; index < 13; index++) {
      tableData.value.push({
        name: tabNameList.value[index],
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
    padding: 0;
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
