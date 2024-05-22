<template>
  <el-dialog
    :model-value="dialogVisibleShow"
    title="修改头像"
    width="408px"
    center
    :before-close="handleClose"
    align-center
    class="avatar-dialog"
    :append-to-body="true"
  >
    <div class="modify-avatar__cropper">
      <el-upload
        v-show="imgUrl === ''"
        v-loading="loading"
        class="upload-demo"
        drag
        :action="`${baseUrl}/api-file/fileUpload`"
        :headers="{ Authorization: `Bearer ${token}` }"
        multiple
        :show-file-list="false"
        :before-upload="onBeforeUpload"
        :on-success="onSuccessUpload"
      >
        <img
          class="modify-avatar__icon"
          src="@/assets/img/common/modify-avatar-icon.png"
        />
        <div class="el-upload__text">
          <p>点击上传头像</p>
          支持 3MB 以内的 JPG 或 PNG 图片
        </div>
      </el-upload>
      <VueCropper
        v-show="imgUrl !== ''"
        ref="cropper"
        v-loading="loading"
        :img="imgUrl"
        :output-size="1"
        output-type="png"
        :auto-crop-width="120"
        :auto-crop-height="120"
        :auto-crop="true"
        :can-move="false"
        :fixed="true"
        :can-scale="false"
        style="width: 240px; height: 240px"
        class="animate__animated animate__fadeIn"
        @realTime="onRealTime"
      />
      <div class="modify-avatar__cropper__preview">
        <div
          v-show="previews['url']"
          style="width: 80px; height: 80px; overflow: hidden"
        >
          <div :style="cropperBox">
            <img :src="previews['url']" :style="previews['img']" />
          </div>
        </div>
        <div v-show="!previews['url']" />
        <p>头像预览</p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-upload
          v-if="imgUrl !== ''"
          class="upload-demo__reUpload"
          :action="`${baseUrl}/api-file/fileUpload`"
          :headers="{ Authorization: `Bearer ${token}` }"
          multiple
          :show-file-list="false"
          :before-upload="onBeforeUpload"
          :on-success="onSuccessUpload"
          >重新上传</el-upload
        >
        <div v-else />
        <div class="modify-avatar__foot">
          <div class="common-follow" @click="handleClose">取 消</div>
          <div
            :class="[
              imgUrl === '' ? 'filed-upload' : 'complete-upload common-button',
            ]"
            @click="onSuccess"
          >
            确 定
          </div>
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { useUserStore } from "@/store/modules/user";
import { getToken } from "@/utils/auth";
import axios from "axios";
export default defineComponent({
  name: "ModifyAvatar",
  components: {
    VueCropper,
  },
  props: {
    dialogVisibleShow: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const fileUrl = useUserStore().getFileUrl;
    const imgWidth = ref(null);
    const imgHeight = ref(null);
    const cropperWidth = ref(null);
    const cropperHeight = ref(null);
    const previewStyle = reactive({ value: {} });
    const previews = ref({});
    const cropperBox = ref("");
    const imgUrl = ref("");
    const loading = ref(false);
    const token = getToken();
    const baseUrl = import.meta.env.VITE_GLOB_API_URL;
    onMounted(() => {});
    return {
      imgWidth, // 图片宽度
      imgHeight, // 图片高度
      cropperWidth, // 裁剪框宽度
      cropperHeight, // 裁剪框高度
      previewStyle, // 预览样式
      previews, // 裁剪图片属性
      loading, // 上传loading
      cropperBox, // 裁剪框样式
      imgUrl, // 上传完图片链接
      token,
      fileUrl,
      baseUrl,
    };
  },
  methods: {
    handleClose() {
      this.$emit("onClose");
    },
    // 图片上传之前
    onBeforeUpload(file) {
      this.loading = true;
      const blob = new Blob([file], { type: "image/png" });
      this.imgUrl = window.URL.createObjectURL(blob);
      // 获取上传图片宽高
      const reader = new FileReader();
      reader.onload = (event) => {
        const txt = event.target.result;
        const img = document.createElement("img");
        img.src = txt;
        img.onload = () => {
          // 设置截取框背景图片宽高
          if (img.width >= img.height) {
            this.imgWidth = 240;
            this.imgHeight = (240 * img.height) / img.width;
          } else {
            this.imgHeight = 240;
            this.imgWidth = (240 * img.width) / img.height;
          }
        };
      };
      reader.readAsDataURL(file);
    },
    // 图片上传成功
    onSuccessUpload() {
      this.loading = false;
    },
    // 确认上传图片
    onSuccess() {
      if (this.imgUrl) {
        this.$refs.cropper.getCropBlob((data) => {
          const formData = new FormData();
          formData.append("file", data, "avatar.png"); //添加图片信息的参数
          axios({
            method: "post",
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
            url: `${this.baseUrl}/api-file/fileUpload`,
            data: formData,
          })
            .then((data) => {
              if (data.data.resp_code === 0) {
                this.imgUrl = data.data.datas;
                this.$emit("onSuccessAvatar", this.imgUrl);
              }
            })
            .catch(() => {
              this.$message.warning("网络似乎不通畅，请检查后再试");
            });
        });
      }
    },
    // 实时裁剪
    onRealTime(data) {
      const previews = data;
      this.cropperWidth = previews.w;
      this.cropperHeight = previews.h;
      this.previewStyle1 = {
        width: previews.w + "px",
        height: previews.h + "px",
        overflow: "hidden",
        margin: "0",
      };
      // 获取截取框的偏移量
      const cropperImg = document.getElementsByClassName("cropper-crop-box")[0];
      const transformX = cropperImg["style"].transform
        .split("(")[1]
        .split(",")[0]
        .split("px")[0];
      const transformY = cropperImg["style"].transform
        .split("(")[1]
        .split(",")[1]
        .split("px")[0];
      // 设置预览框背景图宽高
      data.img.width = (this.imgWidth * 80) / data.w + "px";
      data.img.height = (this.imgHeight * 80) / data.h + "px";
      this.cropperBox = `width: ${
        (240 * data.img.width.split("px")[0]) / this.imgWidth
      }px;height: ${
        (240 * data.img.height.split("px")[0]) / this.imgHeight
      }px;display:flex;align-items: center;justify-content: center;`;
      // 计算偏移量
      const previewWidth = (240 * 80) / data.w;
      const previewHeight = (240 * 80) / data.h;
      const X = (transformX * previewWidth) / 240;
      const Y = (transformY * previewHeight) / 240;
      data.img.transform = `translateX(-${X}px) translateY(-${Y}px)`;
      this.$nextTick(() => {
        this.previews = data;
      });
    },
  },
});
</script>
<style lang="scss">
.avatar-dialog {
  border-radius: 8px;

  .el-dialog__header {
    text-align: left;
  }

  .el-dialog__title {
    color: #1c232f;
    font-weight: 600;
    font-size: 18px;
  }
}

