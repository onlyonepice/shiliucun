<template>
  <div :class="ns.b('compared')">
    <div :class="[ns.be('content', 'top')]">
      <img
        :class="[ns.be('content', 'log')]"
        :src="useUserStore().fileUrl + companyInfo.logoUrl"
        alt=""
      />
      <div>
        <h3>{{ companyInfo.nameCn }}</h3>
        <h5 :class="[ns.be('content', 'link')]">
          {{ companyInfo.nameEn }}
        </h5>
        <template
          v-for="(item, index) in companyInfo.socialMediaJsonArray"
          :key="index"
        >
          <el-popover
            v-if="
              item.link.indexOf('.jpg') > 0 || item.link.indexOf('.png') > 0
            "
            width="150px"
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
    <div :class="[ns.b('title')]" v-if="companyInfo.siteUrl">
      <h5>企业官网</h5>
      <h5 :class="[ns.be('title', 'desc')]">
        <span>{{ companyInfo.siteUrl }}</span>
        <img
          :src="CopyIcon"
          alt=""
          @click="toClipboardFn(companyInfo.siteUrl)"
        />
      </h5>
    </div>
    <div :class="[ns.b('title')]" v-if="companyInfo.abbreviation">
      <h5>企业中文简称</h5>
      <h5 :class="[ns.be('title', 'desc')]">
        {{ companyInfo.abbreviation }}
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
    <div :class="[ns.b('title')]" v-if="companyInfo.mainBusiness">
      <h5>联系人</h5>
      <div style="display: flex; margin-top: 8px">
        <div
          v-for="(item, index) in companyInfo.enterpriseContactDTOList"
          :key="index"
        >
          <el-popover
            placement="right"
            width="368"
            popper-style="padding: 0;border-radius: 4px;"
          >
            <template #reference>
              <div :class="[ns.b('connect')]">
                {{ item.contactName.slice(0, 1) }}
              </div>
            </template>
            <template #default>
              <div :class="[ns.be('content', 'icon-detail-card')]">
                <div :class="[ns.be('icon-detail', 'top')]">
                  <div :class="[ns.be('icon-detail', 'top-left')]">
                    <h4>
                      {{ item.contactName
                      }}{{
                        item.positionTypeName
                          ? " | " + item.positionTypeName
                          : ""
                      }}
                    </h4>
                    <p :class="[ns.b('text')]">{{ item.enterpriseName }}</p>
                    <div :class="[ns.b('empty-line')]" />
                  </div>
                  <img
                    :src="useUserStore().fileUrl + companyInfo.logoUrl"
                    alt=""
                    :class="[ns.be('icon-detail', 'top-right')]"
                  />
                </div>
                <p :class="[ns.b('text')]">手机：{{ item.phone || "-" }}</p>
                <p :class="[ns.b('text')]">邮箱：{{ item.email || "-" }}</p>
              </div>
            </template>
          </el-popover>
          <h5
            :class="[ns.be('title', 'desc')]"
            style="width: 64px; text-align: center; display: block"
          >
            {{ item.contactName }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import CopyIcon from "@/assets/img/common/copy_icon.png";
import { ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
const ns = useNamespace("searchProduct-detailCompany");
const { toClipboard } = useClipboard();
defineProps({
  companyInfo: {
    type: Object as any,
    default: () => {},
  },
});
const handleClick = (link: string) => {
  window.open(link, "externalWindow");
};
const toClipboardFn = (content: string) => {
  toClipboard(content);
  ElMessage.success("复制成功");
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-detailCompany-top {
  @include flex(center, space-between);
  @include padding(0, 0, 19px, 0);
  border-bottom: 1px solid #dbdce2;
  @include margin(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
.es-searchProduct-detailCompany-content__top {
  @include flex(center, flex-start);
  h3 {
    margin-bottom: 8px;
  }
}
.es-searchProduct-detailCompany-content__icon {
  @include widthAndHeight(24px, 24px);
  margin: 8px 8px 0 0;
  cursor: pointer;
}
.es-searchProduct-detailCompany-content__icon-detail {
  @include widthAndHeight(150px, 120px);
  img {
    @include widthAndHeight(120px, 120px);
  }
}
.es-searchProduct-detailCompany-content__icon-detail-card {
  @include widthAndHeight(368px, 176px);
  background: linear-gradient(rgba(36, 75, 241, 0.1), #ffffff);
  padding: 24px;
  box-sizing: border-box;
}
.es-searchProduct-detailCompany-empty-line {
  @include widthAndHeight(200px, 1px);
  background: #dbdce2;
  margin-top: 15px;
}
.es-searchProduct-detailCompany-text {
  @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
}
.es-searchProduct-detailCompany-icon-detail__top {
  @include flex(center, flex-start);
}
.es-searchProduct-detailCompany-icon-detail__top-right {
  @include widthAndHeight(96px, 96px);
  border-radius: 4px;
  object-fit: contain;
  margin-left: 8px;
}
.es-searchProduct-detailCompany-content__link {
  @include flex(center, flex-start);
  font-weight: 400;
  p {
    color: #244bf1;
    cursor: pointer;
  }
}
.es-searchProduct-detailCompany-content__log {
  @include widthAndHeight(120px, 120px);
  margin-right: 16px;
  object-fit: contain;
}
.es-searchProduct-detailCompany-title {
  margin: 24px 0 0;
}
.es-searchProduct-detailCompany-title__desc {
  color: rgba(0, 0, 0, 0.6);
  line-height: 22px;
  margin-top: 4px;
  font-weight: 400;
  font-size: 14px;
  @include flex(center, flex-start);
  img {
    @include widthAndHeight(16px, 16px);
    cursor: pointer;
    margin-left: 4px;
  }
}
.es-searchProduct-detailCompany-connect {
  @include widthAndHeight(64px, 64px);
  background: #244bf1;
  border-radius: 4px;
  @include font(20px, 600, rgba(255, 255, 255, 0.9), 64px);
  text-align: center;
  margin-right: 12px;
}
</style>
