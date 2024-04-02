<template>
  <el-dialog
    v-model="showDialog"
    width="560px"
    confirm-text="导出"
    title="图片格式选择"
  >
    <div class="es-dialog__body">
      <div
        v-for="item in exportType"
        :key="item"
        class="export-type"
        @click="handleSelectExportType(item)"
      >
        <img
          class="export-type-img"
          :src="
            exportTypeValue === item
              ? getImage.radioCheckTrue
              : getImage.radioCheckFalse
          "
        />
        <span class="export-type-text">{{
          item === "png" ? "透明底png" : "白色底jpg"
        }}</span>
      </div>
    </div>
    <div class="export-type__content">
      <img :src="getCanvasImg" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onExport">导出</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { exportImg } from "@/utils/index";
import RadioFalse from "@/assets/img/common/i-Report-radio-false.png";
import RadioTrue from "@/assets/img/common/i-Report-radio-true.png";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    imgUrl: {
      type: Object,
      default: () => {},
    },
    imgTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      exportType: ["png", "jpg"], // 导出类型
      exportTypeValue: "png", // 导出类型值索引
    };
  },
  watch: {
    visible(val) {
      this.showDialog = val;
    },
  },
  computed: {
    getImage() {
      return {
        radioCheckFalse: RadioFalse,
        radioCheckTrue: RadioTrue,
      };
    },
    getCanvasImg() {
      return this.imgUrl[this.exportTypeValue];
    },
  },
  methods: {
    // 选择导出类型
    handleSelectExportType(type) {
      this.exportTypeValue = type;
    },
    // 取消按钮
    onCancel() {
      this.$emit("close");
    },
    // 导出图片
    onExport() {
      this.showDialog = true;
      const { imgTitle, exportTypeValue, imgUrl } = this;
      const _title = imgTitle + "." + exportTypeValue;
      exportImg(exportTypeValue, _title, imgUrl["png"]).then((res) => {
        this.onCancel();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/style";
.es-dialog__body {
  @include flex(center, flex-start);
  @include margin(0, 0, 8px, 0);
}
.export-type {
  @include flex(center, center);
  @include margin(0, 32px, 0, 0);
  cursor: pointer;
}
.export-type-img {
  @include widthAndHeight(24px, 24px);
  @include margin(0, 4px, 0, 0);
}
.export-type-text {
  @include font(16px, 400, #1c232f, 24px);
}
.export-type__content {
  @include widthAndHeight(512px);
  @include flex(center, center);
  @include padding(8px, 0, 8px, 0);
  background: rgba(248, 249, 251, 0);
  border-radius: 4px;
  border: 1px solid #f1f2f6;
  img {
    @include widthAndHeight(496px);
    background-image: url("@/assets/img/canvas-img-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>
<style lang="scss"></style>
