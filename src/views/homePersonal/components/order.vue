<template>
  <div :class="[ns.b()]">
    <div :class="[ns.b('top')]">
      <h3>我的订单</h3>
      <el-button type="primary" :class="ns.be('top','button')" @click='onGetUserInfo()'>我要开票</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" header-row-class-name="table-class">
      <el-table-column prop="date" label="订单编号" width="180" />
      <el-table-column prop="name" label="订单名称" width="180" />
      <el-table-column prop="address" label="购买时间" />
      <el-table-column prop="address" label="订单金额" />
      <el-table-column prop="address" label="操作" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("homePersonalOrder");
const tableData: Ref<any> = ref([]);
const onGetUserInfo = () => {
  console.log("onGetUserInfo");
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalOrder-top{
  @include flex(center,space-between,nowrap);
  @include padding(0,0,24px,0);
}
</style>
