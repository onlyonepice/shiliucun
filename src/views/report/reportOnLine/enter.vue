<template>
  <div :class="[ns.b(''), 'es-commonPage']">
    <p class="page-title">原创报告。</p>
    <div class="content">
      <el-tree ref="treeRef" style="max-width: 384px" :data="treeData" show-checkbox default-expand-all node-key="id"
        highlight-current :props="defaultProps">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              {{ node.id }}
            </span>
          </span>
        </template>
      </el-tree>
      <div class="report-box">
        <onLineReportList style="margin-bottom: 24px;" width="198px" v-for="item in reportList" :page-data="item" />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('report-onLine')
import { ElTree } from 'element-plus'
import { ref, watch } from 'vue'
import { getOnlineReportSelected } from '@/api/home'
import onLineReportList from '@/components/Common/onLineReportList.vue'
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'label',
}

interface Tree {
  id: number
  label: string
  children?: Tree[]
}
const treeData = ref<Tree[]>([
  {
    id: 1,
    label: '报告分类',
    children: [
      {
        id: 4,
        label: '大储',
      },
      {
        id: 4,
        label: '户储',
      },
      {
        id: 4,
        label: '工商业',
      },
    ],
  },

])
const reportList = ref([])
const getOnlineReportSelectedFn = async () => {
  const data = await getOnlineReportSelected({
    limit: 12,
    page: 1,
    keyword: ''
  })
  if (data.resp_code === 0) {
    reportList.value = data.datas.records
  }
}
getOnlineReportSelectedFn()
</script>
<style lang="scss">
.es-report-onLine {

  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #244BF1;
  }

  .custom-tree-node {
    width: 226px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 22px;

    @media screen and (max-width: 1126px) {
      width: 180px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-report-onLine {
  padding-top: 80px;
  padding-bottom: 80px;

  .page-title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    margin-bottom: 32px;
  }

  .content {
    width: 100%;
    display: flex;

    .report-box {
      margin-left: 24px;
      width: 858px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
}
</style>