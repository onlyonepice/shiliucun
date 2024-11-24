<template>
  <el-dialog
    v-model="dialogVisible"
    title="下载app"
    width="400"
    :before-close="handleClose"
    class="login-dialog"
    v-loading="loading"
  >
    <div class="pay_game">
      <div class="platform">
        <img :src="ios" /> iOS <img class="code" :src="base?.ios_download" />
      </div>
      <div class="platform">
        <img :src="Android" />安卓<img
          class="code"
          :src="base?.android_download"
        />
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import Android from "@/assets/img/Android.png";
import ios from "@/assets/img/ios.png";
import { useUserStoreHook } from "@/store/modules/user";
import { getBaseConfigApi } from "@/api/index";
//   import { ElLoading } from 'element-plus'

const dialogVisible = ref(true);
const loading = ref(true);
const base: any = ref();

const handleClose = () => {
  useUserStoreHook().openDownload(false);
};

onMounted(() => {
  // ElLoading.service({})
  getBaseConfigApi()
    .then((res) => {
      base.value = res.data;
    })
    .finally(() => {
      // const loadingInstance = ElLoading.service({})
      // loadingInstance.close()
    });
});
</script>

<style lang="scss">
@import "@/style/mixin.scss";
.pay_game {
  .code {
    margin: 20px;
    height: 7vw;
    widows: 7vw;
  }
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
  .platform {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0.41667vw 0.83333vw;
    padding: var(--xs, 0.41667vw) var(--lg, 0.83333vw);
    text-align: center;
    border-radius: 0.20833vw;
    border-radius: var(--3xs, 0.20833vw);
    border: 0.07813vw solid #3b3939;
    border: 0.07813vw solid var(--neutral-600, #3b3939);
    color: #b6b3b3;
    color: var(--neutral-100, #b6b3b3);
    font-size: 1vw;
    font-weight: 400;
  }
}
</style>
