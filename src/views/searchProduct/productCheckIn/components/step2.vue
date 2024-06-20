<template>
  <div :class="[ns.b()]">
    <el-form ref="formRef" :model="form" label-width="auto">
      <el-form-item
        v-for="item in formField"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :rules="item.rules"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model.trim="form[item.prop]"
          placeholder="请输入"
        />
        <el-date-picker
          v-if="item.type === 'month'"
          v-model="form[item.prop]"
          type="month"
          format="YYYY-MM"
          placeholder="请选择"
        />
        <template v-if="item.type === 'uploadImgs'">
          <div class="image-list">
            <div
              class="image-item"
              v-for="(imgUrl, index) in form[item.prop]"
              :key="imgUrl"
            >
              <img :src="fileUrl + imgUrl" alt="" />
              <div class="image-item-mark">
                <img
                  @click="handleView(index, item.prop)"
                  src="@/assets/img/searchProduct/view.png"
                  alt=""
                />
                <img
                  @click="handleDelete(index, item.prop)"
                  src="@/assets/img/searchProduct/del.png"
                />
              </div>
            </div>
            <el-upload
              v-if="(form[item.prop]?.length || 0) < item.limit"
              class="custom-uploader"
              :action="`${VITE_GLOB_API_URL}/api-file/fileUpload`"
              :headers="{ Authorization: `Bearer ${getToken()}` }"
              :show-file-list="false"
              :auto-upload="true"
              :multiple="false"
              :on-success="(data) => handleAvatarSuccess(data, item)"
              :before-upload="
                (file) => {
                  return beforeAvatarUpload(file, item);
                }
              "
            >
              <div class="addImg image-item">
                <img src="@/assets/img/searchProduct/add.png" alt="" />
                <p>点击上传</p>
              </div>
            </el-upload>
          </div>
          <p class="hint">{{ item.text }}</p>
        </template>
        <template v-if="item.type === 'uploadField'">
          <div class="field-list">
            <el-upload
              v-if="(form[item.prop]?.length || 0) < item.limit"
              class="custom-uploader"
              :action="`${VITE_GLOB_API_URL}/api-file/v1.1/fileUpload`"
              :headers="{ Authorization: `Bearer ${getToken()}` }"
              :show-file-list="false"
              :auto-upload="true"
              :multiple="false"
              :on-success="(data) => handleAvatarSuccess(data, item)"
              :before-upload="
                (file) => {
                  return beforeAvatarUpload(file, item);
                }
              "
            >
              <el-button>上传pdf/jpg文件</el-button>
            </el-upload>
            <div
              class="field-item"
              v-for="(field, index) in form[item.prop]"
              :key="field.id"
            >
              <div class="field-item-name" :title="field.name">
                {{ field.name }}
              </div>
              <div
                @click="handleDelete(index, item.prop)"
                class="field-item-icon"
              >
                <img src="@/assets/img/searchProduct/field-del.png" alt="" />
              </div>
            </div>
          </div>
          <p class="hint">{{ item.text }}</p>
        </template>
      </el-form-item>
      <el-form-item label=" ">
        <div :class="ns.e('footer-btns')">
          <el-button @click="handleBack">上一步</el-button>
          <el-button @click="handleNext(formRef)" type="primary">
            下一步
          </el-button>
          <el-button @click="handleSaveDraft">保存草稿</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-image-viewer
      v-if="showBig"
      :onClose="handelViewImgClose"
      :url-list="showBigImgList"
    />
  </div>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import { ref, watch } from "vue";
