<template>
  <div :class="[ns.b()]">
    <Dialog
      title="修改手机号"
      :visible="visibleMobile"
      width="560px"
      height="224px"
      :appendToBody="appendToBody"
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
    <Dialog
      v-if="visibleInfoSet"
      title="发布需求"
      :visible="visibleInfo"
      width="560px"
      :height="step === 1 ? '568px' : 'auto'"
      :showFoot="false"
      :appendToBody="appendToBody"
      @onHandleClose="onHandleCloseDialog"
      :class="ns.b('dialog-step')"
    >
      <template #content>
        <div :class="ns.b('step-box')">
          <div class="step-box_top">
            <p class="step-icon_one step-icon_active" />
            <p
              :class="
                step === 1
                  ? 'step-icon_line'
                  : 'step-icon_active step-icon_line'
              "
            />
            <p
              :class="
                step === 1 ? 'step-icon_two' : 'step-icon_active step-icon_two'
              "
            />
          </div>
          <div class="step-box_bottom">
            <p
              :class="
                step === 1
                  ? 'step-box_bottom_text step-box_bottom_text_active'
                  : 'step-box_bottom_text'
              "
              style="margin-right: 127px"
            >
              编辑/确认个人信息
            </p>
            <p
              :class="
                step === 2
                  ? 'step-box_bottom_text step-box_bottom_text_active'
                  : 'step-box_bottom_text'
              "
            >
              填写需求信息
            </p>
          </div>
        </div>
        <div v-show="step === 1">
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
            <span required>岗位类型</span>
            <Select
              type="select"
              :defaultValue="modifyInfoFreeze.postType"
              :options="positionTypeList"
              labelKey="label"
              valueKey="id"
              @onChange="
                (val) => {
                  return onChangeInfo(val, 'postType');
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
            <div class="isShow">
              <p>对外展示</p>
              <el-switch
                v-model="showInfo.mobile"
                @change="
                  (val) => {
                    return onChangeSwitch(val, 'mobile');
                  }
                "
              />
            </div>
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
            <div class="isShow">
              <p>对外展示</p>
              <el-switch
                v-model="showInfo.email"
                @change="
                  (val) => {
                    return onChangeSwitch(val, 'email');
                  }
                "
              />
            </div>
          </div>
          <div :class="ns.be('content', 'infoDialog')">
            <span>出生日期</span>
            <el-date-picker
              style="flex: 1"
              v-model="modifyInfoFreeze.birthday"
              type="date"
              placeholder=""
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
          <div class="release-demand-footer">
            <div class="footer-left" @click="handleConfirmUserInfo">
              <img
                :src="isConfirmUserInfo ? HasChoseRadio : NoChoseRadio"
                alt=""
              />
              <p>我已确认以上个人信息，内容真实无误</p>
            </div>
            <div class="footer-right">
              <el-button @click="onHandleCloseInfo(false)">取消</el-button>
              <el-button
                type="primary"
                style="width: 102px"
                @click="onHandleCloseInfo(true)"
                >保存并确认</el-button
              >
            </div>
          </div>
        </div>
        <div v-show="step === 2">
          <div :class="ns.be('content', 'infoDialog')">
            <span required>需求标题</span>
            <Select
              type="input"
              :defaultValue="needData.title"
              :maxlength="20"
              @onChange="
                (val) => {
                  return onChangeNeed(val, 'title');
                }
              "
            />
          </div>
          <div :class="ns.be('content', 'infoDialog')">
            <span required>需求类型</span>
            <Select
              type="select"
              :defaultValue="needData.type"
              :options="needTypeList"
              labelKey="label"
              valueKey="code"
              @onChange="
                (val) => {
                  return onChangeNeed(val, 'type');
                }
              "
            />
          </div>
          <div :class="ns.be('content', 'infoDialog')">
            <span required>寻求资源</span>
            <Select
              type="select"
              :defaultValue="needData.role"
              :options="roleList"
              labelKey="labelName"
              valueKey="id"
              @onChange="
                (val) => {
                  return onChangeNeed(val, 'role');
                }
              "
            />
          </div>
          <div
            :class="ns.be('content', 'infoDialog')"
            style="height: 79px; align-items: flex-start"
          >
            <span required>需求描述</span>
            <Select
              type="input"
              :maxlength="150"
              specialType="textarea"
              :defaultValue="needData.description"
              @onChange="
                (val) => {
                  return onChangeNeed(val, 'description');
                }
              "
            />
          </div>
          <div
            :class="ns.be('content', 'infoDialog')"
            style="display: flex; align-items: flex-start; height: auto"
          >
            <span>项目图片</span>
            <div style="flex: 1">
              <el-upload
                v-model:file-list="imageList"
                :action="`${VITE_GLOB_API_URL}/api-file/fileUpload`"
                :headers="uploadToken"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :limit="3"
                :class="imageList.length >= 3 ? 'upload-box' : ''"
              >
                <template #trigger>
                  <el-icon>
                    <img style="width: 102px; height: 102px" :src="UploadImg" />
                  </el-icon>
                </template>
              </el-upload>
            </div>
          </div>
          <div class="hint">最多上传三张图片</div>
          <div
            :class="ns.be('content', 'infoDialog')"
            style="display: flex; align-items: flex-start; height: auto"
          >
            <span>标签</span>
            <Select
              type="select"
              :defaultValue="needData.tab"
              :options="tabList"
              :multiple="true"
              labelKey="labelName"
              valueKey="id"
              @onChange="
                (val) => {
                  return onChangeNeed(val, 'tab');
                }
              "
            />
            <span :class="ns.b('add-tab')" @click="addTabDialog = true"
              >添加标签</span
            >
          </div>
          <div class="btn-box">
            <el-button @click="backStep" style="margin-right: 231px"
              >上一步</el-button
            >
            <el-button @click="onHandleCloseInfo(false)">取消</el-button>
            <el-button type="primary" @click="handleReleaseNeed(false)"
              >发布需求</el-button
            >
          </div>
          <businessCard :info="userDetailInfo" class="info-card" />
        </div>
      </template>
    </Dialog>
    <el-dialog
      v-model="dialogVisible"
      :append-to-body="true"
      :class="ns.be('dialog--content', 'preview')"
    >
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
  <Dialog
    title="添加标签"
    :visible="addTabDialog"
    width="560px"
    height="176px"
    @onHandleClose="onHandleCloseTab"
    confirmText="添加"
  >
    <template #content>
      <div :class="ns.be('content', 'mbDialog')">
        <span required>标签名称</span>
        <Select
          type="input"
          :defaultValue="tabName"
          @onChange="onChange"
          style="width: 100%"
          :maxlength="5"
        />
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import businessCard from "@/views/demandMatching/detail/components/businessCard.vue";
import NoChoseRadio from "@/assets/img/common/i-Report-radio-false.png";
import HasChoseRadio from "@/assets/img/common/i-Report-radio-true.png";
import UploadImg from "@/assets/img/common/upload-image.png";
import { onMounted, ref, Ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { NOOP } from "@vue/shared";
import { regMobile, regEmail } from "@/utils/rule";
import type { UploadProps } from "element-plus";
import { cloneDeep } from "lodash";
import { getToken } from "@/utils/auth";
const emits = defineEmits(["close"]);
const { VITE_GLOB_API_URL } = import.meta.env;
import {
  updateUserInfo,
  modifyMbCode,
  modifyMbCode1,
  verifyMbCode,
  modifyMb,
  getUserDetailInfo,
  getAreaApi,
  editUserInfoApi,
  getPositionTypeApi,
} from "@/api/user";
import {
  getNeedTypeApi,
  releaseNeedApi,
  updateNeedApi,
  getRoleConfigApi,
} from "@/api/demandList";
import { getInnermostObject } from "@/utils/index";
const uploadToken: Ref<any> = ref({
  Authorization: "Bearer " + getToken(),
  Tenant: "iReport-front",
});
const addTabDialog = ref(false); // 添加标签弹窗
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  needDetailData: {
    type: Object,
    default: () => {},
  },
  appendToBody: {
    type: Boolean,
    default: false,
  },
});
const tabName = ref(""); // 添加标签名称
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const ns = useNamespace("releaseDemand");
const isConfirmUserInfo = ref(false);
const userInfo: Ref<any> = ref({});
const visibleMobile: Ref<boolean> = ref(false); // 修改手机号弹窗
const visibleInfo: Ref<boolean> = ref(false); // 编辑信息弹窗
const visibleInfoSet: Ref<boolean> = ref(false); // 编辑信息弹窗-延迟
const btnDesc: Ref<string> = ref("获取验证码"); // 倒计时文案
const areaList: Ref<any> = ref([]); // 地区数据
const cascaderOption: Ref<any> = ref({
  expandTrigger: "hover",
  label: "name",
  value: "code",
  children: "regionResps",
}); // 地区级联配置项
const modifyInfo: Ref<any> = ref({
  avatarImg: "",
  realName: "",
  company: "",
  position: "",
  regionCode: "",
  mobile: "",
  weCat: "",
  email: "",
}); // 修改信息
const modifyInfoFreeze: Ref<any> = ref({});
const timer = ref(null); // 定时器
const userDetailInfo: Ref<any> = ref(); // 用户详细信息
const modifyMbForm: Ref<any> = ref({
  mobile: "",
  code: "",
}); // 修改手机号form表单
const modifyMbStep: Ref<number> = ref(1); // 修改手机号步骤
const showInfo: Ref<any> = ref({
  mobile: false,
  weChat: false,
  email: false,
});
const step = ref(1);

