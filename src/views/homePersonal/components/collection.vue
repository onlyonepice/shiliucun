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
          {{ item.affiliationModule }} | {{ item.reportName }}
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
          v-if="item.state !== '已失效' && item.downloadPermission"
          type="primary"
          @click="onDownload(item)"
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
import { getFilePathApi, getFileApi } from "@/api/reportDetail";
import { useRouter } from "vue-router";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("homePersonalCollection");
const router = useRouter();
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
// 下载功能
const onDownload = async (item: any) => {
  if (item.isTopping === 1) {
    return getReportLink(item);
  }
  if (useUserStore().checkPermission("REPORT_DOWNLOAD")) {
    getReportLink(item);
  }
};
// 获取报告链接
const getReportLink = async (data: any) => {
  const { fileId, affiliationModule } = data;
  const { resp_code, datas }: any = await getFilePathApi({
    fileId,
    fileType: "pdf",
    moduleName: affiliationModule,
  });
  if (resp_code === 0) {
    getFileDownloadPdf(datas.url, datas["x-oss-meta-token"], data.reportName);
  }
};
// 下载报告
const getFileDownloadPdf = async (url: string, token: string, name: string) => {
  const { status, data }: any = await getFileApi(url, token);
  if (status === 200) {
    const a = document.createElement("a");
    const _url = URL || window.URL || window.webkitURL;
    a.href = _url.createObjectURL(data);
    a.download = name.indexOf(".pdf") !== -1 ? name : name + ".pdf";
    a.click();
    _url.revokeObjectURL(a.href);
  }
};
// 跳转i-report2预览
const onToDetail = (item: any) => {
  const { moduleName, reportId } = item;
  router.push(`/reportDetail?id=${reportId}&moduleName=${moduleName}`);
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