import { step2Field } from "./data";
import { ElMessage } from "element-plus";
import { getToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
const { VITE_GLOB_API_URL } = import.meta.env;
import useNamespace from "@/utils/nameSpace";

const prop = defineProps({
  draftData: {
    type: Object,
    default: null,
  },
});
watch(
  () => prop.draftData,
  () => {
    if (prop.draftData) {
      for (const key in prop.draftData) {
        formField.value.forEach((item) => {
          if (item.prop === key) {
            form.value[key] = prop.draftData[key];
          }
        });
      }
    }
  },
  {
    immediate: true,
  },
);

const { fileUrl } = useUserStoreHook().$state;
const formField = ref(step2Field);
const ns = useNamespace("step2");
const showBigImgList = ref([]);
const showBig = ref(false);
const formRef = ref(null);
const form = ref<any>({});

const emits = defineEmits(["next", "back", "saveDraft"]);

// 校验文件
function beforeAvatarUpload(rawFile, { accept, size }) {
  console.log(rawFile, getFileType(rawFile.name));
  if (!accept.includes(getFileType(rawFile.name))) {
    ElMessage({ message: "文件类型不支持", type: "error" });
    return false;
  }
  if (rawFile.size > size * 1024 * 1024) {
    ElMessage({ message: `文件大小不能超过${size}M`, type: "error" });
    return false;
  }
  return true;
}
// 上传成功
function handleAvatarSuccess({ resp_code, datas }, { prop }) {
  if (resp_code === 0) {
    !form.value[prop]?.length && (form.value[prop] = []);
    form.value[prop].push(datas);
  }
}
function handleView(index, field) {
  const imgArr = form.value[field].map((item) => fileUrl + item);
  let temp = [];
  for (let i = 0; i < index; i++) {
    temp.push(imgArr.shift());
  }
  showBigImgList.value = imgArr.concat(temp);
  showBig.value = true;
}
function handleDelete(index, field) {
  form.value[field].splice(index, 1);
}
function handelViewImgClose() {
  showBig.value = false;
}
function getFileType(fileName) {
  // 获取最后一个点的位置
  const lastDotIndex = fileName.lastIndexOf(".");
  // 提取扩展名
  const fileExtension = fileName.substring(lastDotIndex + 1);
  return fileExtension;
}

function handleNext(formRefName) {
  formRefName.validate((valid) => {
    if (valid) {
      optimizeData();
      emits("next", form.value);
    } else {
      return;
    }
  });
}

function optimizeData() {
  if (form.value?.specificationDocumentFileList) {
    form.value.specificationDocumentFileList =
      form.value.specificationDocumentFileList.map((item) => {
        return {
          name: item.name,
          fileUrl: item.url || item.fileUrl,
        };
      });
  }
  if (form.value.releaseTime) {
    form.value.releaseTime = dayjs(form.value.releaseTime).format("YYYY-MM");
  }
}

function handleSaveDraft() {
  optimizeData();
  emits("saveDraft", form.value);
}
function handleBack() {
  emits("back");
}
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-step2 {
  margin: 0 auto;
  max-width: 562px;
  .image-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .image-item {
      position: relative;
      width: 131px;
      height: 131px;
      @include flex();
      border-radius: 4px;
      background: #ffffff;
      border: 1px solid #dbdce2;
      margin-right: 8px;
      &:nth-child(3n) {
        margin-right: 0;
      }
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        margin-bottom: 8px;
      }
      img {
        max-height: 100%;
        max-width: 100%;
      }
      .image-item-mark {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: inherit;
        @include flex();
        img {
          width: 24px;
          height: 24px;
          margin: 12px;
          cursor: pointer;
        }
      }
      &:hover {
        .image-item-mark {
          opacity: 1;
        }
      }
    }
    .addImg {
      flex-direction: column;
      background: #f2f3f5;
      color: rgba(0, 0, 0, 0.4) !important;
      &:hover {
        background: #ecedf0;
        color: rgba(0, 0, 0, 0.6) !important;
        border: 1px dashed #244bf1;
      }
      &:nth-child(1) {
        margin: 0;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
  .field-list {
    width: 100%;
    .el-button {
      color: rgba(0, 0, 0, 0.6);
    }
    .field-item {
      margin-top: 8px;
      @include flex(center, flex-start);
      .field-item-name {
        flex: 1;
        padding: 0 16px;
        padding-right: 14px;
        height: 32px;
        background: #f2f3f5;
        border-radius: 4px;
        @include textOverflow(1);
      }
      .field-item-icon {
        margin-left: 8px;
        width: 32px;
        height: 32px;
        @include flex();
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
        &:hover {
          border-radius: 4px;
          background: #f2f3f5;
        }
      }
    }
  }
  .es-step2__footer-btns {
    width: 100%;
    display: flex;
    .el-button {
      &:last-child {
        margin-left: auto;
      }
    }
  }
  .hint {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), normal);
  }
  ::v-deep(.el-input) {
    width: 100%;
  }
  ::v-deep(.el-image-viewer__wrapper) {
    .el-image-viewer__mask {
      height: calc(100% - 56px);
      margin-top: 56px;
    }
    .el-image-viewer__close {
      top: 92px;
    }
  }
}
</style>
