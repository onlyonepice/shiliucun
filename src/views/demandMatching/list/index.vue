<template>
  <div :class="['es-commonPage', ns.b()]">
    <img
      :class="ns.b('topIcon')"
      :src="DemandMatchingListImg"
      @click="demandImgVisible = true"
    />
    <p :class="[ns.b('identity'), 'animate__animated animate__fadeIn']">
      当前身份：{{ getRole }}<span @click="onModify()">修改</span>
    </p>
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
    <div v-show="currentPage === 'demand'">
      <template v-if="!loadingList">
        <div class="type-demand">
          <div :class="ns.b('filter')">
            <div
              :class="ns.be('filter', 'item')"
              v-for="item in filterList"
              :key="item.id"
            >
              <h5>{{ item.name }}</h5>
              <div
                v-for="_item in item.option"
                :key="_item.code"
                :class="[
                  ns.be('filter', 'chose'),
                  filterParams[item.type] === _item.code
                    ? ns.bm('filter', 'active')
                    : '',
                ]"
                @click="onChangeType(_item.code, item.type)"
              >
                {{ _item.label }}
                <img
                  v-if="_item.code === 'SORT_BY_TIME'"
                  :src="NewIcon"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div :class="ns.b('type-list')">
            <div :class="ns.b('type-search')">
              <Search
                width="368px"
                height="32px"
                searchTitle=""
                @onSearch="onSearch"
                v-model="filterParams.title"
              />
            </div>
            <el-button
              @click="handleReleaseClick"
              class="release-demand"
              type="primary"
              >发布需求</el-button
            >
          </div>
          <div :class="ns.b('data-box')">
            <DemandMatchingSkeletonList v-if="skeletonListLoading" />
            <template v-else>
              <template v-if="demandList.length > 0">
                <div
                  class="data-box_item animate__animated animate__fadeIn"
                  @click="handleDetailClick(item)"
                  v-for="item in demandList"
                  :key="item.id"
                >
                  <div class="data-box_item_top">
                    <div style="display: flex; align-items: center">
                      <p class="data-box_item_type">
                        {{ item.typeName }}
                      </p>
                      <p class="line" v-if="item.typeName" />
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
                            borderColor: statusItem.color,
                          }"
                        >
                          {{ statusItem.name }}
                        </p>
                      </template>
                      <p
                        class="tag"
                        :style="{
                          background: '#EAEDFE',
                          color: '#244BF1',
                          borderColor: '#244BF1',
                        }"
                        v-if="item.tags && item.tags.includes('海外')"
                      >
                        海外
                      </p>
                    </div>
                    <h5 style="font-weight: 400; float: right">
                      发布时间：{{ item.releaseTime }}
                    </h5>
                  </div>
                  <div class="data-box_item_desc">
                    {{ item.description }}
                  </div>
                </div>
                <div class="Pagination" v-if="total !== 0">
                  <Pagination
                    :pageSize="filterParams.pageSize"
                    :currentPage="filterParams.pageNumber"
                    :total="total"
                    @onchangeCurrent="onchangeCurrent"
                  />
                </div>
              </template>
              <!-- 搜索结果没有数据 -->
              <template v-else>
                <div
                  :class="[
                    ns.be('search', 'empty'),
                    'animate__animated animate__fadeIn',
                  ]"
                >
                  <img :src="DemandHallIcon" alt="" />
                  <h3>暂无搜索结果</h3>
                  <h5>可以试试搜索其他关键词哦～</h5>
                </div>
              </template>
            </template>
          </div>
        </div>
      </template>
      <DemandMatchingSkeleton v-else />
    </div>
    <div v-show="currentPage === 'manage'">
      <template v-if="!loadingMy">
        <div :class="ns.b('demand-manage')">
          <div :class="ns.b('type-list-special')">
            <div>
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
            </div>
            <el-button @click="handleReleaseClick" type="primary"
              >发布需求</el-button
            >
          </div>
          <div :class="ns.b('type-list-special-content')">
            <!-- 我发布的 -->
            <div style="width: 760px" v-show="currentManageTab === 'release'">
              <div :class="ns.b('data-box')">
                <DemandMatchingSkeletonMyList v-if="skeletonListLoadingMy" />
                <template v-else>
                  <template v-if="releaseList.length > 0">
                    <div
                      class="data-box_item"
                      @click="handleDetailClick(item)"
                      v-for="item in releaseList"
                      :key="item.id"
                    >
                      <div class="data-box_item_top">
                        <div style="display: flex; align-items: center">
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
                                borderColor: statusItem.color,
                              }"
                            >
                              {{ statusItem.name }}
                            </p>
                          </template>
                        </div>
                        <h5 style="font-weight: 400">
                          发布时间：{{ item.releaseTime }}
                        </h5>
                      </div>
                      <div class="data-box_item_desc">
                        {{ item.description }}
                      </div>
                    </div>
                    <div class="Pagination" v-if="releaseTotal !== 0">
                      <Pagination
                        :pageSize="releaseParams.pageSize"
                        :currentPage="releaseParams.pageNumber"
                        :total="releaseTotal"
                        @onchangeCurrent="onchangeCurrentRelease"
                      />
                    </div>
                  </template>
                  <!-- 我发布的没有数据 -->
                  <template v-else>
                    <div
                      :class="[
                        ns.be('search', 'empty'),
                        'animate__animated animate__fadeIn',
                      ]"
                    >
                      <img :src="DemandReleaseIcon" alt="" />
                      <h3>暂无需求内容</h3>
                      <h5>发布需求寻求优秀合作伙伴</h5>
                    </div>
                  </template>
                </template>
              </div>
            </div>
            <!-- 我报名的 -->
            <div style="width: 760px" v-show="currentManageTab === 'apply'">
              <div :class="ns.b('data-box')">
                <DemandMatchingSkeletonMyList v-if="skeletonListLoadingMy" />
                <template v-else>
                  <template v-if="applyList.length > 0">
                    <div
                      class="data-box_item"
                      @click="handleDetailClick(item)"
                      v-for="item in applyList"
                      :key="item.id"
                    >
                      <div class="data-box_item_top">
                        <div style="display: flex; align-items: center">
                          <p class="data-box_item_type">
                            {{ item.type }}
                          </p>
                          <p class="line" />
                          <p class="data-box_item_title">
                            {{ item.needTitle }}
                          </p>
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
                                borderColor: statusItem.color,
                              }"
                            >
                              {{ statusItem.name }}
                            </p>
                          </template>
                        </div>
                        <h5 style="font-weight: 400">
                          报名时间：{{
                            item.applyTime.indexOf(" ") > -1
                              ? item.applyTime.split(" ")[0]
                              : item.applyTime
                          }}
                        </h5>
                      </div>
                      <div class="data-box_item_desc">
                        {{ item.description }}
                      </div>
                    </div>
                  </template>
                  <!-- 搜索结果没有数据 -->
                  <template v-else>
                    <div
                      :class="[
                        ns.be('search', 'empty'),
                        'animate__animated animate__fadeIn',
                      ]"
                    >
                      <img :src="DemandReleaseIcon" alt="" />
                      <h3>暂无报名内容</h3>
                      <h5>为客户提供解决方案，建立长久合作</h5>
                    </div>
                  </template>
                </template>
              </div>
              <div class="Pagination" v-if="applyTotal !== 0">
                <Pagination
                  :pageSize="applyParams.limit"
                  :total="applyTotal"
                  @onchangeCurrent="onchangeCurrentApply"
                />
              </div>
            </div>
            <businessCard style="margin-top: 24px" :info="userDetailInfo" />
          </div>
        </div>
      </template>
      <DemandMatchingSkeletonMy v-else />
    </div>
    <ReleaseDemand
      v-if="isLogin"
      @close="releaseDemandClose"
      @success="releaseDemandSuccess"
      :show="releaseDemandShow"
    />
  </div>
  <RoleDialog
    :visible="roleDialogVisible"
    :roleList="roleList"
    @onHandleClose="
      roleDialogVisible = false;
      getIdentity();
      getNeed();
    "
  />
  <Dialog
    :visible="demandImgVisible"
    :class="ns.b('tipsDialog')"
    :showClose="false"
    :showFoot="false"
  >
    <template #content>
      <img :class="ns.be('tipsDialog', 'img')" :src="DemandContentImg" />
      <img
        :class="ns.be('tipsDialog', 'close')"
        :src="CloseIcon"
        @click="demandImgVisible = false"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted, Ref, computed, onActivated } from "vue";