const handleConfirmUserInfo = () => {
  isConfirmUserInfo.value = !isConfirmUserInfo.value;
};
const roleList: Ref<Array<any>> = ref([]); // 角色列表
const tabList: Ref<Array<any>> = ref([]); // tab列表
// 获取角色配置
const getRoleConfig = async () => {
  const { resp_code, datas } = await getRoleConfigApi();
  if (resp_code === 0) {
    datas.forEach((item) => {
      if (item.labelType === "customer_group") {
        roleList.value = item.needLabelResponseList;
      } else if (item.labelType === "content") {
        tabList.value = item.needLabelResponseList;
      }
    });
  }
};
// 添加标签名称
const onChange = (value: any) => {
  tabName.value = value;
};
onMounted(() => {
  userInfo.value = useUserStore().$state.userInfo;
  showInfo.value.mobile = userInfo.value.mobileHide;
  showInfo.value.weChat = userInfo.value.wecatHide;
  showInfo.value.email = userInfo.value.emailHide;
  onGetUserInfo();
  onGetArea();
  getPositionType();
  getNeedType();
  getRoleConfig();
});
const onChangeNeed = (value: any, type: string) => {
  needData.value[type] = value;
  if (type === "type") {
    needTypeList.value.forEach((item) => {
      if (item.id === value) {
        needData.value.typeName = item.label;
      }
    });
  }
};
// 关闭添加标签弹窗
const onHandleCloseTab = (type: boolean) => {
  addTabDialog.value = false;
  type && needData.value.tab.push(tabName.value);
  tabName.value = "";
};
const handleReleaseNeed = async () => {
  if (needData.value.title === "") {
    ElMessage.error("请填写标题");
    return;
  } else if (needData.value.type === "") {
    ElMessage.error("请选择需求类型");
    return;
  } else if (needData.value.role.length === 0) {
    ElMessage.error("请选择寻求资源");
    return;
  } else if (needData.value.description === "") {
    ElMessage.error("请填写需求描述");
    return;
  }
  needData.value.imageUrls = imageList.value.map((item) => {
    item.url = item.response ? item.response.datas : item.url;
    return item.url.includes(useUserStore().fileUrl)
      ? item.url.replace(useUserStore().fileUrl, "")
      : item.url;
  });
  imageList.value.forEach((item) => {
    item.url = item.response
      ? useUserStore().fileUrl + item.response.datas
      : item.url;
  });
  needData.value.imageUrls = needData.value.imageUrls.join(",");
  needData.value.dhLabelDTOList = [{ id: needData.value.role }];
  needData.value.tab.map((item) => {
    if (typeof item === "number") {
      needData.value.dhLabelDTOList = needData.value.dhLabelDTOList.concat({
        id: item,
      });
    } else {
      needData.value.dhLabelDTOList = needData.value.dhLabelDTOList.concat({
        labelName: item,
      });
    }
  });
  const data = needData.value.id
    ? await updateNeedApi(needData.value)
    : await releaseNeedApi(needData.value);
  if (data.resp_code === 0) {
    ElMessage.success("提交发布成功");
    emits("success");
  }
};
// 修改用户信息
const onChangeInfo = (value: any, type: string) => {
  type === "regionCode" &&
    (modifyInfo.value.regionCode = value[value.length - 1]);
  type !== "regionCode" && (modifyInfo.value[type] = value);
};
const onHandleCloseDialog = () => {
  emits("close");
};
const backStep = () => {
  step.value = 1;
};
// 关闭编辑信息
const onHandleCloseInfo = async (type: boolean) => {
  const _modifyInfo = JSON.parse(JSON.stringify(modifyInfo.value));
  if (!type) {
    emits("close");
    return;
  }
  if (!isConfirmUserInfo.value) {
    ElMessage.error("请先确认信息无误");
    return;
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
    step.value = 2;
    useUserStore().handleGetUserInfo();
    onGetUserInfo();
  }
};
const needTypeList = ref([]);
const getNeedType = async () => {
  const data = await getNeedTypeApi();
  if (data.resp_code === 0) {
    needTypeList.value = data.datas;
  }
};
const positionTypeList = ref([]);
const getPositionType = async () => {
  const data = await getPositionTypeApi();
  if (data.resp_code === 0) {
    positionTypeList.value = data.datas;
  }
};
// 获取用户详细信息
const onGetUserInfo = async () => {
  const { resp_code, datas } = await getUserDetailInfo();
  if (resp_code === 0) {
    userDetailInfo.value = datas;
    const _modifyInfo = modifyInfo.value;
    // 重置用户信息
    Object.assign(_modifyInfo, datas);
    datas.region !== null &&
      (_modifyInfo.regionCode = getInnermostObject(datas.region).code);
    modifyInfoFreeze.value = JSON.parse(JSON.stringify(_modifyInfo));
  }
};

