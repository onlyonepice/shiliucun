<template>
  <div :class="[ns.b(),'animate__animated animate__fadeIn']">
    <div :class="[ns.b('top')]">
      <h3>基本信息</h3>
      <el-button type="primary" :class="ns.be('top','button')" @click='visibleInfo = true,visibleInfoSet = true,onGetUserInfo()'>编辑信息</el-button>
    </div>
    <div :class="[ns.b('content')]">
      <div :class="[ns.be('content','left')]">
        <div :class="ns.be('content','item')">
          <h5>真实姓名</h5>
          <div :class="ns.be('item','value')">{{ modifyInfoFreeze.realName }}</div>
        </div>
        <div :class="ns.be('content','item')">
          <h5>企业名称</h5>
          <div :class="ns.be('item','value')">{{ modifyInfoFreeze.company }}</div>
        </div>
        <div :class="ns.be('content','item')">
          <h5>岗位头衔</h5>
          <div :class="ns.be('item','value')">{{ modifyInfoFreeze.position }}</div>
        </div>
        <div :class="ns.be('content','item')">
          <h5>所在地区</h5>
          <div :class="ns.be('item','value')">{{ onGetRegionInfo }}</div>
        </div>
        <div :class="[ns.be('content','item'), ns.bem('content','item','special')]">
          <div>
            <h5>手机号码 | <span @click="onModifyMobile">修改</span></h5>
            <div :class="ns.be('item','value')">{{ modifyInfoFreeze.mobile }}</div>
          </div>
          <el-switch v-model="showInfo.mobile" @change="val=>{ return onChangeSwitch(val,'mobile') }" />
        </div>
        <div :class="[ns.be('content','item'),ns.bem('content','item','special')]">
          <div>
            <h5>微信号码</h5>
            <div :class="ns.be('item','value')">{{ modifyInfoFreeze.weCat }}</div>
          </div>
          <el-switch v-model="showInfo.weChat" @change="val=>{ return onChangeSwitch(val,'weChat') }" />
        </div>
        <div :class="[ns.be('content','item'),ns.bem('content','item','special')]">
          <div>
            <h5>常用邮箱</h5>
            <div :class="ns.be('item','value')">{{ modifyInfoFreeze.email }}</div>
          </div>
          <el-switch v-model="showInfo.email" @change="val=>{ return onChangeSwitch(val,'email') }" />
        </div>
      </div>
      <div :class="[ns.be('content','right')]">
        <div :class="[ns.be('right','bg')]"></div>
        <div>
          <h3 :class="ns.be('right','title')">{{ modifyInfoFreeze.realName }} | {{ modifyInfoFreeze.position }}</h3>
          <h5 :class="ns.be('right','company')">{{ modifyInfoFreeze.company }}</h5>
          <h5 v-if="showInfo.mobile" :class="[ns.be('right','common'),'animate__animated animate__fadeIn']">手机：{{ modifyInfoFreeze.mobile }}</h5>
          <h5 v-if="showInfo.weChat" :class="[ns.be('right','common'),'animate__animated animate__fadeIn']">微信：{{ modifyInfoFreeze.weCat }}</h5>
          <h5 v-if="showInfo.email" :class="[ns.be('right','common'),'animate__animated animate__fadeIn']">邮箱：{{ modifyInfoFreeze.email }}</h5>
        </div>
        <img :class="ns.be('right','headImgUrl')" :src="useUserStore().fileUrl + modifyInfo.companyLogo" alt="">
      </div>
    </div>
    <Dialog title="修改手机号" :visible='visibleMobile' width="560px" height='224px' @onHandleClose='onHandleClose' :confirmText='modifyMbStep === 1 ? "下一步" : "完成"'>
      <template #content>
        <div :class="ns.be('content','mbDialog')" v-if="modifyMbStep === 1">
          <span>手机号码</span>
          <el-input v-model="modifyInfo.mobile" maxlength="11" :class="ns.be('mbDialog','mobile')" placeholder="请输入" :disabled='true' />
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
    <Dialog v-if="visibleInfoSet" title="编辑信息" :visible='visibleInfo' width="560px" height='474px' @onHandleClose='onHandleCloseInfo' confirmText='保存'>
      <template #content>
        <div :class="ns.be('content','infoDialog')">
          <span required>真实姓名</span>
          <Select type="input" :defaultValue='modifyInfoFreeze.realName' @onChange="val=>{ return onChangeInfo(val,'realName') }" />
        </div>
        <div :class="ns.be('content','infoDialog')">
          <span required>企业名称</span>
          <Select type="input" :defaultValue='modifyInfoFreeze.company' @onChange="val=>{ return onChangeInfo(val,'company') }" />
        </div>
        <div :class="ns.be('content','infoDialog')">
          <span required>岗位头衔</span>
          <Select type="input" :defaultValue='modifyInfoFreeze.position' @onChange="val=>{ return onChangeInfo(val,'position') }" />
        </div>
        <div :class="ns.be('content','infoDialog')">
          <span >所在地区</span>
          <Select :options='areaList' :defaultValue='modifyInfoFreeze.regionCode' :cascaderOption='cascaderOption' type="cascader" @onChange="val=>{ return onChangeInfo(val,'regionCode') }" />
        </div>
        <div :class="ns.be('content','infoDialog')">
          <span >手机号码</span>
          <Select type="input" :defaultValue='modifyInfoFreeze.mobile' @onChange="val=>{ return onChangeInfo(val,'mobile') }" />
        </div>
        <div :class="ns.be('content','infoDialog')">
          <span >微信号码</span>
          <Select type="input" :defaultValue='modifyInfoFreeze.weCat' @onChange="val=>{ return onChangeInfo(val,'weCat') }" />
        </div>
        <div :class="ns.be('content','infoDialog')">
          <span >常用邮箱</span>
          <Select type="input" :defaultValue='modifyInfoFreeze.email' @onChange="val=>{ return onChangeInfo(val,'email') }" />
        </div>
      </template>
    </Dialog>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, Ref, watch, computed } from 'vue'
