<template>
  <div
    ref="loading"
    class="loading animate__animated animate__fadeIn"
  >
    <div class="container">
      <Lottie
        :options="defaultOptions"
        :height="160"
        :width="160"
      />
      <p>{{ text }}...</p>
    </div>
  </div>
</template>

<script>
import animationData from '@/config/loadingLottieFiles.json';
export default {
  name: 'Loading',
  props: {
    backgroundColor: {
      type: String,
      default: () => '0,0,0,.7'
    },
    text: {
      type: String,
      default: () => '加载中请稍等'
    }
  },
  data() {
    return {
      defaultOptions: { animationData: animationData },
      animationSpeed: 1,
      anim: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['loading'] && (this.$refs['loading'].style = `background:${this.backgroundColor}`)
    })
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255);
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  .container {
    width: 200px;
    text-align: center;
    font-size: 14px;
    p {
      margin-top: -40px;
    }
  }
}
</style>
