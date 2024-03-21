<template>
  <div :class="[ns.b()]" >
    <div v-if="protocolShow === ''" :class="[ns.b('content')]">
      <div :class="ns.b('top')">
        <img :src="LoginTopBg" :class="ns.bm('content','topBg')" />
        <div :class="ns.b('banner')">
          <p :class="ns.bm('banner','title')">
            <span>{{ loginType === 'password'? '欢迎使用iReport' : '微信登录' }}</span>
            <img :src="LoginCancel" @click="onCloseDialog(true)" />
          </p>
          <p :class="ns.bm('banner','desc')">{{ loginType === 'password'? '未注册手机号验证通过后将自动创建新账号' : '请使用微信扫描二维码登录' }}</p :class="ns.bm('banner','title')">
        </div>
      </div>
      <template v-if="loginType === 'password'">
        <el-input placeholder="手机号码" :class="[ns.bm('input','phone'),ns.bm('input','common')]" />
        <div v-if="!codeLogin" :class="ns.bm('input','code')">
          <el-input :class="[ns.bm('input','common'),ns.bm('input','commonCode')]" placeholder="验证码" />
          <span>获取验证码</span>
        </div>
        <div v-else :class="ns.bm('input','password')">
          <el-input :class="ns.bm('input','common')" :type="passwordShow ? 'password' : 'text'" placeholder="密码" />
          <img :src="passwordShow ? PasswordHidden : PasswordShow" @click="onChangePasswordShow" alt="">
        </div>
        <el-button :class="ns.b('loginBtn')" type="primary">登录/注册</el-button>
        <p :class="ns.b('switchBtn')" @click="onSwitch">{{ codeLogin ? '验证码登录' : '账号密码登录'}}</p>
        <!-- 其他登录方式 -->
        <div class="other-login">
          <div class="other-login__title">其他登录方式</div>
          <div class="other-login__icon-weChat" @click="handleSwitchLogin('weChat')" />
        </div>
      </template>
      <template v-else>
        <div class="weChat-login">
          <img :src="weChatImage" class="weChat-login-QRCode" />
          <p :class="ns.b('switchBtn')" @click="handleSwitchLogin('password')">账号密码登录</p>
        </div>
      </template>
      <!-- 底部 -->
      <div class="form-protocol">
        <p>注册即代表我已阅读并同意</p>
        <p class="agree-protocol">
          <span class="protocol" @click="handleSwitchProtocol('user')" >《用户服务协议》</span>
          <span>和</span>
          <span class="protocol" @click="handleSwitchProtocol('privacy')" >《隐私政策》</span>
        </p>
      </div>
    </div>
    <div v-else class="form-protocol__content" >
      <iframe
        class="protocol"
        :src="protocolShow === 'user' ? 'https://pdf.eesaexpo.com?file=https://oss.eesaenergy.com/protocol/user.pdf' : 'https://pdf.eesaexpo.com?file=https://oss.eesaenergy.com/protocol/privacy.pdf'"
        frameborder="0"
        width="100%"
        height="100%"
      ></iframe>
      <div class="content-footer">
        <div
          class="protocol__foot-continue"
          @click="handleSwitchProtocol('')"
        >同意并继续</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { getQrCode, pollLogin } from '@/api/user'
import useNamespace from '@/utils/nameSpace'
import LoginTopBg from '@/assets/img/login/login-top-bg.png'
import LoginCancel from '@/assets/img/common/cancel.png'
import PasswordShow from '@/assets/img/login/icon_password_show.png'
import PasswordHidden from '@/assets/img/login/icon_password_hidden.png'
const ns = useNamespace('login')
const emit = defineEmits(['onCancel'])
const loginType:Ref<string> = ref('password') // 其他登录方式 weChat: 微信 password: 密码
const protocolShow: Ref<string> = ref('') // 切换协议
const codeLogin: Ref<boolean> = ref(false) // 账号密码登录/验证码登录
const passwordShow: Ref<boolean> = ref(false) // 展示/隐藏密码
const weChatImage: Ref<any> = ref(null) // 微信二维码
const loginCode: Ref<string> = ref('') // 轮训结果二维码
const onCloseDialog = (type: boolean) => {
  emit('onCancel')
}
const handleSwitchProtocol = (type:string)=> {
  protocolShow.value = type
}
// 账号密码登录/微信登录
const handleSwitchLogin = (type)=> {
  loginType.value = type
  type === 'password' && onGetQrCode()
}
// 切换账号密码/验证码登录
const onSwitch = () => {
  codeLogin.value = !codeLogin.value
}
// 切换密码展示/隐藏
const onChangePasswordShow = () => {
  passwordShow.value =!passwordShow.value
}
// 获取微信登录二维码
const onGetQrCode = async() => {
  const blob:any = await getQrCode()
  const reader = new FileReader()
  reader.readAsDataURL(blob.data) // 转换为base64
  loginCode.value = blob.headers.logincode
  setTimeout(() => {
    weChatImage.value = reader.result
  }, 1000)
}
onGetQrCode()

