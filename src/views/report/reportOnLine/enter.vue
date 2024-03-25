<template>
  <div :class="[ns.b(''), 'es-commonPage']">
    <p class="page-title">在线报告。</p>
    <div class="content">
      <el-tree ref="treeRef" :data="treeData" show-checkbox default-expand-all node-key="id" highlight-current
        :props="defaultProps">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              {{ node.id }}
            </span>
          </span>
        </template>
      </el-tree>
      <div class="report-wrapper">
        <p class="title">精选置顶</p>

        <div class="report-box">
          <onLineReportList width="198px" v-for="item in topReportList" :page-data="item" />
        </div>
        <div class="report-box">
          <onLineReportList width="198px" v-for="item in freeReportList" :page-data="item" />
        </div>
        <div class="report-box">
          <onLineReportList width="198px" v-for="item in reportList" :page-data="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('report-onLine')
import { ElTree } from 'element-plus'
import { ref, watch } from 'vue'
import { getOnlineReportSelected, getTopOnlineReportSelected, getFreeOnlineReportSelected } from '@/api/report'
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
const topReportList = ref([])
const freeReportList = ref([])
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
const getTopOnlineReportSelectedFn = async () => {
  const data = await getTopOnlineReportSelected({
    limit: 12,
    page: 1,
    keyword: ''
  })
  if (data.resp_code === 0) {
    topReportList.value = data.datas.records
  }
}
const getFreeOnlineReportSelectedFn = async () => {
  const data = await getFreeOnlineReportSelected({
    limit: 12,
    page: 1,
    keyword: ''
  })
  if (data.resp_code === 0) {
    freeReportList.value = data.datas.records
  }
}
getFreeOnlineReportSelectedFn()
getTopOnlineReportSelectedFn()
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

  .el-tree {
    max-width: 250px;

    @media screen and (max-width:1200px) {
      max-width: 180px;
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

    .report-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;

      .title {
        @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
        margin-bottom: 16px;
        margin-left: 1.25vw;
      }
    }

    .report-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .white-report-list {
        margin-left: 1.25vw;
        margin-bottom: 24px;
      }
    }
  }
}
</style>