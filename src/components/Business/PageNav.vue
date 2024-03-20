<template>
  <nav :class="[ns.b(), opacityBg ? ns.m('opacity') : '', choseExtra ? ns.m('open') : '']">
    <!-- 子菜单栏展开背景图 -->
    <div :class="[ns.b('extra'), choseExtra ? ns.bm('extra','open') : '' ] "></div>
    <div :class="['es-commonPage', ns.b('content')]">
      <img :src="choseExtra || !opacityBg ? LogoIconBlue : LogoIcon" alt="">
      <div :class="[ns.b('list')]" @mouseleave="onChoseLeave()">
        <div
          v-for="item in navList" :key="item.id"
          @mouseenter.stop="onChoseNav(item.id, item.path)"
          :class="[
            ns.bm('list','item'),
            choseNavId === item.id ? ns.bm('list','chose') : '',
          ]"
        >
          <div :class="ns.bm('item','title')">{{ item.text }}</div>
          <div @mouseleave="onChoseNavItemLeave()"
          :class="[
            ns.bm('item','box'),
            choseExtraContent ? ns.bm('item--box','open') : ''
          ]">
            <template v-for="_item in extraList" :key="item.id">
              <div v-if="_item.parentId === item.id" :class="ns.bm('item','text')" >
                {{ _item.text }}
              </div>
            </template>
          </div>
        </div>
        <!-- 下划线 -->
        <div :class="ns.b('underline')" :style="{ 'left': `${ (88 + 16) * (choseNavId - 1) }px` }"></div>
        <!-- 登录/注册 -->
        <p :class="ns.b('login')">登录/注册</p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
interface NavList {
  parentId?: number;
  id: number;
  text: string;
  path: Array<string> | string;
}
import { onMounted, Ref, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
import LogoIcon from '@/assets/img/common/logo-icon.png'
import LogoIconBlue from '@/assets/img/common/logo-icon-blue.png'
import useNamespace from '@/utils/nameSpace'
import { windowScrollStore } from "@/store/modules/windowScroll";
const ns = useNamespace('pageNav')
const router = useRouter();
const route = useRoute();
const opacityBg: Ref<boolean> = ref(true); // 是否展示透明背景
const choseNav: Ref<string> = ref(''); // 选中的导航标签
const choseNavId: Ref<number> = ref(1); // 选中的导航栏id
const choseExtra: Ref<boolean> = ref(false); // 打开下拉菜单
const choseExtraContent: Ref<boolean> = ref(false); // 打开下拉菜单
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
// 监听路由改变
watch(
  () => route.path,
  (path) => {
    opacityBg.value = path === '/home';
    choseNav.value = path
  },
  { immediate: true },
)
// 监听选中tab改变
watch(
  () => choseNavId.value,
  (id) => {
    if( id === 2 ){
      extraList.value = [
      { parentId: 2, id: 1, text: '行业洞察', path: '/report?source=行业洞察' },
      { parentId: 2, id: 2, text: '季报月报', path: '/report?source=季报月报' },
      { parentId: 2, id: 3, text: '原创报告', path: '/report?source=原创报告' },
      { parentId: 2, id: 4, text: '白皮书', path: '/report?source=白皮书' }
      ]
    }else{
      extraList.value = []
    }
  },
  { immediate: true },
)
// 监听页面滑动
watch(
  ()=> windowScrollStore().$state.scrollTop,
  (val) => {
    if( route.path === '/home' ){
      if( val >= 200 ){
      opacityBg.value = false
      }else{
        opacityBg.value = true
      }
    }
  },
  { immediate: true, deep: true },
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
  }
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
.es-pageNav--opacity{
  background-color: rgba(255,255,255,0);
  .es-pageNav-list{
    div{
      color: rgba(255,255,255,0.55);
    }
    .es-pageNav-list--chose{
      color: rgba(255,255,255,0.9);
    }
    .es-pageNav-underline{
      background-color: #ffffff;
    }
  }
  .es-pageNav-login{
    color: rgba(255,255,255,0.55) ;
  }
}
.es-pageNav--open{
  background-color: #ffffff;
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
  transition: all 0.2s ease-out;
  .es-pageNav-list--item{
    @include widthAndHeight(88px,56px);
    @include flex(center,center,wrap);
    @include margin(0,16px,0,0);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease-out;
  }
  .es-pageNav-list--open{
    height: 600px ;
  }
}
.es-pageNav-item--title{
  @include widthAndHeight(88px,56px);
  line-height: 56px;
}
.es-pageNav-item--box{
  height: 0;
  transition: height 0.2s ease-out;
  overflow: hidden;
}
.es-pageNav-item--box--open{
  height: auto;
}
.es-pageNav-item--text{
  @include widthAndHeight(88px,46px);
  @include padding(24px,0,0,0);
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
.es-pageNav-underline{
  @include widthAndHeight(88px,2px);
  background: rgba(255,255,255,0.9);
  border-radius: 2px 2px 0px 0px;
  @include absolute(1,56px,none,none,0);
  will-change: transform;
  transition: all 0.2s ease-out;
}
.es-pageNav-extra{
  @include widthAndHeight(100vw,0);
  background: #FFFFFF;
  will-change: transform;
  transition: all 0.2s ease-out;
  @include fixed(0,0,none,none,0);
  overflow: hidden;
}
.es-pageNav-extra--open{
  @include widthAndHeight(100vw,376px);
}
</style>
