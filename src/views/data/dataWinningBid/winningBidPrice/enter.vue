<template>
  <div :class="ns.b()">
    <div :class="ns.b('filter')">
      <div class="select-item">6</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("winningBidPrice");
import { priceFormOptions } from "../data.js";
const props = defineProps({
  formOptions: {
    type: Array,
    default: () => [],
  },
});
const options = ref(priceFormOptions());
interface response {
  datas: any;
}
watch(
  () => props.formOptions,
  (res: response[]) => {
    console.log(res, "res======", options);
    if (res.length > 0) {
      options.value.forEach((item) => {
        switch (item.model) {
          case "biddingContent":
            item.bind.options = res[0].datas;
            break;
          case "technologyType":
            item.bind.options = res[1].datas;
            break;
          case "applicationScenarios":
            item.bind.options = res[3].datas;
            break;
        }
      });
    }
  },
);
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.es-winningBidPrice {
  width: 100%;
}
.es-winningBidPrice-filter {
  width: 100%;
}
</style>