// 获取地区数据
const onGetArea = async () => {
  const { resp_code, datas }: any = await getAreaApi();
  resp_code === 0 && (areaList.value = datas.records);
};
// 修改手机号
const onModifyMobile = () => {
  visibleMobile.value = !visibleMobile.value;
};
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
const needData: Ref<any> = ref({
  role: null,
  tab: [],
});
const imageList = ref([]);
// 查看大图
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

// 修改对外展示
const onChangeSwitch = async (val: boolean, type: string) => {
  if (type === "mobile") {
    userInfo.value.mobileHide = val;
  } else if (type === "weChat") {
    userInfo.value.wecatHide = val;
  } else if (type === "email") {
    userInfo.value.emailHide = val;
  }
  const { resp_code }: any = await updateUserInfo(userInfo.value);
  onGetUserInfo();
  resp_code === 0 && ElMessage.success("修改成功");
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
watch(
  () => props.show,
  (e) => {
    step.value = 1;
    visibleInfo.value = e;
    visibleInfoSet.value = e;
    isConfirmUserInfo.value = false;
  },
  { deep: true, immediate: true },
);
watch(
  () => props.needDetailData,
  (val) => {
    const arr = cloneDeep(val);
    if (val && Object.keys(arr).length > 0) {
      const _role = -1;
      const _tab = [];

      needData.value = {
        title: arr.title,
        type: arr.type,
        imageUrls: arr.imageUrls,
        typeName: arr.typeName,
        description: arr.description,
        id: arr.id ? arr.id : null,
        role: null,
        tab: [],
      };
      val.needLabelListVOList.map((item) => {
        item.labelType === "customer_group" &&
          (needData.value.role = item.needLabelResponseList[0].id);
        if (item.labelType === "content") {
          item.needLabelResponseList.map((_item) => {
            needData.value.tab.push(_item.id);
          });
        }
        if (item.labelType === "custom") {
          item.needLabelResponseList.map((_item) => {
            needData.value.tab.push(_item.labelName);
          });
        }
      });
      if (needData.value.imageUrls) {
        imageList.value = needData.value.imageUrls.split(",").map((item) => {
          return {
            name: "",
            url: useUserStore().fileUrl + item,
          };
        });
      }
    } else {
      imageList.value = [];
      needData.value = {
        title: "",
        type: "",
        imageUrls: "",
        typeName: "",
        description: "",
        role: null,
        tab: [],
      };
    }
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.hint {
  position: relative;
  top: -18px;
  left: 79px;
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  width: 300px;
}
.info-card {
  margin: 24px auto 0;
}
.isShow {
  width: 116px;
  display: flex;
  align-items: center;
  margin-left: 8px;
  p {
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 22px;
    margin-right: 8px;
  }
}

.es-releaseDemand-content {
  @include flex(flex-start, space-between, nowrap);
}
.es-releaseDemand-add-tab {
  @include font(14px, 400, #244bf1, 22px);
  margin-left: 8px;
  cursor: pointer;
}
.release-demand-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .footer-left {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      @include widthAndHeight(18px, 18px);
    }
    p {
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      line-height: 22px;
      margin-left: 8px;
    }
  }
}
.es-releaseDemand-step-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  .step-box_top {
    display: flex;
    align-items: center;
    .step-icon_one,
    .step-icon_two {
      width: 12px;
      height: 12px;
      background: #f2f3f5;
      border-radius: 50%;
    }

    .step-icon_line {
      width: 200px;
      height: 1px;
      background: #dbdce2;
      margin: 0 6px;
    }
    .step-icon_active {
      background-color: #244bf1;
    }
  }
  .step-box_bottom {
    width: 100%;
    margin-top: 6px;
    padding-left: 85px;
    display: flex;
    .step-box_bottom_text {
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 22px;
    }
    .step-box_bottom_text_active {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.9);
    }
  }
}
.es-releaseDemand-content__flex {
  @include flex(center, flex-start, nowrap);
  margin-bottom: 24px;
  img {
    @include widthAndHeight(80px, 80px);
    border-radius: 50%;
    margin-right: 16px;
  }
}
.es-releaseDemand-content__item {
  width: 394px;
  @include margin(0, 0, 24px, 0);
  @include relative();
  .es-releaseDemand-item__value {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    @include margin(4px, 0, 0, 0);
    @include textOverflow();
  }
  &:nth-last-child(1) {
    @include margin(0, 0, 0, 0);
  }
}
.es-releaseDemand-item__head {
  @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
  .es-releaseDemand-vip {
    @include widthAndHeight(auto, 20px);
    object-fit: contain;
    display: block;
    border-radius: 0;
    margin-top: 4px;
  }
}
.es-releaseDemand-content__item--special {
  @include flex(center, space-between, nowrap);
}
.es-releaseDemand-content__mbDialog {
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
.es-releaseDemand-mbDialog__mobile {
  @include widthAndHeight(434px, 32px);
}
.es-releaseDemand-mbDialog__code {
  @include widthAndHeight(346px, 32px);
  flex: 1;
}
.es-releaseDemand-input--codeBtn {
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px, 400, #244bf1, 22px);
}
.es-releaseDemand-input--down {
  color: #999999;
}

.es-releaseDemand-content__infoDialog {
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
.es-releaseDemand-content__infoDialog-img {
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
</style>

<style lang="scss">
@import "@/style/mixin.scss";
.el-date-table td.current:not(.disabled) .el-date-table-cell__text {
  background-color: #244bf1 !important;
}
.es-releaseDemand-dialog-step {
  .select {
    height: auto !important;
  }
  .el-dialog__body {
    padding-bottom: 24px !important;
  }
}
.es-releaseDemand {
  .el-switch__core {
    @include widthAndHeight(44px, 22px);
  }
}
.es-releaseDemand-content__infoDialog {
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
    right: 138px;
    height: 100%;
    z-index: 1;
    cursor: pointer;
    @include flex();
    @include font(14px, 600, #244bf1, 22px);
  }
}
.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 102px;
}
.el-upload--picture-card {
  width: 102px;
  height: 102px;
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
.el-upload-list--picture-card .el-upload-list__item-status-label {
  background-color: #244bf1;
}
.upload-box {
  .el-upload--picture-card {
    display: none !important;
  }
}
</style>
