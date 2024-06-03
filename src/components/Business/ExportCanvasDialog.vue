<template>
  <el-dialog
    v-model="showDialog"
    :append-to-body="true"
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
      <img
        v-for="item in getCanvasImg"
        :key="item.png"
        :src="item[exportTypeValue]"
      />
      <div
        v-if="maskSize.show"
        :style="`width: ${maskSize.width}px;height: ${maskSize.height}px`"
        class="mask-canvas"
      >
        <h6>开通企业VIP查看完整数据</h6>
        <div>立即开通</div>
      </div>
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
    maskSize: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      exportType: ["png", "jpg"], // 导出类型
      exportTypeValue: "png", // 导出类型值索引
      showDialog: false,
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
      if (Array.isArray(this.imgUrl)) {
        return this.imgUrl;
      } else {
        return [this.imgUrl];
      }
      // return this.imgUrl[this.exportTypeValue];
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
      const { imgTitle, exportTypeValue } = this;
      const imgUrl = this.getCanvasImg;

      let count = 0;
      for (let i = 0; i < imgUrl.length; i++) {
        let _title;
        if (imgTitle !== "") {
          _title = imgTitle + "." + exportTypeValue;
        } else {
          _title = imgUrl[i]["title"] + "." + exportTypeValue;
        }
        exportImg(exportTypeValue, _title, imgUrl[i]["png"]).then(() => {
          count++;
          if (count === imgUrl.length) this.onCancel();
        });
      }
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
  max-height: 380px;
  overflow: auto;
  @include flex(center, center);
  padding: 8px;
  background: rgba(248, 249, 251, 0);
  border-radius: 4px;
  border: 1px solid #f1f2f6;
  position: relative;

  img {
    margin-top: 8px;
    @include widthAndHeight(100%);
    background-image: url("@/assets/img/common/canvas-img-bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    &:first-child {
      margin-top: 0;
    }
  }
}
.mask-canvas {
  @include absolute(1, 0, 0, none, none);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(25px);
  div {
  }
}
</style>
<style lang="scss"></style>
