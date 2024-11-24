<template>
  <div class="announcement">
    <h1 style="color: #fff; margin-bottom: 2vw">公告中心</h1>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        :title="item.title"
        :name="item.id"
        v-for="item in infoList"
        :key="item.id"
      >
        <p style="font-size: 1.5vw; margin-bottom: 0.8vw">{{ item.intro }}</p>
        <p style="font-size: 1vw; margin-bottom: 0.6vw">
          {{ item.created_at }}
        </p>
        <p v-html="item.detail"></p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { getNoticeConfigApi } from "@/api/index";
const infoList = ref([]); // 公告列表
const activeNames = ref([]); // 折叠面板选中项
// 获取公告数据
const gameInfo = async () => {
  const { data, code }: any = await getNoticeConfigApi();
  if (code === 200) {
    infoList.value = data;
  }
};
gameInfo();
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.announcement {
  width: 62.5vw;
  padding: 1.25vw;
  border-radius: 1.25vw;
  background-color: #171616;
  margin: 0 auto;
  .el-collapse {
    border-bottom: none;
    border-top: none;
    --el-collapse-border-color: transparent;
  }
  .el-collapse-item__header {
    background-color: #171616;
    color: #fff;
  }
  .el-collapse-item__content {
    padding: 0.25vw;
  }
}
</style>