import useNamespace from '@/utils/nameSpace'
import { useUserStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { NOOP } from '@vue/shared'
import { regMobile, regEmail } from '@/utils/rule'
import { updateUserInfo, modifyMbCode, modifyMbCode1, verifyMbCode, modifyMb, getUserDetailInfo, getAreaApi, editUserInfoApi } from '@/api/user'
import { getInnermostObject } from '@/utils/index'
const ns = useNamespace('homePersonalInfo')
const userInfo: Ref<any> = ref({})
const visibleMobile: Ref<boolean> = ref(false) // 修改手机号弹窗
const visibleInfo: Ref<boolean> = ref(false) // 编辑信息弹窗
const visibleInfoSet: Ref<boolean> = ref(false) // 编辑信息弹窗-延迟
const btnDesc: Ref<string> = ref('获取验证码') // 倒计时文案
const areaList: Ref<any> = ref([]) // 地区数据
const cascaderOption: Ref<any> = ref({
  expandTrigger: 'hover',
  label: 'name',
  value: 'code',
  children: 'regionResps'
}) // 地区级联配置项
const modifyInfo: Ref<any> = ref({
  realName: '',
  company: '',
  position: '',
  regionCode: '',
  mobile: '',
  weCat: '',
  email: ''
}) // 修改信息
const modifyInfoFreeze: Ref<any> = ref({})
const timer = ref(null) // 定时器
const userDetailInfo: Ref<any> = ref() // 用户详细信息
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
  onGetUserInfo()
  onGetArea()
})
// 修改用户信息
const onChangeInfo = (value:any,type:string)=>{
  type === 'regionCode' && ( modifyInfo.value.regionCode = value[value.length - 1] )
  type !== 'regionCode' && ( modifyInfo.value[type] = value )
}
// 关闭编辑信息
const onHandleCloseInfo = async ( type:boolean )=>{
  const _modifyInfo = JSON.parse(JSON.stringify(modifyInfo.value))
  if( !type ){
    visibleInfo.value = false
    return setTimeout(()=>{visibleInfoSet.value = false},200)
  }
  if( _modifyInfo.realName === '' || _modifyInfo.company === '' || _modifyInfo.position === '' ){
    return ElMessage.error('请完善必填项')
  }
  if ( !_modifyInfo.mobile && !regMobile.test(_modifyInfo.mobile)) {
    return ElMessage.error('请输入正确手机号')
  }
  if ( !_modifyInfo.email && ( _modifyInfo.email !== null && _modifyInfo.email !== '' ) && !regEmail.test(_modifyInfo.email)) {
    return ElMessage.error('请输入正确邮箱')
  }
  if( _modifyInfo.email === null || _modifyInfo.email === '' ){
    delete _modifyInfo.email
  }
  const { resp_code }:any = await editUserInfoApi(_modifyInfo)
  if( resp_code === 0 ){
    ElMessage.success('编辑成功')
    visibleInfo.value = false
    setTimeout(()=>{visibleInfoSet.value = false},200)
    onGetUserInfo()
  }
}
// 获取用户详细信息
const onGetUserInfo = async() => {
  const { resp_code, datas } = await getUserDetailInfo()
  if( resp_code === 0 ){
    userDetailInfo.value = datas
    const _modifyInfo = modifyInfo.value
    // 重置用户信息
    Object.assign(_modifyInfo,datas)
    datas.region !== null && (_modifyInfo.regionCode = getInnermostObject(datas.region).code)
    modifyInfoFreeze.value = JSON.parse(JSON.stringify(_modifyInfo))
  }
}
// 获取用户地区信息
const onGetRegionInfo = computed(()=>{
  const info = userDetailInfo.value
  let _data = ''
  if( info === undefined || info.region === null ){
    _data = '未填写'
  }else{
    if( info.region.subRegion.subRegion.subRegion.subRegion === null ){
      _data = info.region.subRegion.subRegion.name + '/' + info.region.subRegion.subRegion.subRegion.name
    }else{
      _data = info.region.subRegion.subRegion.name + '/' + info.region.subRegion.subRegion.subRegion.name + '/' + info.region.subRegion.subRegion.subRegion.subRegion.name
    }
  }
  return _data
})
// 获取地区数据
const onGetArea = async() => {
  const { resp_code, datas }:any = await getAreaApi()
  resp_code === 0 && ( areaList.value = datas.records )
}
// 修改手机号
const onModifyMobile = () => {
  visibleMobile.value = !visibleMobile.value
}
// 点击取消或确定按钮
const onHandleClose = async (type: boolean) => {
  if( !type ){
    return onModifyMobile()
  }
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
      onGetUserInfo()
    }
  }
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
  onGetUserInfo()
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
  @include textOverflow();
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


.es-homePersonalInfo-content__infoDialog{
  @include widthAndHeight(512px,32px);
  @include flex();
  &>span{
    display: inline-block;
    line-height: 32px;
    @include widthAndHeight(72px,100%);
    text-align: right;
    margin-right: 8px;
  }
  span[required]::before {
    content: "*"; /* 添加一个星号作为标识符 */
    color: red; /* 可以根据需要设置颜色 */
    display: inline-block;
    margin-right: 4px;
  }
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
.es-homePersonalInfo-content__infoDialog{
  @include margin(0,0,16px,0);
  .select{
    flex: 1;
  }
  &:nth-last-child(1){
    @include margin(0,0,0,0);
  }
}
</style>