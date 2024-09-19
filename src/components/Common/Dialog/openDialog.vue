<template>
  <Dialog
    v-if="visibleInfo"
    :title="title"
    :visible="visibleInfo"
    width="560px"
    height="574px"
    @onHandleClose="onClose()"
    :showFoot="false"
  >
    <template #content>
      <div :class="ns.be('content', 'infoDialog')">
        <span required>真实姓名</span>
        <Select
          type="input"
          :defaultValue="activateInfo.userName"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'userName');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span required>手机号码</span>
        <Select
          type="input"
          :defaultValue="activateInfo.mobile"
          :maxlength="11"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'mobile');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span required>验证码</span>
        <Select
          type="input"
          :defaultValue="activateInfo.verificationCode"
          :maxlength="6"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'verificationCode');
            }
          "
        />
        <div
          @click="onSendCode()"
          :class="[
            ns.bm('input', 'codeBtn'),
            btnDesc.indexOf('s') !== -1 ? ns.bm('input', 'down') : '',
          ]"
        >
          {{ btnDesc }}
        </div>
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span>公司名称</span>
        <Select
          type="input"
          :defaultValue="activateInfo.company"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'company');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span>任职职务</span>
        <Select
          type="input"
          :defaultValue="activateInfo.position"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'position');
            }
          "
        />
      </div>
      <div class="dialog-footer">
        <el-button @click="onClose()">取消</el-button>
        <el-button type="primary" @click="handleClose(true)">提交</el-button>
      </div>
      <img :src="ElectricityApiImage" :class="ns.be('content', 'img')" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import ElectricityApiImage from "@/assets/img/dataBase/electricity-api-img.png";
import { getVerificationCode, openApiApi } from "@/api/data";
import { ElMessage } from "element-plus";
import { login } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { setToken } from "@/utils/auth";
import { NOOP } from "@vue/shared";
const ns = useNamespace("openDialog");
const visibleInfo: Ref<boolean> = ref(false); // 弹窗显示
const emits = defineEmits(["onClose"]);
const activateInfo: Ref<any> = ref({
  userName: "",
  mobile: "",
  verificationCode: "",
  company: "",
  position: "",
});
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
watch(
  () => props.visible,
  (val) => {
    visibleInfo.value = val;
  },
);
// 开通弹窗信息修改
const onChangeInfo = (value: any, type: string) => {
  activateInfo.value[type] = value;
};
const btnDesc: Ref<string> = ref("获取验证码");
const timer: Ref<any> = ref(null); // 定时器
const openApiFn = async () => {
  activateInfo.value.source = props.title;
  const { resp_code } = await openApiApi(activateInfo.value);
  if (resp_code === 0) {
    ElMessage.success("信息已提交，24小时内会有工作人员与您联系");
    visibleInfo.value = false;
  }
};
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
    if (activateInfo.value.mobile === "") {
      return ElMessage.error("请输入手机号");
    }
    const { resp_code }: any = await getVerificationCode({
      mobile: activateInfo.value.mobile,
      smsType: "DATA_BASE_APPLY",
    });
    if (resp_code === 0) {
      ElMessage.success("发送成功");
      countDown();
    }
  } catch (error) {
    NOOP();
  }
};
// 点击提交
const handleClose = async (flag: boolean) => {
  const { userName, mobile, verificationCode } = activateInfo.value;
  if (userName === "" || mobile === "" || verificationCode === "") {
    return ElMessage.error("请输入完整信息");
  }
  if (flag) {
    const { datas, resp_code } = await login({
      grant_type: "sms_code",
      smsCode: verificationCode,
      mobile: mobile,
    });
    if (resp_code === 0) {
      setToken(datas);
      useUserStore().$state.token = datas.access_token;
      useUserStore().handleGetUserInfo();
      openApiFn();
    }
  } else {
    visibleInfo.value = false;
  }
};
const onClose = () => {
  emits("onClose");
};
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-openDialog-content__infoDialog {
  @include widthAndHeight(512px, 32px);
  @include flex();
  & > span {
    display: inline-block;
    line-height: 32px;
    @include widthAndHeight(72px, 100%);
    text-align: right;
    margin-right: 8px;
  }
  span[required]::before {
    content: "*"; /* 添加一个星号作为标识符 */
    color: red; /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
}
.es-openDialog-content__infoDialog {
  position: relative;
  @include margin(0, 0, 16px, 0);
  .select {
    flex: 1;
  }
  &:nth-last-child(1) {
    @include margin(0, 0, 0, 0);
  }
  .edit-phone-number_btn {
    position: absolute;
    top: 0;
    right: 8px;
    height: 100%;
    z-index: 1;
    cursor: pointer;
    @include flex();
    @include font(14px, 600, #244bf1, 22px);
  }
}
.es-openDialog-content__img {
  @include widthAndHeight(512px, 182px);
}
.es-openDialog-content__title {
  color: rgba(0, 0, 0, 0.9);
  line-height: 24px;
  margin: 24px 0 8px;
}
.dialog-footer {
  @include flex(center, flex-end);
  margin-bottom: 24px;
}
.es-openDialog-input--codeBtn {
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px, 400, #244bf1, 22px);
}
.es-openDialog-input--down {
  color: #999999;
}
</style>
