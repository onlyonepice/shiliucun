
<template>
  <div :class="['es-commonPage',ns.b()]">
    <div v-for="item in paperList" :key="item.id" :class="ns.b('list')">
      <div :class="ns.bm('list','content')">
        <div :class="[ns.bm('content','year'),ns.bm('content','title')]">{{ item.reportName.split(' ')[0] }}年</div>
        <div :class="[ns.bm('content','title')]">{{ item.reportName.split(' ')[1] }}</div>
        <div :class="[ns.bm('content','line')]" />
        <div :class="[ns.bm('content','desc')]">{{ item.contentOverview }}</div>
        <div :class="[ns.bm('content','more')]">
          <div :class="[ns.bm('more','left')]">
            <img v-for="_item in item.compilationPartner" :key="_item" :src="useUserStore().fileUrl + _item" alt="">
          </div>
          <img :class="[ns.bm('more','right')]" :src="RightArrow" alt="" @click="onDetail(item)">
        </div>
      </div>
      <img :class="ns.bm('list','cover')" :src="useUserStore().fileUrl + item.reportCover" alt="">
    </div>
  </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getPaperList } from '@/api/report'
import useNamespace from '@/utils/nameSpace'
import { useUserStore } from '@/store/modules/user'
import RightArrow from '@/assets/img/common/right-arrow.png'
const { VITE_IREPOET_URL } = import.meta.env
const ns = useNamespace('whitePaper')
const paperList = ref([]) // 白皮书列表
// 获取白皮书列表
const getWhitePaperList = async () => {
  const { datas } = await getPaperList()
  paperList.value = datas
}
// 跳转白皮书详情
const onDetail = (data:any) => {
  window.open(`${VITE_IREPOET_URL}/#/report-detail-pdf_V2?id=${data.id}&parent=白皮书&moduleName=${data.moduleName}&from=/alliance-insight/white-paper`,'_blank')
}
onMounted(() => {
  getWhitePaperList()
})
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-whitePaper{
  padding-top: 80px;
  @include padding(80px,0,80px,0);
}
.es-whitePaper-list{
  @include flex(flex-start,center,nowrap);
}
.es-whitePaper-list--content{
  max-width: 760px;
  @include margin(0,24px,0,0);
  @include relative();
}
.es-whitePaper-content--title{
  @include font(36px,600,rgba(0,0,0,0.9),44px);
}
.es-whitePaper-content--line{
  @include widthAndHeight(32px,4px);
  background: linear-gradient( 90deg, #FF8D32 0%, rgba(255,141,50,0) 100%);
  @include margin(24px,0,56px,0);
}
.es-whitePaper-content--desc{
  @include font(16px,400,rgba(0,0,0,0.6),24px);
  @include margin(0,0,74px,0);
}
.es-whitePaper-content--more{
  @include flex(flex-start,space-between);
}
.es-whitePaper-more--left{
  img{
    @include widthAndHeight(auto,40px);
    @include margin(0,24px,0,0);
  }
}
.es-whitePaper-more--right{
  @include widthAndHeight(48px,48px);
  cursor: pointer;
}
.es-whitePaper-list--cover{
  @include widthAndHeight(368px,426px);
  object-fit: cover;

}
</style>