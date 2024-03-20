<template>
  <button
    class="es-button"
    :class="[
      type ? `es-button--${type}` : '',
      size ? `es-button--${size}` : '',
      {
        'es-button--round': round,
        'es-button--disabled': disabled
      }
    ]"
    :disabled="disabled"
    type="button"
    v-on="$listeners"
  >
    <span class="es-button__content">
      <slot
        name="prefix"
        class="es-button__prefix"
      ></slot>
      <span class="es-button__inner">
        <slot />
      </span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'EsButton',
  props: {
    size: {
      type: String,
      default: () => ''
    },
    type: {
      type: String,
      default: () => 'default'
    },
    round: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    prefix: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick(event) {
      if (this.disabled) {
        event.preventDefault()
        return false
      }
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style";

.es-button {
  min-width: 80px;
  height: 32px;
  border: none;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: all 0.1s;
  padding: 0px 16px;
  white-space: nowrap;
  display: inline-block;
  vertical-align: middle;

  .es-button__content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.es-button--mini {
    min-width: 50px;
    height: 20px;
    line-height: 20px;
  }
  &.es-button--small {
    min-width: 60px;
    height: 24px;
    line-height: 24px;
  }
  &.es-button--medium {
    min-width: 70px;
    height: 28px;
    line-height: 28px;
  }

  &.es-button--default {
    background-color: #F3F4F7;
    color: #5B6985;
    line-height: 32px;

    &.es-button--disabled {
      background-color: #EEEFF3;
      color: #BCC4D8;
      cursor: not-allowed;
    }

    &:hover {
      background-color: #E7E8EF;
    }
    &:active {
      background-color: #CFD4DD;
    }
  }
  &.es-button--primary {
    background-color: $es-bg-color-main;
    color: #ffffff;
    &.es-button--disabled {
      background-color: #9DBEFA;
      color: #ffffff;
      cursor: not-allowed;
    }

    &:hover {
      background-color: #507EF7;
      color: #ffffff;
    }
    &:active {
      background-color: #1E41CA;
      color: #ffffff;
    }
  }
  &.es-button--success {
    background-color: $es-bg-color-success;
  }
  &.es-button--warning {
    background-color: $es-bg-color-warning;
  }
  &.es-button--danger {
    background-color: $es-bg-color-danger;
  }

  &.es-button--round {
    border-radius: 40px;
  }

  &.es-button--disabled {
    background-color: #94bfff;
    color: #ffffff;
    cursor: not-allowed;
  }

  // &::-webkit-input-placeholder {
  //   color: #919db5;
  // }

  & + & {
    margin-left: 16px;
  }
}
</style>

<style lang="scss">
.es-button {
  svg {
    width: 24px;
    height: 24px;
  }
}
</style>