.modify-avatar__cropper {
  display: flex;

  .el-upload {
    width: 240px;
    height: 240px;

    .el-upload-dragger {
      width: 100%;
      height: 100%;
      background: #f4f5f7;
      border: 1px solid transparent;
    }
  }
}

.upload-demo__reUpload {
  color: #165dff;

  .el-upload--picture-card:hover,
  .el-upload:focus {
    color: #165dff;
  }

  .el-upload {
    width: 56px;
    height: 22px;
  }

  .el-upload--picture-card:hover,
  .el-upload {
    color: #165dff;
  }
}

.el-dialog__body {
  padding-top: 0;
  padding-bottom: 0;
}

.vue-cropper {
  width: 480px;
  height: auto;
}

.el-upload__text {
  font-size: 12px !important;
  color: #5e6982;
  margin-top: 24px;

  p {
    font-size: 14px;
    color: #165dff;
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  line-height: 32px;
  font-size: 14px;
}

.modify-avatar__icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.modify-avatar__reUpload {
  color: #165dff;
  cursor: pointer;
}

.modify-avatar__foot {
  display: flex;
  cursor: pointer;

  div {
    width: 64px;
    height: 32px;
    background: #f3f4f7;
    border-radius: 4px;
  }

  div:nth-of-type(1) {
    color: #5b6985;
    margin-right: 8px;
  }

  .complete-upload {
    background: #165dff;
    color: #ffffff;
  }

  .filed-upload {
    background: #94bfff;
    color: #ffffff;
    cursor: not-allowed;
  }
}

.modify-avatar__cropper__preview {
  margin-left: 24px;

  img {
    width: 80px;
    height: 80px;
    background: #f4f5f7;
  }

  div {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: #f4f5f7;
  }

  p {
    font-size: 14px;
    color: #5b6985;
    text-align: center;
    margin-top: 8px;
  }
}
</style>
