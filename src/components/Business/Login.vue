<template>
  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const dialogVisible = ref(false);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
</style>
