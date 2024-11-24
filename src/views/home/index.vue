<template>
  <div class="content">
    <el-carousel class="banner" motion-blur :interval="5000">
      <el-carousel-item
        style="height: 225%"
        v-for="item in fileList"
        :key="item"
      >
        <el-image style="width: 100%" :src="item.banner" fit="contain" @click="goto(item.game_id, item.lock)" />
      </el-carousel-item>
    </el-carousel>
    <div class="card_block">
      <div class="title">
        <div clas="text">【全球首款】真人性愛模擬器</div>
      </div>
      <div class="item_block">
        <div
          class="item"
          v-for="item in gameList"
          :key="item"
          @click="goto(item.game_id, item.lock)"
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getBanner, getGameList } from "@/api/index";
import { ITEM_RENDER_EVT } from "element-plus/es/components/virtual-list/src/defaults";
const router = useRouter();
const goto = (game_id, lock) => {
  router.push({ path: "/gameItem", query: { game_id, lock } });
};
const fileList = ref<any>([1, 2, 3, 4, 5]);
const gameList = ref<any>([1, 2, 3, 4, 5]);

onMounted(() => {
  getBanner().then((res) => {
    console.log(res);
    if ((res.code = 200)) {
      fileList.value = res?.data?.list;
    }
  });
  getGameList({ id: 1 }).then((res) => {
    console.log(res);
    if ((res.code = 200)) {
      gameList.value = res?.data?.list;
    }
  });
});
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
::-webkit-scrollbar {
  display: none;
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
    &:hover {
      border: 0.5px solid crimson;
      background-image: url("@/assets/img/card-select.png");
    }
    cursor: pointer;

    width: 14.16667vw;
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
  height: 9.58333vw;
  border-radius: 0.41667vw;
  border-radius: var(--3xs, 0.41667vw);
  object-fit: cover;
}
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
