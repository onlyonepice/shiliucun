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
                    <div class="title">
                        这个面试有点硬
                    </div>
                    <div class="price">
                        2399 M币
                    </div>
                </div>
                <img />
            </div>
            <div class="buy_title">当前余额</div>
            <div class="buy_button">
                M比
            </div>
            <div class="buy_title">交易概览</div>
            <div class="item_tips">
                <div class="tips">金额</div>
                <div class="right_tips">M币</div>
            </div>
            <div class="item_tips">
                <div class="tips">优惠</div>
                <div class="right_tips">0M币</div>
            </div>
            <div class="item_tips">
                <div class="tips">支付</div>
                <div class="right_tips">0M币</div>
            </div>
           <div> <el-button @click="goChange" class="btn-foot">余额不足去充值</el-button></div>
           <div> <el-button @click="cannel" class="btn-foot cannel">取消</el-button></div>
        </div>
    </el-dialog>
  </template>
  <script lang="ts" setup>
  import { ref, watch, Ref, onMounted } from "vue";
  import { useUserStoreHook } from "@/store/modules/user";

  const dialogVisible = ref(true);
  
  
  const handleClose = () => {
    useUserStoreHook().openPayGame(false);
  };
  onMounted(()=>{
    getUserInfo().then((res)=>{
        console.log('res-------<',res)
    })
  })
  </script>
  
  <style lang="scss">
  @import "@/style/mixin.scss";
  .pay_game{
    .btn-foot{
        width: 100%;
        justify-content: center;
        margin-top:20px
    }
    .cannel{
        width: 100%;
        height: 2.08333vw;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #b6b3b3;
        color: var(--neutral-100, #b6b3b3);
        font-size: .72917vw;
        font-weight: 400;
        line-height: 1.04167vw;
        border-radius: .41667vw;
        border-radius: var(--3xs, .41667vw);
        border: 1px solid #3b3939;
        border: 1px solid var(--neutral-600, #3b3939);
        background: #222121;
        background: var(--neutral-900, #222121);
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        margin-top:10px
    }
    .item_tips{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .tips{
            color: #6f6d6d;
            color: var(--neutral-300, #6f6d6d);
            font-size: .625vw;
            font-weight: 400;
            line-height: 1.04167vw;
        }
        .right_tips{
            flex-shrink: 0;
            color: #b6b3b3;
            color: var(--neutral-100, #b6b3b3);
            text-align: right;
            font-size: .72917vw;
            font-weight: 400;
            line-height: .83333vw;
            margin-left: .625vw;
        }
    }
    .buy_title{
        color: #f0eded;
        color: var(--neutral-50, #f0eded);
        font-size: .72917vw;
        font-weight: 400;
        line-height: .83333vw;
        margin-bottom: .41667vw;
        margin-top:10px;
        margin-bottom:10px
    }
    .buy_button{
        padding: .41667vw .83333vw;
        padding: var(--xs, .41667vw) var(--lg, .83333vw);
        text-align: center;
        border-radius: .20833vw;
        border-radius: var(--3xs, .20833vw);
        border: .07813vw solid #3b3939;
        border: .07813vw solid var(--neutral-600, #3b3939);
        color: #b6b3b3;
        color: var(--neutral-100, #b6b3b3);
        font-size: .72917vw;
        font-size: var(--font-size-sm, .72917vw);
        font-weight: 400;
        line-height: .83333vw;
        line-height: var(--font-line-height-sm, .83333vw);
    }
    .top_block{
        .right{
            display: flex;
            flex-direction: column;
        }
        display: flex;
        padding: .41667vw .41667vw .41667vw .83333vw;
        padding: var(--3xs, .41667vw) var(--3xs, .41667vw) var(--3xs, .41667vw) var(--sm, .83333vw);
        justify-content: space-between;
        align-items: center;
        border-radius: .625vw;
        border-radius: var(--md, .625vw);
        background: #222121;
        background: var(--neutral-900, #222121);
        .title{
            color: #f0eded;
            color: var(--neutral-50, #f0eded);
            font-size: .83333vw;
            font-weight: 400;
            line-height: 1.04167vw;
            margin-bottom: .41667vw;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .price{
            color: var(--primary-300, #f00a38);
            font-size: .72917vw;
            font-weight: 400;
            line-height: .83333vw;
            margin-top: 20px;
        }
        img{
            flex-shrink: 0;
            margin-left: .625vw;
            width: 8.33333vw;
            height: 4.6875vw;
            object-fit: cover;
            border-radius: .625vw;
        }
    }
  }
  </style>
  