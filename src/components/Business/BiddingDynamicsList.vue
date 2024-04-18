<template>
  <div :class="[ns.b()]">
    <div :class="ns.b('item_info')" @click="handleSetDetailShowClick">
      <p class="name">
        {{ currentData.tenderName }}
      </p>
      <div class="tag-box">
        <div class="left">
          <img v-if="currentData.isNew" class="new" :src="redNew" alt="" />
          <p
            class="tag"
            v-if="currentData.categoryName || currentData.contentName"
          >
            <span>
              {{ currentData.categoryName }}
            </span>
            <span v-if="currentData.categoryName"> | </span>
            <span>{{ currentData.contentName }}</span>
          </p>
        </div>
        <span class="right">{{ currentData.countdown }}</span>
      </div>
    </div>
    <div class="detail-data" v-if="currentData.showDetail && detailData">
      <div class="detail_content">
        <div class="detail_content_item">
          <p class="detail_content_item_label">基本信息</p>
          <div class="detail_content_item_value">
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">发布时间</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.releaseTime }}
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
                {{ detailData.contentName }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">招标内容</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.categoryName }}
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">功率</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.powerScale }}MW
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">能量</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.energyScale }}MWh
              </p>
            </div>
            <div class="detail_content_item_value_item">
              <p class="detail_content_item_value_item_label">技术类型</p>
              <p class="detail_content_item_value_item_value">
                {{ detailData.technologyTypeName }}
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
  </div>
</template>

<script setup lang="ts">
import copy_icon from "@/assets/img/common/copy_icon.png";
import lament_icon from "@/assets/img/common/lament_icon.png";
import right_more from "@/assets/img/common/right-more.png";
import { useUserStore } from "@/store/modules/user";
import redNew from "@/assets/img/red_new.png";
import { ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
import { cloneDeep } from "lodash";
import { useRouter } from "vue-router";
import { getToken } from "@/utils/auth";
import { getBidFinderDetail } from "@/api/data";
import { ElMessage } from "element-plus";
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
const ns = useNamespace("biddingDynamicsList");
const router = useRouter();
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
});
const isVip = ref(false);
interface dataType {
  id?: number;
  showDetail?: boolean;
  tenderName?: string | null;
  isNew?: boolean;
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
const currentData = ref<dataType>({});

const detailData = ref(null);

const handleSetDetailShowClick = async () => {
  if ("showDetail" in props.pageData === false) {
    router.push({
      path: "/dataTender",
      query: {
        id: currentData.value.id,
      },
    });
    return;
  }
  if (currentData.value.showDetail) {
    currentData.value.showDetail = false;
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

    const data = await getBidFinderDetail({ id: currentData.value.id });
    if (data.resp_code === 0) {
      detailData.value = data.datas;
      currentData.value.showDetail = true;
    } else if (data.resp_code === 10027) {
      //观看次数到达上限
      useUserStore().openVipTitle =
        "当日的查看次数已达到上限，请开通VIP继续查看。";
      useUserStore().openVip(true);
      currentData.value.showDetail = false;
    }
  }
};

const handleLinkClick = (link) => {
  window.open(link);
};
watch(
  () => props.pageData,
  (newVal) => {
    currentData.value = cloneDeep(newVal);
    if (newVal?.showDetail === true) {
      currentData.value.showDetail = false;
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
    @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
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
        @include font(12px, 400, #ff8d32, 20px);
      }
    }

    .right {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    }
  }
  .detail-data {
    margin-top: 16px;
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
      width: 100%;
      padding: 16px;
      background-color: #f2f3f5;

      .detail_content_item {
        width: 100%;
        display: flex;
        margin-bottom: 16px;

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
            background: rgba(0, 0, 0, 0.1); /* 半透明黑色背景 */
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
}
</style>
