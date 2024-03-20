<template>
  <nav :class="[ns.b(), ns.m('opacity'), choseExtra ? ns.m('open') : '']">
    <div v-if="opacityBg" :class="['es-commonPage', ns.b('content')]">
      <img :src="choseExtra ? LogoIconBlue : LogoIcon" alt="" @mouseleave="onChoseLeave()">
      <div :class="[ns.b('list')]" >
        <div v-for="item in navList" :key="item.id" @mouseenter.stop="onChoseNav(item.id, item.path)" @mouseleave="onChoseNavItemLeave()" :class="choseNavId === item.id ? ns.bm('list','chose') : ''">{{ item.text }}</div>
        <div :class="ns.b('underline')" :style="{ 'left': `${ (88 + 16) * (choseNavId - 1) }px` }"></div>
        <p :class="ns.b('login')">登录/注册</p>
      </div>
    </div>
    <div :class="[ns.b('extra'), choseExtra ? ns.bm('extra','open') : '' ] ">
      <div class="es-commonPage" :class="ns.bm('extra','body')" >
        <div :class="[ns.be('extra','content'), choseExtraContent ? ns.bem('extra','content','open') : '']" :style="{ 'margin-left': `${ (88 + 16) * (choseNavId - 1) }px`}">
          <p v-for="item in extraList" :key="item.id" :class="[ns.be('extra','item')]">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
interface NavList {
  id: number;
  text: string;
  path: Array<string> | string;
}
import { onMounted, Ref, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
import LogoIcon from '@/assets/img/common/logo-icon.png'
import LogoIconBlue from '@/assets/img/common/logo-icon-blue.png'
import useNamespace from '@/utils/nameSpace'
const ns = useNamespace('pageNav')
const emit = defineEmits(['onHashChange'])
const router = useRouter();
const route = useRoute();
const props = defineProps({
  opacityBg: {
    type: Boolean,
    default: true
  }
})
const choseNav: Ref<string> = ref('') // 选中的导航标签
const choseNavId: Ref<number> = ref(1) // 选中的导航栏id
const choseExtra: Ref<boolean> = ref(true) // 打开下拉菜单
const choseExtraContent: Ref<boolean> = ref(false) // 打开下拉菜单
// 导航栏数组
const navList: Ref<Array<NavList>> = ref([
  { id: 1, text: '首页', path: ["/home",] },
  { id: 2, text: '报告', path: ["/report",'','','',''] },
  { id: 3, text: '数据', path: ["/data"] },
  { id: 4, text: '分析', path: ["/analyze"] },
  { id: 5, text: '企业', path: ["/enterprise"] },
  { id: 6, text: '资源', path: ["/resource"] },
  { id: 7, text: '开通VIP', path: ["/vip"] }
])
const extraList: Ref<Array<NavList>> = ref([]) // 扩展下拉导航栏数据


// 选择导航栏
const onChoseNav = (id: number,path: Array<string> | string) => {
  choseNavId.value = id
  choseExtra.value = true
  choseExtraContent.value = true
}
const onChoseLeave = () => {
  choseExtra.value = false
}

const onChoseNavItemLeave = () => {
  choseExtraContent.value = false
}
watch(
  () => route.path,
  (path) => { choseNav.value = path },
  { immediate: true },
)
watch(
  () => choseNavId.value,
  (id) => {
    if( id === 2 ){
      extraList.value = [
      { id: 1, text: '行业洞察', path: '/report?source=行业洞察' },
      { id: 2, text: '季报月报', path: '/report?source=季报月报' },
      { id: 3, text: '原创报告', path: '/report?source=原创报告' },
      { id: 4, text: '白皮书', path: '/report?source=白皮书' }
      ]
    }else{
      extraList.value = []
    }
  },
  { immediate: true },
)

// 判断是否要选中某个导航
const isChoseNav = computed(() => {
  return (list: any) => {
    return list.some((item: string) => item.includes(choseNav.value))
  }
})

onMounted(()=>{

})

</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-pageNav{
  height: 56px;
  @include box(none,none,#ffffff);
  @include flex();
  @include fixed(2,0,0,none,0);
}
.es-pageNav-content{
  width: 1156px;
  height: 100%;
  @include margin(0,auto,0,auto);
  @include flex(center,space-between,nowrap);
  img{
    @include widthAndHeight(64px,30px);
    @include relative(10);
    transition: all 0.2s;
  }
}
.es-pageNav--opacity{
  background-color: rgba(255,255,255,0);
  .es-pageNav-list{
    div{
      color: rgba(255,255,255,0.55);
    }
    .es-pageNav-list--chose{
      color: rgba(255,255,255,0.9);
    }
  }
}
.es-pageNav--open{
  .es-pageNav-list{
    div{
      color: rgba(0,0,0,0.6);
    }
    .es-pageNav-list--chose{
      color: #244BF1;
    }
    .es-pageNav-underline{
      background-color: #244BF1;
    }
  }
  .es-pageNav-login{
    color: rgba(0,0,0,0.9);
  }
}
.es-pageNav-list{
  @include flex(center,center,nowrap);
  @include font(14px,400,rgba(255,255,255,0.55),22px);
  @include relative();
  will-change: transform;
  transition: all 0.2s ease-out;
  div{
    @include widthAndHeight(88px,56px);
    @include flex(center,center,nowrap);
    @include margin(0,16px,0,0);
    cursor: pointer;
    &:last-of-type{
      @include margin(0,0,0,0);
    }
  }
}

.es-pageNav-login{
  @include widthAndHeight(95px,32px);
  @include flex(center,center);
  @include margin(0,0,0,16px);
  @include font(14px,400,rgba(255,255,255,0.9),22px);
  will-change: transform;
  transition: all 0.2s ease-out;
  @include relative(10);
}
.es-pageNav-list{
  .es-pageNav-underline{
    @include widthAndHeight(88px,2px);
    background: rgba(255,255,255,0.9);
    border-radius: 2px 2px 0px 0px;
    @include absolute(1,none,none,0,0);
    will-change: transform;
    transition: all 0.2s ease-out;
  }
}
.es-pageNav-extra{
  @include widthAndHeight(100vw,0);
  background: #FFFFFF;
  will-change: transform;
  transition: all 0.2s ease-out;
  @include absolute(0,0,0,none,0);
  overflow: hidden;
}
.es-pageNav-extra--open{
  @include widthAndHeight(100vw,320px);
}
.es-pageNav-extra--body{
  width: 712px !important;
  height: 264px !important;
  transform: translateX(93px);
}
.es-pageNav-extra__content{
  @include widthAndHeight(88px,0);
  will-change: transform;
  transition: height 0.2s ease-out;
  overflow: hidden;
}
.es-pageNav-extra__content--open{
  @include widthAndHeight(88px,264px);
}
.es-pageNav-extra__item{
  @include widthAndHeight(88px,22px);
  @include flex(center,center);
  @include font(14px,400,rgba(0,0,0,0.6),22px);
  @include margin(24px,0,0,0);
  &:nth-of-type(1){
    margin-top: 80px;
  }
}

</style>
