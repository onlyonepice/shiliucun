<template>
  <div :class="[ns.b()]">
    <Loading v-if="filterLoading" />
    <div class="header">
      <Search
        width="368px"
        @onSearch="onSearch"
        v-model="filterParams.keyword"
      />
    </div>
    <div class="content">
      <div class="filter-box">
        <div
          class="tree-item"
          v-for="(value, key) in filterOptionsData"
          :key="key"
        >
          <el-tree
            @check="(data, keys) => handleCheckChange(keys, value)"
            ref="treeRefFilter"
            :data="[value]"
            default-expand-all
            highlight-current
            :props="defaultProps"
            node-key="paramValue"
            show-checkbox
            :default-checked-keys="filterParams[value.paramValue].split(',')"
          >
            <template #default="{ node, data }">
              <div class="custom-tree_item">
                <div class="custom-tree-node">
                  <span :class="data.dropDownBoxResp ? 'name' : 'parent-name'">
                    {{ node.label }}
                  </span>
                  <span class="number" v-if="data.policyQuantity">
                    {{ data.policyQuantity }}
                  </span>
                </div>
                <div
                  @click.stop
                  v-if="showOpen(key)"
                  style="
                     {
                      left: 56px;
                    }
                  "
                  class="open-box"
                >
                  <p
                    @click.stop="handleShowAllClick(key, data)"
                    class="showAll-btn"
                    v-if="data.showAll !== undefined"
                  >
                    {{ !data.showAll ? "展开更多" : "收起更多" }}
                  </p>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="policy-list">
        <div
          class="policy_item"
          v-for="(item, index) in pageData"
          :key="item.policyReleased"
        >
          <el-collapse v-model="activeName">
            <el-collapse-item
              :title="`${item.policyReleased} （${item.total}条数据）`"
              :name="index"
            >
              <el-scrollbar
                class="policy_item_box"
                v-loading="item.loading"
                ref="scrollbar"
                @scroll="() => handleScroll(scrollbar[index], item)"
                :style="{ height: item.data.length > 10 ? '500px' : 'auto' }"
              >
                <template v-if="item.data.length">
                  <div
                    class="policy_item_box_content"
                    :key="row.policyName"
                    v-for="(row, rowIndex) in item.data"
                  >
                    <div
                      class="policy_item_value"
                      @click="handleItemClick(index, rowIndex)"
                    >
                      <p class="policy-name">{{ row.policyName }}</p>
                      <div class="tag-box">
                        <p class="tag" v-for="tag in row.typeName" :key="tag">
                          {{ tag }}
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="row.showDetail"
                      class="detail-data"
                      :class="row.className"
                    >
                      <div class="detail_content">
                        <div class="detail_content_item">
                          <p class="detail_content_item_label">基本信息</p>
                          <div class="detail_content_item_value">
                            <div class="detail_content_item_value_item">
                              <p class="detail_content_item_value_item_label">
                                发布时间
                              </p>
                              <p class="detail_content_item_value_item_value">
                                {{ row.detailData?.releaseTime }}
                              </p>
                            </div>
                            <div class="detail_content_item_value_item">
                              <p class="detail_content_item_value_item_label">
                                发布地区
                              </p>
                              <p class="detail_content_item_value_item_value">
                                {{ getRegion(row.detailData?.regionName) }}
                              </p>
                            </div>
                            <div
                              class="detail_content_item_value_item"
                              v-if="row.detailData?.allocationStorageRatio"
                            >
                              <p class="detail_content_item_value_item_label">
                                配储比例
                              </p>
                              <p class="detail_content_item_value_item_value">
                                {{ row.detailData?.allocationStorageRatio }}
                              </p>
                            </div>
                            <div class="detail_content_item_value_item">
                              <p class="detail_content_item_value_item_label">
                                原文链接
                              </p>
                              <p
                                @click="
                                  handleLinkClick(row.detailData?.originalLink)
                                "
                                style="color: #244bf1; cursor: pointer"
                                class="detail_content_item_value_item_value"
                              >
                                查看原文链接
                              </p>
                            </div>
                          </div>
                        </div>
                        <div class="detail_content_item">
                          <p class="detail_content_item_label">摘要</p>
                          <div class="detail_content_item_value">
                            <div class="detail_content_item_value_item">
                              <p class="detail_content_item_value_item_label">
                                摘要内容
                              </p>
                              <p class="detail_content_item_value_item_value">
                                {{ row.detailData?.summary }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p
                        @click="handleHiddenDetailClick(index, rowIndex)"
                        class="hidden-detail"
                      >
                        收起详情&nbsp;&nbsp;^
                      </p>
                    </div>
                  </div>
                </template>
                <template v-else><EmptyData /></template>
              </el-scrollbar>
            </el-collapse-item>
          </el-collapse>
        </div>
        <el-empty
          v-if="pageData.length === 0 && !filterLoading"
          description="暂无数据~"
        />
      </div>
      <el-scrollbar class="month-list">
        <p
          :class="
            policyReleased === item.paramValue
              ? 'active-month month_item'
              : 'month_item'
          "
          v-for="item in monthList?.dropDownBoxResp || []"
          :key="item.paramValue"
          @click="handleMonthClick(item)"
        >
          {{ item.paramValue }}
        </p>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface ListType {
  dropDownBoxResp: {
    page: number;
    limit: number;
    paramDesc: string;
    paramValue: string;
  }[];
}
import {
  policyFilterSearch,
  getPolicyDetailsApi,
  getPolicyByFiltrateNoPagination,
} from "@/api/data";
import { cloneDeep } from "lodash";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getToken } from "@/utils/auth";
import { getTimesApi } from "@/api/user";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import { windowScrollStore } from "@/store/modules/windowScroll";
import { ElMessage } from "element-plus";
const route = useRoute();
const windowScroll = windowScrollStore();
windowScroll.SET_SCROLL_TOP(0);
const ns = useNamespace("policyList");

