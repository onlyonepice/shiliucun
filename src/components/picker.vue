<template>
  <div class="picker-page">
    <!-- <van-field :disabled="disabled" :label-width="labelWidth" v-model="value" :label="props.title"
      :placeholder="props.placeholder" @click="handleShowPicker()" /> -->
    <div class="field-box" @click="handleShowPicker()">
      <span class="label" :style="{ color: disabled ? '#c8c9cc' : '' }">
        {{ props.title }}
      </span>
      <p v-if="value.length > 0" class="value">
        <span v-for="item  in  value" :key="item">
          {{ item }}
        </span>
      </p>
      <span v-else class="placeholder">
        {{ props.placeholder }}
      </span>
    </div>
    <van-popup get-container="body" v-model:show="showPicker" round position="bottom">
      <van-picker v-model="modelValue" :title="title" @cancel="handleShowPicker()" @confirm=" onChange($event, field)"
        :columns-field-names="fieldNames" :columns="columns" />
    </van-popup>
    <img src="@/assets/img/icon_right.png" alt="">
  </div>
</template>

<script setup lang="ts">
import { watch, defineProps, ref, defineEmits, computed } from 'vue'
const props = defineProps({

  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'select'
  },
  labelWidth: {
    type: Number || String,
    default: 120
  },
  title: {
    type: String,
  },
  defaultValue: {
    type: String,
  },
  placeholder: {
    type: String,
    default: '请选择'
  },
  field: {
    type: String,
  },
  fieldNames: {
    type: Object,
    default: () => {
      return {
        text: 'paramDesc',
        value: 'paramName'
      }
    }
  },
  columns: {
    type: Array,
    default: () => {
      return []
    }
  },
})
const emit = defineEmits(['onChange'])
const value: any = ref('') // 选中值
let deepTree = (arr, val) => {
  arr.forEach(item => {
    if (item[props.fieldNames.value] === val[value.value.length]) {
      value.value.push(item[props.fieldNames.text])
      if (item[props.fieldNames.children]) {
        deepTree(item[props.fieldNames.children], val)
      }
    }
  })
}
const modelValue = computed(() => {
  if (Array.isArray(props.defaultValue)) {
    return props.defaultValue
  } else {
    return props.defaultValue ? [props.defaultValue] : [props.columns[0][props.fieldNames.value]]
  }

})
watch(
  () => props.defaultValue,
  val => {
    if (val) {
      if (props.type === 'select') {
        props.columns.forEach(item => {
          if (item[props.fieldNames.value] === val)
            value.value = [item[props.fieldNames.text]]
        })
      } else if (props.type === 'cascader') {
        value.value = []
        deepTree(props.columns, val)
      }
    } else {
      value.value = []
    }


  },
  { immediate: true }
)

let columns = computed(() => {
  return props.columns
})
let showPicker = ref(false)
let handleShowPicker = () => {
  if (props.disabled) return
  showPicker.value = !showPicker.value
}
let onChange = (_data, type) => {
  showPicker.value = !showPicker.value
  let row = _data.selectedValues.length > 1 ? _data.selectedValues : _data.selectedValues[0]
  emit('onChange', row, type)
}
</script>

<style lang="scss" scoped>
.picker-page {
  width: 100%;
  display: flex;
  padding: 1.8rem 0;
  align-items: flex-start;
  min-height: 8rem;

  .field-box {
    flex: 1;
    display: flex;
    align-items: flex-start;

    .label {
      font-size: 2.4rem;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.8);
      line-height: 4.4rem;
      width: 20rem;
    }

    .value {
      flex: 1;
      text-align: right;
      font-size: 2.8rem;
      font-weight: 500;
      color: rgba(51, 51, 51, 0.9);
      line-height: 4.4rem;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
    }

    .placeholder {
      flex: 1;
      text-align: right;
      font-size: 2.8rem;
      font-weight: 400;
      color: rgba(153, 153, 153, 0.9);
      line-height: 4.4rem;
    }
  }

  img {
    width: 3rem;
    height: 3rem;
    margin-top: 0.6rem;
  }
}
</style>