<template>
  <div class="el-search-box" :style="{ width: width, height: height }">
    <div class="homeTopSearch">
      <el-input
        v-model="value"
        placeholder="请输入关键字…"
        @keyup.enter="onSearch"
      />
      <img
        @click="handleClearTap"
        v-show="value"
        :src="icon_clear"
        class="icon_clear"
        alt=""
      />
      <div class="homeTopSearchIcon" @click.stop="onSearch">
        <span>搜索</span>
        <img :src="searchIcon" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import searchIcon from "@/assets/img/common/search-icon.png";
import icon_clear from "@/assets/img/common/cancel-icon.png";
const value: any = ref(""); // 选中值
const model = defineModel();
const emit = defineEmits(["onSearch"]);
defineProps({
  // 筛选项宽度
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "40px",
  },
  placeholder: {
    type: String,
    default: "请输入关键词...",
  },
});
// 通过onChange事件传递值给父组件
watch(
  () => value.value,
  (val) => {
    model.value = val;
  },
);
function onSearch() {
  model.value = value.value;
  emit("onSearch", value.value);
}
const handleClearTap = () => {
  value.value = "";
  model.value = value.value;
  emit("onSearch", value.value);
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.el-search-box {
  .homeTopSearch {
    @include widthAndHeight(100%, 100%);
    @include margin(0, auto, 0, auto);
    @include relative();

    .icon_clear {
      @include widthAndHeight(20px, 20px);
      @include absolute(1, 10px, 105px, none, none);
      cursor: pointer;

      &:hover {
        @include widthAndHeight(22px, 22px);
      }
    }
  }

  .homeTopSearchIcon {
    @include widthAndHeight(96px, 100%);
    @include absolute(1, 0, 0, 0, none);
    @include flex(center, center);
    border-radius: 0px 100px 100px 0px;
    cursor: pointer;
    background-color: #244bf1;

    span {
      @include font(14px, 400, rgba(255, 255, 255, 0.9), 22px);
      margin-right: 4px;
    }

    img {
      @include widthAndHeight(20px, 20px);
    }
  }
}
</style>
<style lang="scss">
.el-search-box {
  .homeTopSearch {
    .el-input {
      height: 100%;
      .el-input__wrapper {
        border-radius: 24px;
        border: 1px solid #dbdce2;
        background-color: white;
        .el-input__inner {
          text-indent: 13px;
          padding-right: 120px;
        }
      }
    }
  }
}
</style>
