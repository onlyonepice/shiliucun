<template>
  <Dialog
    title="编辑信息"
    :visible="visibleInfo"
    width="560px"
    height="484px"
    @onHandleClose="onHandleCloseInfo"
    confirmText="保存"
  >
    <template #content>
      <div :class="ns.be('content', 'infoDialog')">
        <span required>真实姓名</span>
        <Select
          type="input"
          :defaultValue="modifyInfoFreeze.realName"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'realName');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span required>企业名称</span>
        <Select
          type="input"
          :defaultValue="modifyInfoFreeze.company"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'company');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span required>岗位头衔</span>
        <Select
          type="input"
          :defaultValue="modifyInfoFreeze.position"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'position');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span>所在地区</span>
        <Select
          :options="areaList"
          :defaultValue="modifyInfoFreeze.regionCode"
          :cascaderOption="cascaderOption"
          type="cascader"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'regionCode');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span>手机号码</span>
        <Select
          type="input"
          :defaultValue="modifyInfoFreeze.mobile"
          :disabled="true"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'mobile');
            }
          "
        />
        <div @click="onHandleModifyMobile" class="edit-phone-number_btn">
          修改
        </div>
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span>微信号码</span>
        <Select
          type="input"
          :defaultValue="modifyInfoFreeze.weCat"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'weCat');
            }
          "
        />
      </div>
      <div :class="ns.be('content', 'infoDialog')">
        <span>常用邮箱</span>
        <Select
          type="input"
          :defaultValue="modifyInfoFreeze.email"
          @onChange="
            (val) => {
              return onChangeInfo(val, 'email');
            }
          "
        />
      </div>
    </template>
  </Dialog>
  <Dialog
    title="修改手机号"
    :visible="visibleMobile"
    width="560px"
    height="224px"
    @onHandleClose="onHandleClose"
    :confirmText="modifyMbStep === 1 ? '下一步' : '完成'"
  >
    <template #content>
      <div :class="ns.be('content', 'mbDialog')" v-if="modifyMbStep === 1">
        <span>手机号码</span>
        <el-input
          v-model="modifyInfo.mobile"
          maxlength="11"
          :class="ns.be('mbDialog', 'mobile')"
          placeholder="请输入"
          :disabled="true"
        />
      </div>
      <div :class="ns.be('content', 'mbDialog')" v-else>
        <span>新手机号码</span>
        <el-input
          v-model="modifyMbForm.mobile"
          maxlength="11"
          :class="ns.be('mbDialog', 'mobile')"
          placeholder="请输入"
        />
      </div>
      <div :class="ns.be('content', 'mbDialog')">
        <span>验证码</span>
        <el-input
          v-model="modifyMbForm.code"
          :class="ns.be('mbDialog', 'code')"
          placeholder="请输入"
        />
        <div
          @click="onSendCode"
          maxlength="6"
          :class="[
            ns.bm('input', 'codeBtn'),
            btnDesc.indexOf('s') !== -1 ? ns.bm('input', 'down') : '',
          ]"
        >
          {{ btnDesc }}
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Ref, ref, watch } from "vue";
import { getInnermostObject } from "@/utils/index";
import { useUserStore } from "@/store/modules/user";
import {
  getUserDetailInfo,
  editUserInfoApi,
  getAreaApi,
  modifyMbCode,
  modifyMbCode1,
  verifyMbCode,
  modifyMb,
} from "@/api/user";
import useNamespace from "@/utils/nameSpace";
import { ElMessage } from "element-plus";
import { regMobile, regEmail } from "@/utils/rule";
import { NOOP } from "@vue/shared";
const areaList: Ref<any> = ref([]); // 地区数据
const ns = useNamespace("homePersonalInfo");
const visibleInfo: Ref<boolean> = ref(false); // 编辑信息弹窗
const emits = defineEmits(["onHandleCloseInfo"]);
const visibleMobile: Ref<boolean> = ref(false); // 修改手机号弹窗
const modifyMbStep: Ref<number> = ref(1); // 修改手机号步骤
const btnDesc: Ref<string> = ref("获取验证码"); // 倒计时文案
const timer = ref(null); // 定时器
const cascaderOption: Ref<any> = ref({
  expandTrigger: "hover",
  label: "name",
  value: "code",
  children: "regionResps",
}); // 地区级联配置项
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
const modifyMbForm: Ref<any> = ref({
  mobile: "",
  code: "",
}); // 修改手机号form表单
const modifyInfo: Ref<any> = ref({
  realName: "",
  company: "",
  position: "",
  regionCode: "",
  mobile: "",
  weCat: "",
  email: "",
}); // 修改信息
const modifyInfoFreeze: Ref<any> = ref({});
watch(
  () => props.visible,
  (newVal) => {
    visibleInfo.value = newVal;
  },
  { immediate: true },
);
// 获取地区数据
const onGetArea = async () => {
  const { resp_code, datas }: any = await getAreaApi();
  resp_code === 0 && (areaList.value = datas.records);
};
onGetArea();
// 获取用户详细信息
const onGetUserInfo = async () => {
  const { resp_code, datas } = await getUserDetailInfo();
  if (resp_code === 0) {
    const _modifyInfo = modifyInfo.value;
    // 重置用户信息
    Object.assign(_modifyInfo, datas);
    datas.region !== null &&
      (_modifyInfo.regionCode = getInnermostObject(datas.region).code);
    modifyInfoFreeze.value = JSON.parse(JSON.stringify(_modifyInfo));
  }
};
onGetUserInfo();
function onHandleModifyMobile() {
  visibleMobile.value = true;
}
// 点击取消或确定按钮
const onHandleClose = async (type: boolean) => {
  if (!type) {
    return onModifyMobile();
  }
  if (modifyMbStep.value === 1) {
    const { resp_code }: any = await verifyMbCode({
      smsCode: modifyMbForm.value.code,
    });
    if (resp_code === 0) {
      modifyMbStep.value = 2;
      clearInterval(timer.value);
      modifyMbForm.value.code = "";
      btnDesc.value = "获取验证码";
    }
  } else {
    const { resp_code }: any = await modifyMb({
      mobile: modifyMbForm.value.mobile,
      smsCode: modifyMbForm.value.code,
    });
    if (resp_code === 0) {
      ElMessage.success("修改成功");
      onModifyMobile();
      onGetUserInfo();
    }
  }
};
// 修改手机号
const onModifyMobile = () => {
  visibleMobile.value = !visibleMobile.value;
};
// 关闭编辑信息
const onHandleCloseInfo = async (type: boolean) => {
  const _modifyInfo = JSON.parse(JSON.stringify(modifyInfo.value));
  if (!type) {
    emits("onHandleCloseInfo");
    return (visibleInfo.value = false);
  }
  if (
    _modifyInfo.realName === "" ||
    _modifyInfo.company === "" ||
    _modifyInfo.position === ""
  ) {
    return ElMessage.error("请完善必填项");
  }
  if (!_modifyInfo.mobile && !regMobile.test(_modifyInfo.mobile)) {
    return ElMessage.error("请输入正确手机号");
  }
  if (
    !_modifyInfo.email &&
    _modifyInfo.email !== null &&
    _modifyInfo.email !== "" &&
    !regEmail.test(_modifyInfo.email)
  ) {
    return ElMessage.error("请输入正确邮箱");
  }
  if (_modifyInfo.email === null || _modifyInfo.email === "") {
    delete _modifyInfo.email;
  }
  delete _modifyInfo.region;
  const { resp_code }: any = await editUserInfoApi(_modifyInfo);
  if (resp_code === 0) {
    ElMessage.success("编辑成功");
    visibleInfo.value = false;
    useUserStore().handleGetUserInfo();
    onGetUserInfo();
  }
  emits("onHandleCloseInfo");
};
// 修改用户信息
const onChangeInfo = (value: any, type: string) => {
  type === "regionCode" &&
    (modifyInfo.value.regionCode = value[value.length - 1]);
  type !== "regionCode" && (modifyInfo.value[type] = value);
};
// 发送验证码
const onSendCode = async () => {
  try {
    if (btnDesc.value.indexOf("s") !== -1) {
      return false;
    }
    if (modifyMbStep.value === 2) {
      if (modifyMbForm.value.mobile === "") {
        return ElMessage.error("请输入手机号");
      }
      if (!regMobile.test(modifyMbForm.value.mobile)) {
        return ElMessage.error("请输入正确手机号");
      }
    }
    const { resp_code }: any =
      modifyMbStep.value === 1
        ? await modifyMbCode()
        : await modifyMbCode1(modifyMbForm.value.mobile);
    if (resp_code === 0) {
      ElMessage.success("发送成功");
      countDown();
    }
  } catch (error) {
    NOOP();
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

<style lang="scss">
@import "@/style/mixin.scss";

.es-homePersonalInfo-content__infoDialog {
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
.es-homePersonalInfo-content__infoDialog-img {
  @include flex(center, flex-start, nowrap);
  margin-bottom: 16px;
  height: 64px;
  cursor: pointer;
  @include relative();
  span {
    height: 22px;
  }
  img {
    @include widthAndHeight(64px, 64px);
    border-radius: 50%;
  }
  img:nth-of-type(2) {
    @include widthAndHeight(26px, 26px);
    @include absolute(1, none, none, 0, 123px);
  }
}
.es-homePersonalInfo-content__infoDialog {
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
.es-homePersonalInfo-content__mbDialog {
  @include flex(center, flex-start, nowrap);
  @include margin(0, 0, 16px, 0);
  &:nth-last-child(1) {
    @include margin(0, 0, 0, 0);
  }
  span {
    display: inline-block;
    @include widthAndHeight(70px, 22px);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    @include margin(0, 8px, 0, 0);
    text-align: right;
  }
}
.es-homePersonalInfo-mbDialog__mobile {
  @include widthAndHeight(434px, 32px);
}
.es-homePersonalInfo-mbDialog__code {
  @include widthAndHeight(346px, 32px);
  flex: 1;
}
.es-homePersonalInfo-input--codeBtn {
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px, 400, #244bf1, 22px);
}
.es-homePersonalInfo-input--down {
  color: #999999;
}
</style>
