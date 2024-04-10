<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div class="header">
      <p class="title">政策查找</p>
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
                  height:
                    item.data.length > 10
                      ? '500px'
                      : item.data.length * 61 + 'px',
                }"
                class="policy_item_box"
              >
                <div
                  class="policy_item_value"
                  v-for="row in item.data"
                  :key="row.policyName"
                >
                  <p class="policy-name">{{ row.policyName }}</p>
                  <div class="tag-box">
                    <p class="tag">{{ row.typeName }}</p>
                  </div>
                </div>
              </el-scrollbar>
            </el-collapse-item>
          </el-collapse>
        </div>
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
        margin-bottom: 40px;
        .policy_item_box {
          width: 100%;
          box-sizing: border-box;
          padding-right: 20px;
        }
        .policy_item_value {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #dbdce2;
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
