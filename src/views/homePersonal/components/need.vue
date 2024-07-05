<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的需求</h3>
    </div>
    <div :class="[ns.b('tab')]">
      <div
        v-for="item in tabList"
        :key="item.id"
        :class="choseTab === item.id ? ns.bm('tab', 'active') : ''"
        @click="
          choseTab = item.id;
          getNeedList();
        "
      >
        {{ item.name }}
      </div>
    </div>
    <div
      v-for="item in needList"
      :key="item.id"
      :class="[ns.b('list'), 'animate__animated animate__fadeIn']"
    >
      <div :class="[ns.be('list', 'top')]">
        <h3>{{ item.title || item.needTitle }}</h3>
        <div
          v-if="choseTab === 1"
          :class="[ns.b('status')]"
          :style="{
            border: '1px solid ' + searchDemandStatus(item.status)?.borderColor,
            color: searchDemandStatus(item.status)?.color,
            backgroundColor: searchDemandStatus(item.status)?.background,
          }"
        >
          {{ searchDemandStatus(item.status).name }}
        </div>
        <div
          v-if="choseTab === 2"
          :class="ns.b('status')"
          :style="{
            border:
              '1px solid ' + searchApplicationStatus(item.status)?.borderColor,
            color: searchApplicationStatus(item.status)?.color,
            backgroundColor: searchApplicationStatus(item.status)?.background,
          }"
        >
          {{ searchApplicationStatus(item.status).name }}
        </div>
      </div>
      <h5>{{ item.description }}</h5>
    </div>
    <Pagination :total="total" @onchangeCurrent="onchangeCurrent" />
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import {
  searchApplicationStatus,
  searchDemandStatus,
} from "../../demandMatching/config";
import { getReleaseNeedApi, getApplyNeedApi } from "@/api/demandList";
const ns = useNamespace("homePersonalNeed");
const pageInfo: Ref<any> = ref({
  pageNumber: 1,
  pageSize: 10,
});
const total: Ref<number> = ref(0); // 总条数
const needList: Ref<Array<any>> = ref([]); // 需求列表
const tabList: Ref<Array<any>> = ref([
  { id: 1, name: "我发布的" },
  { id: 2, name: "我报名的" },
]); // 需求tab列表
const choseTab: Ref<number> = ref(1); // 选中的tab
// 分页改变
const onchangeCurrent = (page: number) => {
  pageInfo.value.pageNumber = page;
  getNeedList();
};
const getNeedList = async () => {
  const { datas, resp_code } =
    choseTab.value === 1
      ? await getReleaseNeedApi(pageInfo.value)
      : await getApplyNeedApi({
          page: pageInfo.value.pageNumber,
          limit: pageInfo.value.pageSize,
        });
  if (resp_code === 0) {
    datas.records.map((item) => {
      item.enabled === 2 && (item.status = 99);
    });
    needList.value = datas.records;
    total.value = datas.total;
  }
};
getNeedList();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalNeed-top {
  @include flex(center, space-between);
  @include padding(0, 0, 19px, 0);
  border-bottom: 1px solid #dbdce2;
  @include margin(0, 0, 24px, 0);
  h3 {
    line-height: 56px;
  }
}
.es-homePersonalNeed-tab {
  @include flex(center, flex-start);
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  margin-bottom: 24px;
  div {
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0);
    padding: 5px 12px;
    cursor: pointer;
  }
  .es-homePersonalNeed-tab--active {
    border: 1px solid #244bf1;
    color: #244bf1;
  }
}
.es-homePersonalNeed-list {
  padding-bottom: 16px;
  border-bottom: 1px solid #dbdce2;
  margin-bottom: 16px;
  &:nth-last-of-type(1) {
    border-bottom: none;
  }
  h5 {
    color: rgba(0, 0, 0, 0.4);
    line-height: 22px;
  }
}
.es-homePersonalNeed-list__top {
  @include flex(center, flex-start);
  margin-bottom: 8px;
  cursor: pointer;
  h3 {
    margin-right: 8px;
    line-height: 28px;
  }
}
.es-homePersonalNeed-status {
  padding: 2px 8px;
  border-radius: 4px;
  line-height: 20px;
}
</style>
