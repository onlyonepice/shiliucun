<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的企业</h3>
    </div>
    <div :class="[ns.b('content'), 'animate__animated animate__fadeIn']">
      <div :class="[ns.be('content', 'top')]">
        <img
          :class="[ns.be('content', 'log')]"
          :src="useUserStore().fileUrl + companyInfo.logoUrl"
          alt=""
        />
        <div>
          <h3>{{ companyInfo.nameCn }}</h3>
          <h5 :class="[ns.be('content', 'link')]">
            企业官网：
            <p @click="handleClick(companyInfo.siteUrl)">
              {{ companyInfo.siteUrl }}
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
      <div :class="[ns.b('title')]" v-if="companyInfo.introduction">
        <h5>企业简介</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.introduction }}
        </h5>
      </div>
      <div :class="[ns.b('title')]" v-if="companyInfo.abbreviation">
        <h5>企业中文简称</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.abbreviation }}
        </h5>
      </div>
      <div :class="[ns.b('title')]" v-if="companyInfo.nameEn">
        <h5>企业英文名称</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.nameEn }}
        </h5>
      </div>
      <div :class="[ns.b('title')]" v-if="companyInfo.landline">
        <h5>座机号码</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.landline }}
        </h5>
      </div>
      <div :class="[ns.b('title')]" v-if="companyInfo.address">
        <h5>企业地址</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.address }}
        </h5>
      </div>
      <div :class="[ns.b('title')]" v-if="companyInfo.mainBusiness">
        <h5>产业链环节</h5>
        <h5 :class="[ns.be('title', 'desc')]">
          {{ companyInfo.mainBusiness }}
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
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getPositionTypeApi } from "@/api/user";
import CopyIcon from "@/assets/img/common/copy_icon.png";
import useClipboard from "vue-clipboard3";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/modules/user";
const { toClipboard } = useClipboard();
const ns = useNamespace("homePersonalCompany");
const companyInfo: Ref<any> = ref({}); // 获取企业信息
const getCompanyInfo = async () => {
  const { datas, resp_code } = await getPositionTypeApi();
  if (resp_code === 0) {
    console.log(datas);
    companyInfo.value = datas;
  }
};
getCompanyInfo();
const toClipboardFn = (content: string) => {
  toClipboard(content);
  ElMessage.success("复制成功");
};
const handleClick = (link: string) => {
  window.open(link, "externalWindow");
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
</style>
