<template>
  <el-dialog
    v-model="dialogVisible"
    title=""
    width="400"
    :before-close="handleClose"
    class="login-dialog"
  >
  <img class="avatar" :src="useUserStoreHook().$state.userInfo.avatar_url" alt="">
  <el-upload
      class="upload-demo"
      action="http://api-1980831594.ap-east-1.elb.amazonaws.com/web/api/open/img"
      :show-file-list="false"
      :auto-upload="true"
      :multiple="false"
      :on-success="handleAvatarSuccess"
    >
    <el-button type="primary">上传头像</el-button>
  </el-upload>
  <el-input
    v-model="form.nickname"
    style="width: 100%; margin-bottom: 1.25vw"
    placeholder="请输入昵称"
  />
  <template #footer>
      <div class="dialog-footer">
        <el-button @click="onSave" class="btn-foot">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { editUserInfoApi } from "@/api/index";
import { ElMessage } from "element-plus";
const dialogVisible = ref(true);
const emits = defineEmits(["close"]);
const form = ref({
  nickname: useUserStoreHook().$state.userInfo.nickname,
});
const handleAvatarSuccess = (res: any) => {
  if (res.code === 200) {
    ElMessage.success("上传成功");
    editUserInfoApi({avatar_url: res.data.url});
    useUserStoreHook().handleGetUserInfo();
    emits("close");
  }
};
const onSave = () => {
  editUserInfoApi({ nickname: form.value.nickname }).then((res) => {
    if (res.code === 200) {
      ElMessage.success("修改成功");
      useUserStoreHook().handleGetUserInfo();
      emits("close");
    }
  })
}
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.el-upload-list {
  display: none;
}
.avatar {
  @include widthAndHeight(4.16667vw,4.16667vw);
  border-radius: 50%;
  margin: 0 auto 2vw;
  display: block;
}
.upload-demo {
  text-align: center;
  margin-bottom: 2vw;
}
.btn-foot {
    width: 100%;
    @include flex(center, center, nowrap);
    span {
      width: 100%;
      @include flex(center, center, nowrap);
    }
  }
.el-button--primary {
  background-color: #222121 !important;
  padding: 1vw 6vw !important;
}
</style>