const paging = ref({
  limit: 15,
  page: 1,
});

const pageData = ref([]);
const activeName = ref([0, 1]);
const treeRefFilter = ref(null);
const filterLoading = ref(true);
const scrollbar = ref<any>(null);
const filterOptions = ref([]); //所有筛选项
const policyReleased = ref(""); //政策发布时间
const monthList = ref<ListType>(); // 右侧时间筛选

const defaultProps = {
  children: "dropDownBoxResp",
  label: "paramDesc",
  value: "paramValue",
};

// 左侧选项选中的值
const filterParams = ref<any>({ keyword: "" });

function handleMonthClick(row) {
  policyReleased.value = row.paramValue;
  monthList.value.dropDownBoxResp = monthList.value.dropDownBoxResp.map(
    (item) => {
      return { ...item, ...paging.value };
    },
  );
  getData();
}

function getRegion(regionName) {
  return !regionName ? "" : regionName.join("-");
}

function handleHiddenDetailClick(index, rowIndex) {
  pageData.value[index].data[rowIndex].className = "hide";
  setTimeout(() => {
    pageData.value[index].data[rowIndex].showDetail = false;
  }, 450);
}

async function handleItemClick(index, rowIndex) {
  window.trackFunction("pc_Policy_SearchFile_click");
  if (!pageData.value[index].data[rowIndex].showDetail) {
    if (!getToken()) {
      useUserStore().openLogin(true);
      return;
    }
    const data = await getPolicyDetailsApi({
      id: pageData.value[index].data[rowIndex].id,
    });
    const _datas: any = await getTimesApi({
      moduleName: "POLICY_DETAILS",
    });
    if (_datas.datas !== null) {
      ElMessage({
        message: `<div style="display: flex;align-items: center;"><img width="17.5" height="17.5" style="margin-right: 9px;" src="https://eesa-mini-app.oss-rg-china-mainland.aliyuncs.com/i-report/v1.0/iReport3_icon_comment.png" /><span>剩余使用次数：${_datas.datas}次</span></div>`,
        type: "info",
        dangerouslyUseHTMLString: true,
        duration: 2000,
      });
    }
    if (data.resp_code === 0) {
      pageData.value[index].data[rowIndex].detailData = data.datas;
      pageData.value[index].data[rowIndex].showDetail = true;
      pageData.value[index].data[rowIndex].className = "show";
    } else if (data.resp_code === 10027) {
      //观看次数到达上限
      useUserStore().openVipTitle =
        "当日的查看次数已达到上限，请开通VIP继续查看。";
      useUserStore().openVip(true);
    }
  } else {
    pageData.value[index].data[rowIndex].className = "hide";
    setTimeout(() => {
      pageData.value[index].data[rowIndex].showDetail = false;
    }, 450);
  }
}

function handleLinkClick(link) {
  window.open(link);
}

