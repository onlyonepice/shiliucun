<template>
  <Breadcrumb :breadcrumbList="breadcrumbList" />
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('header')">
      <img :src="TodayIcon" alt="" />
      <Select
        title=""
        :options="dateList"
        :defaultValue="choseDate"
        style="width: 160px"
        @onChange="
          (val) => {
            onChoseDate(val);
          }
        "
      />
    </div>
    <img :src="TodayDesc" alt="" :class="ns.be('header', 'desc')" />
    <div :class="ns.b('content')">
      <div :class="ns.be('content', 'left')">
        <div v-for="item in todayEnergyDataLeft" :key="item.tag">
          <h4>{{ item.tag }}</h4>
          <p
            v-for="_item in item.data"
            :key="_item.title"
            @click="handleGoEnterpriseDetails(item.tag, _item)"
          >
            {{ item.tag === "供需" ? _item.typeName + " | " : ""
            }}{{ _item.title }}
          </p>
        </div>
      </div>
      <div :class="ns.be('content', 'right')">
        <div v-for="item in todayEnergyDataRight" :key="item.tag">
          <h4>{{ item.tag }}</h4>
          <p
            v-for="_item in item.data"
            :key="_item.title"
            @click="handleGoEnterpriseDetails(item.tag, _item)"
          >
            {{ item.tag === "供需" ? _item.typeName + " | " : ""
            }}{{ _item.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref, onMounted } from "vue";
import TodayIcon from "@/assets/img/common/today-energy-icon.png";
import TodayDesc from "@/assets/img/common/today-energy-desc.png";
import { generateDatesBackward } from "@/utils/index";
import { getTodayEnergyStorageApi } from "@/api/home";
import { useRouter } from "vue-router";
import useNamespace from "@/utils/nameSpace";
const ns = useNamespace("todayEnergy");
const router = useRouter();
const todayEnergyDataLeft: Ref<Array<any>> = ref([]); // 今日储能数据源-左边
const todayEnergyDataRight: Ref<Array<any>> = ref([]); // 今日储能数据源-右边
const dateList: Ref<Array<any>> = ref([]); // 日期列表
const choseDate: Ref<string> = ref(generateDatesBackward(30)[0]); // 日期选择
const breadcrumbList: Ref<Array<any>> = ref([
  {
    text: "首页",
    path: "/home",
  },
  {
    text: "今日储能",
    path: "",
  },
]);
onMounted(() => {
  generateDatesBackward(30).forEach((item) => {
    dateList.value.push({
      value: item,
      label: item,
    });
  });
  getAmountData();
});
// 获取今日储能数据
const getAmountData = async () => {
  todayEnergyDataRight.value = [];
  todayEnergyDataLeft.value = [];
  const { resp_code, datas }: any = await getTodayEnergyStorageApi({
    homePage: false,
    date: choseDate.value,
  });
  if (resp_code === 0) {
    datas.forEach((item) => {
      if (item.tag === "供需" || item.tag === "招标" || item.tag === "政策") {
        todayEnergyDataRight.value.push(item);
      } else {
        todayEnergyDataLeft.value.push(item);
      }
    });
  }
};

// 选择日期
const onChoseDate = (data: any) => {
  choseDate.value = data;
  getAmountData();
};
const handleGoEnterpriseDetails = (type: String, data: any) => {
  switch (type) {
    case "热点":
      router.push(`/hotSpots?id=${data.id}`);
      break;
    case "供需":
      router.push(`/demandMatching/detail?id=${data.id}`);
      break;
    case "招标":
      router.push(
        `/dataTender?id=${data.id}&title=${encodeURIComponent(data.title)}`,
      );
      break;
    case "政策":
      router.push(
        `/policy?id=${data.id}&title=${encodeURIComponent(data.title)}`,
      );
      break;
    case "洞察":
      window.open(data.link, "externalWindow");
      break;
    case "动态":
      window.open(data.link, "externalWindow");
      break;
    default:
      break;
  }
};
</script>

<style lang="scss">
@import "@/style/mixin.scss";

.es-todayEnergy-header {
  @include flex(center, flex-start, nowrap);
  img {
    @include widthAndHeight(136px, 32px);
    margin-right: 8px;
  }
}
.es-todayEnergy-header__desc {
  @include widthAndHeight(214px, 30px);
}
.es-todayEnergy {
  .el-select .el-select__wrapper {
    background-color: #ffffff !important;
  }
}
.es-todayEnergy-content {
  @include flex(flex-start, space-between, nowrap);
  margin-top: 24px;
  &__left {
    width: 760px;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
  }
  &__right {
    width: 368px;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
  }
  h4 {
    margin-bottom: 8px;
  }
  p {
    @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
    margin-bottom: 16px;
    cursor: pointer;
  }
}
</style>
