<template>
  <Dialog
    :visible="visibleDelete"
    width="400px"
    height="360px"
    @onHandleClose="onHandleClose"
    confirmText="删除需求"
    cancelText="下次再说"
    :class="ns.b()"
  >
    <template #content>
      <p>1</p>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
// import { useUserStore } from "@/store/modules/user";
const ns = useNamespace("demandMatchingDetail-apply");
const visibleDelete: Ref<boolean> = ref(false); // 弹窗
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  // 报名需求id
  needId: {
    type: Number,
    default: 0,
  },
});
watch(
  () => props.visible,
  (newVal) => {
    visibleDelete.value = newVal;
  },
  { immediate: true },
);
const onHandleClose = async (type: boolean) => {
  if (type) {
    console.log("====", type);
  }
  visibleDelete.value = false;
};
</script>
<style lang="scss">
@import "@/style/mixin.scss";
</style>
