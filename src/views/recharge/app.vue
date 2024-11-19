<template>
  <div class="recharge">
    <div class="recharge-desc">
      <img src="@/assets/img/tips-icon.png" alt="" />
      您可以使用M币购买本平台的游戏，可通过充值获得M币。汇率结算单位：美元（实时汇率）
    </div>
    <div class="recharge-list">
      <div
        v-for="(item, index) in rechargeList"
        :key="index"
        class="recharge-list__item"
      >
        <img src="" alt="" />
        <p>{{ item.money }}M币</p>
        <el-button style="width: 100%; text-align: center"
          >${{ item.money }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const rechargeList = ref([
  {
    name: "1元",
    money: "1.00",
    money_usd: "0.01",
    money_rmb: "6.00",
  },
  {
    name: "1元",
    money: "1.00",
    money_usd: "0.01",
    money_rmb: "6.00",
  },
  {
    name: "1元",
    money: "1.00",
    money_usd: "0.01",
    money_rmb: "6.00",
  },
  {
    name: "1元",
    money: "1.00",
    money_usd: "0.01",
    money_rmb: "6.00",
  },
  {
    name: "1元",
    money: "1.00",
    money_usd: "0.01",
    money_rmb: "6.00",
  },
  {
    name: "1元",
    money: "1.00",
    money_usd: "0.01",
    money_rmb: "6.00",
  },
]);
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.recharge {
  width: 62.5vw;
  padding: 1.25vw;
  border-radius: 1.25vw;
  background-color: #171616;
  margin: 0 auto;
}
.recharge-desc {
  padding: 0.83333vw;
  border: 1px solid #3b3939;
  color: #6f6d6d;
  font-size: 0.625vw;
  border-radius: 0.625vw;
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(1.25vw, 1.25vw);
    margin-right: 0.425vw;
  }
}
.recharge-list {
  display: flex;
  gap: 0.625vw;
  flex-wrap: wrap;
  margin-top: 2vw;
}
.recharge-list__item {
  padding: 0.41667vw;
  box-sizing: border-box;
  background-color: #222121;
  background-image: url("@/assets/img/list-item-bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  img {
    @include widthAndHeight(13.69792vw, 9.11458vw);
    border-radius: 0.3125vw;
  }
  p {
    @include font(0.9375vw, 400, #f00a38, 1.25vw);
    text-align: center;
    margin: 1.20833vw 0 3vw;
  }
  .el-button {
    @include flex(center, center, row);
  }
}
</style>
