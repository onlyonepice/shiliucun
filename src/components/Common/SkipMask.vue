<template>
  <div v-show="show" class="mask_box">
    <div class="mask_operation">
      <div class="header">
        <div class="header_left">
          <img class="icon_title" :src="WarningIcon" v-if="showIcon" />
          <div class="title">{{ title }}</div>
        </div>
        <div v-if="iconClosure" class="header_right">
          <img class="icon_clear" :src="CancelIcon" @click="onClose(false)" />
        </div>
      </div>
      <div class="option_left" v-if="showTips" @click="checkType = !checkType">
        <img :src="checkType ? IconChecked : IconCheck" alt="" />
        <span>不再提示</span>
      </div>
      <div class="option">
        <el-button @click="onClose(false)" v-if="cancel !== ''">{{
          cancel
        }}</el-button>
        <el-button @click="onClose(true)" type="primary">{{
          confirm
        }}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import WarningIcon from "@/assets/img/common/icon_success_nor.png";
import CancelIcon from "@/assets/img/common/cancel.png";
import IconCheck from "@/assets/img/common/icon_check.png";
import IconChecked from "@/assets/img/common/icon_checked.png";
export default {
  name: "ExitPrompt",
  props: {
    icon: {
      type: String,
      default: null,
    },
    // 标题
    title: {
      type: String,
      default: "标题title",
    },
    // 展示icon
    showIcon: {
      type: Boolean,
      default: true,
    },
    // 提示内容
    text: {
      type: String,
      default: "提示内容text",
    },
    // 取消字体
    cancel: {
      type: String,
      default: "取消",
    },
    // 确定字体
    confirm: {
      type: String,
      default: "确认",
    },
    // 显示
    show: {
      type: Boolean,
      default: false,
    },
    effect: {
      type: Number,
      default: () => 2,
    },
    iconClosure: {
      type: Boolean,
      default: true,
    },
    showTips: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      WarningIcon: WarningIcon,
      CancelIcon: CancelIcon,
      IconCheck: IconCheck,
      IconChecked: IconChecked,
      checkType: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      document.body.appendChild(this.$el);
    });
  },
  beforeUnmount() {
    document.body.removeChild(this.$el);
  },
  methods: {
    onClose(type) {
      this.showTips && this.$emit("onClose", type, this.checkType);
      !this.showTips && this.$emit("onClose", type);
    },
  },
};
</script>
<style lang="scss" scoped>
.mask_box {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  .title {
    color: #000;
  }
  .mask_operation {
    width: 368px;
    height: 200px;
    background-color: #fff;
    border-radius: 10px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 24px;
    box-sizing: border-box;
    .header {
      height: 26px;
      line-height: 26px;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      .header_left {
        display: flex;
        .icon_title {
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
      }
      .icon_clear {
        width: 24px;
        height: 24px;
        margin-top: 1px;
        cursor: pointer;
      }
    }
    .text {
      color: #5b6985;
      line-height: 22px;
      font-size: 14px;
      display: flex;
      margin-top: 4px;
      .seat {
        width: 32px;
      }
    }
    .option {
      position: absolute;
      bottom: 24px;
      right: 24px;
      button {
        border: 0px;
        width: 80px;
        height: 32px;
      }
    }
  }
}
.option_left {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  bottom: 28px;
  left: 24px;
  img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  span {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
  }
}
</style>
