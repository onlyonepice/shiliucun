<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('left')">
      <div class="filter-box" v-if="filterOptionsData.length > 0">
        <div
          class="tree-item"
          v-for="(value, key) in filterOptionsData"
          :key="key"
        >
          <template v-if="value[0].paramValue !== 'yearRange'">
            <el-tree
              @check="() => changeTag(value[0], key)"
              ref="treeRefFilter"
              :data="value"
              default-expand-all
              highlight-current
              :props="defaultProps"
              node-key="paramValue"
              show-checkbox
            >
              <template #default="{ node, data }">
                <span class="custom-tree_item">
                  <div class="custom-tree-node">
                    <span
                      :class="!data.policyQuantity ? 'name' : 'parent-name'"
                    >
                      {{ node.label }}</span
                    >
                    <span class="number" v-if="data.policyQuantity">
                      {{ data.policyQuantity }}
                    </span>
                  </div>
                  <div
                    v-if="showOpen(data)"
                    :style="{
                      left:
                        filterOptionsData[key].paramValue === 'itemCategory'
                          ? '40px'
                          : '56px',
                    }"
                    class="open-box"
                  >
                    <p
                      @click="handleShowAllClick(key, data)"
                      class="showAll-btn"
                      v-if="!data.showAll"
                    >
                      展开更多
                    </p>
                    <p
                      @click="handleShowAllClick(key, data)"
                      class="showAll-btn"
                      v-if="data.showAll"
                    >
                      收起更多
                    </p>
                  </div>
                </span>
              </template>
            </el-tree>
          </template>
          <template v-else>
            <el-tree
              @node-click="(val) => changeYearRangeTag(val, value[0])"
              :data="value"
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
                      data.paramValue === filterParams[value[0].paramValue]
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
              @click="handleShowAllClick(key, null)"
              class="showAll-btn"
              v-if="
                filterOptions[key].dropDownBoxResp.length > 5 &&
                !filterOptions[key].parentShowAll
              "
            >
              展开更多
            </p>
            <p
              @click="handleShowAllClick(key, null)"
              class="showAll-btn"
              v-if="
                filterOptions[key].dropDownBoxResp.length > 5 &&
                filterOptions[key].parentShowAll
              "
            >
              收起更多
            </p>
          </template>
        </div>
      </div>
    </div>
    <div :class="ns.b('right')">
      <Search
        width="858px"
        v-model="filterParams.keyword"
        @onSearch="onSearch"
      />
      <div class="content" v-loading="loading">
        <div class="item" v-for="item in pageData" :key="item.id + '7'">
          <BiddingDynamicsList :pageData="item" />
        </div>
        <el-empty
          v-if="pageData.length === 0 && !loading"
          description="数据快马加鞭补全中~"
        />
        <Pagination
          :pageSize="limit"
          :total="total"
          @onchangeCurrent="onchangeCurrent"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import radio_true from "@/assets/img/common/i-Report-radio-true.png";
import radio_false from "@/assets/img/common/i-Report-radio-false.png";
import { ref, onMounted, computed } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("dataSearch");
import { getBidFinderApi, getTenderLookupApi } from "@/api/data";
import { useRoute } from "vue-router";
import { cloneDeep } from "lodash";
import { windowScrollStore } from "@/store/modules/windowScroll";
const route = useRoute();
const loading = ref(false);
const filterParams = ref({
  keyword: "",
  biddingContentTwo: [],
  itemCategory: [],
  provincialLevel: [],
  yearRange: "",
});
const multistage = ref(["biddingContentTwo", "provincialLevel"]);
const defaultProps = ref({
  children: "dropDownBoxResp",
  label: "paramDesc",
  value: "paramValue",
});
const page = ref(1);
const limit = ref(20);
const total = ref(0);
const onSearch = () => {
  page.value = 1;
  getData();
};
const showOpen = (data) => {
  return "showAll" in data;
};
const pageData = ref([]);
const getData = async () => {
  loading.value = true;
  const requestData = Object.assign(
    {
      limit: limit.value,
      page: page.value,
    },
    filterParams.value,
  );
  interface responseType {
    datas: {
      records?: {
        showDetail: boolean;
        className: undefined | string;
        id: any;
        isPermissions: boolean;
      }[];
      total: number;
    };
    resp_code: number;
  }
  const data: responseType = await getBidFinderApi(requestData);
  loading.value = false;
  if (data.resp_code === 0) {
    total.value = data.datas.total;
    pageData.value = data.datas.records.map((item, index) => {
      if (route.query.id === item.id) {
        setTimeout(() => {
          windowScrollStore().SET_SCROLL_TOP((index + 1) * 80 + 160);
        });
      }
      item.showDetail = route.query.id === item.id;
      item.className = "";
      return item;
    });
    console.log(pageData.value.map((item) => item.status));
  }
};
const filterOptions = ref([]);
const filterOptionsData = computed(() => {
  const arr = cloneDeep(filterOptions.value);
  let newArr = arr.map((item) => {
    if (!multistage.value.includes(item.paramValue)) {
      if ("parentShowAll" in item) {
        item.dropDownBoxResp = item.dropDownBoxResp.filter(
          (children, childrenIndex) => {
            return childrenIndex < 5 || item.parentShowAll;
          },
        );
        item.dropDownBoxResp[item.dropDownBoxResp.length - 1].showAll =
          item.parentShowAll;
      }
    } else {
      if (!item.dropDownBoxResp || item.dropDownBoxResp.length === 0) return;
      item.dropDownBoxResp.forEach((children) => {
        if ("parentShowAll" in children) {
          children.dropDownBoxResp = children.dropDownBoxResp.filter(
            (row, rowIndex) => {
              return rowIndex < 5 || children.parentShowAll;
            },
          );
          children.dropDownBoxResp[
            children.dropDownBoxResp.length - 1
          ].showAll = children.parentShowAll;
        }
      });
    }
    return item;
  });

  for (let i in newArr) {
    newArr[i] = [newArr[i]];
  }
  return newArr;
});

