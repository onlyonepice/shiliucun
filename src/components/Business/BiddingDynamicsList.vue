<template>
  <div :class="[ns.b()]">
    <div :class="ns.b('item_info')" @click="handleSetDetailShowClick">
      <p class="name">
        {{ currentData.tenderName || currentData.policyName }}
      </p>
      <div class="tag-box">
        <div class="left">
          <img
            v-if="currentData.isNew && source !== 'policy'"
            class="new"
            :src="redNew"
            alt=""
          />
          <template v-if="source === 'policy'">
            <div
              class="tag"
              v-for="(tagItem, index) in currentData.typeName"
              :key="index"
            >
              {{ tagItem }}
            </div>
          </template>
          <p
            :class="['tag', currentData.status ? '' : 'tagDisable']"
            v-if="currentData.categoryName || currentData.contentName"
          >
            <span>
              {{ currentData.categoryName }}
            </span>
            <span v-if="currentData.categoryName"> | </span>
            <span>{{ currentData.contentName }}</span>
          </p>
        </div>
        <span class="right">{{
          currentData.countdown || currentData.releaseTime.split(" ")[0]
        }}</span>
      </div>
    </div>
    <div
      class="detail-data"
      :class="currentData.className"
      v-if="currentData.showDetail && detailData"
    >
      <div class="detail_content">
        <div class="detail_content_item">
          <p class="detail_content_item_label">基本信息</p>
          <div class="detail_content_item_value">
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">发布时间</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.releaseTime.split(" ")[0] }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">招标企业</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.tenderer ? detailData.tenderer : "" }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">地区</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.regionName }}
              </p>
            </div>

            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">文件链接</p>
              <p
                @click="handleLinkClick(detailData.fileUrl)"
                style="color: #244bf1; cursor: pointer"
                class="detail_content_item_value_item_value"
              >
                点击查看
              </p>
            </div>
          </div>
        </div>
        <div class="detail_content_item">
          <p class="detail_content_item_label">项目信息</p>
          <div class="detail_content_item_value">
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">项目类别</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.categoryName }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">招标内容</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.contentName }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">功率</p>
              <p class="detail_content_item_value_item_value">
                {{
                  !!detailData.powerScale
                    ? detailData.powerScale + "MW"
                    : "未知"
                }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">能量</p>
              <p class="detail_content_item_value_item_value">
                {{
                  !!detailData.energyScale
                    ? detailData.energyScale + "MWh"
                    : "未知"
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="detail_content_item">
          <p class="detail_content_item_label">招标代理机构</p>
          <div class="detail_content_item_value">
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">联系人</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.tenderingAgencyContactPerson }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">联系电话</p>
              <p class="detail_content_item_value_item_value">
                <span>{{ detailData.tenderingAgencyContactNumber }}</span>
                <img
                  v-if="
                    detailData.tenderingAgencyContactNumber &&
                    detailData.tenderingAgencyContactNumber !== ''
                  "
                  @click="
                    copyToClipboard(detailData.tenderingAgencyContactNumber)
                  "
                  class="copy_icon"
                  :src="copy_icon"
                  alt=""
                />
              </p>
            </div>
            <div class="role-permission" v-if="!isVip" @click="handleVipClick">
              <p class="role-permission_one">
                <img :src="lament_icon" alt="" />
                <span>开通会员查看代理机构信息</span>
              </p>
              <p class="role-permission_two">
                <span>立即开通</span>
                <img :src="right_more" alt="" />
              </p>
            </div>
          </div>
        </div>
      </div>
      <p @click="handleSetDetailShowClick()" class="hidden-detail">
        收起详情&nbsp;&nbsp;^
      </p>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="您只能查看12个月内数据，历史数据请至「EESA储能数据库」查看"
      :class="dialog.b()"
      :show-close="false"
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <img
        :class="dialog.b('cancel')"
        :src="CancelIcon"
        @click="handleClose(false)"
        alt=""
      />
      <!-- <span>title</span> -->
      <template #footer>
        <div class="dialog-footer">
          <el-checkbox v-model="checked" label="不再提示" size="large" />
          <el-button class="ml-a" @click="handleClose(false)"
            >下次再说</el-button
          >
          <el-button type="primary" @click="handleClose(true)"
            >立即前往</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { cloneDeep } from "lodash";
import { useRouter } from "vue-router";
import { getToken } from "@/utils/auth";
import { ElMessage } from "element-plus";
import useNamespace from "@/utils/nameSpace";
const { VITE_DATABASE_URL } = import.meta.env;
import redNew from "@/assets/img/red_new.png";
import { getBidFinderDetail } from "@/api/data";
import { getTimesApi } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import CancelIcon from "@/assets/img/common/cancel.png";
import copy_icon from "@/assets/img/common/copy_icon.png";
import right_more from "@/assets/img/common/right-more.png";
import lament_icon from "@/assets/img/common/lament_icon.png";
function copyToClipboard(text) {
  var textarea: any = document.createElement("textarea");
  textarea.style.position = "fixed";
  textarea.style.opacity = 0;
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  ElMessage.success("复制成功");
}
const checked = ref(false);
const ns = useNamespace("biddingDynamicsList");
const dialog = useNamespace("prompt");
const router = useRouter();
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
  source: {
    type: String,
    default: "",
  },
});

const isVip = ref(false);
const dialogVisible = ref(false);
interface dataType {
  id?: number;
  status: boolean;
  isNew?: boolean;
  className: string;
  showDetail?: boolean;
  tenderName?: string | null;
  policyName?: string | null;
  categoryName?: string | null;
  contentName?: string | null;
  countdown?: string | null;
  releaseTime?: string | null;
  tenderer?: string | null;
  regionName?: string | null;
  fileUrl?: string | null;
  powerScale?: string | null;
  energyScale?: string | null;
  technologyTypeName?: string | null;
  isPermissions?: boolean;
}
const handleVipClick = () => {
  router.push("/vip");
};
function handleClose(val) {
  checked.value &&
    window.localStorage.setItem(
      "historical-data-viewing-prompt",
      JSON.stringify(checked.value),
    );
  dialogVisible.value = false;
  if (val) {
    window.open(
      `${VITE_DATABASE_URL}/#/winningBidLibraryManage?tenderName=${currentData.value.tenderName}`,
    );
  }
}
const currentData = ref<dataType>(null);

const detailData = ref(null);

const handleSetDetailShowClick = async () => {
  if (props.source === "policy") {
    router.push({
      name: "Policy",
      query: { id: props.pageData.id },
    });
  } else {
    if ("showDetail" in props.pageData === false) {
      router.push({
        path: "/dataTender",
        query: {
          id: currentData.value.id,
        },
      });
      return;
    }
  }

  if (currentData.value.showDetail) {
    setTimeout(() => {
      currentData.value.showDetail = false;
    }, 450);
    currentData.value.className = "hide";
  } else {
    if (!getToken()) {
      useUserStore().openLogin(true);
      return;
    }
    useUserStore().permissionList.forEach((item) => {
      if (item.code === "CONTACT_INFORMATION_TENDERER") {
        isVip.value = item.permission;
      }
    });
    if (!currentData.value.status) {
      if (window.localStorage.getItem("historical-data-viewing-prompt")) {
        window.open(
          `${VITE_DATABASE_URL}/#/winningBidLibraryManage?tenderName=${currentData.value.tenderName}`,
        );
      } else {
        dialogVisible.value = true;
      }
    } else {
      const data = await getBidFinderDetail({ id: currentData.value.id });
      if (props.source === "dataTenderSearch") {
        window.trackFunction("pc_Bidding_SearchFile_click");
        const _datas: any = await getTimesApi({
          moduleName: "TENDER_DETAILS",
        });
        if (_datas.datas !== null) {
          ElMessage({
            message: `<div style="display: flex;align-items: center;"><img width="17.5" height="17.5" style="margin-right: 9px;" src="https://eesa-mini-app.oss-rg-china-mainland.aliyuncs.com/i-report/v1.0/iReport3_icon_comment.png" /><span>剩余使用次数：${_datas.datas}次</span></div>`,
            type: "info",
            dangerouslyUseHTMLString: true,
            duration: 2000,
          });
        }
      }
      if (data.resp_code === 0) {
        detailData.value = data.datas;
        currentData.value.showDetail = true;
        currentData.value.className = "show";
      } else if (data.resp_code === 10027) {
        //观看次数到达上限
        useUserStore().openVipTitle =
          "当日的查看次数已达到上限，请开通VIP继续查看。";
        useUserStore().openVip(true);
        setTimeout(() => {
          currentData.value.showDetail = false;
        }, 450);
        currentData.value.className = "hide";
      }
    }
  }
};
const handleLinkClick = (link) => {
  window.open(link);
};
watch(
  () => props.pageData,
  (newVal) => {
    currentData.value = cloneDeep(newVal) as any;
    if (newVal?.showDetail === true) {
      setTimeout(() => {
        currentData.value.showDetail = false;
      }, 450);
      currentData.value.className = "hide";
      handleSetDetailShowClick();
    }
  },
  { deep: true, immediate: true },
);
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-biddingDynamicsList {
  width: 100%;
  border-bottom: 1px solid #dbdce2;
  padding-bottom: 16px;
  margin-bottom: 16px;
  cursor: pointer;

  .es-biddingDynamicsList-item_info {
    width: 100%;
  }

  &:hover {
    .name {
      color: #244bf1;
    }
  }

  .name {
    @include textOverflow(1);
    width: 100%;
    @include font(16px, 400, rgba(0, 0, 0, 0.9), 28px);
    margin-bottom: 8px;
  }

  .tag-box {
    width: 100%;
    @include flex(center, space-between);

    .left {
      display: flex;

      .new {
        @include widthAndHeight(41px, 24px);
        margin-right: 8px;
      }

      .tag {
        padding: 2px 8px;
        background: #fff3ea;
        border-radius: 4px;
        border: 1px solid #ff8d32;
        margin-right: 4px;
        @include font(12px, 400, #ff8d32, 20px);
      }

      .tagDisable {
        background: #f2f3f5;
        border: 1px solid #dbdce2;
        @include font(12px, 400, #dbdce2, 20px);
      }
    }

    .right {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    }
  }

  .detail-data {
    transition: all 0.2s;
    overflow: hidden;

    .hidden-detail {
      width: 100%;
      height: 32px;
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-top: 13px;
      @include font(14px, 400, #244bf1, 22px);
      cursor: pointer;
    }

    .detail_content {
      margin-top: 16px;
      width: 100%;
      padding: 16px;
      background-color: #f2f3f5;

      .detail_content_item {
        width: 100%;
        display: flex;
        margin-bottom: 16px;
        &:last-child {
          margin-bottom: 0;
        }
        .detail_content_item_label {
          margin-right: 16px;
          width: 96px;
          @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
        }

        .detail_content_item_value {
          flex: 1;
          border: 1px solid #dbdce2;
          border-bottom: 0;
          position: relative;

          .role-permission {
            position: absolute;
            left: 0;
            top: 0;
            @include widthAndHeight(100%, 100%);
            background: rgba(0, 0, 0, 0.1);
            /* 半透明黑色背景 */
            backdrop-filter: blur(3px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            justify-content: center;

            .role-permission_one,
            .role-permission_two {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .role-permission_one {
              img {
                @include widthAndHeight(18px, 18px);
                margin-right: 2px;
              }

              span {
                @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
              }
            }

            .role-permission_two {
              img {
                @include widthAndHeight(18px, 18px);
                margin-right: 2px;
              }

              span {
                @include font(16px, 600, #244bf1, 24px);
              }
            }
          }

          .detail_content_item_value_item {
            width: 100%;
            border-bottom: 1px solid #dbdce2;
            display: flex;

            .detail_content_item_value_item_label {
              @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
              width: 96px;
              border-right: 1px solid #dbdce2;
              background-color: #e8eaef;
              padding: 9px 16px;
            }

            .detail_content_item_value_item_value {
              @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
              padding: 9px 16px;
              flex: 1;
              display: flex;
              align-items: center;

              .copy_icon {
                @include widthAndHeight(20px, 20px);
                margin-left: 4px;
              }
            }
          }
        }
      }
    }
  }

  $maxHeightVal: 800px;
  .show {
    animation: openDetail 0.5s linear;
  }
  .hide {
    animation: closeDetail 0.5s linear;
  }
  @keyframes openDetail {
    0% {
      opacity: 0.5;
      max-height: 0px;
    }
    25% {
      opacity: 0.9;
    }
    100% {
      max-height: $maxHeightVal;
    }
  }
  @keyframes closeDetail {
    0% {
      max-height: $maxHeightVal;
    }
    100% {
      max-height: 0;
      display: none;
    }
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.es-prompt {
  width: 384px !important;
  height: 200px !important;
  border-radius: 10px !important;
  translate: 50vw 50vh;
  margin-top: -100px !important;
  margin-left: -184px !important;
  @include flex(flex-start, flex-start);
  flex-direction: column;

  .el-dialog__header {
    font-weight: 600;
    line-height: 26px;
    color: rgba(0, 0, 0, 1);
  }

  .el-dialog__body {
    padding: 0;
    margin: 0;
    height: 0;
  }

  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
  }

  .el-dialog__footer {
    width: 100%;
    margin-top: auto;

    .dialog-footer {
      width: 100%;
      @include flex(center, flex-start);

      .el-checkbox {
        height: 28px;

        .el-checkbox__label {
          color: rgba(0, 0, 0, 0.6) !important;
        }
      }

      .ml-a {
        margin-left: auto;
      }
    }
  }

  .el-dialog__headerbtn {
    right: 14px;
  }
}

.es-prompt-cancel {
  @include widthAndHeight(28px, 28px);
  @include absolute(1, 24px, 18px, none, none);
  cursor: pointer;
}
</style>
