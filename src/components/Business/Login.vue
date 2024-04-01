<template>
  <div :class="[ns.b()]">
    <div v-if="protocolShow === ''" :class="[ns.b('content')]">
      <div :class="ns.b('top')">
        <img :src="LoginTopBg" :class="ns.bm('content', 'topBg')" />
        <div :class="ns.b('banner')">
          <p :class="ns.bm('banner', 'title')">
            <span>{{
              loginType === "password" ? "欢迎使用iReport" : "微信登录"
            }}</span>
            <img :src="LoginCancel" @click="onCloseDialog()" />
          </p>
          <p :class="ns.bm('banner', 'desc')">
            {{
              loginType === "password"
                ? "未注册手机号验证通过后将自动创建新账号"
                : "请使用微信扫描二维码登录"
            }}
          </p>
        </div>
      </div>
      <template v-if="loginType === 'password'">
        <el-input
          v-model="loginForm.mobile"
          placeholder="手机号码"
          maxlength="11"
          :class="[ns.bm('input', 'phone'), ns.bm('input', 'common')]"
        />
        <div v-if="!codeLogin" :class="ns.bm('input', 'code')">
          <el-input
            v-model="loginForm.smsCode"
            :class="[ns.bm('input', 'common'), ns.bm('input', 'commonCode')]"
            maxlength="6"
            placeholder="验证码"
          />
          <span
            @click="onSendCode"
            :class="[btnDesc.indexOf('s') !== -1 ? ns.bm('input', 'down') : '']"
            >{{ btnDesc }}</span
          >
        </div>
        <div v-else :class="ns.bm('input', 'password')">
          <el-input
            v-model="loginForm.password"
            :class="ns.bm('input', 'common')"
            :type="!passwordShow ? 'password' : 'text'"
            maxlength="16"
            placeholder="密码"
          />
          <img
            :src="!passwordShow ? PasswordHidden : PasswordShow"
            @click="passwordShow = !passwordShow"
            alt=""
          />
        </div>
        <el-button :class="ns.b('loginBtn')" type="primary" @click="onLogin"
          >登录/注册</el-button
        >
        <p :class="ns.b('switchBtn')" @click="codeLogin = !codeLogin">
          {{ codeLogin ? "验证码登录" : "账号密码登录" }}
        </p>
        <!-- 其他登录方式 -->
        <div class="other-login">
          <div class="other-login__title">其他登录方式</div>
          <div
            class="other-login__icon-weChat"
            @click="handleSwitchLogin('weChat')"
          />
        </div>
      </template>
      <template v-else>
        <div class="weChat-login">
          <img :src="weChatImage" class="weChat-login-QRCode" />
          <p :class="ns.b('switchBtn')" @click="handleSwitchLogin('password')">
            账号密码登录
          </p>
        </div>
      </template>
      <!-- 底部 -->
      <div class="form-protocol">
        <p>注册即代表我已阅读并同意</p>
        <p class="agree-protocol">
          <span class="protocol" @click="handleSwitchProtocol('user')"
            >《用户服务协议》</span
          >
          <span>和</span>
          <span class="protocol" @click="handleSwitchProtocol('privacy')"
            >《隐私政策》</span
          >
        </p>
      </div>
    </div>
    <div v-else class="form-protocol__content">
      <iframe
        class="protocol"
        :src="
          protocolShow === 'user'
            ? 'https://pdf.eesaexpo.com?file=https://oss.eesaenergy.com/protocol/user.pdf'
            : 'https://pdf.eesaexpo.com?file=https://oss.eesaenergy.com/protocol/privacy.pdf'
        "
        frameborder="0"
        width="100%"
        height="100%"
      />
      <div class="content-footer">
        <div class="protocol__foot-continue" @click="handleSwitchProtocol('')">
          同意并继续
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import { getQrCode, pollLogin, sendCode, login } from "@/api/user";
import { setToken } from "@/utils/auth";
import { regMobile } from "@/utils/rule";
import { ElMessage } from "element-plus";
import useNamespace from "@/utils/nameSpace";
import LoginTopBg from "@/assets/img/login/login-top-bg.png";
import LoginCancel from "@/assets/img/common/cancel.png";
import PasswordShow from "@/assets/img/login/icon_password_show.png";
import PasswordHidden from "@/assets/img/login/icon_password_hidden.png";
import { NOOP } from "@vue/shared";
import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("login");
const emit = defineEmits(["onCancel"]);
const loginType: Ref<string> = ref("password"); // 其他登录方式 weChat: 微信 password: 密码
const protocolShow: Ref<string> = ref(""); // 切换协议
const codeLogin: Ref<boolean> = ref(false); // 账号密码登录/验证码登录
const passwordShow: Ref<boolean> = ref(false); // 展示/隐藏密码
const weChatImage: Ref<any> = ref(null); // 微信二维码
const loginCode: Ref<string> = ref(""); // 轮训结果二维码
const btnDesc: Ref<string> = ref("获取验证码"); // 倒计时文案
const loginForm = ref({
  mobile: "",
  smsCode: "",
  password: "",
  grant_type: "sms_code", // sms_code 验证码登录 mobile_password 密码登录
}); // 提交信息
const props = defineProps({
  openLogin: {
    type: Boolean,
    default: false,
  },
});
const onCloseDialog = () => {
  emit("onCancel");
};
const handleSwitchProtocol = (type: string) => {
  protocolShow.value = type;
};
// 账号密码登录/微信登录
const handleSwitchLogin = (type) => {
  loginType.value = type;
  type === "password" && onGetQrCode();
  type === "weChat" && weChatLogin();
};
// 获取微信登录二维码
const onGetQrCode = async () => {
  const blob: any = await getQrCode();
  const reader = new FileReader();
  reader.readAsDataURL(blob.data); // 转换为base64
  loginCode.value = blob.headers.logincode;
  setTimeout(() => {
    weChatImage.value = reader.result;
  }, 1000);
};
onGetQrCode();

