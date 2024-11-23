<template>
    <el-dialog
      v-model="dialogVisible"
      title="购买游戏"
      width="500"
      :before-close="handleClose"
      class="login-dialog"
    >
      <template>
        <div class="pay_game">
            <div class="top_block">
                <div class="title">
                    这个面试有点硬
                </div>
                <div class="price">
                    2399 M币
                </div>
                <img />
            </div>
        </div>
      </template>
    </el-dialog>
  </template>
  <script lang="ts" setup>
  import { ref, watch, Ref } from "vue";
  import { useUserStoreHook } from "@/store/modules/user";
  import { ElMessage } from "element-plus";
  import { loginApi, sendVerificationCodeApi } from "@/api/index";
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
    const { code, data }: any = await loginApi(form.value);
    if (code === 200) {
      useUserStoreHook().$state.token = data.token;
      setToken(data);
      useUserStoreHook().handleGetUserInfo();
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
    useUserStoreHook().openPayGame(false);
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
  .pay_game{
    .top_block{
        display: flex;
        padding: .41667vw .41667vw .41667vw .83333vw;
        padding: var(--3xs, .41667vw) var(--3xs, .41667vw) var(--3xs, .41667vw) var(--sm, .83333vw);
        justify-content: space-between;
        align-items: center;
        border-radius: .625vw;
        border-radius: var(--md, .625vw);
        background: #222121;
        background: var(--neutral-900, #222121);
        .title{
            color: #f0eded;
            color: var(--neutral-50, #f0eded);
            font-size: .83333vw;
            font-weight: 400;
            line-height: 1.04167vw;
            margin-bottom: .41667vw;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .price{
            color: var(--primary-300, #f00a38);
            font-size: .72917vw;
            font-weight: 400;
            line-height: .83333vw;
        }
        img{
            flex-shrink: 0;
            margin-left: .625vw;
            width: 8.33333vw;
            height: 4.6875vw;
            object-fit: cover;
            border-radius: .625vw;
        }
    }
  }
  </style>
  