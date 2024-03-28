<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="['es-commonPage',ns.b('content')]">
      <h1>个人中心。</h1>
      <div :class="ns.b('box')">
        <div :class="ns.be('box','left')">
          <div :class="ns.be('left','tab')">
            <div v-for="item in tabList" :key="item.id" :class="choseTab === item.id ? ns.bem('left','tab','chose') : ''" @click="onClickTab(item.id)">
              <img :src="choseTab === item.id ? item.iconChose : item.icon" alt="">
              <p>{{ item.text }}</p>
            </div>
          </div>
          <div :class="ns.bm('left','list')"></div>
        </div>
        <div :class="ns.bm('box','right')" v-if="useUserStoreHook().$state.userInfo.id !== undefined">
          <infoComponent v-if="choseTab === 1" />
          <collectionComponent v-if="choseTab === 2"  />
          <orderComponent v-if="choseTab === 3"  />
          <passwordComponent v-if="choseTab === 4"  />
        </div>
      </div>
    </div>
    <Logout :visible="visible" @onHandleClose="onHandleClose" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
import useNamespace from '@/utils/nameSpace'
import Info from '@/assets/img/homePersonal/info.png'
import InfoChose from '@/assets/img/homePersonal/info-chose.png'
import Collection from '@/assets/img/homePersonal/collection.png'
import CollectionChose from '@/assets/img/homePersonal/collection-chose.png'
import Order from '@/assets/img/homePersonal/order.png'
import OrderChose from '@/assets/img/homePersonal/order-chose.png'
import Password from '@/assets/img/homePersonal/password.png'
import PasswordChose from '@/assets/img/homePersonal/password-chose.png'
import LogoutImg from '@/assets/img/homePersonal/logout.png'
import { useUserStoreHook } from "@/store/modules/user"
import infoComponent from './components/info.vue'
import collectionComponent from './components/collection.vue'
import orderComponent from './components/order.vue'
import passwordComponent from './components/password.vue'
const ns = useNamespace('homePersonal')
const { VITE_IREPOET_URL } = import.meta.env
const route = useRoute()
const router = useRouter()
const breadcrumbList: Ref<Array<any>> = ref([
  { text: '首页',path: '/home' },
  { text: '个人中心',path: '' }
])
const tabList: Ref<Array<any>> = ref([
  { id: 1, text: '基本信息', iconChose: InfoChose, icon: Info },
  { id: 2, text: '我的收藏', iconChose: CollectionChose, icon: Collection },
  { id: 3, text: '我的订单', iconChose: OrderChose, icon: Order },
  { id: 4, text: '修改密码', iconChose: PasswordChose, icon: Password },
  { id: 5, text: '退出登录', icon: LogoutImg }
])
const choseTab: Ref<number> = ref(1)
const visible: Ref<boolean> = ref(false)
watch(
  () => route.query.id,
  (val: string) => {
    choseTab.value = Number(val)
  },
  { immediate: true }
)
// 点击左侧边栏
const onClickTab = (id: number) => {
  if( id !== 5 ){
    choseTab.value = id
  }else{
    visible.value = true
  }
}
// 退出登录
const onHandleClose = (type: boolean) => {
  visible.value = false
  if( type ){
    useUserStoreHook().logOut()
    router.push({ path: '/home' })
  }
}
// 监听路由变化
onMounted(()=>{
  choseTab.value = Number(route.query.id)
})
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonal-content{
  @include padding(56px,0,80px,0);
}
.es-homePersonal-box{
  @include flex(flex-start,flex-start,nowrap);
  @include margin(32px,0,0,0);
}
.es-homePersonal-box__left{
  @include widthAndHeight(270px);
  @include margin(0,24px,0,0);
}
.es-homePersonal-box--right{
  background: #FFFFFF;
  border-radius: 8px;
  @include padding(24px,24px,24px,24px);
  flex: 1;
}
.es-homePersonal-left__tab{
  @include widthAndHeight(100%,296px);
  background: #FFFFFF;
  border-radius: 8px;
  @include padding(24px,16px,24px,16px);
  div{
    @include widthAndHeight(238px,32px);
    @include margin(0,auto,8px,auto);
    @include padding(5px,0,5px,8px);
    @include flex(center,flex-start);
    @include font(14px,400,rgba(0,0,0,0.6),22px);
    cursor: pointer;
    img{
      @include widthAndHeight(20px,20px);
      @include margin(0,8px,0,0);
    }
    &:nth-last-of-type(1){
      @include margin(64px,0,0,0);
    }
  }
  .es-homePersonal-left__tab--chose{
    @include font(14px,600,rgba(0,0,0,0.9),22px);
  }
}

</style>
