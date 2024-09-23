<template>
  <breadcrumb :breadcrumbList="breadcrumbList" />
  <div :class="ns.b('page')">
    <div :class="['es-commonPage', ns.b()]">
      <div :class="[ns.b('step')]">
        <div
          v-for="item in stepList"
          :key="item.id"
          :class="[
            ns.be('step', 'item'),
            step === item.id ? ns.be('step', 'active') : '',
          ]"
        >
          <div :class="ns.be('step', 'number')">{{ item.id }}</div>
          <div :class="ns.be('step', 'name')">{{ item.name }}</div>
        </div>
      </div>
      <div v-show="step === 1" class="animate__animated animate__fadeIn">
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
        <div :class="ns.be('content', 'infoDialog')" style="height: auto">
          <span required>业务范围</span>
          <Select
            type="select"
            :defaultValue="modifyInfoFreeze.business"
            :options="useUserStore().$state.businessList"
            labelKey="label"
            valueKey="value"
            :multiple="true"
            @onChange="
              (val) => {
                return onChangeInfo(val, 'business');
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
          <div
            v-if="false"
            @click="onHandleModifyMobile"
            class="edit-phone-number_btn"
          >
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
        <div class="footer-left" @click="handleConfirmUserInfo">
          <img :src="isConfirmUserInfo ? HasChoseRadio : NoChoseRadio" alt="" />
          <p>我已确认以上个人信息，内容真实无误</p>
        </div>
        <div class="footer-left" style="margin-top: 40px">
          <el-button @click="onHandleCloseInfo(false)">取消</el-button>
          <el-button
            type="primary"
            style="width: 102px"
            @click="onHandleCloseInfo(true)"
            >保存并确认</el-button
          >
        </div>
      </div>
      <div v-show="step === 2">
        <div :class="ns.be('content', 'infoDialog')">
          <span required>需求标题</span>
          <Select
            type="input"
            :defaultValue="needData.title"
            :maxlength="20"
            :showWordLimit="true"
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
          <span required>寻求客户</span>
          <Select
            type="select"
            :defaultValue="needData.role"
            :options="roleList"
            labelKey="labelName"
            valueKey="id"
            :multiple="true"
            :multipleLimit="2"
            :showSelectHead="true"
            @onChange="
              (val) => {
                return onChangeNeed(val, 'role');
              }
            "
          >
            <template #header>
              <div :class="ns.b('upperLimit')">
                已选{{ needData.role ? needData.role.length : 0 }}/2
              </div>
            </template>
          </Select>
        </div>
        <div
          :class="ns.be('content', 'infoDialog')"
          style="display: flex; align-items: flex-start; height: auto"
        >
          <span>内容标签</span>
          <Select
            type="select"
            :defaultValue="needData.tab"
            :options="tabList"
            :multiple="true"
            :multipleLimit="3"
            labelKey="labelName"
            placeholder="添加标签，让更多人关注到你"
            valueKey="id"
            :showSelectHead="true"
            @onChange="
              (val) => {
                return onChangeNeed(val, 'tab');
              }
            "
          >
            <template #header>
              <div :class="ns.b('upperLimit')">
                已选{{ needData.tab ? needData.tab.length : 0 }}/3
              </div>
            </template>
          </Select>
          <span :class="ns.b('add-tab')" @click="onAddTag()">添加标签</span>
        </div>
        <div
          :class="ns.be('content', 'infoDialog')"
          style="height: 79px; align-items: flex-start"
        >
          <span required>需求描述</span>
          <Select
            type="input"
            :maxlength="500"
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

        <div class="btn-box">
          <el-button @click="backStep" style="margin-right: 231px"
            >上一步</el-button
          >
          <el-button @click="onHandleCloseInfo(false)">取消</el-button>
          <el-button type="primary" @click="handleReleaseNeed()"
            >发布需求</el-button
          >
        </div>
        <BusinessCard :info="userDetailInfo" class="info-card" />
      </div>
    </div>
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
import BusinessCard from "@/views/demandMatching/detail/components/businessCard.vue";
import NoChoseRadio from "@/assets/img/common/i-Report-radio-false.png";
import HasChoseRadio from "@/assets/img/common/i-Report-radio-true.png";
import UploadImg from "@/assets/img/common/upload-image.png";
import { onMounted, ref, Ref, watch, onActivated } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
import { regMobile, regEmail } from "@/utils/rule";
import type { UploadProps } from "element-plus";
import { cloneDeep } from "lodash";
import { getToken } from "@/utils/auth";
import { splitOrJoin } from "@/utils";
import { useRouter } from "vue-router";
const router = useRouter();
const emits = defineEmits(["close"]);
const { VITE_GLOB_API_URL } = import.meta.env;
import {
  updateUserInfo,
  editUserInfoApi,
  getPositionTypeApi,
} from "@/api/user";
import {
  getNeedTypeApi,
  releaseNeedApi,
  updateNeedApi,
  getRoleConfigApi,
} from "@/api/demandList";
// 步骤数组信息
const stepList: Ref<Array<any>> = ref([
  { id: 1, name: "编辑/确认个人信息" },
  { id: 2, name: "填写需求信息" },
]);
const uploadToken: Ref<any> = ref({
  Authorization: "Bearer " + getToken(),
  Tenant: "iReport-front",
});
const breadcrumbList: Ref<Array<any>> = ref([
  { text: "需求大厅", path: "/demandMatching/list" },
  { text: "需求发布", path: "" },
]);
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
const modifyInfo: Ref<any> = ref({
  avatarImg: "",
  realName: "",
  company: "",
  position: "",
  mobile: "",
  weCat: "",
  email: "",
}); // 修改信息
const modifyInfoFreeze: Ref<any> = ref({});
const userDetailInfo: Ref<any> = ref(); // 用户详细信息
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
// 点击添加标签
const onAddTag = () => {
  if (needData.value.tab.length >= 3) {
    return ElMessage.warning("最多添加3个标签");
  }
  addTabDialog.value = true;
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
  getPositionType();
  getNeedType();
  getRoleConfig();
});
onActivated(() => {
  onGetUserInfo();
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
  needData.value.dhLabelDTOList = [];
  needData.value.role.map((item) => {
    needData.value.dhLabelDTOList.push({ id: item });
  });
  (needData.value.tab.length > 0 || needData.value.tab.length == 0) &&
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
    needData.value = {};
    ElMessage.success("提交发布成功");
    router.back();
  }
};
// 修改用户信息
const onChangeInfo = (value: any, type: string) => {
  modifyInfo.value[type] = value;
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
  _modifyInfo.business = splitOrJoin(_modifyInfo.business);
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
const onGetUserInfo = () => {
  const datas = useUserStore().$state.userInfo;
  userDetailInfo.value = datas;
  const _modifyInfo = modifyInfo.value;
  // 重置用户信息
  Object.assign(_modifyInfo, datas);
  _modifyInfo.business = splitOrJoin(_modifyInfo.business);
  modifyInfoFreeze.value = JSON.parse(JSON.stringify(_modifyInfo));
};
function onHandleModifyMobile() {
  visibleMobile.value = true;
}
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
      val.needLabelListVOList &&
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
.es-releaseDemand {
  background: #ffffff;
  border-radius: 8px;
  padding: 80px 303px 48px;
}
.es-releaseDemand-page {
  padding: 36px 0 80px;
}
.es-releaseDemand-content {
  @include flex(flex-start, space-between, nowrap);
}
.es-releaseDemand-upperLimit {
  background: #f2f3f5;
  @include font(12px, 600, rgba(0, 0, 0, 0.9), 20px);
}
.es-releaseDemand-add-tab {
  @include font(14px, 400, #244bf1, 22px);
  margin-left: 8px;
  cursor: pointer;
}
.footer-left {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 80px;
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
.es-releaseDemand-step {
  width: 100%;
  @include flex(flex-start, space-between, nowrap);
  margin-bottom: 64px;
  .es-releaseDemand-step__item {
    @include flex(center, flex-start, nowrap);
    &:nth-of-type(1)::after {
      content: "";
      display: block;
      @include widthAndHeight(96px, 1px);
      background: #dbdce2;
      margin-left: 32px;
    }
  }
  .es-releaseDemand-step__number {
    @include widthAndHeight(40px, 40px);
    background: #f2f3f5;
    border-radius: 50%;
    @include flex(center, center, nowrap);
    margin-right: 8px;
    @include font(16px, 600, rgba(0, 0, 0, 0.6), 24px);
  }
  .es-releaseDemand-step__name {
    @include font(20px, 400, rgba(0, 0, 0, 0.6), 28px);
  }
  .es-releaseDemand-step__active {
    .es-releaseDemand-step__number {
      background: #244bf1;
      @include font(16px, 600, rgba(255, 255, 255, 0.9), 24px);
    }
    .es-releaseDemand-step__name {
      color: rgba(0, 0, 0, 0.9);
      font-weight: 600;
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
.el-select-dropdown__header {
  background: #f2f3f5;
  border: none;
  margin-top: 8px;
  height: 24px;
  padding: 2px 16px;
}
</style>
