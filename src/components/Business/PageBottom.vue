<template>
  <div :class="['es-commonPage', ns.b()]">
    <div :class="ns.b('introduce')">
      <div :class="ns.be('introduce','left')">
        <h3>关于「掌上储能」</h3>
        <p :class="ns.be('introduce','desc')">「掌上储能」是一款由储能领跑者联盟自主研发，服务于储能行业的专业工具类软件。致力于为行业提供专业的数据和报告服务。平台提供电价、招标、中标、政策、企业、产品等行业信息、数据的查询服务，也提供定期报告以及定制化的报告。</p>
      </div>
      <div :class="ns.be('introduce','right')">
        <h3>联系我们</h3>
        <p :class="ns.be('introduce','desc')">电话：021-3996 5066<br />地址：上海市嘉定区城北路1818号3号楼</p>
      </div>
    </div>
    <div :class="ns.b('info')">
      <img :class="ns.be('info','logo')" :src="LogoIconBlueBig" alt="">
      <div :class="ns.be('info','connect')">
        <div>
          <img :src="IReportMini" alt="">
          <span>「掌上储能」小程序</span>
        </div>
        <div>
          <img :src="IReportWeChat" alt="">
          <span>EESA储能云</span>
        </div>
      </div>
    </div>
    <p :class="ns.b('filing')">沪ICP备2022030943号-1</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { useRouter } from "vue-router";
import useNamespace from '@/utils/nameSpace'
import LogoIconBlueBig from '@/assets/img/common/logo-icon-blue-big.png'
import IReportMini from '@/assets/img/common/iReport-miniApp.png'
import IReportWeChat from '@/assets/img/common/iReport-weChat.png'
const ns = useNamespace('pageBottom')
onMounted(()=>{

})

</script>

<style scoped lang="scss">
@import "@/style/mixin.scss";
.es-pageBottom{
  height: 694px;
  background: #F9F9F9;
  @include padding(80px,0,80px,0);
}
.es-pageBottom-introduce{
  @include flex(flex-start,space-between,nowrap);
  @include padding(0,0,63px,0);
  border-bottom: 1px solid #DBDCE2;
}
.es-pageBottom-introduce__left{
  @include widthAndHeight(662px);
}
.es-pageBottom-introduce__desc{
  @include font(14px,400,rgba(0,0,0,0.6),22px);
  @include margin(16px,0,0,0);
}
.es-pageBottom-info{
  @include flex(flex-start,space-between);
}
.es-pageBottom-info__logo{
  @include widthAndHeight(172px,80px);
  @include margin(106px,0,0,0);
}
.es-pageBottom-info__connect{
  @include widthAndHeight(368px);
  @include flex(center,center,nowrap);
  text-align: center;
  img{
    @include widthAndHeight(172px,172px);
    @include margin(0,0,8px,0);
    &:nth-of-type(1){
      margin-right: 24px;
    }
  }
  span{
    @include font(14px,400,rgba(0,0,0,0.9),22px);
  }
}
.es-pageBottom-info{
  @include padding(56px,0,80px,0);
}
.es-pageBottom-filing{
  @include font(14px,400,rgba(0,0,0,0.6),22px);
  text-align: center;
}
</style>
<style lang="scss">
.es-pageBottom-introduce__left{
  h3{
    line-height: 28px;
  }
}
</style>
