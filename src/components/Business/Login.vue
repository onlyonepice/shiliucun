<template>
  <el-dialog
    v-model="dialogVisible"
    title="欢迎来到十六村"
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
      <p class="passwordTips___uSglk">忘记密码？</p>
    </template>
    <template v-else>
      <el-input
        v-model="form.email"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入邮箱地址"
      />
      <div class="registerCode">
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
        :show-password="!showPassword"
      />
      <el-input
        v-model="form.password"
        style="width: 100%; margin-bottom: 1.25vw"
        placeholder="请输入密码"
        type="password"
        :show-password="!showPassword"
      />
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onLogin" class="btn-foot">{{
          openLoginType === "login" ? "登入" : "注册"
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, watch, Ref } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { loginApi } from "@/api/index"
const dialogVisible = ref(true);
const openLoginType = ref(""); // 登录方式
const form: Ref<any> = ref({});
const showPassword: Ref<boolean> = ref(false); // 密码是否可见
const btnDesc: Ref<string> = ref("获取验证码"); // 倒计时文案
watch(
  () => useUserStoreHook().$state.openLoginType,
  (newVal) => {
    openLoginType.value = newVal;
  },
  {
    immediate: true,
  },
);
// 登陆/注册
const onLogin = async () => {
  if( useUserStoreHook().$state.openLoginType !== 'login' ) {
    return onRegister();
  };
  if (openLoginType.value === "login") {
    // 登录
    const res = await loginApi(form.value);
  }
};
const onRegister = async () => {
  if (openLoginType.value === "login") {
    // 登录
    const res = await loginApi(form.value);
  }
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
    // await sendCode({ mobile: loginForm.value.mobile });
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
.passwordTips___uSglk {
  font-size: 0.72917vw;
  font-weight: 500;
  color: #b6b3b3;
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
</style>
