<template>
  <nav class="nav">
    <div class="nav__content">
      <img class="content__title" :src="EnergyLogo" />
      <div class="nav__list">
        <span class="nav__item" :class="{'nav__item-chose': choseNavId === item.id}" v-for="item in navList" :key="item.id" @click="onChoseNav(item.id,item.path)">{{item.text}}</span>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
interface NAVLIST {
  id: number;
  text: string;
  path: string
}
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from "vue-router";
import EnergyLogo from '@/assets/img/energy-logo.png'
const emit = defineEmits(['onHashChange'])
const router = useRouter();

// 导航栏数组
const navList: Ref<Array<NAVLIST>> = ref([
  { id: 1, text: '投资回报性分析', path: "/ipotisedge/PC/investment" },
  { id: 2, text: '代理购电价格追踪', path: "/ipotisedge/PC/priceTracking" }
])
// 选中的导航栏id
const choseNavId: Ref<number> = ref(1)
// 选择导航栏
const onChoseNav = (id: number,path: string) => {
  choseNavId.value = id
  emit('onHashChange',path)
}

onMounted(()=>{
  choseNavId.value = window.location.hash.indexOf('priceTracking') > -1 ? 2 : 1
})

</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.nav{
  @include widthAndHeight(100%,80px);
  @include box(none,none,#ffffff);
  @include flex();
  min-width: 1080px;
  position: fixed;
  top: 0;
  z-index: 2;
}
.nav__content{
  @include widthAndHeight(80vw,40px);
  @include flex(center,flex-start);
  @include margin(0,auto,0,auto);
  min-width: 1080px;
}
.content__title{
  @include widthAndHeight(336px,60px);
  @include margin(0,72px,0,0);
}
.nav__item{
  @include widthAndHeight(auto,40px);
  @include font(16px,400,#5B6985,24px);
  @include margin(0,32px,0,0);
  @include padding(6px,0,0,0);
  display: inline-block;
  cursor: pointer;
}
.nav__item-chose{
  @include font(16px,600,#1D232E,24px);
  border-bottom: 2px solid #2D5CF6;
}
</style>
