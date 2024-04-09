<template>
  <!-- <div :class="ns.b('top')" v-if="PDFViewerApplication !== null"> -->
  <div :class="ns.b('top')" v-if="false">
    <div :class="ns.be('top', 'empty')" />
    <template v-if="false">
      <div :class="ns.be('top', 'pageTo')">
        <el-input-number
          v-model="pdfPage"
          size="small"
          :min="1"
          :controls="false"
          style="width: 32px; height: 24px"
        />
        <span>/{{ pdfInfo.pagesCount }} 页</span>
      </div>
      <div :class="ns.be('top', 'zoom')">
        <img :src="NumberDown" alt="" @click="handlePDF('zoomIn')" />
        <span>{{ pdfInfo.pageScale }}</span>
        <img :src="NumberUp" alt="" @click="handlePDF('zoomOut')" />
      </div>
    </template>
  </div>
  <iframe id="iframe" :src="previewPdfSrc" width="100%" height="100%" />
  <div :class="ns.b('bottom')">
    <p>3000</p>
    <span>付费解锁</span>
    <el-button type="primary">立即购买</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import NumberDown from "@/assets/img/common/number-down.png";
import NumberUp from "@/assets/img/common/number-up.png";
import { getFilePathApi, getFileApi } from "@/api/reportDetail";
import { toType } from "@/utils";
import { ElMessage } from "element-plus";
const ns = useNamespace("reportDetailInfo");
const previewPdfSrc: Ref<string> = ref(""); // 预览pdf地址
// const pdfPage: Ref<number> = ref(1); // pdf页码
const totalPage: Ref<number> = ref(1); // pdf总页数
const pdfData: Ref<any> = ref(null); // 暂存pdf数据对象，需要删除
const pdfPage: Ref<number> = ref(1); // pdf页码
const pdfInfo: Ref<any> = ref({
  pageNumber: 1,
  pagesCount: 1,
  pageScale: 1,
}); // pdf信息
const PDFViewerApplication: Ref<any> = ref({
  toolbar: null,
}); // pdf预览对象
const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
});
// 获取pdf地址
const getFile = async () => {
  const _data = {
    fileId: props.detail.fileId,
    fileType: "pdf",
    moduleName: props.detail.moduleName,
  };
  const { datas, resp_code }: any = await getFilePathApi(_data);
  if (resp_code === 0) {
    totalPage.value = datas.pages;
    getFileDownloadPdf(datas.url, datas["x-oss-meta-token"]);
  }
};
// 下载pdf文件,转为blob对象
const getFileDownloadPdf = async (url: string, token: string) => {
  const { data }: any = await getFileApi(url, token);
  const blobType = toType(data);
  if (blobType === "object") {
    return ElMessage.error("文件已被删除或不存在");
  }
  if (blobType === "blob") {
    window.URL.revokeObjectURL(pdfData.value);
    pdfData.value = window.URL.createObjectURL(data);
    previewPdfSrc.value = `static/html/viewer.html?file=${pdfData.value}`;
    getPDFInfoFn();
  }
};
// 获取pdf信息
const getPDFInfoFn = () => {
  const t = window.setInterval(async () => {
    const pdfIframe: any = await document.querySelector("#iframe");
    if (pdfIframe) {
      const contentWindow = pdfIframe.contentWindow;
      if (
        contentWindow &&
        contentWindow.PDFViewerApplication &&
        contentWindow.PDFViewerApplication.pdfViewer
      ) {
        window.clearInterval(t);
        PDFViewerApplication.value = contentWindow.PDFViewerApplication;
        setTimeout(() => {
          const _toolbar = PDFViewerApplication.value.toolbar;
          pdfInfo.value.pageNumber = PDFViewerApplication.value.page;
          pdfInfo.value.pagesCount = PDFViewerApplication.value.pagesCount;
          pdfInfo.value.pageScale = (_toolbar.pageScale * 100).toFixed(0);
        });
      }
    }
  }, 300);
};
// 跳转pdf页码
// const handleUpdatePage = () => {
//   PDFViewerApplication.value.page = pdfPage.value;
// };
// // pdf放大缩小事件
// const handlePDF = (type: string) => {
//   type === "zoomIn"
//     ? PDFViewerApplication.value.zoomIn()
//     : PDFViewerApplication.value.zoomOut();
// };
getFile();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-reportDetailInfo-top {
  @include widthAndHeight(100%, 48px);
  @include flex(center, space-between, nowrap);
  .es-reportDetailInfo-top__pageTo {
    @include flex();
    span {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
      margin-left: 4px;
    }
  }
  .es-reportDetailInfo-top__zoom {
    padding-right: 20px;
    @include flex();
    img {
      @include widthAndHeight(16px, 16px);
      cursor: pointer;
    }
    span {
      margin: 0 12px;
    }
  }
}
#iframe {
  @include widthAndHeight(100%, calc(100% - 64px));
  background: #dbdce2;
}
.es-reportDetailInfo-bottom {
  @include widthAndHeight(100%, 64px);
  @include flex(center, center, nowrap);
  p {
    @include font(24px, 600, rgba(0, 0, 0, 0.9), 32px);
    margin-right: 8px;
    &::before {
      content: "¥";
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
  span {
    display: inline-block;
    background: #fff3eb;
    border-radius: 4px;
    border: 1px solid #ff892e;
    @include font(12px, 400, #ff892e, 20px);
    padding: 2px 8px;
    margin-right: 24px;
  }
}
</style>
<style lang="scss">
.es-reportDetailInfo-top {
  .el-input-number.is-without-controls .el-input__wrapper {
    padding: 0;
    height: 24px;
  }
  .el-input__wrapper .el-input__inner {
    text-align: center;
  }
}
</style>
