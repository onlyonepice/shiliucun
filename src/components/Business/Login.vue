<template>
  <el-dialog
    v-model="dialogVisible"
    title="欢迎来到 影游天堂"
    width="500"
    :before-close="handleClose"
    class="login-dialog"
  >
    <template v-if="useUserStoreHook().$state.openLoginType === 'login'">
      <el-input
        v-model="form.email"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入邮箱地址"
      />
      <el-input
        v-model="form.password"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入密码"
        type="password"
        :show-password="!showPassword"
      />
      <div class="passwordTips">
        <p class="passwordTips___uSglk" @click="onForget()">
          忘记密码？/注册账号
        </p>
        <!-- <p class="passwordTips___uSglk" @click="onForget()">注册账号</p> -->
      </div>
    </template>
    <template v-else>
      <el-input
        v-model="form.email"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入邮箱地址"
        :disabled="openLoginType === 'editPassword'"
      />
      <div class="registerCode" v-if="openLoginType !== 'editPassword'">
        <el-input
          v-model="form.code"
          style="width: 64%"
          placeholder="请输入验证码"
        />
        <div class="registerCode-btn" @click="onSendCode">{{ btnDesc }}</div>
      </div>
      <el-input
        v-model="form.password"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入密码"
        type="password"
        :minlength="6"
        :show-password="!showPassword"
      />
      <el-input
        v-model="form.password2"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请确认密码"
        type="password"
        :minlength="6"
        :show-password="!showPassword"
      />
      <el-input
        v-if="openLoginType !== 'editPassword'"
        v-model="form.invite_code"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入邀请码（选填）"
      />
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onLogin" class="btn-foot">{{
          resetPassword
            ? "重置密码"
            : openLoginType === "login"
              ? "登入"
              : openLoginType === "editPassword"
                ? "保存"
                : "注册"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import {
  loginApi,
  sendVerificationCodeApi,
  editUserInfoApi,
} from "@/api/index";
import { setToken } from "@/utils/auth";
const dialogVisible = ref(true);
const openLoginType = ref(""); // 登录方式
const form: Ref<any> = ref({});
const showPassword: Ref<boolean> = ref(false); // 密码是否可见
const btnDesc: Ref<string> = ref("获取验证码"); // 倒计时文案
const resetPassword: Ref<boolean> = ref(false); // 重置密码
watch(
  () => useUserStoreHook().$state.openLoginType,
  (newVal) => {
    openLoginType.value = newVal;
    newVal === "editPassword" &&
      (form.value.email = useUserStoreHook().$state.userInfo.email);
  },
  {
    immediate: true,
  },
);
// 登陆/注册
const onLogin = async () => {
  const _form = form.value;
  if (useUserStoreHook().$state.openLoginType === "login") {
    if (_form.email === "" || _form.password === "") {
      return ElMessage.error("请输入账号和密码");
    }
  } else {
    if (
      _form.email === "" ||
      _form.password === "" ||
      _form.password2 === "" ||
      _form.code === ""
    ) {
      return ElMessage.error("请晚上注册信息");
    }
    if (_form.password !== _form.password2) {
      return ElMessage.error("两次密码不一致");
    }
  }
  if (_form.password.length < 6) {
    return ElMessage.error("密码长度最短6位");
  }
  if (openLoginType.value === "editPassword") {
    await editUserInfoApi({ password: _form.password });
    return useUserStoreHook().openLogin(false);
  }
  const { code, data }: any = await loginApi(form.value);
  if (code === 200) {
    useUserStoreHook().$state.token = data.token;
    setToken(data);
    useUserStoreHook().handleGetUserInfo();
    location.reload();
  }
  useUserStoreHook().openLogin(false);
};
// 忘记密码
const onForget = () => {
  resetPassword.value = true;
  // 忘记密码
  useUserStoreHook().$state.openLoginType = "register";
};

const handleClose = () => {
  useUserStoreHook().openLogin(false, useUserStoreHook().$state.openLoginType);
};
// 倒计时
const timer: Ref<any> = ref(null); // 定时器
const countDown = () => {
  btnDesc.value = "60s 后可重发";
  timer.value = setInterval(() => {
    let seconds = Number(btnDesc.value.replace("s 后可重发", ""));
    seconds--;
    btnDesc.value = seconds + "s 后可重发";
    if (seconds === 0) {
      clearInterval(timer.value);
      btnDesc.value = "重新获取";
    }
  }, 1000);
};
// 发送验证码
const onSendCode = async () => {
  try {
    if (btnDesc.value.indexOf("s") !== -1) {
      return false;
    }
    if (form.value.email === "") {
      return ElMessage.error("请输入邮箱");
    }
    await sendVerificationCodeApi({ email: form.value.email });
    ElMessage.success("发送成功");
    countDown();
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.login-dialog {
  width: 26vw;
  .btn-foot {
    width: 100%;
    @include flex(center, center, nowrap);
  }
}
.passwordTips {
  @include flex(center, space-between, nowrap);
}
.passwordTips___uSglk {
  font-size: 0.72917vw;
  font-weight: 500;
  color: #b6b3b3;
  cursor: pointer;
}
.registerCode {
  @include flex(center, space-between, nowrap);
  margin-bottom: 1.25vw;
  height: 32px;
  .registerCode-btn {
    width: 32%;
    background-color: #323030;
    color: #b6b3b3;
    font-size: 0.83333vw;
    font-weight: 500;
    padding: 0.625vw;
    border-radius: 0.625vw;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #222121;
    }
  }
}
.el-input.is-disabled .el-input__wrapper {
  background-color: #222121;
  box-shadow: none;
}
</style>
