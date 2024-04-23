<template>
  <div
    :class="['page-loading', loading ? 'show' : 'hide']"
    :style="{ 'background-color': bg }"
  >
    <div class="page-loading-container">
      <div class="container" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  bg: {
    default: "#ffffff",
  },
});
</script>

<style lang="scss" scoped>
@import "@/style";

.page-loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;

  @include widthAndHeight(100vw, 100vh);
  animation-duration: 0.5s;
  animation-fill-mode: both;
  background-color: #ffffff;

  .page-loading-container {
    @include flex();
    @include widthAndHeight();
    .container {
      --uib-size: 40px;
      --uib-color: #244bf1;
      --uib-speed: 0.9s;
      --uib-stroke: 5px;
      --mask-size: calc(var(--uib-size) / 2 - var(--uib-stroke));
      @include widthAndHeight(var(--uib-size), var(--uib-size));
      -webkit-mask: radial-gradient(
        circle var(--mask-size),
        transparent 99%,
        #000 100%
      );
      mask: radial-gradient(
        circle var(--mask-size),
        transparent 99%,
        #000 100%
      );
      background-image: conic-gradient(transparent 25%, var(--uib-color));
      animation: spin calc(var(--uib-speed)) linear infinite;
      border-radius: 50%;
    }
  }
}

.show {
  animation-name: loadingShow;
}

.hide {
  animation-name: loadingHide;
}

@keyframes loadingShow {
  0% {
    display: block;
    opacity: 0.2;
  }
  25% {
    opacity: 0.6;
  }
  100% {
    display: block;
    opacity: 1;
  }
}

@keyframes loadingHide {
  0% {
    opacity: 1;
  }

  100% {
    display: none;
    opacity: 0.5;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