async function policyFilterSearchFn() {
  let {
    datas: { screen },
    resp_code,
  } = await policyFilterSearch(filterParams.value.year);
  if (resp_code === 0) {
    screen = screen.filter((item: any) => item.dropDownBoxResp);
    filterOptions.value = [];
    screen.forEach((item) => {
      !filterParams.value[item.paramValue] &&
        (filterParams.value[item.paramValue] = "");
      item.showAll = item.dropDownBoxResp?.length > 0 ? false : true;
    });
    screen.forEach((item) => {
      if (item.paramValue === "policyReleased") {
        monthList.value = item;
        item.dropDownBoxResp = item.dropDownBoxResp.map((item) => {
          return {
            ...paging.value,
            paramDesc: item.paramDesc,
            paramValue: item.paramValue,
          };
        });
        policyReleased.value = item.dropDownBoxResp[0].paramValue;
      } else {
        filterOptions.value.push(item);
      }
    });
    getData();
  }
}

const showOpen = computed(() => {
  return (key) => {
    return filterOptions.value[key].dropDownBoxResp.length >= 6;
  };
});

// 获取政策列表
async function getData() {
  filterLoading.value = true;
  pageData.value = [];
  const index = monthList.value.dropDownBoxResp.findIndex(
    (item) => item.paramValue === policyReleased.value,
  );
  if (index !== -1) {
    const { page, limit, paramValue } = monthList.value.dropDownBoxResp[index];
    const parameter = {
      page,
      limit,
      ...filterParams.value,
      policyReleased: paramValue,
    };
    await getMonthlyPolicyData(parameter);
  }

  if (index + 1 < monthList.value.dropDownBoxResp.length) {
    const { page, limit, paramValue } =
      monthList.value.dropDownBoxResp[index + 1];
    const parameter = {
      page,
      limit,
      ...filterParams.value,
      policyReleased: paramValue,
    };
    await getMonthlyPolicyData(parameter);
  }
  filterLoading.value = false;
}

async function handleScroll(
  { wrapRef: { scrollHeight, scrollTop } },
  { policyReleased, total, size, current },
) {
  /**
   * 滚动到底部
   * scrollHeight： 滚动条高度
   * scrollTop： 滚动的距离
   * 500: 元素高度
   * 8: 当页面放大缩小是可能存在一定的误差
   **/
  if (scrollHeight - scrollTop - 500 === 0) {
    // 已经展示所有数据
    if (total <= size || total <= size * current) {
      return;
    } else {
      // 继续加载更多数据
      const index = monthList.value.dropDownBoxResp.findIndex(
        (item) => item.paramDesc === policyReleased,
      );
      monthList.value.dropDownBoxResp[index].page = current + 1;
      const { page, limit, paramValue } =
        monthList.value.dropDownBoxResp[index];
      const parameter = {
        page,
        limit,
        ...filterParams.value,
        policyReleased: paramValue,
      };
      const _index = pageData.value.findIndex(
        (item) => item.policyReleased === policyReleased,
      );
      pageData.value[_index].loading = true;
      const { datas, resp_code } =
        await getPolicyByFiltrateNoPagination(parameter);
      const routeId = ref(route.query.id ? route.query.id : null);
      if (resp_code === 0) {
        !datas.data && (datas.data = []);
        datas.data.forEach((item, index) => {
          if (item.id === routeId.value) {
            setTimeout(() => {
              handleItemClick(0, index);
            });
          } else {
            item.showDetail = false;
            item.className = "";
          }
        });
        pageData.value[_index] = {
          ...datas,
          loading: false,
          data: [...pageData.value[_index].data, ...datas.data],
        };
      }
    }
  }
}

async function getMonthlyPolicyData(parameter) {
  const { datas, resp_code } = await getPolicyByFiltrateNoPagination(parameter);
  const routeId = ref(route.query.id ? route.query.id : null);
  if (resp_code === 0) {
    !datas.data && (datas.data = []);
    datas.data.forEach((item, index) => {
      if (item.id === routeId.value) {
        setTimeout(() => {
          handleItemClick(0, index);
        });
      } else {
        item.showDetail = false;
        item.className = "";
      }
    });
    pageData.value.push({ ...datas, loading: false });
  }
}

function onSearch() {
  policyReleased.value = monthList.value.dropDownBoxResp[0].paramValue;
  getData();
}

async function handleCheckChange(select: any, row: any) {
  const key = row.paramValue;
  const { checkedKeys } = select;
  if (isNaN(Number(checkedKeys[0]))) {
    checkedKeys.splice(0, 1);
  }
  filterParams.value[key] = checkedKeys.join(",");
  const data = await policyFilterSearch(filterParams.value.year);
  if (data.resp_code === 0) {
    data.datas.screen.forEach((item) => {
      if (item.paramValue === "policyReleased") {
        monthList.value = item;
        item.dropDownBoxResp = item.dropDownBoxResp.map((item) => {
          return {
            ...paging.value,
            paramDesc: item.paramDesc,
            paramValue: item.paramValue,
          };
        });
        policyReleased.value = item.dropDownBoxResp[0].paramValue;
      }
    });
    getData();
  }
}

