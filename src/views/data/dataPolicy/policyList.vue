<template>
  <div :class="[ns.b()]">
    <div class="header">
      <p class="title">政策查找</p>
      <Search
        width="368px"
        @onSearch="onSearch"
        v-model="filterParams.keyword"
      />
    </div>
    <div class="content">
      <div class="filter-box" v-if="filterOptionsData.length > 0">
        <div
          class="tree-item"
          v-for="(value, key) in filterOptionsData"
          :key="key"
        >
          <el-tree
            @node-click="(val) => changeTag(val, value)"
            ref="treeRefFilter"
            :data="[value]"
            default-expand-all
            highlight-current
            :props="defaultProps"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <img
                  class="radio"
                  v-if="data.policyQuantity"
                  :src="imageUrl(node, data)"
                  alt=""
                />
                <span :class="!data.policyQuantity ? 'name' : 'parent-name'">
                  {{ node.label }}</span
                >
                <span class="number" v-if="data.policyQuantity">
                  {{ data.policyQuantity }}
                </span>
              </span>
            </template>
          </el-tree>
          <p
            @click="handleShowAllClick(key)"
            class="showAll-btn"
            v-if="
              filterOptions[key].dropDownBoxResp.length > 5 &&
              !filterOptions[key].showAll
            "
          >
            展开更多
          </p>
          <p
            @click="handleShowAllClick(key)"
            class="showAll-btn"
            v-if="
              filterOptions[key].dropDownBoxResp.length > 5 &&
              filterOptions[key].showAll
            "
          >
            收起更多
          </p>
        </div>
      </div>
      <div class="policy-list" v-loading="filterLoading">
        <div
          class="policy_item"
          v-for="(item, index) in pageData"
          :key="item.policyReleased"
        >
          <el-collapse v-model="activeName">
            <el-collapse-item :title="item.policyReleased" :name="index">
              <el-scrollbar
                :style="{
                  height: item.data.length > 10 ? '500px' : 'auto',
                }"
                class="policy_item_box"
              >
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
                      <p class="tag">{{ row.typeName }}</p>
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
          v-for="item in monthList.dropDownBoxResp"
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
import {
  policyFilterSearch,
  getPolicyByFiltrateNoPagination,
  getPolicyDetailsApi,
} from "@/api/data";
import { cloneDeep } from "lodash";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { getToken } from "@/utils/auth";
import useNamespace from "@/utils/nameSpace";
import { useUserStore } from "@/store/modules/user";
import { windowScrollStore } from "@/store/modules/windowScroll";
import radio_true from "@/assets/img/common/i-Report-radio-true.png";
import radio_false from "@/assets/img/common/i-Report-radio-false.png";
const route = useRoute();
const windowScroll = windowScrollStore();
windowScroll.SET_SCROLL_TOP(0);

const ns = useNamespace("policyList");
const policyReleased = ref(""); //政策发布时间
const treeRefFilter = ref(null);
const defaultProps = {
  children: "dropDownBoxResp",
  label: "paramDesc",
  value: "paramValue",
};
const activeName = ref([0, 1]);
const filterLoading = ref(true);
const filterParams = ref({
  keyword: "",
});
interface ListType {
  dropDownBoxResp?: { paramValue: string }[];
}
const filterOptions = ref([]); //所有筛选项
const monthList = ref<ListType>({});
const handleMonthClick = (row) => {
  policyReleased.value = row.paramValue;
  getData();
};
const getRegion = (regionName) => {
  return !regionName ? "" : regionName.join("-");
};
const handleHiddenDetailClick = (index, rowIndex) => {
  pageData.value[index].data[rowIndex].className = "hide";
  setTimeout(() => {
    pageData.value[index].data[rowIndex].showDetail = false;
  }, 450);
};
const handleItemClick = async (index, rowIndex) => {
  if (!pageData.value[index].data[rowIndex].showDetail) {
    if (!getToken()) {
      useUserStore().openLogin(true);
      return;
    }
    const data = await getPolicyDetailsApi({
      id: pageData.value[index].data[rowIndex].id,
    });
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
};
const handleLinkClick = (link) => {
  window.open(link);
};

const policyFilterSearchFn = async () => {
  const data = await policyFilterSearch();
  if (data.resp_code === 0) {
    filterOptions.value = [];
    data.datas.screen.forEach((item) => {
      filterParams.value[item.paramValue] = [];
      item.showAll = item.dropDownBoxResp.length > 0 ? false : true;
    });
    data.datas.screen.forEach((item) => {
      if (item.paramValue === "policyReleased") {
        monthList.value = item;
        policyReleased.value = item.dropDownBoxResp[0].paramValue;
      } else {
        filterOptions.value.push(item);
      }
    });
  }
};
const pageData = ref([]);
const getData = async () => {
  filterLoading.value = true;

  const requestData = Object.assign(
    {
      policyReleased: {
        municipalLevel: "",
        policyType: "",
        provincialLevel: "",
        year: "",
        keyword: "",
      },
      page: 1,
      limit: 0,
    },
    filterParams.value,
  );
  const data = await getPolicyByFiltrateNoPagination(requestData);
  const routeId = ref(route.query.id ? route.query.id : null);

  if (data.resp_code === 0) {
    data.datas.forEach((item, index) => {
      item.data.forEach((row, rowIndex) => {
        if (row.id === routeId.value) {
          setTimeout(() => {
            handleItemClick(index, rowIndex);
          });
        } else {
          row.showDetail = false;
          row.className = "";
        }
      });
    });
    pageData.value = data.datas;
  }
  filterLoading.value = false;
};
const onSearch = () => {
  policyReleased.value = "";
  getData();
};
const changeTag = (e, row) => {
  const index = filterParams.value[row.paramValue].findIndex(
    (item) => item === e.paramValue,
  );
  if (index == -1) {
    filterParams.value[row.paramValue].push(e.paramValue);
  } else {
    filterParams.value[row.paramValue].splice(index, 1);
  }
  console.log(filterParams.value);
  // getData();
};

const handleShowAllClick = (index) => {
  filterOptions.value[index].showAll = !filterOptions.value[index].showAll;
};

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

// 根据选中状态返回对应的图片
const imageUrl = computed(() => {
  return (
    {
      parent: {
        data: { paramValue },
      },
    },
    item,
  ) => {
    const isSelect = filterParams.value[paramValue].some(
      (_item) => _item === item.paramValue,
    );
    return isSelect ? radio_true : radio_false;
  };
});
// getData();
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
    justify-content: space-between;
    align-items: center;
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
          @include font(16px, 600, rgba(0, 0, 0, 0.9), 24px);
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
        }

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
            @include widthAndHeight(682px, 24px);
            @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
            @include textOverflow();
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
.es-policyList {
  .el-tree-node__content {
    padding-left: 0 !important;
  }

  .el-collapse {
    border: 0 !important;

    .el-collapse-item__wrap {
      border: 0 !important;
    }

    button {
      border: 0 !important;
      font-weight: 600;
      font-size: 20px;
      color: rgba(0, 0, 0, 0.9);
      line-height: 28px;
    }
  }
}
</style>