// 轮询登录接口
const weChatLogin = async () => {
  try {
    if (loginCode.value !== "") {
      const { datas, resp_code }: any = await pollLogin({
        loginCode: loginCode.value,
      });
      if (
        resp_code === 2044 &&
        loginType.value === "weChat" &&
        props.openLogin
      ) {
        weChatLogin();
      }
      if (datas.openId) {
        sendLogin({ grant_type: "openId", openId: datas.openId });
      }
    }
  } catch (error) {
    NOOP();
  }
};
// 登录接口
const onLogin = async () => {
  loginForm.value.grant_type = codeLogin.value ? "mobile_password" : "sms_code";
  codeLogin.value && delete loginForm.value.smsCode;
  !codeLogin.value && delete loginForm.value.password;
  sendLogin(loginForm.value);
};
// 发送登录接口
const sendLogin = async (data: any) => {
  try {
    const { datas, resp_code }: any = await login(data);
    if (resp_code === 0) {
      setToken(datas);
      onCloseDialog();
      useUserStore().$state.token = datas.access_token;
    }
  } catch (error) {
    NOOP();
  }
};

// 倒计时
const timer = ref(null); // 定时器
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
    if (loginForm.value.mobile === "") {
      return ElMessage.error("请输入手机号");
    }
    if (!regMobile.test(loginForm.value.mobile)) {
      return ElMessage.error("请输入正确手机号");
    }
    await sendCode({ mobile: loginForm.value.mobile });
    ElMessage.success("发送成功");
    countDown();
  } catch (error) {
    NOOP();
  }
};
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-login {
  @include widthAndHeight(100vw, 100vh);
  background-color: rgba(0, 0, 0, 0.4);
  @include fixed(99999, 0, 0, 0, 0);
  @include flex();
}
.es-login-content {
  @include widthAndHeight(360px, 540px);
  @include relative();
  background-color: #fff;
  border-radius: 8px;
  padding: 0 24px 40px;
  box-sizing: border-box;
}
.es-login-content--topBg {
  @include widthAndHeight(100%, 120px);
  @include absolute(-1, 0, 0, none, none);
}
.es-login-banner {
  padding-top: 32px;
}
.es-login-banner--title {
  @include font(20px, 600, rgba(0, 0, 0, 0.9));
  @include flex(center, space-between);
  img {
    @include widthAndHeight(28px, 28px);
    cursor: pointer;
  }
}
.es-login-banner--desc {
  @include font(12px, 400, rgba(0, 0, 0, 0.6));
}
.es-login-loginBtn {
  @include widthAndHeight(100%, 40px);
  background-color: #165dff;
  border-radius: 4px;
  text-align: center;
  @include font(16px, 400, #ffffff, 40px);
  @include margin(16px, 0, 4px, 0);
  cursor: pointer;
}
.es-login-switchBtn {
  background-color: transparent;
  text-align: center;
  margin-bottom: 25px;
  @include font(14px, 400, #244bf1, 22px);
  cursor: pointer;
}
.es-login-input--common {
  height: 40px;
}
.es-login-input--phone {
  @include margin(50px, 0, 20px, 0);
}
.es-login-input--code {
  @include margin(0, 0, 20px, 0);
  @include flex(center, space-between, nowrap);
  span {
    cursor: pointer;
    @include widthAndHeight(136px, 40px);
    padding-left: 10px;
    @include font(14px, 500, #165dff, 40px);
  }
  .es-login-input--down {
    color: #999999;
  }
}
.es-login-input--password {
  @include margin(0, 0, 20px, 0);
  @include relative();
  img {
    @include widthAndHeight(24px, 24px);
    @include absolute(1, 8px, 8px, none, none);
    cursor: pointer;
  }
}

// 其他登录方式
.other-login {
  margin-bottom: 16px;
  .other-login__title {
    display: flex;
    align-items: center;
    @include font(12px, 400, rgba(0, 0, 0, 0.4), 20px);
    &::before {
      content: "";
      display: inline-block;
      @include widthAndHeight(104px, 1px);
      background: #dbdce2;
      margin-right: 16px;
    }
    &::after {
      content: "";
      display: inline-block;
      @include widthAndHeight(104px, 1px);
      background: #dbdce2;
      margin-left: 16px;
    }
  }
  .other-login__icon-weChat {
    @include widthAndHeight(40px, 40px);
    background: #f2f3f5;
    margin: 8px auto 16px;
    background-image: url("@/assets/img/common/weChat-icon.png");
    background-size: 32px 32px;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    border-radius: 50%;
  }
}

.form-protocol {
  @include fontSize(12px);
  text-align: center;
  overflow: hidden;

  .agree-protocol {
    .protocol {
      @include color(#ff8d32);
      cursor: pointer;
    }
  }
}
.form-protocol__content {
  width: 650px;
  height: 700px;
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background-color: #fff;
  z-index: 5000;
  padding-bottom: 70px;
  .content-footer {
    position: absolute;
    bottom: 0;
    text-align: right;
    padding: 16px 0;
    width: 100%;
    background: #fff;
    .protocol__foot-continue {
      font-size: 16px;
      margin-right: 24px;
      background: #244bf1;
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.9);
      text-align: center;
      display: inline-block;
      padding: 8px 16px;

      &:hover {
        background: #4079fc;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.9);
      }
      &:active {
        background: #0945cd;
      }
    }
  }
}
.weChat-login {
  text-align: center;
}
.weChat-login-QRCode {
  @include widthAndHeight(200px, 200px);
  @include margin(89px, auto, 25px, auto);
}
</style>
