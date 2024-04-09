<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div class="header">
      <p class="title">政策查找</p>
      <Search width="368px" @on-search="onSearch" v-model="keyword" />
    </div>
    <div class="content" v-loading="filterLoading">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import useNamespace from "@/utils/nameSpace";
import { policyFilterSearch } from "@/api/data";
import radio_true from "@/assets/img/common/i-Report-radio-true.png";
import radio_false from "@/assets/img/common/i-Report-radio-false.png";
import { cloneDeep } from "lodash";
const ns = useNamespace("policy");
const keyword = ref("");
const treeRefFilter = ref(null);
const defaultProps = {
  children: "dropDownBoxResp",
  label: "paramDesc",
  value: "paramValue",
};
const filterLoading = ref(false);
const filterParams = ref({
  municipalLevel: "",
  policyType: "",
  provincialLevel: "",
  year: "",
});
const filterOptions = ref([]); //所有筛选项
const policyFilterSearchFn = async () => {
  const data = await policyFilterSearch(filterParams.value);
  if (data.resp_code === 0) {
    data.datas.screen.forEach((item) => {
      item.showAll = item.dropDownBoxResp.length > 0 ? false : true;
    });
    filterOptions.value = data.datas.screen;
    console.log(data);
  }
  filterLoading.value = false;
};
const onSearch = (e) => {
  console.log(e);
};
const changeTag = (e, row) => {
  if (!e.policyQuantity) return;
  filterLoading.value = true;
  filterParams.value[row.paramValue] =
    e.paramValue === filterParams.value[row.paramValue] ? "" : e.paramValue;
  policyFilterSearchFn();
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
  }
}
</style>
<style lang="scss">
.es-policy {
  .el-tree-node__content {
    padding-left: 0 !important;
  }
}
</style>
