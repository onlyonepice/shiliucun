<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <p class="title">分布式光伏及储能 专属资金解决方案</p>
    <img class="financing_plan_one" :src="financing_plan_one" alt="" />
    <img class="financing_plan_two" :src="financing_plan_two" alt="" />
    <el-button @click="handleFinancingClick('BUSINESS_INDUSTRY')" type="primary"
      >申请融资</el-button
    >
    <img class="financing_plan_three" :src="financing_plan_three" alt="" />
    <el-button type="primary" @click="handleFinancingClick('PHOTOVOLTAIC')"
      >申请融资</el-button
    >
  </div>
  <el-drawer
    v-if="drawer"
    :custom-class="ns.b('drawer')"
    append-to-body
    lock-scroll
    :z-index="3000"
    v-model="drawer"
    :title="`${typeConfig[ruleForm.type]}-融资申请`"
    direction="rtl"
    :before-close="handleClose"
  >
    <template #default>
      <el-form
        label-position="top"
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input placeholder="请输入" v-model="ruleForm.enterpriseName" />
        </el-form-item>
        <el-form-item label="企业所在地" prop="locationEnterprise">
          <el-select placeholder="请选择" v-model="ruleForm.locationEnterprise">
            <el-option
              v-for="item in regions"
              :key="item.code"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="ruleForm.type === 'BUSINESS_INDUSTRY'"
          label="新建储能电站规模"
          prop="energyStorageScale"
        >
          <el-input placeholder="请输入" v-model="ruleForm.energyStorageScale">
            <template #append>MWh</template>
          </el-input>
        </el-form-item>
        <el-form-item v-else label="新建光伏规模" prop="photovoltaicScale">
          <el-input placeholder="请输入" v-model="ruleForm.photovoltaicScale">
            <template #append>MW</template>
          </el-input>
        </el-form-item>
        <el-form-item label="投资类型" prop="investmentType">
          <el-radio-group v-model="ruleForm.investmentType">
            <el-radio label="1">业主自投</el-radio>
            <el-radio label="2">第三方投资</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input placeholder="请输入" v-model="ruleForm.contactName" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input placeholder="请输入" v-model="ruleForm.phoneNumber" />
        </el-form-item>
        <el-form-item label="常用邮箱" prop="mailbox">
          <el-input placeholder="请输入" v-model="ruleForm.mailbox" />
        </el-form-item>
        <el-form-item label="备注说明" prop="remark">
          <el-input
            placeholder="请输入"
            v-model="ruleForm.remark"
            type="textarea"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div>
        <el-button @click="closeDrawer">取消</el-button>

        <el-button type="primary" @click="submitForm(ruleFormRef)">
          提交
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import financing_plan_one from "@/assets/img/financingPlan/financing_plan_one.png";
import financing_plan_two from "@/assets/img/financingPlan/financing_plan_two.png";
import financing_plan_three from "@/assets/img/financingPlan/financing_plan_three.png";
import { REGEXP, regMobile, regEmail } from "@/utils/rule";
import { sddFindList } from "@/api/financingPlan";
import { ElMessage, type FormInstance } from "element-plus";
import { getAreaApi } from "@/api/user";
const typeConfig = {
  BUSINESS_INDUSTRY: "工商业储能",
  PHOTOVOLTAIC: "分布式光伏",
};
const ns = useNamespace("financing-plan");
const drawer = ref(false);
const handleClose = () => {
  drawer.value = false;
};

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref({
  locationEnterprise: "",
  enterpriseName: "",
  energyStorageScale: "",
  investmentType: "",
  contactName: "",
  phoneNumber: "",
  mailbox: "",
  remark: "",
  photovoltaicScale: "",
  type: "BUSINESS_INDUSTRY",
});

const closeDrawer = () => {
  drawer.value = false;
};
const rules = reactive({
  enterpriseName: [
    { required: true, message: "请输入", trigger: ["input", "blur"] },
  ],
  locationEnterprise: [
    { required: true, message: "请选择", trigger: ["input", "blur"] },
  ],
  energyStorageScale: [
    { required: true },
    {
      validator: (rule, value, callback) => {
        if (value && !REGEXP.numberReg.test(value)) callback("请输入数字");
        else {
          if (value) callback();
          else callback("请输入新建储能电站规模");
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  photovoltaicScale: [
    { required: true },
    {
      validator: (rule, value, callback) => {
        if (value && !REGEXP.numberReg.test(value)) callback("请输入数字");
        else {
          if (value) callback();
          else callback("请输入新建光伏规模");
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  scale: [{ required: true, message: "请输入", trigger: ["input", "blur"] }],
  investmentType: [
    { required: true, message: "请输入", trigger: ["input", "blur"] },
  ],
  contactName: [
    { required: true, message: "请输入", trigger: ["input", "blur"] },
  ],
  phoneNumber: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value && !regMobile.test(value)) {
          callback("请输入正确的手机号");
        } else {
          if (value) callback();
          else callback("请输入手机号码");
        }
      },
      trigger: ["change", "blur"],
    },
  ],
  mailbox: [
    {
      required: false,
      validator: (rule, value, callback) => {
        if (!value) callback();
        else {
          if (!regEmail.test(value)) {
            callback("请输入正确的邮箱地址");
          } else callback();
        }
      },
      trigger: ["change", "blur"],
    },
  ],
});
watch(
  () => drawer.value,
  (newVal) => {
    if (newVal === false) {
      ruleFormRef.value.resetFields();
    }
  },
);
let regions = ref([]);
const getAreaFn = async () => {
  const data = await getAreaApi({ level: 4, page: 1, limit: 1000, pcode: 156 });
  if (data.resp_code === 0) {
    regions.value = data.datas.records;
  }
};
const handleFinancingClick = (type) => {
  ruleForm.value.type = type;
  drawer.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitFn();
    } else {
      console.log("error submit!", fields);
    }
  });
};
const submitFn = async () => {
  let requestData = {};
  Object.keys(ruleForm.value).forEach((item) => {
    if (ruleForm.value[item] !== "") {
      requestData[item] = ruleForm.value[item];
    }
  });
  const data = await sddFindList(requestData);
  if (data.resp_code === 0) {
    drawer.value = false;
    ElMessage.success("提交成功");
  }
};

getAreaFn();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-financing-plan {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 56px;
  .title {
    @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    margin-bottom: 32px;
    width: 100%;
  }
  .el-button {
    margin-bottom: 16px;
  }
  .financing_plan_one {
    @include widthAndHeight(100%, 712px);
    margin-bottom: 32px;
  }
  .financing_plan_two {
    @include widthAndHeight(100%, 512px);
    margin-bottom: 16px;
  }
  .financing_plan_three {
    @include widthAndHeight(100%, 490px);
    margin-bottom: 16px;
  }
}
</style>
<style lang="scss">
.el-drawer__header {
  margin-bottom: 0 !important;
  border-bottom: 1px solid #dbdce2;
  padding-bottom: 15px;
  .el-drawer__title {
    font-weight: 600;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 24px;
  }
}
.el-drawer__footer {
  border-top: 1px solid #dbdce2;
  padding-top: 23px;
}
</style>
