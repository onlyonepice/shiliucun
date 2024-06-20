<template>
  <div :class="ns.b()">
    <h4>{{ detail.reportName }}</h4>
    <div :class="ns.b('tab')">
      <span v-for="item in detail.reportTag" :key="item">{{ item }}</span>
    </div>
    <h4 :class="ns.b('author')" v-if="detail.author">
      分析师：{{ detail.author.join("、") }}
    </h4>
    <p :class="ns.b('write')">撰写时间：{{ detail.writingTime }}</p>
    <el-button
      :class="ns.be('button', 'big')"
      type="primary"
      @click="onBuyReport()"
      >{{ isNeedBuy ? "立即购买" : "下载报告" }}</el-button
    >
    <div :class="ns.be('button', 'list')">
      <el-button
        :class="ns.be('button', 'collection')"
        @click="onCollection()"
        >{{ props.detail.isCollected ? "取消收藏" : "收藏" }}</el-button
      >
      <el-button :class="ns.be('button', 'share')" @click="onShare()"
        >分享</el-button
      >
    </div>
    <div :class="ns.be('score', 'head')">
      <h5>报告评分</h5>
      <span v-if="score !== -1">{{ scoreTextList[score] }}</span>
    </div>
    <div :class="ns.be('score', 'content')" @mouseleave="onMouseleave()">
      <div
        v-for="item in 5"
        :key="item"
        @mouseenter="onMouseScore(item)"
        @click="onScore(item)"
      >
        <img
          :class="ns.be('score', 'chose')"
          v-if="item <= score + 1"
          :src="StarFull"
          alt=""
        />
        <img :src="StarEmpty" alt="" />
      </div>
    </div>
    <el-button :class="ns.be('button', 'big')" @click="showDialog = true"
      >内容纠错</el-button
    >
  </div>
  <Dialog
    title="报告内容纠错"
    :visible="showDialog"
    confirmText="保存"
    width="560px"
    height="432px"
    @onHandleClose="onHandleClose"
    :class="ns.be('dialog--content', 'error')"
  >
    <template #content>
      <div :class="ns.be('content', 'dialog')">
        <span required>您的姓名</span>
        <Select
          type="input"
          :defaultValue="errorContent.name"
          width="434px"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'name');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'dialog')">
        <span required>联系方式</span>
        <Select
          type="input"
          :defaultValue="errorContent.contactInformation"
          width="434px"
          :maxlength="11"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'contactInformation');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'dialog')">
        <span required>内容描述</span>
        <Select
          type="input"
          :defaultValue="errorContent.describe"
          specialType="textarea"
          width="434px"
          height="64px"
          :maxlength="200"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'describe');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'dialog')">
        <span>内容截图</span>
        <el-upload
          v-model:file-list="fileList"
          :action="`${VITE_GLOB_API_URL}/api-file/fileUpload`"
          :headers="uploadToken"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :class="fileList.length > 2 ? ns.bm('content', 'hidden') : ''"
        >
          <el-icon>
            <img :src="UploadImg" />
          </el-icon>
        </el-upload>
      </div>
    </template>
  </Dialog>
  <el-dialog
    v-model="dialogVisible"
    :append-to-body="true"
    :class="ns.be('dialog--content', 'preview')"
  >
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  getFilePathApi,
  getFileApi,
  setReportCollectApi,
  setReportFeedbackApi,
  setReportScoreApi,
} from "@/api/reportDetail";
const { VITE_GLOB_API_URL } = import.meta.env;
import { getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import { regMobile } from "@/utils/rule";
import useClipboard from "vue-clipboard3";
import useNamespace from "@/utils/nameSpace";
import type { UploadProps } from "element-plus";
import { ref, defineProps, Ref, watch } from "vue";
import { useUserStore } from "@/store/modules/user";
import { reportStore } from "@/store/modules/report";
import UploadImg from "@/assets/img/common/upload-image.png";
import StarEmpty from "@/assets/img/reportDetail/i-Report-star.png";
import StarFull from "@/assets/img/reportDetail/i-Report-star-fill.png";
const props = defineProps({
  detail: {
    type: Object,
    default: () => {},
  },
  isNeedBuy: {
    type: Boolean,
    default: false,
  },
});
const ns = useNamespace("reportDetailOption");
const { toClipboard } = useClipboard();
const emit = defineEmits(["onBuy"]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref([]); // 纠错内容照片墙中的图片
const showDialog: Ref<boolean> = ref(false); // 报告纠错弹窗
const scoreTextList = ref(["比较差", "较差", "一般", "较好", "比较好"]);
const scoreSure: Ref<number> = ref(props.detail.reportScoring - 1); // 确定分数
const storageDetail: Ref<any> = ref(null); // 缓存详情接口，用于修改收藏状态，无需重复调用详情接口
const errorContent: Ref<any> = ref({
  name: "",
  contactInformation: "",
  describe: "",
}); // 纠错内容
const uploadToken: Ref<any> = ref({
  Authorization: "Bearer " + getToken(),
  Tenant: "iReport-front",
});
const score: Ref<number> = ref(
  props.detail.reportScoring === 0 ? -1 : props.detail.reportScoring - 1,
);

watch(
  () => props.detail,
  (val) => {
    storageDetail.value = val;
  },
  {
    immediate: true,
    deep: true,
  },
);
// 修改纠错内容弹窗内容
const onChangeInfo = (val: string, type: string) => {
  errorContent.value[type] = val;
};

// 查看大图
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

// 关闭弹窗
const onHandleClose = async (type: boolean) => {
  if (!type) {
    showDialog.value = false;
  } else {
    if (
      errorContent.value.name === "" ||
      errorContent.value.contactInformation === "" ||
      errorContent.value.describe === ""
    ) {
      return ElMessage.warning("请将内容填写完整");
    }
    if (!regMobile.test(errorContent.value.contactInformation)) {
      return ElMessage.error("请输入正确手机号");
    }
    const _data = errorContent.value;
    _data.url = fileList.value
      .map((item: any) => item.response.datas)
      .join(",");
    _data.moduleName = props.detail.moduleName;
    _data.reportId = props.detail.id;
    _data.reportName = props.detail.reportName;
    const { resp_code }: any = await setReportFeedbackApi(_data);
    if (resp_code === 0) {
      ElMessage.success("内容纠错上传成功");
      showDialog.value = false;
    }
  }
  errorContent.value = {};
  fileList.value = [];
};

// 购买报告
const onBuyReport = async () => {
  if (props.isNeedBuy) {
    emit("onBuy");
  } else {
    if (props.detail.isTopping === 1) {
      return getReportLink();
    }
    if (useUserStore().checkPermission("REPORT_DOWNLOAD")) {
      getReportLink();
    }
  }
};

// 获取报告链接
const getReportLink = async () => {
  const { fileId, reportName, moduleName } = props.detail;
  const { resp_code, datas }: any = await getFilePathApi({
    fileId,
    fileType: "pdf",
    moduleName: reportStore().getReportMapList(moduleName).ch,
  });
  if (resp_code === 0) {
    getFileDownloadPdf(datas.url, datas["x-oss-meta-token"], reportName);
  }
};

// 下载报告
const getFileDownloadPdf = async (url: string, token: string, name: string) => {
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
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

// 收藏按钮
const onCollection = async () => {
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
  const { resp_code }: any = await setReportCollectApi({
    collectionType: "REPORT",
    reportId: props.detail.id,
    uncollect: props.detail.isCollected,
    moduleName: props.detail.moduleName,
  });
  if (resp_code === 0) {
    ElMessage.success(
      storageDetail.value.isCollected ? "取消收藏" : "收藏成功",
    );
    storageDetail.value.isCollected = !storageDetail.value.isCollected;
  }
};

// 分享按钮
const onShare = async () => {
  await toClipboard(window.location.href);
  ElMessage.success("分享成功");
};

// 鼠标移入选择
const onMouseScore = (item: number) => {
  score.value = item - 1;
};

// 鼠标移出
const onMouseleave = () => {
  score.value = scoreSure.value;
};

// 打分
const onScore = async (item: number) => {
  score.value = item - 1;
  const { resp_code }: any = await setReportScoreApi({
    level: scoreTextList.value[score.value - 1],
    moduleName: props.detail.moduleName,
    reportId: props.detail.id,
    score: item,
  });
  if (resp_code === 0) {
    ElMessage.success("评分成功");
    scoreSure.value = item - 1;
  }
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-reportDetailOption {
  @include widthAndHeight(100%, 440px);
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;

  h4 {
    @include textOverflow(2);
    margin-bottom: 4px;
    line-height: 24px;
  }

  .es-reportDetailOption-author {
    width: 100%;
    margin: 16px 0 4px;
    @include textOverflowOne();
    display: block;
  }
}

.es-reportDetailOption-tab {
  @include flex(center, flex-start);
  padding-bottom: 15px;
  border-bottom: 1px solid #dbdce2;

  span {
    border-radius: 4px;
    @include font(12px, 400, #ff8d32, 20px);
    @include flex();
    margin-right: 8px;
    border: 1px solid #ff8d32;
    background: #fff3ea;
    padding: 2px 8px;
    box-sizing: border-box;
  }
}

.es-reportDetailOption-write {
  @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
}

.es-reportDetailOption-button__big {
  @include widthAndHeight(222px, 32px);
  margin-bottom: 8px;
  margin-top: 16px;
}

.es-reportDetailOption-button__list {
  @include flex(center, space-between, nowrap);
  margin-bottom: 32px;
}

.es-reportDetailOption-button__collection {
  @include widthAndHeight(107px, 32px);
}

.es-reportDetailOption-button__share {
  @include widthAndHeight(107px, 32px);
}

.es-reportDetailOption-score__head {
  height: 22px;
  @include flex(center, space-between, nowrap);

  span {
    @include font(14px, 400, #ff8d32, 22px);
  }
}

.es-reportDetailOption-score__content {
  @include flex(center, flex-start, nowrap);
  margin: 8px 0 8px;

  div {
    @include widthAndHeight(32px, 32px);
    cursor: pointer;
    @include relative();
    margin-right: 12px;
  }

  img {
    @include widthAndHeight(100%, 100%);
    @include absolute();
  }

  .es-reportDetailOption-score__chose {
    @include absolute(2);
  }
}

.es-reportDetailOption-content__dialog {
  @include flex(flex-start, flex-start, nowrap);
  margin-bottom: 16px;

  &:nth-last-child(1) {
    margin-top: 54px;
    margin-bottom: 0;
  }

  & > span {
    display: inline-block;
    line-height: 32px;
    @include widthAndHeight(72px, 100%);
    text-align: right;
    margin-right: 8px;
  }

  span[required]::before {
    content: "*";
    /* 添加一个星号作为标识符 */
    color: red;
    /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.es-reportDetailOption-content__dialog {
  .el-upload--picture-card {
    @include widthAndHeight(112px, 112px);
  }

  .el-upload-list__item {
    @include widthAndHeight(112px, 112px);
  }

  .el-icon {
    @include widthAndHeight(100%, 100%);

    img {
      @include widthAndHeight(100%, 100%);
    }
  }
}

.es-reportDetailOption-dialog--content__error {
  .el-dialog__footer {
    padding-top: 4px;
  }
}

.es-reportDetailOption-content--hidden {
  .el-upload {
    display: none;
  }
}

.es-reportDetailOption-dialog--content__preview {
  .el-dialog__body {
    @include flex();
    height: 600px;
  }
}
</style>
