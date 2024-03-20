<!--
 * @Date: 2023-11-20 09:22:18
 * @Author: luoluoa
 * @LastEditors: luoluoa
 * @LastEditTime: 2023-12-07 19:51:11
 * @FilePath: \i-report-frontend\src\views\V2\components\Tag\index.vue
 * @Description:
-->
<template>
  <span
    class="es-tag"
    :class="getWrapperClass"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script>
export default {
  name: 'EsTag',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'normal'
    },
    color: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    getWrapperClass() {
      const { type, size } = this

      const typeClass = type ? `type-${type}` : ''
      const sizeClass = size ? `size-${size}` : ''

      return [typeClass, sizeClass]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/style";

@import "./style.scss";
</style>
