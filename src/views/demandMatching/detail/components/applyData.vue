<template>
  <div :class="ns.b()">
    <h4>报名列表</h4>
    <div :class="ns.b('underline')" />
    <div :class="ns.b('info')" v-for="item in applyData" :key="item.id">
      <div :class="ns.be('info', 'icon')">
        <img :src="useUserStore().fileUrl + item.logo" alt="" />
      </div>
      <div :class="ns.be('info', 'content')">
        <p :class="ns.be('info', 'user')">
          {{ item.userName }}｜{{ item.position }}
        </p>
        <p :class="ns.be('info', 'company')">{{ item.enterpriseName }}</p>
        <p :class="ns.be('info', 'time')">申请时间：{{ item.applyTime }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/modules/user";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("applyData");
defineProps({
  applyData: {
    type: Array as () => any[],
    default: () => [],
  },
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-applyData {
  padding: 24px;
  background: #ffffff;
  border-radius: 4px;
  margin-top: 24px;
}
.es-applyData-underline {
  @include widthAndHeight(100%, 1px);
  background: #dbdce2;
  margin-top: 15px;
}
.es-applyData-info {
  @include flex(flex-start, center, nowrap);
  margin-top: 16px;
  .es-applyData-info__icon {
    @include widthAndHeight(80px, 80px);
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #dbdce2;
    margin-right: 16px;
  }
  .es-applyData-info__user {
    @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
    @include textOverflow();
  }
  .es-applyData-info__company {
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  }
  .es-applyData-info__time {
    @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    margin-top: 8px;
  }
}
.es-applyData-info__content {
  flex: 1;
}
</style>
