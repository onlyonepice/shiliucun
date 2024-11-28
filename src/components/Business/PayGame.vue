<template>
  <el-dialog
    v-model="dialogVisible"
    title="购买游戏"
    width="400"
    :before-close="handleClose"
    class="login-dialog"
  >
    <div class="pay_game">
      <div class="top_block">
        <div class="right">
          <div class="title">{{ gameInfo?.name }}</div>
          <div class="price">{{ gameInfo?.price }}喵币</div>
        </div>
        <img :src="gameInfo.icon" />
      </div>
      <div class="buy_title">当前余额</div>
      <div class="buy_button">{{ currentUser.coin }}喵币</div>
      <div class="buy_title">交易概览</div>
      <div class="item_tips">
        <div class="tips">金额</div>
        <div class="right_tips">喵币</div>
      </div>
      <div class="item_tips">
        <div class="tips">优惠</div>
        <div class="right_tips">{{ gameInfo.price }}喵币</div>
      </div>
      <div class="item_tips">
        <div class="tips">支付</div>
        <div class="right_tips" style="color: #f00a38">
          {{ gameInfo.price }}喵币
        </div>
      </div>
      <div>
        <el-button v-if="buyType" @click="goChange" class="btn-foot"
          >{{ buyType == "1" ? "余额不足去充值" : "立即购买" }}
        </el-button>
      </div>
      <div>
        <el-button @click="handleClose" class="btn-foot cannel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStoreHook } from "@/store/modules/user";
import { getUserInfo, payGame } from "@/api/index";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();
const dialogVisible = ref(true);
const currentUser: any = ref(true);
const buyType: any = ref();
const gameInfo: any = useUserStoreHook().currentGame;

const handleClose = () => {
  useUserStoreHook().openPayGame(false, {});
};
const goChange = () => {
  if (buyType.value == 1) {
    router.push("/recharge");
  } else if (buyType.value == 2) {
    payGame({ game_id: gameInfo.game_id }).then((res) => {
      console.log(res);
      if (res.code == 200) {
        ElMessage.success("购买成功！");
        handleClose();
        location.reload();
      } else {
        ElMessage.error("购买失败！");
      }
    });
  }
};

onMounted(() => {
  getUserInfo().then((res) => {
    currentUser.value = res.data?.user;
    buyType.value = res.data?.user?.coin - gameInfo?.price < 0 ? "1" : "2";
  });
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.pay_game {
  .btn-foot {
    width: 100%;
    justify-content: center;
    margin-top: 20px;
  }
  .cannel {
    width: 100%;
    height: 2.08333vw;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: 0.72917vw;
    font-weight: 400;
    line-height: 1.04167vw;
    border-radius: 0.41667vw;
    border-radius: var(--3xs, 0.41667vw);
    border: 1px solid #3b3939;
    border: 1px solid var(--neutral-600, #3b3939);
    background: #222121;
    background: var(--neutral-900, #222121);
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-top: 10px;
  }
  .item_tips {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tips {
      color: #6f6d6d;
      color: var(--neutral-300, #6f6d6d);
      font-size: 0.625vw;
      font-weight: 400;
      line-height: 1.04167vw;
    }
    .right_tips {
      flex-shrink: 0;
      color: #b6b3b3;
      color: var(--neutral-100, #b6b3b3);
      text-align: right;
      font-size: 0.72917vw;
      font-weight: 400;
      line-height: 0.83333vw;
      margin-left: 0.625vw;
    }
  }
  .buy_title {
    color: #f0eded;
    color: var(--neutral-50, #f0eded);
    font-size: 0.72917vw;
    font-weight: 400;
    line-height: 0.83333vw;
    margin-bottom: 0.41667vw;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .buy_button {
    padding: 0.41667vw 0.83333vw;
    padding: var(--xs, 0.41667vw) var(--lg, 0.83333vw);
    text-align: center;
    border-radius: 0.20833vw;
    border-radius: var(--3xs, 0.20833vw);
    border: 0.07813vw solid #3b3939;
    border: 0.07813vw solid var(--neutral-600, #3b3939);
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: 0.72917vw;
    font-size: var(--font-size-sm, 0.72917vw);
    font-weight: 400;
    line-height: 0.83333vw;
    line-height: var(--font-line-height-sm, 0.83333vw);
  }
  .top_block {
    .right {
      display: flex;
      flex-direction: column;
    }
    display: flex;
    padding: 0.41667vw 0.41667vw 0.41667vw 0.83333vw;
    padding: var(--3xs, 0.41667vw) var(--3xs, 0.41667vw) var(--3xs, 0.41667vw)
      var(--sm, 0.83333vw);
    justify-content: space-between;
    align-items: center;
    border-radius: 0.625vw;
    border-radius: var(--md, 0.625vw);
    background: #222121;
    background: var(--neutral-900, #222121);
    .title {
      color: #f0eded;
      color: var(--neutral-50, #f0eded);
      font-size: 0.83333vw;
      font-weight: 400;
      line-height: 1.04167vw;
      margin-bottom: 0.41667vw;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .price {
      color: var(--primary-300, #f00a38);
      font-size: 0.72917vw;
      font-weight: 400;
      line-height: 0.83333vw;
      margin-top: 20px;
    }
    img {
      flex-shrink: 0;
      margin-left: 0.625vw;
      width: 8.33333vw;
      height: 4.6875vw;
      object-fit: cover;
      border-radius: 0.625vw;
    }
  }
}
</style>