const getTenderLookupFn = async () => {
  const data = await getTenderLookupApi();
  if (data.resp_code === 0) {
    filterOptions.value = data.datas.screen.map((item) => {
      if (multistage.value.includes(item.paramValue)) {
        item.dropDownBoxResp.forEach((children) => {
          if (children.dropDownBoxResp && children.dropDownBoxResp.length > 5) {
            children.parentShowAll = false;
          }
        });
      } else {
        if (item.dropDownBoxResp && item.dropDownBoxResp.length > 5) {
          item.parentShowAll = false;
        }
      }
      return item;
    });
  }
};

const treeRefFilter = ref(null);
const changeTag = (value, index) => {
  const checked = treeRefFilter.value[index].getCheckedNodes();
  filterParams.value[value.paramValue] = [];
  checked.forEach((item) => {
    if (!item.dropDownBoxResp || item.dropDownBoxResp.length === 0) {
      filterParams.value[value.paramValue].push(item.paramValue);
    }
  });
  page.value = 1;
  getData();
};
const handleShowAllClick = (key, _data) => {
  if (key === "yearRange") {
    filterOptions.value[key].parentShowAll =
      !filterOptions.value[key].parentShowAll;
  } else {
    if (multistage.value.includes(filterOptions.value[key].paramValue)) {
      filterOptions.value[key].dropDownBoxResp.forEach((item) => {
        if (item.dropDownBoxResp) {
          item.dropDownBoxResp.forEach((children) => {
            if (_data.paramValue === children.paramValue) {
              item.parentShowAll = !item.parentShowAll;
            }
          });
        }
      });
    } else {
      filterOptions.value[key].parentShowAll =
        !filterOptions.value[key].parentShowAll;
    }
  }
};

const onchangeCurrent = (e) => {
  page.value = e;
  getData();
  windowScrollStore().SET_SCROLL_TOP(0);
};
const changeYearRangeTag = (e, row) => {
  if (!e.policyQuantity) return;
  filterParams.value[row.paramValue] =
    e.paramValue === filterParams.value[row.paramValue] ? "" : e.paramValue;
  getData();
};
onMounted(() => {
  getData();
  getTenderLookupFn();
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-dataSearch {
  padding: 24px 0 80px;
  display: flex;
}
.es-dataSearch-left {
  @include widthAndHeight(270px);
  margin-right: 24px;
  .filter-box {
    width: 270px;
    .tree-item {
      width: 100%;
      .showAll-btn {
        @include font(14px, 400, #244bf1, 24px);
        cursor: pointer;
      }
    }
    .custom-tree_item {
      width: 100%;
    }
    .open-box {
      position: absolute;
      bottom: 0;
      left: 40px;
      z-index: 999999999;
    }
    .custom-tree-node {
      flex: 1;
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
.es-dataSearch-right {
  width: 858px;
  .content {
    width: 100%;
    margin-top: 24px;
    min-height: 200px;
    .item {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.es-dataSearch {
  .el-tree-node__children {
    position: relative;
  }
  .el-tree-node__children {
    > :last-child {
      padding-bottom: 24px;
    }
  }
}
</style>
