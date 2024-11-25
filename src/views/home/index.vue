<template>
  <div class="content">
    <el-carousel class="banner" autoplay  v-if="fileList?.length">
        <el-carousel-item
          style="height: 225%"
          v-for="item in fileList"
          :key="item"
        >
          <el-image style="width: 100%" :src="item.banner" fit="contain" @click="goto(item.game_id, 'now')" />
        </el-carousel-item>
      </el-carousel>
    <div class="banner_shelf" v-if="!fileList?.length" />
    <div class="card_block">
      <div class="title">
        <div clas="text">【全球首款】真人性愛模擬器</div>
      </div>
      <div class="item_block">
        <div
          class="item"
          v-for="item in gameList"
          :key="item"
          @click="goto(item.game_id)"
        >
          <img v-if="item.icon" class="card_img" :src="item.icon" />
          <div class="bottom">
            <div class="tips">
              {{ item.name }}
            </div>
            <div class="coupon"></div>
            <template v-if="item.price > 0 && item.lock === 1">
              <div class="price">已购买</div>
            </template>
            <template v-else>
              <div class="price">
                {{ item.price ? item.price + "M币" : "免费" }}
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="title" style="margin-top: 2vw;">
        <div clas="text">敬请期待</div>
      </div>
      <div class="item_block">
        <div
          class="item"
          v-for="item in gameListFeature"
          :key="item"
          @click="goto(item.game_id, 'feature')"
        >
          <img v-if="item.icon" class="card_img" :src="item.icon" />
          <div class="bottom">
            <div class="tips">
              {{ item.name }}
            </div>
            <div class="coupon"></div>
            <div class="price">查看详情</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getBanner, getGameList } from "@/api/index";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
const router = useRouter();
const goto = (game_id, time = 'now') => {
  router.push({ path: "/gameItem", query: { game_id, time } });
};
const fileList = ref<any>([]);
const gameList = ref<any>([]);
const gameListFeature = ref<any>([]);

onMounted(() => {
  getBanner().then((res) => {
    console.log(res);
    if ((res.code = 200)) {
      fileList.value = res?.data?.list;
    }
  });
  getGameList({ id: 1 }).then((res) => {
    if ((res.code = 200)) {
      gameList.value = res?.data?.list;
    }
  });
  getGameList({ is_online: 0 }).then((res) => {
    if ((res.code = 200)) {
      gameListFeature.value = res?.data?.list;
    }
  });
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
::-webkit-scrollbar {
  display: none;
}
.banner_shelf{
  height: 55vh;
}
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.card_block {
  margin-top: 1.5vw;
  width: 100%;
  background: crimson;
  width: calc(82% - 100px);
  border-radius: 6px;
  padding: var(--xs, 0.625vw) var(--lg, 1.25vw);
  background: var(--neutral-950, #171616);
  .item_block {
    display: flex;
    flex-direction: row;
    grid-gap: 0.625vw;
    gap: 0.625vw;
    grid-gap: var(--xs, 0.625vw);
    gap: var(--xs, 0.625vw);
    overflow-x: auto;
    flex-wrap: wrap;
  }
  .title {
    font-size: 1.45833vw;
    font-weight: 400;
    background-clip: text;
    background-image: linear-gradient(180deg, #bcb1b1, #786b6b);
    color: transparent;
    margin-bottom: var(--sm, 0.83333vw);
  }
  .bottom {
    padding: var(--xs, 0.625vw) 0 var(--3xs, 0.41667vw);
  }
  .text {
    background: var(--neutral-950, #171616);
  }
  .item {
    &::after{
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 200px;
      background-image: url("@/assets/img/1.png");
      z-index: 1;
      background-size: 100% 100%;
    }
    &:hover {
      border: 0.5px solid crimson;
      background-image: url("@/assets/img/card-select.png");
    }
    cursor: pointer;
    width: 13.16667vw;
    padding: var(--3xs, 0.41667vw);
    position: relative;
    border-radius: 0.625vw;
    border-radius: var(--md, 0.625vw);
    cursor: pointer;
    background-color: var(--neutral-900, #222121);
    padding: 1.25vw;
    background-image: url("@/assets/img/card.png");
    background-position: 100% 100%;
    background-size: 200%;
    background-repeat: no-repeat;
    .tips {
      height: var(--xl, 1.66667vw);
      overflow: hidden;
      color: #f0eded;
      color: var(--neutral-50, #f0eded);
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 0.72917vw;
      font-weight: 400;
      line-height: 0.83333vw;
      height: var(--xl, 1.66667vw);
    }
    .coupon {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: #f00a38;
      color: var(--primary-300, #f00a38);
      font-size: 0.83333vw;
      font-weight: 400;
      line-height: 1.04167vw;
      grid-gap: 0.20833vw;
      gap: 0.20833vw;
    }
    .price {
      margin-top: 2vw;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: #f00a38;
      color: var(--primary-300, #f00a38);
      font-size: 0.83333vw;
      font-weight: 400;
      line-height: 1.04167vw;
      grid-gap: 0.20833vw;
      gap: 0.20833vw;
    }
  }
}
.banner {
  width: calc(82% - 100px);
  height: 0;
  padding-bottom: calc((125% - 10px) / 3);
  border-radius: 6px;
}
.card_img {
  width: 100%;
  height: 7.5vw;
  border-radius: 0.41667vw;
  border-radius: var(--3xs, 0.41667vw);
  object-fit: cover;

}
.demonstration {
  color: var(--el-text-color-secondary);
}
</style>