// 过滤后的筛选项
const filterOptionsData = computed(() => {
  const _data = cloneDeep(filterOptions.value);
  const newVal = _data.map((item) => {
    if (item.dropDownBoxResp.length > 5 && !item.showAll) {
      item.dropDownBoxResp = item.dropDownBoxResp.slice(0, 5);
    }
    return item;
  });
  return newVal;
});
const handleShowAllClick = (key, _data) => {
  filterOptions.value[key].showAll = !filterOptions.value[key].showAll;
};

policyFilterSearchFn();
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-policy {
  margin-top: 9px;
  padding-bottom: 55px;

  .header {
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 24px;
  }

  .content {
    display: flex;
    width: 100%;
    position: relative;

    .filter-box {
      width: 270px;

      .tree-item {
        width: 100%;
        margin-bottom: 24px;

        .showAll-btn {
          @include font(14px, 400, #244bf1, 24px);
          margin-left: 20px;
          cursor: pointer;
        }
      }

      .custom-tree-node {
        width: 226px;
        display: flex;
        align-items: center;
        font-weight: 400;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.9);
        line-height: 22px;
        position: relative;

        .number {
          position: absolute;
          right: 0;
        }

        .radio {
          margin-right: 8px;
          width: 16px;
          height: 16px;
        }

        .name {
          @include font(16px, 400, rgba(0, 0, 0, 0.6), 24px);
        }

        .parent-name {
          @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
        }
      }
    }

    .policy-list {
      width: 858px;
      min-height: 400px;
      margin-left: 12px;
      margin-right: 12px;

      .policy_item {
        width: 100%;

        .policy_item_box {
          width: 100%;
          box-sizing: border-box;
          padding-right: 20px;

          .policy_item_box_content {
            width: 100%;
            padding-bottom: 16px;
            border-bottom: 1px solid #dbdce2;
            margin-bottom: 16px;

            .detail-data {
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

                > .detail_content_item:nth-child(1) {
                  margin-bottom: 16px;
                }

                .detail_content_item {
                  width: 100%;
                  display: flex;

                  .detail_content_item_label {
                    margin-right: 16px;
                    width: 80px;
                    @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
                  }

                  .detail_content_item_value {
                    flex: 1;
                    border: 1px solid #dbdce2;
                    border-bottom: 0;

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
                      }
                    }
                  }
                }
              }
            }

            .policy_item_value {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: pointer;

              &:hover {
                .policy-name {
                  color: rgb(36, 75, 241);
                }
              }

              .policy-name {
                @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
                @include textOverflow();
                @include margin(0, 24px, 0, 0);
              }

              .tag-box {
                display: flex;
                align-items: center;

                .tag {
                  font-weight: 400;
                  font-size: 12px;
                  color: #ff892e;
                  line-height: 20px;
                  padding: 2px 8px;
                  background: #fff3eb;
                  border-radius: 4px;
                  border: 1px solid #ff892e;
                  margin-left: 8px;
                  white-space: nowrap;
                  &:first-child {
                    margin-left: 0;
                  }
                }
              }
            }
          }
        }
      }
    }

    .month-list {
      position: absolute;
      right: -80px;
      height: 240px;
      padding-right: 20px;

      .month_item {
        padding-left: 16px;
        @include font(12px, 400, rgba(0, 0, 0, 0.6), 24px);
        border-left: 1px solid #e8eaef;
        cursor: pointer;
      }

      .active-month {
        border-left: 1px solid #244bf1;
        color: #244bf1;
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
</style>
<style lang="scss">
@import "@/style/mixin.scss";

.es-policyList {
  .el-tree-node__content {
    width: 100%;
    box-sizing: border-box;

    .custom-tree_item {
      width: auto;
      flex: 1;

      .custom-tree-node {
        width: 100% !important;
      }

      .open-box {
        position: absolute;
        bottom: -24px;
        left: 40px;
        z-index: 10;

        .showAll-btn {
          @include font(14px, 400, #244bf1, 24px);
          cursor: pointer;
        }
      }
    }
  }

  .el-collapse {
    border: 0 !important;

    .el-collapse-item__wrap {
      border: 0 !important;
    }

    button {
      border: 0 !important;
      @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
    }
  }
}
</style>
