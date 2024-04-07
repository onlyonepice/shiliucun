<template>
  <div :class="[ns.b()]">
    <h3>我的收藏</h3>
    <div
      :class="[ns.b('list'), 'animate__animated animate__fadeIn']"
      v-for="item in collectionList"
      :key="item.id"
    >
      <div>
        <div
          :class="[
            ns.b('type'),
            item.state === '已失效'
              ? ns.bm('type', '3')
              : item.state === '长期有效'
                ? ns.bm('type', '2')
                : ns.bm('type', '1'),
          ]"
        >
          {{ item.state }}
        </div>
        <div
          :class="[
            ns.b('title'),
            item.state === '已失效' ? ns.b('invalid') : '',
          ]"
        >
          {{ item.moduleName }} | {{ item.reportName }}
        </div>
        <div
          :class="[
            ns.b('date'),
            item.state === '已失效' ? ns.b('invalid') : '',
          ]"
        >
          收藏日期：{{ item.collectionDate }}
        </div>
      </div>
      <div>
        <el-button v-if="item.state !== '已失效'" @click="onToDetail(item)"
          >预览</el-button
        >
        <el-button
          v-if="item.state !== '已失效'"
          type="primary"
          @click="onToDetail(item)"
          >下载</el-button
        >
        <el-button
          v-if="item.state === '已失效'"
          type="primary"
          @click="onDelete(item.id)"
          >删除</el-button
        >
      </div>
    </div>
    <Pagination :total="total" @onchangeCurrent="onchangeCurrent" />
    <SkipMask v-bind="titleSkip" @onClose="onClose" />
  </div>
</template>

<script lang="ts" setup>
interface PAGEINFO {
  page: Number;
  limit: Number;
}
import { ref, Ref } from "vue";
import { myCollectListApi, deleteCollectApi } from "@/api/user";
const { VITE_I_REPORT_URL } = import.meta.env;
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("homePersonalCollection");
const pageInfo: Ref<PAGEINFO> = ref({
  page: 1,
  limit: 10,
});
const titleSkip = ref({
  title: "删除后文件不可恢复，确定删除吗？",
  cancel: "取消",
  confirm: "确定",
  show: false,
});
const collectionList: Ref<Array<any>> = ref([]); // 收藏列表
const total: Ref<number> = ref(0);
const choseId: Ref<number> = ref(0); // 选中操作的id
const getCollectionList = async () => {
  const { resp_code, datas }: any = await myCollectListApi(pageInfo.value);
  if (resp_code === 0) {
    total.value = datas.total;
    collectionList.value = datas.records;
  }
};
getCollectionList();
// 修改页码
const onchangeCurrent = (page: number) => {
  pageInfo.value.page = page;
  getCollectionList();
};
// 删除
const onDelete = (id: number) => {
  choseId.value = id;
  titleSkip.value.show = true;
  titleSkip.value.confirm = "确定";
  titleSkip.value.cancel = "取消";
};
// 关闭二次确认框
const onClose = async (type: boolean) => {
  if (!type) {
    return (titleSkip.value.show = false);
  }
  const { resp_code }: any = await deleteCollectApi(choseId.value);
  if (resp_code === 0) {
    titleSkip.value.show = false;
    getCollectionList();
  }
};
// 跳转i-report2预览
const onToDetail = (item: any) => {
  const { moduleName, reportId } = item;
  let _moduleName = "";
  switch (moduleName) {
    case "白皮书":
      _moduleName = "WHITE_PAPER";
      break;
    case "在线报告":
      _moduleName = "ONLINE_REPORT";
      break;
    case "季报月报":
      _moduleName = "QUARTERLY_AND_MONTHLY_REPORTS";
      break;
    default:
      break;
  }
  window.open(
    `${VITE_I_REPORT_URL}#/report-detail-pdf_V2?id=${reportId}&parent=${moduleName}&moduleName=${_moduleName}&from=/alliance-insight/white-paper`,
    "_blank",
  );
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalCollection {
  h3 {
    margin-bottom: 24px;
    line-height: 56px;
  }
}
.es-homePersonalCollection-list {
  @include widthAndHeight(810px, 122px);
  margin-bottom: 16px;
  border-radius: 4px;
  border: 1px solid #dbdce2;
  @include flex(center, space-between, nowrap);
  padding: 16px 24px 16px 16px;
}
.es-homePersonalCollection-type {
  margin-bottom: 16px;
  @include font(12px, 400, #f75964, 24px);
  @include flex();
}
.es-homePersonalCollection-type--1 {
  @include widthAndHeight(77px, 24px);
  background: #feeff0;
  border-radius: 4px;
  border: 1px solid #f75964;
}
.es-homePersonalCollection-type--2 {
  @include widthAndHeight(64px, 24px);
  background: #eff4ff;
  border-radius: 4px;
  border: 1px solid #244bf1;
  @include font(12px, 400, #244bf1, 20px);
}
.es-homePersonalCollection-type--3 {
  @include widthAndHeight(52px, 24px);
  background: #f2f3f5;
  border-radius: 4px;
  border: 1px solid #dbdce2;
  @include font(12px, 400, rgba(0, 0, 0, 0.9), 20px);
}
.es-homePersonalCollection-title {
  width: 568px;
  @include textOverflow();
  margin-bottom: 4px;
  @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
}
.es-homePersonalCollection-date {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
}
.es-homePersonalCollection-invalid {
  color: rgba(0, 0, 0, 0.26);
}
</style>
