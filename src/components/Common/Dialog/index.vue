<template>
  <div
    v-if="visible"
    class="es-dialog"
  >
    <div
      class="es-dialog__wrapper"
      :style="`--width: ${width}`"
    >
      <div
        v-if="title || $slots.title"
        class="es-dialog__header"
      >
        <p class="title">
          <slot
            name="title"
            class="title-wrapper"
          >{{ title }}</slot>
          </span>
          <es-image
            class="es-image"
            :src="require('@/assets/img/home/details/cancel.png')"
            @click.stop="cancel"
            @keydown.enter="cancel"
            @keydown.space="cancel"
          />
        </p>
      </div>
      <div class="es-dialog__body">
        <slot></slot>
      </div>
      <div
        class="es-dialog__footer"
        :style="`--text-align: ${buttonAlign}`"
      >
        <slot name="footer">
          <es-button
            @click.stop="cancel"
            @keydown.enter="cancel"
            @keydown.space="cancel"
          >{{ cancelText }}</es-button>
          <es-button
            type="primary"
            @click.stop="confirm"
            @keydown.enter="confirm"
            @keydown.space="confirm"
          >{{ confirmText }}</es-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { EsImage, EsButton } from '@/components'
export default {
  name: 'EsDialog',
  components: {
    EsButton,
    EsImage
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    visible: {
      type: Boolean
    },
    buttonAlign: {
      type: String,
      default: () => 'right'
    },
    width: {
      type: String,
      default: () => ''
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    confirm() {
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.es-dialog {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(000, 000, 000, 0.5);
  z-index: 2000;
  .es-dialog__wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #ffffff;
    border-radius: 8px;
    padding: 24px;
    width: var(--width);
    .es-dialog__header {
      padding-bottom: 8px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title-wrapper {
          color: #1d232e;
          font-weight: bold;
          font-size: 24px;
          line-height: 32px;
        }
        .es-image {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
      }
    }
    .es-dialog__body {
    }
    .es-dialog__footer {
      text-align: var(--text-align);
      padding-top: 8px;
    }
  }
}
</style>
