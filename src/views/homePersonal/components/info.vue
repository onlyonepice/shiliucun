<template>
  <div :class="[ns.b(),'animate__animated animate__fadeIn']">
    <div :class="[ns.b('top')]">
      <h3>基本信息</h3>
      <!-- <el-button type="primary" :class="ns.be('top','button')">编辑信息</el-button> -->
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
            <h5>手机号码 | <span @click="onModifyMobile">修改</span></h5>
            <div :class="ns.be('item','value')">{{ userInfo.mobile }}</div>
          </div>
          <el-switch v-model="showInfo.mobile" @change="val=>{ return onChangeSwitch(val,'mobile') }" />
        </div>
        <div :class="[ns.be('content','item'),ns.bem('content','item','special')]">
          <div>
            <h5>微信号码</h5>
            <div :class="ns.be('item','value')">{{ userInfo.weCat }}</div>
          </div>
          <el-switch v-model="showInfo.weChat" @change="val=>{ return onChangeSwitch(val,'weChat') }" />
        </div>
        <div :class="[ns.be('content','item'),ns.bem('content','item','special')]">
          <div>
            <h5>常用邮箱</h5>
            <div :class="ns.be('item','value')">{{ userInfo.email }}</div>
          </div>
          <el-switch v-model="showInfo.email" @change="val=>{ return onChangeSwitch(val,'email') }" />
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
    <Dialog title="修改手机号" :visible='visibleMobile' width="560px" height='224px' @onHandleClose='onHandleClose' :confirmText='modifyMbStep === 1 ? "下一步" : "完成"'>
      <template #content>
        <div :class="ns.be('content','mbDialog')" v-if="modifyMbStep === 1">
          <span>手机号码</span>
          <el-input v-model="userInfo.mobile" maxlength="11" :class="ns.be('mbDialog','mobile')" placeholder="请输入" :disabled='true' />
        </div>
        <div :class="ns.be('content','mbDialog')" v-else>
          <span>新手机号码</span>
          <el-input v-model="modifyMbForm.mobile" maxlength="11" :class="ns.be('mbDialog','mobile')" placeholder="请输入" />
        </div>
        <div :class="ns.be('content','mbDialog')">
          <span>验证码</span>
          <el-input v-model="modifyMbForm.code" :class="ns.be('mbDialog','code')" placeholder="请输入" />
          <div @click="onSendCode" maxlength="6" :class="[ns.bm('input','codeBtn'),btnDesc.indexOf('s') !== -1 ? ns.bm('input','down') : '']">{{ btnDesc }}</div>
        </div>
      </template>
    </Dialog>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, Ref, watch } from 'vue'
import useNamespace from '@/utils/nameSpace'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { NOOP } from '@vue/shared'
import { regMobile } from '@/utils/rule'
import { updateUserInfo, modifyMbCode, modifyMbCode1, verifyMbCode, modifyMb } from '@/api/user'
const ns = useNamespace('homePersonalInfo')
const userInfo: Ref<any> = ref({})
const visibleMobile: Ref<boolean> = ref(false) // 修改手机号弹窗
const btnDesc: Ref<string> = ref('获取验证码') // 倒计时文案
const timer = ref(null) // 定时器
const modifyMbForm: Ref<any> = ref({
  mobile: '',
  code: ""
}) // 修改手机号form表单
const modifyMbStep: Ref<number> = ref(1) // 修改手机号步骤
const showInfo: Ref<any> = ref({
  mobile: false,
  weChat: false,
  email: false
})
onMounted(()=>{
  userInfo.value = useUserStore().$state.userInfo
  showInfo.value.mobile = userInfo.value.mobileHide
  showInfo.value.weChat = userInfo.value.wecatHide
  showInfo.value.email = userInfo.value.emailHide
})
// 修改手机号
const onModifyMobile = () => {
  visibleMobile.value = !visibleMobile.value
}
// 点击取消或确定按钮
const onHandleClose = async (type: boolean) => {
  if( modifyMbStep.value === 1 ){
    const { resp_code }:any = await verifyMbCode({ smsCode: modifyMbForm.value.code })
    if( resp_code === 0 ){
      modifyMbStep.value = 2
      clearInterval(timer.value)
      modifyMbForm.value.code = ''
      btnDesc.value = '获取验证码'
    }
  }else{
    const { resp_code }:any = await modifyMb({ mobile: modifyMbForm.value.mobile, smsCode: modifyMbForm.value.code })
    if( resp_code === 0 ){
      ElMessage.success('修改成功')
      onModifyMobile()
      useUserStore().handleGetUserInfo()
    }
  }
  !type && onModifyMobile()
}
// 修改对外展示
const onChangeSwitch = async (val: boolean, type: string) => {
  if (type ==='mobile') {
    userInfo.value.mobileHide = val
  } else if (type === 'weChat') {
    userInfo.value.wecatHide = val
  } else if (type === 'email') {
    userInfo.value.emailHide = val
  }
  const { resp_code }:any = await updateUserInfo(userInfo.value)
  useUserStore().handleGetUserInfo()
  resp_code === 0 && ElMessage.success('修改成功')
}
// 倒计时

const countDown = ()=> {
  btnDesc.value = '60s 后可重发'
  timer.value = setInterval(() => {
    let seconds = Number(btnDesc.value.replace('s 后可重发', ''))
    seconds--
    btnDesc.value = seconds + 's 后可重发'
    if (seconds === 0) {
      clearInterval(timer.value)
      btnDesc.value = '重新获取'
    }
  }, 1000)
}
// 发送验证码
const onSendCode = async ()=> {
  try {
    if (btnDesc.value.indexOf('s') !== -1) {
      return false
    }
    if( modifyMbStep.value === 2 ){
      if (modifyMbForm.value.mobile === '') {
        return ElMessage.error('请输入手机号')
      }
      if (!regMobile.test(modifyMbForm.value.mobile)) {
        return ElMessage.error('请输入正确手机号')
      }
    }
    const { resp_code }:any = modifyMbStep.value === 1 ? await modifyMbCode() : await modifyMbCode1(modifyMbForm.value.mobile)
    if( resp_code === 0 ){
      ElMessage.success('发送成功')
      countDown()
    }
  } catch (error) {
    NOOP()
  }
}
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
  span{
    color: #244BF1;
    cursor: pointer;
  }
}
.es-homePersonalInfo-content__item--special{
  @include flex(center,space-between,nowrap);
}
.es-homePersonalInfo-content__mbDialog{
  @include flex(center,flex-start,nowrap);
  @include margin(0,0,16px,0);
  &:nth-last-child(1){
    @include margin(0,0,0,0);
  }
  span{
    display: inline-block;
    @include widthAndHeight(70px,22px);
    @include font(14px,400,rgba(0,0,0,0.6),22px);
    @include margin(0,8px,0,0);
    text-align: right;
  }
}
.es-homePersonalInfo-mbDialog__mobile{
  @include widthAndHeight(434px,32px);
}
.es-homePersonalInfo-mbDialog__code{
  @include widthAndHeight(346px,32px);
  flex: 1;
}
.es-homePersonalInfo-input--codeBtn{
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px,400,#244BF1,22px);
}
.es-homePersonalInfo-input--down{
  color: #999999;
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