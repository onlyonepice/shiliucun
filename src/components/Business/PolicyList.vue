<template>
  <div :class="[ns.b()]" @click="handleItemClick">
    <p class="name">{{ pageData.policyName }}</p>
    <div class="tag-box">
      <p>{{ pageData.typeName }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useNamespace from "@/utils/nameSpace";
import { useRouter } from "vue-router";
const ns = useNamespace("policyList");
const router = useRouter();
const props = defineProps({
  pageData: {
    type: Object,
    default: () => ({}),
  },
});
const handleItemClick = () => {
  router.push({
    name: "Policy",
    query: { id: props.pageData.id },
  });
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-policyList {
  width: 100%;
  border-bottom: 1px solid #dbdce2;
  padding-bottom: 16px;
  margin-bottom: 16px;
  height: 44px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &:hover {
    .name {
      color: #244bf1;
    }
  }

  .name {
    @include textOverflow(1);
    width: 600px;
    @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
  }

  .tag-box {
    display: flex;

    p {
      padding: 2px 8px;
      background: #fff3ea;
      border-radius: 4px;
      border: 1px solid #ff8d32;
      @include font(12px, 400, #ff8d32, 20px);
    }
  }
}
</style>
