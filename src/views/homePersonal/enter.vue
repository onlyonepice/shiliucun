<template>
  <div :class="[ns.b()]">
    <breadcrumb :breadcrumbList="breadcrumbList" />
    <div :class="['es-commonPage',ns.b('content')]">
      <h1>个人中心。</h1>
      <div :class="ns.b('box')">
        <div :class="ns.be('box','left')">
          <div :class="ns.be('left','tab')">
            <div v-for="item in tabList" :key="item.id" :class="choseTab === item.id ? ns.bem('left','tab','chose') : ''">
              <img :src="choseTab === item.id ? item.iconChose : item.icon" alt="">
              <p>{{ item.text }}</p>
            </div>
          </div>
          <div :class="ns.bm('left','list')"></div>
        </div>
        <div :class="ns.bm('box','right')"></div>
      </div>
    </div>
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
import Logout from '@/assets/img/homePersonal/logout.png'
const ns = useNamespace('homePersonal')
const route = useRoute()

const breadcrumbList: Ref<Array<any>> = ref([
  { text: '首页',path: '/home' },
  { text: '个人中心',path: '' }
])
const tabList: Ref<Array<any>> = ref([
  { id: 1, text: '基本信息', iconChose: InfoChose, icon: Info },
  { id: 2, text: '我的收藏', iconChose: CollectionChose, icon: Collection },
  { id: 3, text: '我的订单', iconChose: OrderChose, icon: Order },
  { id: 4, text: '修改密码', iconChose: PasswordChose, icon: Password },
  { id: 5, text: '退出登录', icon: Logout }
])
const choseTab: Ref<number> = ref(1)
watch(
  () => route.query.id,
  (val: string) => {
    choseTab.value = Number(val)
  },
  { immediate: true }
)
onMounted(()=>{
  route.query.id && ( choseTab.value = Number(route.query.id) )
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
