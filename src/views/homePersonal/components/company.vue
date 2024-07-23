<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的企业</h3>
      <div v-if="JSON.stringify(companyInfo) !== '{}'">
        <template v-if="companyInfo.address">
          <el-button type="primary" @click="reviseCompanyVisible = true"
            >修改信息</el-button
          >
        </template>
        <template v-else>
          <el-button @click="visibleCompany = true">更换企业</el-button>
          <el-button type="primary" @click="onSettlement()">企业入驻</el-button>
        </template>
      </div>
    </div>
    <div :class="[ns.b('content'), 'animate__animated animate__fadeIn']">
      <div :class="[ns.be('content', 'top')]">
        <img
          :class="[ns.be('content', 'log')]"
          :src="
            companyInfo.logoUrl
              ? useUserStore().fileUrl + companyInfo.logoUrl
              : 'https://cdn.eesaenergy.com/mini-app/i-report/v1.0/no_img.png'
          "
          alt=""
        />
        <div>
          <h3>{{ companyInfo.nameCn }}</h3>
          <h5 :class="[ns.be('content', 'link')]">
            企业官网：
            <p @click="handleClick(companyInfo.siteUrl)">
              {{ companyInfo.siteUrl || "信息暂无" }}
            </p>
          </h5>
          <template
            v-for="(item, index) in companyInfo.socialMediaJsonArray"
            :key="index"
          >
            <el-popover
              v-if="
                item.link.indexOf('.jpg') > 0 || item.link.indexOf('.png') > 0
              "
            >
              <template #reference>
                <img
                  :class="[ns.be('content', 'icon')]"
                  :src="useUserStore().fileUrl + item.socialMediaIcon"
                />
              </template>
              <template #default>
                <div :class="[ns.be('content', 'icon-detail')]">
                  <img :src="useUserStore().fileUrl + item.link" />
                </div>
              </template>
            </el-popover>
            <img
              v-else
              :class="[ns.be('content', 'icon')]"
              :src="useUserStore().fileUrl + item.socialMediaIcon"
              @click="handleClick(item.link)"
            />
          </template>
        </div>
      </div>
      <div :class="[ns.b('title')]">
        <h5>企业简介</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.introduction || "信息暂无" }}
        </h5>
      </div>
      <div :class="[ns.b('title')]">
        <h5>企业中文简称</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.abbreviation || "信息暂无" }}
        </h5>
      </div>
      <div :class="[ns.b('title')]">
        <h5>企业英文名称</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.nameEn || "信息暂无" }}
        </h5>
      </div>
      <div :class="[ns.b('title')]">
        <h5>座机号码</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.landline || "信息暂无" }}
        </h5>
      </div>
      <div :class="[ns.b('title')]">
        <h5>企业地址</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.address || "信息暂无" }}
        </h5>
      </div>
      <div :class="[ns.b('title')]">
        <h5>产业链环节</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.mainBusiness || "信息暂无" }}
        </h5>
      </div>
      <div :class="[ns.b('title')]" v-if="companyInfo.enterpriseContactDTOList">
        <h5>联系人</h5>
        <div
          :class="[ns.be('title', 'desc')]"
          v-for="(item, index) in companyInfo.enterpriseContactDTOList"
          :key="index"
        >
          <span>{{ item.contactName }}</span>
          <span v-if="item.positionTitle" :class="[ns.be('title', 'line')]"
            >|</span
          >
          <span v-if="item.positionTitle">{{ item.positionTitle }}</span>
          <div :class="[ns.be('title', 'copy')]" v-if="item.phone">
            {{ item.phone }}
            <img
              :class="[ns.be('copy', 'icon')]"
              :src="CopyIcon"
              @click="toClipboardFn(item.phone)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    title="更改企业"
    :visible="visibleCompany"
    width="560px"
    height="176px"
    @onHandleClose="onHandleClose"
  >
    <template #content>
      <div :class="ns.be('content', 'mbDialog')">
        <span required>企业名称</span>
        <Select
          type="input"
          :defaultValue="companyName"
          @onChange="onChange"
          style="width: 100%"
        />
      </div>
    </template>
  </Dialog>
  <ReviseCompany
    :visible="reviseCompanyVisible"
    @onHandleClose="reviseCompanyVisible = false"
  />
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getCompanyInfoApi } from "@/api/user";
import CopyIcon from "@/assets/img/common/copy_icon.png";
import useClipboard from "vue-clipboard3";
import { ElMessage } from "element-plus";
import { updateCompanyName } from "@/api/home";
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
import { useUserStore } from "@/store/modules/user";
const { toClipboard } = useClipboard();
const ns = useNamespace("homePersonalCompany");
const visibleCompany: Ref<boolean> = ref(false); // 更改企业弹窗
const companyName: Ref<any> = ref({}); // 更改企业弹窗数据
const companyInfo: Ref<any> = ref({}); // 获取企业信息
const reviseCompanyVisible: Ref<boolean> = ref(false); // 修改企业弹窗
const getCompanyInfo = async () => {
  const { datas, resp_code } = await getCompanyInfoApi();
  if (resp_code === 0) {
    companyInfo.value = datas;
    companyName.value = datas.nameCn;
  }
};
getCompanyInfo();
const toClipboardFn = (content: string) => {
  toClipboard(content);
  ElMessage.success("复制成功");
};
const handleClick = (link: string) => {
  link && window.open(link, "externalWindow");
};
// 企业入驻
const onSettlement = () => {
  window.open(`${VITE_INDUSTRIALMAP_URL}/uploadEnterprise`, "externalWindow");
};
// 关闭弹窗
const onHandleClose = async (type: boolean) => {
  visibleCompany.value = false;
  if (type) {
    const { resp_code }: any = await updateCompanyName({
      companyName: companyName.value,
    });
    if (resp_code === 0) {
      ElMessage.success("修改成功");
      getCompanyInfo();
    }
  }
};
const onChange = (val: string) => {
  companyName.value = val;
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalCompany-top {
  @include flex(center, space-between);
  @include padding(0, 0, 19px, 0);
  border-bottom: 1px solid #dbdce2;
  @include margin(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
.es-homePersonalCompany-content__top {
  @include flex(center, flex-start);
  h3 {
    margin-bottom: 8px;
  }
}
.es-homePersonalCompany-content__log {
  @include widthAndHeight(120px, 120px);
  margin-right: 16px;
  object-fit: contain;
}
.es-homePersonalCompany-content__icon {
  @include widthAndHeight(24px, 24px);
  margin: 8px 8px 0 0;
  cursor: pointer;
}
.es-homePersonalCompany-content__icon-detail {
  @include flex(center, center);
  img {
    @include widthAndHeight(120px, 120px);
  }
}
.es-homePersonalCompany-content__link {
  @include flex(center, flex-start);
  font-weight: 400;
  p {
    color: #244bf1;
    cursor: pointer;
  }
}
.es-homePersonalCompany-title {
  margin: 24px 0 0;
}
.es-homePersonalCompany-title__desc {
  color: rgba(0, 0, 0, 0.6);
  line-height: 22px;
  margin-top: 4px;
  font-weight: 400;
  font-size: 14px;
  @include flex(center, flex-start);
}
.es-homePersonalCompany-title__line {
  margin: 0 4px;
  font-weight: 500;
}
.es-homePersonalCompany-title__copy {
  @include flex(center, flex-start);
  margin-left: 20px;
}
.es-homePersonalCompany-copy__icon {
  @include widthAndHeight(16px, 16px);
  margin-left: 8px;
  cursor: pointer;
}
.es-homePersonalCompany-content__mbDialog {
  @include flex(center, flex-start, nowrap);
  @include margin(0, 0, 16px, 0);
  &:nth-last-child(1) {
    @include margin(0, 0, 0, 0);
  }
  span {
    display: inline-block;
    @include widthAndHeight(90px, 22px);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    @include margin(0, 8px, 0, 0);
    text-align: right;
  }
  span[required]::before {
    content: "*"; /* 添加一个星号作为标识符 */
    color: red; /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
}
</style>
