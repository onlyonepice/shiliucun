<template>
  <div :class="ns.b('top')">
    <div :class="ns.be('top', 'empty')" />
    <div :class="ns.be('top', 'pageTo')">
      <el-input-number
        v-model="pdfPage"
        size="small"
        :min="1"
        :controls="false"
        style="width: 32px; height: 24px"
      />
      <span>/{{ totalPage }} 页</span>
    </div>
    <div :class="ns.be('top', 'zoom')">
      <img :src="NumberDown" alt="" />
      <span>{{ getPDFInfo.zoom }}</span>
      <img :src="NumberUp" alt="" />
    </div>
  </div>
  <iframe id="iframe" :src="previewPdfSrc" />
  <div :class="ns.b('bottom')" />
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
const pdfPage: Ref<number> = ref(1); // pdf页码
const totalPage: Ref<number> = ref(1); // pdf总页数
const pdfData: Ref<any> = ref(null); // 暂存pdf数据对象，需要删除
const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
});
const getPDFInfo: Ref<{
  zoom: string;
}> = ref({
  zoom: "100%",
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
    const _blob = await getFileDownloadPdf(datas.url, datas.token);
    window.URL.revokeObjectURL(pdfData.value);
    pdfData.value = window.URL.createObjectURL(_blob);
    previewPdfSrc.value = `static/html/viewer.html?file=${pdfData.value}`;
    console.log("==========", previewPdfSrc.value);
  }
};
// 下载pdf文件
const getFileDownloadPdf = async (url: string, token: string) => {
  const res: any = await getFileApi(url, token);
  if (res.status === 200) {
    const blob = new Blob([res], { type: "application/pdf" });
    if (toType(blob) === "object") {
      ElMessage.error("文件已被删除或不存在");
    }
    return blob;
  }
};
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
  @include widthAndHeight(100%, calc(100% - 64px - 48px));
  background: #dbdce2;
}
.es-reportDetailInfo-bottom {
  @include widthAndHeight(100%, 64px);
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
