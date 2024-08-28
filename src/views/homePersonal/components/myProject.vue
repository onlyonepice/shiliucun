<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的项目</h3>
    </div>
    <el-table
      class="animate__animated animate__fadeIn"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      header-row-class-name="table-class"
    >
      <el-table-column prop="createdDate" label="时间" />
      <el-table-column prop="projectName" label="项目名称" />
      <el-table-column prop="enterpriseName" label="企业">
        <template #default="scope">
          <p>
            {{ scope.row.enterpriseName ? scope.row.enterpriseName : "-" }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="region" label="地区" />
      <el-table-column prop="investmentModel" label="投资模式">
        <template #default="scope">
          <p>
            {{
              scope.row.cooperationPlan.investmentModel === 1
                ? "EMC合同能源管理"
                : "业主自投"
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <p :class="[ns.b('buy')]" @click="onChick(scope.row.id)">查看</p>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" @onchangeCurrent="onchangeCurrent" />
  </div>
</template>

<script lang="ts" setup>
interface PAGEINFO {
  page: Number;
  limit: Number;
}
import { ref, Ref } from "vue";
import { getMyProjectListApi } from "@/api/user";
import useNamespace from "@/utils/nameSpace";
import { useRouter } from "vue-router";
const router = useRouter();
const ns = useNamespace("myProject");
const tableData: Ref<any> = ref([]);
const loading: Ref<boolean> = ref(false); // 加载数据
const total: Ref<number> = ref(0); // 数据总数
const pageInfo: Ref<PAGEINFO> = ref({
  page: 1,
  limit: 10,
});
// 页数改变
const onchangeCurrent = (val: number) => {
  pageInfo.value.page = val;
  getProjectList();
};
// 获取我的订单列表
const getProjectList = async () => {
  loading.value = true;
  const { resp_code, datas }: any = await getMyProjectListApi(pageInfo.value);
  if (resp_code === 0) {
    tableData.value = datas.content;
    total.value = datas.total;
    loading.value = false;
  }
};
getProjectList();
// 支付
const onChick = (id: string) => {
  router.push(`/calculationLite?id=${id}`);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-myProject-top {
  @include flex(center, space-between, nowrap);
  @include padding(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
.es-myProject-buy {
  @include font(14px, 400, #244bf1, 22px);
  cursor: pointer;
}
.es-myProject-invoicing {
  @include widthAndHeight(512px, 312px);
}
</style>
