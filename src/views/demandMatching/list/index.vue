<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('tab-list')">
      <div
        class="tab-list_item"
        @click="changeTab(item.value)"
        v-for="item in tabList"
        :key="item.value"
      >
        <p
          :class="
            item.value === currentPage
              ? 'tab-list_item_name tab-list_item_name-active'
              : 'tab-list_item_name'
          "
        >
          {{ item.name }}
        </p>
        <p v-if="item.value === currentPage" class="tab-list_item_line" />
      </div>
    </div>
    <div class="type-demand" v-show="currentPage === 'demand'">
      <div :class="ns.b('search')">
        <Search
          width="858px"
          @onSearch="onSearch"
          v-model="filterParams.title"
        />
      </div>
      <div :class="ns.b('type-list')">
        <p
          :class="
            filterParams.type === item.code
              ? 'type-item-active type-item'
              : 'type-item'
          "
          v-for="item in typeList"
          :key="item.label"
          @click="changeType(item.code)"
        >
          {{ item.label }}
        </p>
        <el-button
          @click="releaseDemandShow = true"
          class="release-demand"
          type="primary"
          >发布需求</el-button
        >
      </div>
      <div :class="ns.b('data-box')">
        <div
          class="data-box_item"
          @click="handleDetailClick(item)"
          v-for="item in demandList"
          :key="item.id"
        >
          <div class="data-box_item_top">
            <p class="data-box_item_type">
              {{ item.typeName }}
            </p>
            <p class="line" />
            <p class="data-box_item_title">{{ item.title }}</p>
            <template v-for="statusItem in demandStatus" :key="statusItem.name">
              <p
                class="tag"
                v-if="statusItem.value == item.status"
                :style="{
                  background: statusItem.background,
                  color: statusItem.color,
                }"
              >
                {{ statusItem.name }}
              </p>
            </template>
          </div>
          <div class="data-box_item_desc">
            {{ item.description }}
          </div>
        </div>
      </div>
      <div class="Pagination">
        <Pagination
          :pageSize="filterParams.pageSize"
          :total="total"
          @onchangeCurrent="onchangeCurrent"
        />
      </div>
    </div>
    <div :class="ns.b('demand-manage')" v-show="currentPage === 'manage'">
      <div :class="ns.b('type-list')">
        <p
          :class="
            currentManageTab === item.name
              ? 'type-item-active type-item'
              : 'type-item'
          "
          v-for="item in manageTabArr"
          :key="item.title"
          @click="changeManageTab(item.name)"
        >
          {{ item.title }}
        </p>
        <div class="release-demand">
          <el-button @click="releaseDemandShow = true" type="primary"
            >发布需求</el-button
          >
          <businessCard style="margin-top: 24px" :info="userDetailInfo" />
        </div>
      </div>
      <!-- 我发布的 -->
      <div style="width: 760px" v-show="currentManageTab === 'release'">
        <div :class="ns.b('data-box')">
          <div
            class="data-box_item"
            @click="handleDetailClick(item)"
            v-for="item in releaseList"
            :key="item.id"
          >
            <div class="data-box_item_top">
              <p class="data-box_item_type">
                {{ item.typeName }}
              </p>
              <p class="line" />
              <p class="data-box_item_title">{{ item.title }}</p>
              <template
                v-for="statusItem in demandStatus"
                :key="statusItem.name"
              >
                <p
                  class="tag"
                  v-if="statusItem.value == item.status"
                  :style="{
                    background: statusItem.background,
                    color: statusItem.color,
                  }"
                >
                  {{ statusItem.name }}
                </p>
              </template>
            </div>
            <div class="data-box_item_desc">
              {{ item.description }}
            </div>
          </div>
        </div>
        <div class="Pagination">
          <Pagination
            :pageSize="releaseParams.pageSize"
            :total="releaseTotal"
            @onchangeCurrent="onchangeCurrentRelease"
          />
        </div>
      </div>
      <!-- 我报名的 -->
      <div style="width: 760px" v-show="currentManageTab === 'apply'">
        <div :class="ns.b('data-box')">
          <div
            class="data-box_item"
            @click="handleDetailClick(item)"
            v-for="item in applyList"
            :key="item.id"
          >
            <div class="data-box_item_top">
              <p class="data-box_item_type">
                {{ item.type }}
              </p>
              <p class="line" />
              <p class="data-box_item_title">{{ item.needTitle }}</p>
              <template
                v-for="statusItem in applicationStatus"
                :key="statusItem.name"
              >
                <p
                  class="tag"
                  v-if="statusItem.value == item.status"
                  :style="{
                    background: statusItem.background,
                    color: statusItem.color,
                  }"
                >
                  {{ statusItem.name }}
                </p>
              </template>
            </div>
            <div class="data-box_item_desc">
              {{ item.description }}
            </div>
          </div>
        </div>
        <div class="Pagination">
          <Pagination
            :pageSize="applyParams.limit"
            :total="applyTotal"
            @onchangeCurrent="onchangeCurrentApply"
          />
        </div>
      </div>
    </div>
    <ReleaseDemand
      v-if="getToken()"
      @close="releaseDemandClose"
      @success="releaseDemandSuccess"
      :show="releaseDemandShow"
    />
  </div>
