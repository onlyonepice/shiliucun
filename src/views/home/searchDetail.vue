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
          <img
            @click="handleClearTap"
            v-show="searchContent"
            :src="icon_clear"
            class="icon_clear"
            alt=""
          />
          <div :class="ns.b('homeTopSearchIcon')" @click.stop="onSearch">
            <span>搜索</span>
            <img :src="searchIcon" alt="" />
          </div>
        </div>
      </div>
      <div class="tab-box">
        <template v-for="(value, key) in pageOptions" :key="key">
          <div v-if="value.show" class="tab_item" @click="handleTabChange(key)">
            <span
              :class="`'tab_name' ${key === currentTab ? 'active' : ''} `"
              >{{ value.name }}</span
            >
            <span v-if="key === currentTab" class="tab_line" />
          </div>
        </template>
      </div>
      <div
        class="search-content"
        v-if="Object.keys(pageOptions.All.data).length > 0"
      >
        <template v-for="key in Object.keys(pageOptions.All.data)" :key="key">
          <div
            class="search-content_item"
            v-if="
              pageOptions.All.data[key].length > 0 &&
              key !== 'WHITE_PAPER' &&
              (currentTab === 'All' || currentTab === key)
            "
          >
            <p class="search-content_item_title">{{ pageOptions[key].name }}</p>
            <div class="search-content_item_value">
              <!-- 储能前沿 -->
              <template
                v-if="
                  key === 'Energy_Storage_Frontier' &&
                  (currentTab === 'All' ||
                    currentTab === 'Energy_Storage_Frontier')
                "
              >
                <div class="Energy_Storage_Frontier-box">
                  <div
                    class="Energy_Storage_Frontier-box_item"
                    :style="{ marginRight: rowIndex === 3 ? '0' : '1.25vw' }"
                    v-for="(row, rowIndex) in pageOptions.All.data[key]"
                    :key="rowIndex"
                  >
                    <img
                      class="Energy_Storage_Frontier-box_item_left"
                      :src="row.img"
                      alt=""
                    />
                    <div class="Energy_Storage_Frontier-box_item_right">
                      <p class="Energy_Storage_Frontier-box_item_name">
                        {{ row.moduleDesc }}
                      </p>
                      <p class="Energy_Storage_Frontier-box_item_code">
                        {{ row.code }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              <!-- 行业洞察 -->
              <template v-if="key === 'REAL_TIME_INFORMATION'">
                <div
                  class="text-item"
                  v-for="(row, rowKey) in pageOptions.All.data[key]"
                  :key="rowKey"
                >
                  <p class="report-name" v-html="row.reportName" />
                  <p
                    class="report-introduction"
                    v-html="row.contentOverview ?? '--'"
                  />
                </div>
              </template>
              <!-- 季报月报 -->
              <template v-if="key === 'QUARTERLY_AND_MONTHLY_REPORTS'">
                <div
                  class="text-item"
                  v-for="(row, rowKey) in pageOptions.All.data[key]"
                  :key="rowKey"
                >
                  <p class="report-name" v-html="row.reportName" />
                  <p
                    class="report-introduction"
                    v-html="row.contentOverview ?? '--'"
                  />
                </div>
              </template>
              <!-- 在线报告 -->
              <template v-if="key === 'ONLINE_REPORT'">
                <div class="online-report-box">
                  <onLineReportList
                    style="width: 191px; margin-bottom: 24px"
                    class="online-report_item"
                    v-for="(row, index) in pageOptions.All.data[key]"
                    :pageData="row"
                    :key="index"
                  />
                </div>
              </template>
            </div>
          </div>
          <div
            v-if="
              pageOptions.All.data[key].length > 0 &&
              key === 'WHITE_PAPER' &&
              currentTab === 'WHITE_PAPER'
            "
          >
            <WhiteReport :page-data="pageOptions.All.data[key]" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import useNamespace from "@/utils/nameSpace";
import icon_clear from "@/assets/img/common/icon_clear.png";
import searchIcon from "@/assets/img/common/search-icon.png";
import { globalSearch, getByKeyword } from "@/api/home";
import return_on_investment from "@/assets/img/common/return_on_investment.png";
import price_tracking from "@/assets/img/common/price_tracking.png";
import winning_bid_tracking from "@/assets/img/common/winning_bid_tracking.png";
import policy_tracking from "@/assets/img/common/policy_tracking.png";
import financing_plan from "@/assets/img/common/financing_plan.png";
import { useRouter } from "vue-router";
const router = useRouter();
const ns = useNamespace("searchDetail");
const breadcrumbList = [
  { text: "首页", path: "/home" },
  { text: "搜索详情", path: "" },
];
const searchContent = ref<any>("");
const currentTab = ref("All") as any;
const pageOptions = ref<any>({
  All: { name: "搜索结果", data: {}, show: true },
  Energy_Storage_Frontier: { name: "储能前沿", show: false },
  REAL_TIME_INFORMATION: { name: "行业洞察", show: false },
  QUARTERLY_AND_MONTHLY_REPORTS: { name: "季报月报", show: false },
  WHITE_PAPER: { name: "白皮书", show: false },
  ONLINE_REPORT: { name: "在线报告", show: false },
}) as any;
// 搜索事件
const onSearch = () => {
  if (searchContent.value === "") {
    return;
  }
  currentTab.value = "All";
  searchFn();
};
const searchFn = async () => {
  //搜储能前沿
  const _data = await getByKeyword({ keyword: searchContent.value });
  if (_data.resp_code === 0 && _data.datas.length > 0) {
    pageOptions.value.All.data.Energy_Storage_Frontier = _data.datas.map(
      (item) => {
        if (item.moduleDesc === "工商业投资回报性分析") {
          item.moduleDesc = "工商业投资回报性";
        }
        switch (item.moduleDesc) {
          case "工商业投资回报性":
            item.img = return_on_investment;
            item.code = "Return on investment";
            break;
          case "代理购电价格追踪":
            item.img = price_tracking;
            item.code = "Price tracking";
            break;
          case "中标项目追踪":
            item.img = winning_bid_tracking;
            item.code = "Winning bid tracking";
            break;
          case "政策追踪":
            item.img = policy_tracking;
            item.code = "Policy tracking";
            break;
          case "融资方案":
            item.img = financing_plan;
            item.code = "Financing plan";
            break;
          default:
            break;
        }
        return item;
      },
    );
  }
  //搜全部
  const data = await globalSearch({ keyword: searchContent.value });
  if (data.resp_code === 0) {
    for (const key in data.datas) {
      if (data.datas[key].length > 0 || key === "All") {
        pageOptions.value[key].show = true;
      } else {
        pageOptions.value[key].show = false;
      }
      if (searchContent.value !== "") {
        data.datas[key].forEach((item) => {
          Object.keys(item).forEach((children) => {
            if (children !== "reportCover") {
              if (typeof item[children] === "string") {
                item[children] = item[children].replace(
                  searchContent.value,
                  `<span style='color: #FF8D32;' class='search-match'>${searchContent.value}</span>`,
                );
              } else if (Array.isArray(item[children])) {
                item[children] = item[children].map((arrItem) => {
                  return arrItem.replace(
                    searchContent.value,
                    `<span style='color: #FF8D32;' class='search-match'>${searchContent.value}</span>`,
                  );
                });
              }
            }
          });
        });
      }
    }
    pageOptions.value.All.data = Object.assign(
      pageOptions.value.All.data,
      data.datas,
    );
  }
};
const handleTabChange = (key: string | number) => {
  currentTab.value = key;
};
const handleClearTap = () => {
  searchContent.value = "";
  searchFn();
};
onMounted(() => {
  searchContent.value = router.currentRoute.value.params.searchContent;
  searchFn();
});
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

        .icon_clear {
          @include widthAndHeight(20px, 20px);
          @include absolute(1, 14px, 112px, none, none);
          cursor: pointer;

          &:hover {
            @include widthAndHeight(22px, 22px);
          }
        }
      }

      .es-searchDetail-homeTopSearchIcon {
        @include widthAndHeight(96px, 100%);
        @include absolute(1, 0, 0, 0, none);
        @include flex(center, center);
        border-radius: 0px 100px 100px 0px;
        cursor: pointer;
        background-color: #244bf1;

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
        cursor: pointer;

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

        .search-content_item_value {
          width: 100%;

          .text-item {
            width: 100%;
            margin-bottom: 16px;

            .report-name {
              width: 100%;
              @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
              margin-bottom: 8px;
            }

            .report-introduction {
              width: 100%;
              @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
            }
          }
        }

        .online-report-box {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
      }

      .Energy_Storage_Frontier-box {
        width: 100%;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .Energy_Storage_Frontier-box_item {
          width: 246px;
          height: 104px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px solid #dbdce2;
          padding: 24px 16px;
          display: flex;
          cursor: pointer;
          margin-bottom: 24px;
          &:hover {
            box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
          }

          .Energy_Storage_Frontier-box_item_left {
            width: 56px;
            height: 56px;
            margin-right: 8px;
          }

          .Energy_Storage_Frontier-box_item_right {
            flex: 1;

            .Energy_Storage_Frontier-box_item_name {
              font-weight: 400;
              font-size: 16px;
              color: #244bf1;
              line-height: 24px;
            }

            .Energy_Storage_Frontier-box_item_code {
              font-weight: 400;
              font-size: 12px;
              color: rgba(0, 0, 0, 0.26);
              line-height: 20px;
              text-align: left;
            }
          }
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
            background-color: white;

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
