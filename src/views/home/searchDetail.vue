<template>
  <div :class="[ns.b()]">
    <Breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="[ns.b('content'), 'es-commonPage']">
      <div class="search-box">
        <div :class="ns.b('homeTopSearch')">
          <el-input
            v-model="searchContent"
            placeholder="请输入关键字…"
            @keyup.enter="onSearch"
          />
          <div :class="ns.b('homeTopSearchIcon')" @click.stop="onSearch">
            <span>搜索</span>
            <img :src="searchIcon" alt="" />
          </div>
        </div>
      </div>
      <div class="tab-box">
        <div
          class="tab_item"
          v-for="(value, key) in pageOptions"
          :key="`page${key}`"
        >
          <span :class="`'tab_name' ${key === currentTab ? 'active' : ''} `">{{
            value.name
          }}</span>
          <span v-if="key === currentTab" class="tab_line" />
        </div>
      </div>
      <div class="search-content">
        <div
          class="search-content_item"
          v-for="(value, key) in pageOptions.All.data"
          :key="`pageOptions${key}`"
        >
          <p class="search-content_item_title">{{ pageOptions[key].name }}</p>
          <div class="search-content_item_value">
            <!-- 储能前沿 -->
            <template v-if="key === 'Energy_Storage_Frontier'" />
            <!-- 行业洞察 -->
            <template v-if="key === 'REAL_TIME_INFORMATION'">
              <div
                class="text-item"
                v-for="(row, rowIndex) in value"
                :key="`rowIndex${rowIndex}`"
              >
                <p class="report-name">{{ row }}</p>
                <p class="report-introduction">
                  前言：山东省风光资源丰富，2022 年其风光发电合计占比达
                  33.6%，领跑全国，风光消纳问题使得配建储能成为新能源并网必选项。但源侧配储盈利渠道较窄，经济性难以实现。近日山东省发布《关于开展我省配建储能转为独立储能试点工作的通知》，旨在拓宽配建储能盈利渠道，鼓励其作为市场主体参与电力市场交易，更好地发挥电力系统调节作用。山东配建储能转独立储能后盈利模式有哪些？
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import searchIcon from "@/assets/img/common/search-icon.png";
import { globalSearch, getByKeyword } from "@/api/home";
const ns = useNamespace("searchDetail");
const breadcrumbList = [
  { text: "首页", path: "/home" },
  { text: "搜索详情", path: "" },
];
const searchContent: Ref<string> = ref("储能");
const currentTab = ref("REAL_TIME_INFORMATION") as any;
const pageOptions = ref<any>({
  All: { name: "搜索结果", data: {} },
  Energy_Storage_Frontier: { name: "储能前沿" },
  REAL_TIME_INFORMATION: { name: "行业洞察" },
  QUARTERLY_AND_MONTHLY_REPORTS: { name: "季报月报" },
  WHITE_PAPER: { name: "白皮书" },
  ONLINE_REPORT: { name: "在线报告" },
}) as any;
// 搜索事件
const onSearch = () => {
  if (searchContent.value === "") {
    return;
  }
  searchFn();
};
const searchFn = async () => {
  //搜全部
  const data = await globalSearch({ keyword: searchContent.value });
  if (data.resp_code === 0) {
    pageOptions.value.All.data = data.datas;
  }
  //搜储能前沿
  const _data = await getByKeyword({ keyword: searchContent.value });
  if (_data.resp_code === 0 && _data.datas.length > 0) {
    pageOptions.value.All.data.Energy_Storage_Frontier = _data.datas;
  }
};
searchFn();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-searchDetail {
  width: 100vw;

  .es-searchDetail-content {
    .search-box {
      width: 100%;
      padding: 64px 0 24px 0;

      .es-searchDetail-homeTopSearch {
        @include widthAndHeight(956px, 48px);
        @include margin(0, auto, 0, auto);
        @include relative();
      }

      .es-searchDetail-homeTopSearchIcon {
        @include widthAndHeight(96px, 100%);
        @include absolute(1, 0, 0, 0, none);
        background: #244bf1;
        @include flex(center, center);
        border-radius: 0px 100px 100px 0px;

        span {
          @include font(14px, 400, rgba(255, 255, 255, 0.9), 22px);
          margin-right: 4px;
        }

        img {
          @include widthAndHeight(20px, 20px);
        }
      }
    }

    .tab-box {
      @include widthAndHeight(100%, 56px);
      border-bottom: 1px solid #dbdce2;
      display: flex;
      margin-bottom: 24px;

      .tab_item {
        @include widthAndHeight(88px, 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .tab_name {
          @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
        }

        .active {
          @include font(14px, 600, #244bf1, 22px);
        }

        .tab_line {
          @include widthAndHeight(100%, 2px);
          background: #244bf1;
          border-radius: 2px 2px 0px 0px;
          @include absolute(1, none, 0, 0, 0);
        }
      }
    }

    .search-content {
      width: 100%;
      padding-bottom: 80px;

      .search-content_item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        margin-bottom: 24px;

        .search-content_item_title {
          width: 98px;
          @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.es-searchDetail {
  .es-searchDetail-content {
    .search-box {
      .es-searchDetail-homeTopSearch {
        .el-input {
          height: 48px;

          .el-input__wrapper {
            border-radius: 24px;
            border: 1px solid #dbdce2;

            .el-input__inner {
              text-indent: 13px;
            }
          }
        }
      }
    }
  }
}
</style>
