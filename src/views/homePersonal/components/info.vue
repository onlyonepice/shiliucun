<template>
  <div :class="[ns.b(),'animate__animated animate__fadeIn']">
    <div :class="[ns.b('top')]">
      <h3>基本信息</h3>
      <el-button type="primary" :class="ns.be('top','button')">编辑信息</el-button>
    </div>
    <div :class="[ns.b('content')]">
      <div :class="[ns.be('content','left')]">
        <div :class="ns.be('content','item')">
          <h5>真是姓名</h5>
          <div :class="ns.be('item','value')">{{ userInfo.realName }}</div>
        </div>
        <div :class="ns.be('content','item')">
          <h5>企业名称</h5>
          <div :class="ns.be('item','value')">{{ userInfo.company }}</div>
        </div>
        <div :class="ns.be('content','item')">
          <h5>岗位类型</h5>
          <div :class="ns.be('item','value')">{{ userInfo.position }}</div>
        </div>
        <div :class="ns.be('content','item')">
          <h5>所在地区</h5>
          <div :class="ns.be('item','value')">{{ userInfo.position }}</div>
        </div>
        <div :class="[ns.be('content','item'), ns.bem('content','item','special')]">
          <div>
            <h5>手机号码 | <span>修改</span></h5>
            <div :class="ns.be('item','value')">{{ userInfo.mobile }}</div>
          </div>
          <el-switch v-model="showInfo.mobile" />
        </div>
        <div :class="[ns.be('content','item'),ns.bem('content','item','special')]">
          <div>
            <h5>微信号码</h5>
            <div :class="ns.be('item','value')">{{ userInfo.weCat }}</div>
          </div>
          <el-switch v-model="showInfo.weChat" />
        </div>
        <div :class="[ns.be('content','item'),ns.bem('content','item','special')]">
          <div>
            <h5>常用邮箱</h5>
            <div :class="ns.be('item','value')">{{ userInfo.email }}</div>
          </div>
          <el-switch v-model="showInfo.email" />
        </div>
      </div>
      <div :class="[ns.be('content','right')]">
        <div :class="[ns.be('right','bg')]"></div>
        <div>
          <h3 :class="ns.be('right','title')">{{ userInfo.realName }} | {{ userInfo.position }}</h3>
          <h5 :class="ns.be('right','company')">{{ userInfo.company }}</h5>
          <h5 v-if="showInfo.mobile" :class="[ns.be('right','common'),'animate__animated animate__fadeIn']">手机：{{ userInfo.mobile }}</h5>
          <h5 v-if="showInfo.weChat" :class="[ns.be('right','common'),'animate__animated animate__fadeIn']">微信：{{ userInfo.weCat }}</h5>
          <h5 v-if="showInfo.email" :class="[ns.be('right','common'),'animate__animated animate__fadeIn']">邮箱：{{ userInfo.email }}</h5>
        </div>
        <img :class="ns.be('right','headImgUrl')" :src="useUserStore().fileUrl + userInfo.headImgUrl" alt="">
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
import { useUserStore } from '@/store/modules/user'
const ns = useNamespace('homePersonalInfo')
const userInfo: Ref<any> = ref({})
const showInfo: Ref<any> = ref({
  mobile: false,
  weChat: false,
  email: false
})
onMounted(()=>{
  userInfo.value = useUserStore().$state.userInfo
  showInfo.value.mobile = !userInfo.value.mobileHide
  showInfo.value.weChat = !userInfo.value.wecatHide
  showInfo.value.email = !userInfo.value.emailHide
})
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-homePersonalInfo-top{
  @include flex(center,space-between);
  @include padding(0,0,19px,0);
  border-bottom: 1px solid #DBDCE2;
  @include margin(0,0,24px,0);
}
.es-homePersonalInfo-top__button{
  @include widthAndHeight(88px,32px);
}
.es-homePersonalInfo-content{
  @include flex(flex-start,space-between,nowrap);
}
.es-homePersonalInfo-content__right{
  @include widthAndHeight(392px,220px);
  box-shadow: 0px 4px 10px 0px rgba(0,0,0,0.1);
  border-radius: 8px;
  border: 1px solid #DBDCE2;
  @include margin(0,0,0,24px);
  @include relative();
  @include padding(24px,24px,24px,24px);
  overflow: hidden;
  @include flex(flex-start,space-between,nowrap);
}
.es-homePersonalInfo-right__bg{
  @include widthAndHeight(379.2px,60px);
  @include absolute(-1,0,0,none,none);
  background: linear-gradient( rgba(36,75,241,0.4), #ffffff);
  filter: blur(40px);
}
.es-homePersonalInfo-right__top{
  @include flex(center,space-between,nowrap);
}
.es-homePersonalInfo-right__title{
  @include font(20px,600,rgba(0,0,0,0.9),28px);
}
.es-homePersonalInfo-right__company{
  @include font(14px,400,rgba(0,0,0,0.6),22px);
  @include margin(8px,0,15px,0);
  padding-bottom: 16px;
  @include widthAndHeight(224px,39px);
  border-bottom: 1px solid #DBDCE2;
}
.es-homePersonalInfo-right__common{
  @include font(14px,400,rgba(0,0,0,0.6),22px);
  @include margin(0,0,8px,0);
}
.es-homePersonalInfo-right__headImgUrl{
  @include widthAndHeight(96px,96px);
  border-radius: 4px;
}
.es-homePersonalInfo-content__item{
  width: 394px;
  @include margin(0,0,24px,0);
  @include relative();
  .es-homePersonalInfo-item__value{
    @include font(14px,400,rgba(0,0,0,0.6),22px);
    @include margin(4px,0,0,0);
    @include textOverflow();
  }
  &:nth-last-child(1){
    @include margin(0,0,0,0);
  }
}
.es-homePersonalInfo-content__item--special{
  @include flex(center,space-between,nowrap);
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-homePersonalInfo{
  .el-switch::before{
    content: '对外展示';
    @include font(14px,400,rgba(0,0,0,0.9),22px);
    @include margin(0,8px,0,0);
  }
  .el-switch__core{
    @include widthAndHeight(44px,22px);
  }
}
</style>