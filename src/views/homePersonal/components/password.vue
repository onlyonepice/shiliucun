<template>
  <div :class="[ns.b()]">
    <h3>修改密码</h3>
    <div :class="[ns.b('content'), 'animate__animated animate__fadeIn']">
      <div :class="ns.b('head')">
        <div
          :class="[
            step === 1 ? ns.b('chose') : '',
            step === 2 ? ns.bm('chose', 'has') : '',
          ]"
        >
          获取验证码
        </div>
        <div :class="[step === 2 ? ns.b('chose') : '']">修改密码</div>
      </div>
      <template v-if="step === 1">
        <p :class="ns.b('text')">手机号码</p>
        <Select
          type="input"
          style="width: 100%"
          :defaultValue="mbInfo.mobile"
          :disabled="true"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'mobile');
            }
          "
        />
        <p :class="ns.b('text')">验证码</p>
        <div :class="ns.be('step1', 'content')">
          <Select
            type="input"
            style="width: 100%"
            :defaultValue="mbInfo.code"
            @onChange="
              (val) => {
                return onChangeInfo(val, 'code');
              }
            "
          />
          <p
            type="primary"
            :class="[
              ns.b('btn'),
              btnDesc.indexOf('s') !== -1 ? ns.bm('btn', 'down') : '',
            ]"
            @click="onGetCode()"
          >
            {{ btnDesc }}
          </p>
        </div>
        <el-button type="primary" :class="ns.b('next')" @click="onNext()"
          >下一步</el-button
        >
      </template>
      <template v-else>
        <p :class="ns.b('text')">新密码</p>
        <div :class="ns.b('special')">
          <img :src="PasswordKey" alt="" />
          <Select
            type="input"
            style="width: 100%"
            :specialType="showPassword.password1 ? 'password' : 'text'"
            @onChange="
              (val) => {
                return onChangePassword(val, 'password1');
              }
            "
          />
          <img
            :src="!showPassword.password1 ? PasswordHidden : PasswordShow"
            @click="onChangeShow('password1')"
            alt=""
          />
        </div>
        <p :class="ns.b('text')">再次输入新密码</p>
        <div :class="ns.b('special')">
          <img :src="PasswordKey" alt="" />
          <Select
            type="input"
            style="width: 100%"
            :specialType="showPassword.password2 ? 'password' : 'text'"
            @onChange="
              (val) => {
                return onChangePassword(val, 'password2');
              }
            "
          />
          <img
            :src="!showPassword.password2 ? PasswordHidden : PasswordShow"
            @click="onChangeShow('password2')"
            alt=""
          />
        </div>
        <el-button type="primary" :class="ns.b('next')" @click="onConfirm()"
          >完成</el-button
        >
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import useNamespace from "@/utils/nameSpace";
import {
  modifyPasswordCode,
  checkPasswordCode,
  modifyPasswordApi,
} from "@/api/user";
import PasswordHidden from "@/assets/img/homePersonal/password-hidden.png";
import PasswordShow from "@/assets/img/homePersonal/password-show.png";
import PasswordKey from "@/assets/img/homePersonal/password-key.png";
import { ElMessage } from "element-plus";
import { regPassword } from "@/utils/rule";
const ns = useNamespace("homePersonalPassword");
const step: Ref<number> = ref(1);
const btnDesc: Ref<string> = ref("发送验证码");
const timer = ref(null); // 定时器
const mbInfo: Ref<any> = ref({
  mobile: useUserStore().$state.userInfo.mobile,
  code: "",
});
const modifyPassword = ref({
  password1: "",
  password2: "",
});
const showPassword: Ref<any> = ref({
  password1: true,
  password2: true,
});
// 手机号/验证码修改
const onChangeInfo = (val: any, type: string) => {
  mbInfo.value[type] = val;
};
// 修改密码可见度
const onChangeShow = (type: string) => {
  showPassword.value[type] = !showPassword.value[type];
};
// 输入新密码
const onChangePassword = (val: any, type: string) => {
  modifyPassword.value[type] = val;
};
// 完成密码输入
const onConfirm = async () => {
  if (!regPassword.test(modifyPassword.value.password1)) {
    ElMessage.error("密码格式不正确");
    return;
  }
  if (modifyPassword.value.password1 !== modifyPassword.value.password2) {
    ElMessage.error("两次密码不一致");
    return;
  }
  const { resp_code }: any = await modifyPasswordApi({
    password: modifyPassword.value.password1,
    smsCode: mbInfo.value.code,
  });
  if (resp_code === 0) {
    ElMessage.success("修改成功");
    step.value = 1;
  }
};
// 获取验证码
const onGetCode = async () => {
  if (btnDesc.value.indexOf("s") !== -1) {
    return false;
  }
  const { resp_code }: any = await modifyPasswordCode(mbInfo.value);
  if (resp_code === 0) {
    countDown();
    ElMessage.success("发送成功");
  }
};
// 点击下一步
const onNext = async () => {
  const { resp_code, datas }: any = await checkPasswordCode(mbInfo.value.code);
  if (resp_code === 0 && datas) {
    step.value = 2;
  }
};
// 倒计时
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
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalPassword {
  height: 466px;
  h3 {
    line-height: 56px;
  }
}
.es-homePersonalPassword-content {
  width: 400px;
  @include margin(48px, auto, 0, auto);
}
.es-homePersonalPassword-text {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  @include margin(16px, 0, 8px, 0);
}
.es-homePersonalPassword-next {
  float: right;
  margin-top: 24px;
}
.es-homePersonalPassword-special {
  @include relative(0);
  img {
    @include widthAndHeight(12px, 12px);
  }
  img:nth-of-type(1) {
    @include absolute(2, 10px, none, 10px, 10px);
  }
  img:nth-of-type(2) {
    @include absolute(1, 10px, 10px, 10px, none);
    cursor: pointer;
  }
}
.es-homePersonalPassword-step1__content {
  @include flex(center, center, nowrap);
  p {
    width: 120px;
  }
}
.es-homePersonalPassword-btn {
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px, 400, #244bf1, 22px);
}
.es-homePersonalPassword-btn--down {
  color: #999999;
}
.es-homePersonalPassword-input {
  width: 400px;
}
.es-homePersonalPassword-head {
  @include flex(center, space-between, nowrap);
  @include padding(0, 40px, 0, 40px);
  @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
  @include margin(0, 0, 32px, 0);
  div::before {
    content: "1";
    display: inline-block;
    @include widthAndHeight(32px, 32px);
    border-radius: 50%;
    background: #f2f3f5;
    line-height: 32px;
    text-align: center;
    margin-right: 8px;
  }
  div:nth-child(2)::before {
    content: "2";
  }
  .es-homePersonalPassword-chose::before {
    background: #244bf1;
    color: rgba(255, 255, 255, 0.9);
  }
  .es-homePersonalPassword-chose--has {
    @include flex();
  }
  .es-homePersonalPassword-chose--has::before {
    content: "";
    background-image: url("@/assets/img/common/icon-success.png");
    background-size: 100% 100%;
  }
}
</style>
<style lang="scss">
.es-homePersonalPassword-special {
  .el-input__wrapper {
    padding-left: 32px;
  }
}
</style>