</template>

<script setup lang="ts">
import ReleaseDemand from "../releaseDemand.vue";
import useNamespace from "@/utils/nameSpace";
import businessCard from "@/views/demandMatching/detail/components/businessCard.vue";
const ns = useNamespace("demand-list");
import { useUserStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
const router = useRouter();
import { getToken } from "@/utils/auth";
import { ref, onUnmounted, onMounted } from "vue";

import {
  getTypeNotNullApi,
  getNeedApi,
  getReleaseNeedApi,
  getApplyNeedApi,
} from "@/api/demandList";
import { getUserDetailInfo } from "@/api/user";
const demandStatus = [
  {
    name: "待审核",
    value: "1",
    background: "#FFF3EA",
    color: "#ED832E",
  },
  {
    name: "需求中",
    value: "2",
    background: "#FFF3EA",
    color: "#FF8D32",
  },
  {
    name: "审核未通过",
    value: "3",
    background: "#FEEFF0",
    color: "#F75964",
  },
  {
    name: "已解决",
    value: "4",
    background: "#E9F6F2",
    color: "#25AB7B",
  },
];
const applicationStatus = [
  {
    name: "待查阅",
    value: "1",
    background: "#FFF3EA",
    color: "#ED832E",
  },
  {
    name: "已同意",
    value: "2",
    background: "#E9F6F2",
    color: "#25AB7B",
  },
  {
    name: "已拒绝",
    value: "3",
    background: "#FEEFF0",
    color: "#F75964",
  },
  {
    name: "已查阅",
    value: "4",
    background: "#ECF6FF",
    color: "#39A7FD",
  },
];
const tabList = ref([
  {
    name: "需求大厅",
    value: "demand",
  },
  {
    name: "我的需求",
    value: "manage",
  },
]);
const filterParams = ref({
  pageNumber: 1,
  pageSize: 10,
  type: "",
  title: "",
});
const total = ref(0);
const demandList = ref([]);
const typeList = ref();
const currentPage = ref("demand");
const currentManageTab = ref("release");
const manageTabArr = ref([
  {
    title: "我发布的",
    name: "release",
    isShowRed: false,
  },
  {
    title: "我报名的",
    name: "apply",
    isShowRed: false,
  },
]);

const userDetailInfo = ref({});
// 获取用户详细信息
const onGetUserInfo = async () => {
  const { resp_code, datas } = await getUserDetailInfo();
  if (resp_code === 0) {
    console.log(datas);
    userDetailInfo.value = datas;
  }
};

const changeManageTab = (value) => {
  if (value === "release") {
    getReleaseNeed();
  } else {
    getApplyNeed();
  }
  currentManageTab.value = value;
};
const releaseDemandShow = ref(false);
const releaseDemandSuccess = () => {
  getReleaseNeed();
  releaseDemandShow.value = false;
};
const releaseDemandClose = () => {
  releaseDemandShow.value = false;
};
const onSearch = (value) => {
  filterParams.value.title = value;
  filterParams.value.pageNumber = 1;
  filterParams.value.type = "";
  getNeed();
  getTypeNotNull();
};
const changeTab = (value) => {
  if (!getToken() && value === "manage") {
    return useUserStore().openLogin(true);
  }
  if (value === "manage") {
    onGetUserInfo();
    getReleaseNeed();
  } else {
    getNeed();
  }
  currentPage.value = value;
};
const changeType = (value) => {
  filterParams.value.type = value;
  filterParams.value.pageNumber = 1;
  getNeed();
};
const handleDetailClick = (row) => {
  router.push({
    path: `/demandMatching/detail`,
    query: {
      id: row.id || row.needId,
    },
  });
};
const onchangeCurrent = (number: number) => {
  filterParams.value.pageNumber = number;
  getNeed();
};
const getTypeNotNull = async () => {
  const data = await getTypeNotNullApi({ title: filterParams.value.title });
  if (data.resp_code === 0) {
    data.datas.unshift({
      label: "全部",
      code: "",
    });
    typeList.value = data.datas;
  }
};
const getNeed = async () => {
  const data = await getNeedApi(filterParams.value);
  if (data.resp_code === 0) {
    demandList.value = data.datas.records;
    total.value = data.datas.total;
  }
};
const releaseParams = ref({
  pageNumber: 1,
  pageSize: 10,
});
const releaseTotal = ref(0);
const releaseList = ref([]);
const getReleaseNeed = async () => {
  const data = await getReleaseNeedApi(releaseParams.value);
  if (data.resp_code === 0) {
    releaseTotal.value = data.datas.total;
    releaseList.value = data.datas.records;
  }
};
const onchangeCurrentRelease = (number: number) => {
  releaseParams.value.pageNumber = number;
  getReleaseNeed();
};
const applyParams = ref({
  page: 1,
  limit: 10,
});
const applyTotal = ref(0);
const applyList = ref([]);
const getApplyNeed = async () => {
  const data = await getApplyNeedApi(applyParams.value);
  if (data.resp_code === 0) {
    applyTotal.value = data.datas.total;
    applyList.value = data.datas.records;
  }
};
const onchangeCurrentApply = (number: number) => {
  applyParams.value.page = number;
  getApplyNeed();
};
onUnmounted(() => {
  releaseDemandShow.value = false;
});
onMounted(() => {
  getTypeNotNull();
  getNeed();
});
</script>
<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-demand-list {
  padding-top: 80px;
}
.es-demand-list-tab-list {
  width: 100%;
  height: 56px;
  border-bottom: 1px solid #dbdce2;
  display: flex;
  margin-bottom: 24px;
  .tab-list_item {
    width: 88px;
    height: 56px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 8px;
    cursor: pointer;
    .tab-list_item_name {
      @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    }
    .tab-list_item_name-active {
      color: #244bf1;
      font-weight: 600;
    }
    .tab-list_item_line {
      @include widthAndHeight(88px, 2px);
      background: #244bf1;
      border-radius: 2px 2px 0px 0px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
.es-demand-list-search {
  width: 100%;
  display: flex;
  justify-content: center;
}
.es-demand-list-type-list {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: 24px;
  position: relative;
  .type-item {
    margin-right: 8px;
    @include widthAndHeight(80px, 32px);
    @include flex(center, center);
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    box-sizing: border-box;
    cursor: pointer;
  }
  .type-item-active {
    background: rgba(255, 255, 255, 0);
    border-radius: 4px;
    border: 1px solid #244bf1;
    color: #244bf1;
  }
  .release-demand {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
}
.es-demand-list-data-box {
  margin-top: 24px;
  width: 100%;
  .data-box_item {
    width: 100%;
    padding-bottom: 15px;
    border-bottom: 1px solid #dbdce2;
    margin-bottom: 16px;
    cursor: pointer;
    .data-box_item_top {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .data-box_item_type,
      .data-box_item_title {
        @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
      }
      .tag {
        border-radius: 4px;
        padding: 2px 8px;
        @include font(12px, 400, none, 20px);
        margin-left: 16px;
      }
      .line {
        width: 2px;
        height: 20px;
        margin: 0 8px;
        background: rgba(0, 0, 0, 0.7);
      }
    }
    .data-box_item_desc {
      @include font(14px, 400, rgba(0, 0, 0, 0.4), 22px);
    }
  }
  .Pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
