<template>
  <nav :class="[ns.b(), choseExtra ? ns.m('open') : '']">
    <!-- 子菜单栏展开背景图 -->
    <div :class="[ns.b('extra'), choseExtra ? ns.bm('extra','open') : '' ] "></div>
    <div :class="['es-commonPage', ns.b('content')]">
      <img :src="choseExtra || !opacityBg ? LogoIconBlue : LogoIcon" alt="">
      <div :class="[ns.b('list')]" @mouseleave="onChoseLeave()">
        <div
          v-for="item in navList" :key="item.id"
          @mouseenter="onChoseNav(item.id, item.path)"
          :class="[ ns.bm('list','item'), optionChildren ? ns.bm('list--item','chose') : '' ]"
        >
          <div :class="ns.bm('item','title')">
            <span>{{ item.text }}</span>
            <div :class="[ns.b('underline')]"></div>
          </div>
          <div :class="ns.bm('item','box')" >
            <div v-for="_item in item.children" :key="_item.id">
              <div :class="ns.bm('item','text')" @click="onChildrenPath(_item.path)">
                {{ _item.text }}
              </div>
            </div>
          </div>
        </div>
        <!-- 登录/注册 -->
        <p :class="ns.b('login')" @click="onLogin">登录/注册</p>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
interface NavList {
  children?: Array<NavList>;
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
const router = useRouter();
const route = useRoute();
const choseNav: Ref<string> = ref(''); // 选中的导航标签
const choseNavId: Ref<number> = ref(1); // 选中的导航栏id
const choseExtra: Ref<boolean> = ref(false); // 打开下拉菜单
const choseExtraContent: Ref<boolean> = ref(false); // 打开下拉菜单
const emit = defineEmits(['onLogin'])
const props = defineProps({
  opacityBg: {
    type: Boolean,
    default: false
  }
})
// 导航栏数组
const navList: Ref<Array<NavList>> = ref([
  { id: 1, text: '首页', path: ["/home",],
    children: []
  },
  { id: 2, text: '报告', path: ["/report",'/reportDetail','','',''],
    children: [
      { id: 1, text: '行业洞察', path: '/report?source=行业洞察' },
      { id: 2, text: '季报月报', path: '/report?source=季报月报' },
      { id: 3, text: '原创报告', path: '/reportOnLine?source=原创报告' },
      { id: 4, text: '白皮书', path: '/reportWhitePaper' }
    ]
  },
  { id: 3, text: '数据', path: ["/data"],
    children: [
      { id: 1, text: '招标', path: '/report?source=行业洞察' },
      { id: 2, text: '中标', path: '/report?source=季报月报' },
      { id: 3, text: '电价', path: '/report?source=原创报告' },
      { id: 4, text: '政策', path: '/report?source=白皮书' },
      { id: 5, text: '行业数据库', path: '/report?source=白皮书' },
    ]
  },
  { id: 4, text: '分析', path: ["/analyze"],
    children: [
      { id: 1, text: '工商业投资测算', path: '/report?source=行业洞察' },
    ]
  },
  { id: 5, text: '企业', path: ["/enterprise"],
    children: [
      { id: 1, text: '产业链地图', path: '/report?source=行业洞察' },
    ]
  },
  { id: 6, text: '资源', path: ["/resource"],
    children: [
      { id: 1, text: '融资方案', path: '/report?source=行业洞察' },
      { id: 2, text: '供需对接', path: '/report?source=行业洞察' },
    ]
  },
  { id: 7, text: '开通VIP', path: ["/vip"],
    children: []
  }
])
// 选择导航栏
const onChoseNav = (id: number,path: Array<string> | string) => {
  choseNavId.value = id
  choseExtra.value = true
  choseExtraContent.value = true
}
const onChoseLeave = () => {
  choseExtra.value = false
}
const optionChildren: Ref<boolean> = ref(false)
// 子路由跳转
const onChildrenPath = (path: string | Array<string>) => {
  optionChildren.value = true
  if( route.path !== path || route.path !== path[0] ){
    router.push(Array.isArray(path) ? path[0] : path)
    onChoseLeave()
    setTimeout(()=>{
      optionChildren.value = false
    })
  }
}
// 监听路由改变
watch(
  () => route.path,
  (path) => {
    choseNav.value = path
  },
  { immediate: true },
)

// 判断是否要选中某个导航
const isChoseNav = computed(() => {
  return (list: any) => {
    return list.some((item: string) => item.includes(choseNav.value))
  }
})
const onLogin = () => {
  emit('onLogin')
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-pageNav{
  height: 56px;
  background-color: rgba(255,255,255,1);
  @include flex();
  transition: all 0.2s linear;
}
.es-pageNav--opacity{
  .es-pageNav-list{
    div{
      color: rgba(255,255,255,0.55);
    }
    .es-pageNav-list--chose{
      color: rgba(255,255,255,0.9);
    }
  }
  .es-pageNav-login{
    color: rgba(255,255,255,0.55) ;
  }
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
  }
  .es-pageNav-login{
    color: rgba(0,0,0,0.9);
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
    @include flex(flex-start,center,wrap);
    @include margin(0,16px,0,0);
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease-out;
    .es-pageNav-underline{
      @include widthAndHeight(0,2px);
      background-color: #244BF1;
      border-radius: 2px 2px 0px 0px;
      will-change: transform;
      overflow: hidden;
      transition: width 0.3s ease-in-out;
      @include margin(0,auto,0,auto);
    }
    &:hover .es-pageNav-underline{
      @include widthAndHeight(88px,2px);
    }
    .es-pageNav-item--box{
      height: 0;
      opacity: 0;
      transition: all 0.5s linear;
      overflow: hidden;
    }
    &:hover .es-pageNav-item--box{
      height: auto;
      opacity: 1;
    }
  }
  .es-pageNav-list--item--chose{
    .es-pageNav-item--box{
      height: 0 !important;
      opacity: 0 !important;
    }
  }
}
.es-pageNav-item--title{
  @include widthAndHeight(88px,56px);
  line-height: 56px;
  @include relative();

}
.es-pageNav-item--text{
  @include widthAndHeight(88px,46px);
  @include padding(24px,0,0,0);
  &:hover{
    font-weight: 600;
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
  cursor: pointer;
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
