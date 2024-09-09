<template>
  <div :class="ns.b()">
    <div :class="ns.b('top')">
      <el-skeleton animated :rows="1">
        <template #template>
          <div style="display: flex; justify-content: space-between">
            <div :class="ns.be('top', 'left')">
              <template v-for="item in 3" :key="item">
                <el-skeleton-item
                  style="width: 215px; height: 104px; margin-bottom: 8px"
                />
              </template>
              <template v-for="item in 4" :key="item">
                <el-skeleton-item
                  style="width: 160px; height: 80px; margin-bottom: 8px"
                />
              </template>
              <template v-for="item in 4" :key="item">
                <el-skeleton-item
                  style="width: 160px; height: 80px; margin-bottom: 24px"
                />
              </template>
              <el-skeleton-item style="width: 662px; height: 372px" />
            </div>
            <div :class="ns.be('top', 'right')">
              <el-skeleton-item
                style="width: 465px; height: 41px; margin-bottom: 24px"
              />
              <el-skeleton-item
                style="width: 465px; height: 215px; margin-bottom: 24px"
              />
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                "
              >
                <el-skeleton-item
                  v-for="item in 2"
                  :key="item"
                  style="width: 88px; height: 32px; margin-bottom: 16px"
                />
              </div>
              <el-skeleton-item
                v-for="item in 8"
                :key="item"
                style="width: 465px; height: 24px; margin-bottom: 16px"
              />
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <el-skeleton animated :rows="1">
      <template #template>
        <el-skeleton-item
          style="width: 160px; height: 44px; margin: 80px auto 32px"
        />
        <div :class="ns.be('list', 'content')">
          <el-skeleton-item
            v-for="item in 18"
            :key="item"
            style="width: 185px; height: 128px; margin-bottom: 8px"
          />
        </div>
      </template>
    </el-skeleton>
    <el-skeleton animated :rows="1">
      <template #template>
        <el-skeleton-item
          style="width: 160px; height: 44px; margin: 80px auto 32px"
        />
        <div :class="ns.be('list', 'content')">
          <el-skeleton-item
            v-for="item in 18"
            :key="item"
            style="width: 185px; height: 128px; margin-bottom: 8px"
          />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("home-skeleton");
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-home-skeleton {
  font-size: 0;
}
.es-home-skeleton-top {
  width: 100%;
}
.es-home-skeleton-top__left {
  width: 661px;
  @include flex(center, space-between, wrap);
  margin-right: 24px;
  flex: 0;
}
.es-home-skeleton-list__content {
  width: 100%;
  @include flex(center, space-between, wrap);
}
</style>
