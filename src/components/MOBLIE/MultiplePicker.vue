<template>
  <van-popup
    v-model:show="multipleType"
    round
    position="bottom"
    @close="onClose"
    :style="{ height: '70%' }"
  >
    <div class="multiple-head">
      <p>地区筛选条件</p>
      <img :src="CloseIcon" alt="">
    </div>
    <div class="multiple-content">
      <div v-for="item in props.option" :key="item[labelKey]" class="multiple-item" :class="{ 'multiple-item-chose': getDefaultValue(item[labelKey]) }" @click.stop="onChose(item[labelKey])">
        <span>{{ item[labelKey] }}</span>
        <img v-if="getDefaultValue(item[labelKey])" src="https://cdn.eesaenergy.com/mini-app/i-report/v1.0/enterprise/enterprise_checked_icon.png" alt="">
      </div>
    </div>
  </van-popup>
</template>

<script lang="ts" setup>
import { ref, Ref, onMounted, defineProps, computed, defineEmits, watch } from 'vue'
import CloseIcon from '@/assets/img/close-icon.png'
const emit = defineEmits(['onChange','onClose'])
const props = defineProps({
  showMultiple: {
    type: Boolean,
    default: false
  },
  option: {
    type: Array,
    default: () => []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  // 默认渲染数据
  defaultValue: {
    type: Array,
    default: () => ['上海市']
  }
})
const multipleType = ref(false) // 组件内控制弹窗显示
const choseData = ref([]) // 选中的城市
watch(
  () => props.showMultiple,
  (val) => {
    multipleType.value = val
  },
  { immediate: true }
)
watch(
  () => props.defaultValue,
  (val) => {
    choseData.value = val
  },
  { deep: true, immediate: true }
)
const getDefaultValue = computed(()=>(key:string)=>{
  return props.defaultValue.indexOf(key) > -1
})
// 点击城市
function onChose(value: string){
  emit('onChange',value)
}
// 关闭弹窗
function onClose(){
  emit('onClose')
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.multiple-head{
  @include widthAndHeight(100%,11.2rem);
  @include padding(3.2rem,3.2rem,3.2rem,4.8rem);
  @include flex(center,space-between);
  @include fixed();
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  p{
    @include font(3.2rem,600,rgba(0,0,0,.9),4.8rem);
  }
  img{
    @include widthAndHeight(4.8rem,4.8rem);
  }
}
.multiple-item{
  @include widthAndHeight(100%,8rem);
  @include font(2.8rem,400,rgba(0,0,0,.6),8rem);
  @include padding(0,0,0,4.8rem);
  img{
    @include widthAndHeight(3.2rem,3.2rem);
    @include margin(0,4.2rem,0,0)
  }
}
.multiple-content{
  @include padding(11.2rem,0,0,0);
  @include flex(center,space-between);
}
.multiple-item-chose{
  @include font(2.8rem,400,#244BF1,8rem);
  @include flex(center,space-between);
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
</style>