import ReleaseDemand from "../releaseDemand.vue";
import useNamespace from "@/utils/nameSpace";
import businessCard from "@/views/demandMatching/detail/components/businessCard.vue";
import DemandHallIcon from "@/assets/img/demand/demand-hall-icon.png";
import DemandReleaseIcon from "@/assets/img/demand/demand-release-icon.png";
import RoleDialog from "./roleDialog.vue";
import NewIcon from "@/assets/img/common/new-icon.png";
import DemandMatchingSkeleton from "../skeleton/demandMatchingSkeleton.vue";
import DemandMatchingSkeletonList from "../skeleton/demandMatchingSkeletonList.vue";
import DemandMatchingSkeletonMy from "../skeleton/demandMatchingSkeletonMy.vue";
import DemandMatchingSkeletonMyList from "../skeleton/demandMatchingSkeletonMyList.vue";
import DemandMatchingListImg from "@/assets/img/demand/demandMatching-list-img.png";
import DemandContentImg from "@/assets/img/demand/demand-content-img.png";
import CloseIcon from "@/assets/img/demand/close-icon-circle.png";
const ns = useNamespace("demand-list");
import { useUserStore } from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
import { getToken } from "@/utils/auth";
import { windowScrollStore } from "@/store/modules/windowScroll";
import { demandStatus, applicationStatus } from "../config";
import {
  getTypeNotNullApi,
  getNeedApi,
  getReleaseNeedApi,
  getApplyNeedApi,
  getNeedEvaluateApi,
  getIdentityApi,
} from "@/api/demandList";
import { getUserDetailInfo } from "@/api/user";
const route = useRoute();
const isLogin = ref(getToken());
const roleDialogVisible: Ref<boolean> = ref(false); // 角色弹窗
const loadingList: Ref<boolean> = ref(true); // 加载
const loadingMy: Ref<boolean> = ref(true); // 加载
const skeletonListLoading: Ref<boolean> = ref(true); // 列表数据骨架屏
const skeletonListLoadingMy: Ref<boolean> = ref(true); // 列表数据骨架屏
const demandImgVisible: Ref<boolean> = ref(false); // 需求对接弹窗图片
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
const filterList: Ref<Array<any>> = ref([
  {
    id: 1,
    type: "tag",
    name: "需求来源",
    option: [
      { code: "", label: "全部" },
      { code: "海外", label: "海外" },
    ],
  },
  { id: 2, type: "sortType", name: "排序", option: [] },
  { id: 3, type: "type", name: "需求类型", option: [] },
]);
const filterParams = ref({
  pageNumber: 1,
  pageSize: 10,
  type: null,
  sortType: null,
  tag: "",
});
const total = ref(0);
const demandList = ref([{}]);
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
const getRole = computed(() => {
  let _role = "";
  roleList.value.map((item) => {
    item.labelType === "customer_group" &&
      (_role = item.needLabelResponseList[0].labelName);
  });
  return _role;
});
const handleReleaseClick = () => {
  isLogin.value = getToken();
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
  releaseDemandShow.value = true;
};
// 点击修改
const onModify = () => {
  isLogin.value = getToken();
  if (!getToken()) {
    return useUserStore().openLogin(true);
  }
  roleDialogVisible.value = true;
};
const userDetailInfo = ref({});
// 获取用户详细信息
const onGetUserInfo = async () => {
  const { resp_code, datas } = await getUserDetailInfo();
  if (resp_code === 0) {
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
  windowScrollStore().SET_SCROLL_TOP(0);
};
const getTypeNotNull = async () => {
  const data = await getTypeNotNullApi({ title: filterParams.value.title });
  if (data.resp_code === 0) {
    data.datas.unshift({
      label: "全部",
      code: "",
    });
    filterList.value[2].option = data.datas;
    filterParams.value.type = data.datas[0].code;
  }
};
// 获取需求大厅列表数据
const getNeed = async () => {
  skeletonListLoading.value = true;
  const data = await getNeedApi(filterParams.value);
  if (data.resp_code === 0) {
    loadingList.value = false;
    skeletonListLoading.value = false;
    data.datas.records.forEach((item) => {
      item.tags && (item.tags = item.tags.split(","));
    });
    demandList.value = data.datas.records;
    total.value = data.datas.total;
  }
};
const roleList: Ref<any[]> = ref([]); // 角色列表
// 获取身份
const getIdentity = async () => {
  const { datas, resp_code } = await getIdentityApi();
  if (resp_code === 0) {
    roleList.value = datas;
    roleDialogVisible.value = datas.length === 0;
  }
};
const releaseParams = ref({
  pageNumber: 1,
  pageSize: 10,
});
const releaseTotal = ref(0);
const releaseList = ref([]);
const getReleaseNeed = async () => {
  skeletonListLoadingMy.value = true;
  const data = await getReleaseNeedApi(releaseParams.value);
  if (data.resp_code === 0) {
    skeletonListLoadingMy.value = false;
    releaseTotal.value = data.datas.total;
    releaseList.value = data.datas.records;
    releaseList.value.forEach((item) => {
      item.enabled === 2 && (item.status = 99);
    });
    loadingMy.value = false;
  }
};
const onchangeCurrentRelease = (number: number) => {
  releaseParams.value.pageNumber = number;
  getReleaseNeed();
  windowScrollStore().SET_SCROLL_TOP(0);
};
const applyParams = ref({
  page: 1,
  limit: 10,
});
const applyTotal = ref(0);
const applyList = ref([]);
const getApplyNeed = async () => {
  skeletonListLoadingMy.value = true;
  const data = await getApplyNeedApi(applyParams.value);
  if (data.resp_code === 0) {
    skeletonListLoadingMy.value = false;
    applyTotal.value = data.datas.total;
    applyList.value = data.datas.records;
  }
};
const onchangeCurrentApply = (number: number) => {
  applyParams.value.page = number;
  getApplyNeed();
  windowScrollStore().SET_SCROLL_TOP(0);
};
onUnmounted(() => {
  releaseDemandShow.value = false;
});
// 获取排序筛选项
const getSortTypeList = async () => {
  const { datas, resp_code } = await getNeedEvaluateApi({
    type: "NEED_HOMEPAGE_SORT",
  });
  if (resp_code === 0 && datas.length) {
    filterList.value[1].option = datas[0].subset;
    filterParams.value.sortType = datas[0].subset[0].code;
    getNeed();
  }
};
const onChangeType = (value, key) => {
  filterParams.value.pageNumber = 1;
  filterParams.value[key] = value;
  if (currentPage.value === "demand") {
    getNeed();
  }
};
onActivated(() => {
  if (route.query.type === "operate") {
    if (currentPage.value === "demand") {
      getNeed();
    } else if (currentPage.value === "manage") {
      getReleaseNeed();
    }
  }
  if (currentManageTab.value === "apply") {
    getApplyNeed();
  }
});
onMounted(() => {
  route.query.type = "";
  getTypeNotNull();
  getSortTypeList();
  getToken() && getIdentity();
  window.trackFunction("pc_RequestConnect_click");
});
</script>
<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-demand-list {
  padding-top: 80px;
  position: relative;
  padding-bottom: 24px;
}
.es-demand-list-topIcon {
  @include widthAndHeight(1152px, 80px);
  cursor: pointer;
  margin-bottom: 16px;
}
.es-demand-list-identity {
  @include absolute(1, 197px, 0, none, none);
  @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
  display: inline-block;
  span {
    @include font(14px, 400, #244bf1, 22px);
    margin-left: 8px;
    cursor: pointer;
  }
}
.es-demand-list-type-list-special {
  @include flex(center, space-between, nowrap);
  div {
    @include flex(center, space-between, nowrap);
  }
}
.es-demand-list-type-list-special-content {
  @include flex(flex-start, space-between, nowrap);
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
.es-demand-list-filter {
  @include widthAndHeight(100%);
  border-bottom: 1px solid #dbdce2;
  padding-bottom: 23px;
}
.es-demand-list-filter__item {
  @include flex(center, flex-start, nowrap);
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
  h5 {
    width: 60px;
    text-align: right;
    margin-right: 16px;
  }
}
.es-demand-list-filter__chose {
  padding: 2px 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
  cursor: pointer;
  border-radius: 4px;
  margin-right: 16px;
  @include flex(center, center, nowrap);
  img {
    @include widthAndHeight(32px, 16px);
    margin-left: 12px;
  }
}
.es-demand-list-filter--active {
  border: 1px solid #244bf1;
  color: #244bf1;
}
.es-demand-list-type-search {
  @include widthAndHeight(368px, 32px);
}
.es-demand-list-type-list {
  width: 100%;
  margin-top: 24px;
  position: relative;
  @include flex(center, space-between, nowrap);
}
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
      @include flex(center, space-between, nowrap);
      margin-bottom: 8px;
      .data-box_item_type,
      .data-box_item_title {
        @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
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
.time {
  width: 100%;
  @include flex(center, space-between);
  margin-top: 16px;
}
.tag {
  border-radius: 4px;
  padding: 3px 8px;
  @include font(12px, 400, none, 20px);
  border: 1px solid #ff892e;
  margin-left: 8px;
}
.es-demand-list-search__empty {
  @include widthAndHeight(232px);
  margin: 64px auto 0;
  @include flex(flex-start, center, wrap);
  img {
    @include widthAndHeight(120px, 120px);
  }
  h3 {
    line-height: 28px;
    margin-bottom: 4px;
  }
  h5 {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
    padding-bottom: 64px;
  }
}
</style>

<style lang="scss">
@import "@/style/mixin.scss";

.es-demand-list-tipsDialog {
  @include widthAndHeight(560px, 816px);
  background: transparent !important;
  box-shadow: none;
  text-align: center;
  .el-dialog__header,
  .el-dialog__body {
    padding: 0 !important;
  }
  .es-demand-list-tipsDialog__img {
    @include widthAndHeight(560px, 760px);
  }
  .es-demand-list-tipsDialog__close {
    @include widthAndHeight(32px, 32px);
    margin: 24px auto 0;
    cursor: pointer;
  }
}
</style>
