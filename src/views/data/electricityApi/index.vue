<template>
  <div :class="[ns.b()]">
    <div :class="['es-commonPage', ns.b('content')]">
      <h1>电价API</h1>
      <div :class="ns.be('content', 'desc')">
        <div :class="ns.be('desc', 'info')">
          <div
            v-for="item in info"
            :key="item.id"
            :class="ns.be('desc__info', 'item')"
          >
            <h4>{{ item.title }}</h4>
            <h5 v-for="(_item, _index) in item.desc" :key="_index">
              {{ _item }}
            </h5>
          </div>
        </div>
        <el-button type="primary" @click="onOpen()">立即开通</el-button>
      </div>
      <h4 :class="ns.be('content', 'title')">请求参数说明</h4>
      <el-table :data="requestTable" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="value" label="示例值" />
        <el-table-column prop="isMust" label="必须" />
        <el-table-column prop="desc" label="说明" />
      </el-table>
      <h4 :class="ns.be('content', 'title')">返回参数说明</h4>
      <el-table :data="responseTable" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="value" label="示例值" />
        <el-table-column prop="desc" label="说明" />
        <el-table-column prop="none" label="" />
      </el-table>
      <h4 :class="ns.be('content', 'title')">错误码参照</h4>
      <el-table :data="errorTable" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="desc" label="说明" />
        <el-table-column prop="none" label="" />
        <el-table-column prop="none" label="" />
        <el-table-column prop="none" label="" />
      </el-table>
    </div>
  </div>
  <Dialog
    v-if="visibleInfo"
    title="开通API"
    :visible="visibleInfo"
    width="560px"
    height="574px"
    @onHandleClose="visibleInfo = false"
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
        <el-button @click="visibleInfo = false">取消</el-button>
        <el-button type="primary" @click="handleClose(true)">提交</el-button>
      </div>
      <img :src="ElectricityApiImage" :class="ns.be('content', 'img')" />
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { NOOP } from "@vue/shared";
import { ElMessage } from "element-plus";
import ElectricityApiImage from "@/assets/img/dataBase/electricity-api-img.png";
import { getVerificationCode, openApiApi } from "@/api/data";
import { login } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { setToken } from "@/utils/auth";
const ns = useNamespace("electricityApi");
const visibleInfo: Ref<boolean> = ref(false); // 开通弹窗
const activateInfo: Ref<any> = ref({
  source: "Api接口",
  userName: "",
  mobile: "",
  verificationCode: "",
  company: "",
  position: "",
}); // 开通弹窗信息
// 开通弹窗信息修改
const onChangeInfo = (value: any, type: string) => {
  activateInfo.value[type] = value;
};
const btnDesc: Ref<string> = ref("获取验证码");
const timer: Ref<any> = ref(null); // 定时器
const onOpen = () => {
  visibleInfo.value = true;
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
const openApiFn = async () => {
  const { resp_code } = await openApiApi(activateInfo.value);
  if (resp_code === 0) {
    ElMessage.success("信息已提交，24小时内会有工作人员与您联系");
    visibleInfo.value = false;
  }
};
const info: Ref<Array<any>> = ref([
  {
    id: 1,
    title: "产品介绍",
    desc: [
      "· 包含30个省份、37个地区的电价数据。",
      "· 每月底27日后逐步更新次月电价数据。",
      "· 适用于各地区工商业投资回报性测算、分析各省份电价走势等场景。",
    ],
  },
  {
    id: 2,
    title: "最新数据",
    desc: ["2024年7月"],
  },
  {
    id: 3,
    title: "计费方式",
    desc: ["年付，详情咨询客服人员"],
  },
]);
const requestTable: Ref<Array<any>> = ref([
  {
    id: 1,
    name: "regionName",
    type: "string",
    value: "上海市",
    isMust: "否",
    desc: "区域名称",
  },
  {
    id: 2,
    name: "years",
    type: "string",
    value: "2024.04",
    isMust: "否",
    desc: "年月",
  },
]);
const responseTable: Ref<Array<any>> = ref([
  {
    id: 1,
    name: "electricityTypeOneName",
    type: "string",
    value: "两部制",
    desc: "用电类型I",
  },
  {
    id: 2,
    name: "electricityTypeTwoName",
    type: "string",
    value: "一般工商业",
    desc: "用电类型II",
  },
  {
    id: 3,
    name: "tariffLevelId",
    type: "string",
    value: "不满一千伏",
    desc: "电压等级",
  },
  {
    id: 4,
    name: "topTime",
    type: "number",
    value: "-",
    desc: "尖峰时刻",
  },
  {
    id: 5,
    name: "highTime",
    type: "number",
    value: "-",
    desc: "高峰时刻",
  },
  {
    id: 6,
    name: "flatTime",
    type: "number",
    value: "-",
    desc: "平时刻",
  },
  {
    id: 7,
    name: "lowTime",
    type: "number",
    value: "-",
    desc: "低谷时刻",
  },
  {
    id: 8,
    name: "deepTime",
    type: "number",
    value: "-",
    desc: "深谷时刻",
  },
  {
    id: 9,
    name: "regionName",
    type: "string",
    value: "上海市",
    desc: "区域名称",
  },
  {
    id: 10,
    name: "years",
    type: "string",
    value: "2024.04",
    desc: "年月",
  },
]);
const errorTable: Ref<Array<any>> = ref([
  {
    id: 1,
    name: "200",
    desc: "请求成功",
  },
  {
    id: 1,
    name: "201",
    desc: "请求取消",
  },
  {
    id: 1,
    name: "401",
    desc: "没有权限",
  },
  {
    id: 1,
    name: "403",
    desc: "禁止访问",
  },
  {
    id: 1,
    name: "404",
    desc: "没有找到",
  },
]);
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-electricityApi-content {
  padding: 80px 0;
}
.es-electricityApi-content__desc {
  @include widthAndHeight(100%, auto);
  padding: 24px;
  background: #f4f6fe;
  border-radius: 8px;
  @include flex(flex-start, space-between, nowrap);
  margin: 32px 0 24px;
}
.es-electricityApi-desc__info__item {
  margin-bottom: 16px;
  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
.es-electricityApi-desc__info__item {
  h4 {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 24px;
  }
  h5 {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
  }
}
.es-electricityApi-content__img {
  @include widthAndHeight(512px, 182px);
}
.es-electricityApi-content__title {
  color: rgba(0, 0, 0, 0.9);
  line-height: 24px;
  margin: 24px 0 8px;
}
.es-electricityApi-input--codeBtn {
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px, 400, #244bf1, 22px);
}
.es-electricityApi-input--down {
  color: #999999;
}
.es-electricityApi-content__infoDialog {
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
.es-electricityApi-content__infoDialog {
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
.dialog-footer {
  @include flex(center, flex-end);
  margin-bottom: 24px;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-electricityApi-content {
  thead {
    .el-table__cell {
      @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
    }
  }
  tbody {
    .el-table__cell {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
}
</style>
