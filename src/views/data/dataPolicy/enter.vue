<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div class="header">
      <p class="title">政策查找。</p>
      <Search width="368px" @onSearch="onSearch" v-model="keyword" />
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
                  :src="
                    data.paramValue === filterParams[value.paramValue]
                      ? radio_true
                      : radio_false
                  "
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
                    @click="handleItemClick(row, index, rowIndex)"
                  >
                    <p class="policy-name">{{ row.policyName }}</p>
                    <div class="tag-box">
                      <p class="tag">{{ row.typeName }}</p>
                    </div>
                  </div>
                  <div class="detail-data" v-if="row.showDetail">
                    <div class="detail_content">
                      <div class="detail_content_item">
                        <p class="detail_content_item_label">基本信息</p>
                        <div class="detail_content_item_value">
                          <div class="detail_content_item_value_item">
                            <p class="detail_content_item_value_item_label">
                              发布时间
                            </p>
                            <p class="detail_content_item_value_item_value">
                              {{ row.releaseTime }}
                            </p>
                          </div>
                          <div class="detail_content_item_value_item">
                            <p class="detail_content_item_value_item_label">
                              发布地区
                            </p>
                            <p class="detail_content_item_value_item_value">
                              {{ getRegion(row.regionName) }}
                            </p>
                          </div>
                          <div
                            class="detail_content_item_value_item"
                            v-if="row.allocationStorageRatio"
                          >
                            <p class="detail_content_item_value_item_label">
                              配储比例
                            </p>
                            <p class="detail_content_item_value_item_value">
                              {{ row.allocationStorageRatio }}
                            </p>
                          </div>
                          <div class="detail_content_item_value_item">
                            <p class="detail_content_item_value_item_label">
                              原文链接
                            </p>
                            <p
                              @click="handleLinkClick(row.originalLink)"
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
                              {{ row.summary }}
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

<script setup lang="ts">
import { ref, computed } from "vue";
import useNamespace from "@/utils/nameSpace";
import {
  policyFilterSearch,
  getPolicyByFiltrateNoPagination,
} from "@/api/data";
import radio_true from "@/assets/img/common/i-Report-radio-true.png";
import radio_false from "@/assets/img/common/i-Report-radio-false.png";
import { cloneDeep } from "lodash";
const ns = useNamespace("policy");
const keyword = ref("");
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
  municipalLevel: "",
  policyType: "",
  provincialLevel: "",
  year: "",
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
  return regionName.join("-");
};
const handleHiddenDetailClick = (index, rowIndex) => {
  pageData.value[index].data[rowIndex].showDetail = false;
};
const handleItemClick = async (item, index, rowIndex) => {
  pageData.value[index].data[rowIndex].showDetail =
    !pageData.value[index].data[rowIndex].showDetail;
};
const handleLinkClick = (link) => {
  window.open(link);
};
const policyFilterSearchFn = async () => {
  const data = await policyFilterSearch(filterParams.value);
  if (data.resp_code === 0) {
    filterOptions.value = [];

    data.datas.screen.forEach((item) => {
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
      keyword: keyword.value,
      policyReleased: policyReleased.value,
      page: 1,
      limit: 0,
    },
    filterParams.value,
  );
  const data = await getPolicyByFiltrateNoPagination(requestData);
  if (data.resp_code === 0) {
    pageData.value = data.datas;
  }
  filterLoading.value = false;
};
const onSearch = () => {
  getData();
};
const changeTag = (e, row) => {
  if (!e.policyQuantity) return;
  filterParams.value[row.paramValue] =
    e.paramValue === filterParams.value[row.paramValue] ? "" : e.paramValue;
  policyFilterSearchFn();
  policyReleased.value = "";
  getData();
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
const handleShowAllClick = (index) => {
  filterOptions.value[index].showAll = !filterOptions.value[index].showAll;
};
getData();
policyFilterSearchFn();
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-policy {
  padding: 80px 0;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 36px;
    .title {
      @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
    }
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
            width: 682px;
            height: 28px;
            font-weight: 400;
            font-size: 20px;
            color: rgba(0, 0, 0, 0.9);
            line-height: 28px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
</style>
<style lang="scss">
.es-policy {
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