// 轮询登录接口
const weChatLogin = async ()=> {
  try {
    if (loginCode.value !== '') {
      const { datas }:any = await pollLogin({ loginCode: loginCode.value })
      if ( datas.openId) {
        // login({ grant_type: 'openId', openId: datas.openId })
      }
    }
  } catch (error) {
    // error.resp_code === 2044 && this.dialogType && this.loginType === 'weChat' && this.weChatLogin()
  }
}
</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-login{
  @include widthAndHeight(100vw,100vh);
  background-color: rgba(0,0,0,0.4);
  @include fixed(99999,0,0,0,0);
  @include flex();
}
.es-login-content{
  @include widthAndHeight(360px,540px);
  @include relative();
  background-color: #fff;
  border-radius: 8px;
  padding: 0 24px 40px;
  box-sizing: border-box;
}
.es-login-content--topBg{
  @include widthAndHeight(100%,120px);
  @include absolute(-1,0,0,none,none);
}
.es-login-banner{
  padding-top: 32px;
}
.es-login-banner--title{
  @include font(20px,600,rgba(0,0,0,0.9));
  @include flex(center,space-between);
  img{
    @include widthAndHeight(28px,28px);
    cursor: pointer;
  }
}
.es-login-banner--desc{
  @include font(12px,400,rgba(0,0,0,0.6));
}
.es-login-loginBtn{
  @include widthAndHeight(100%,40px);
  background-color: #165DFF;
  border-radius: 4px;
  text-align: center;
  @include font(16px,400,#ffffff,40px);
  @include margin(16px,0,4px,0);
  cursor: pointer;
}
.es-login-switchBtn {
  background-color: transparent;
  text-align: center;
  margin-bottom: 25px;
  @include font(14px,400,#244BF1,22px);
  cursor: pointer;
}
.es-login-input--common{
  height: 40px;
}
.es-login-input--phone{
  @include margin(50px,0,20px,0);
}
.es-login-input--code{
  @include margin(0,0,20px,0);
  @include flex(center,space-between,nowrap);
  span{
    cursor: pointer;
    width: 136px;
    height: 40px;
    padding-left: 10px;
    @include font(14px,500,#165dff,40px);
  }
}
.es-login-input--password{
  @include margin(0,0,20px,0);
  @include relative();
  img{
    @include widthAndHeight(24px,24px);
    @include absolute(1,8px,8px,none,none);
    cursor: pointer;
  }
}



// 其他登录方式
.other-login{
  margin-bottom: 16px;
  .other-login__title{
    display: flex;
    align-items: center;
    @include font(12px, 400, rgba(0,0,0,.4), 20px);
    &::before{
      content: '';
      display: inline-block;
      width: 104px;
      height: 1px;
      background: #DBDCE2;
      margin-right: 16px;
    }
    &::after{
      content: '';
      display: inline-block;
      width: 104px;
      height: 1px;
      background: #DBDCE2;
      margin-left: 16px;
    }
  }
  .other-login__icon-weChat{
    width: 40px;
    height: 40px;
    background: #F2F3F5;
    margin: 8px auto 16px;
    background-image: url("@/assets/img/common/weChat-icon.png");
    background-size: 32px 32px;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    border-radius: 50%;
  }
}

.form-protocol {
  @include fontSize(12px);
  text-align: center;
  overflow: hidden;

  .agree-protocol {
    .protocol {
      @include color(#FF8D32 );
      cursor: pointer;
    }
  }
}
.form-protocol__content {
  width: 650px;
  height: 700px;
  position: relative;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background-color: #fff;
  z-index: 5000;
  padding-bottom: 70px;
  .content-footer {
    position: absolute;
    bottom: 0;
    text-align: right;
    padding: 16px 0;
    width: 100%;
    background: #fff;
    .protocol__foot-continue{
      font-size: 16px;
      margin-right: 24px;
      background: #244BF1;
      border-radius: 4px;
      color: rgba(255,255,255,0.9);
      text-align: center;
      display: inline-block;
      padding: 8px 16px;

      &:hover{
        background: #4079FC;
        cursor: pointer;
        color: rgba(255,255,255,0.9);
      }
      &:active{
        background: #0945CD;
      }
    }
  }
}
.weChat-login{
text-align: center}
.weChat-login-QRCode{
  @include widthAndHeight(200px,200px);
  @include margin(89px,auto,25px,auto);
}
</style>
