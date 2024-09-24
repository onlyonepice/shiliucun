<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <Skeleton v-if="homeLoading" />
    <div v-else :class="ns.b('homeContent')">
      <div :class="ns.b('homeSupplyDemandDocking')">
        <div :class="ns.b('homeSupplyDemandDockingLeft')">
          <div :class="ns.b('homeSupplyDemandDockingTop')">
            <div
              :class="ns.b('homeSupplyDemandDockingItem')"
              :style="{ background: item.bgc }"
              v-for="item in functionNav"
              @click="onFunctionNav(item)"
              :key="item.title"
            >
              <img :src="item.icon" alt="" />
              {{ item.title }}
            </div>
          </div>
          <div :class="ns.b('homeSupplyDemandDockingBottom')">
            <div
              :class="ns.b('homeSupplyDemandDockingItem')"
              v-for="item in functionNavTwo"
              @click="onFunctionNav(item)"
              :key="item.title"
            >
              <img :src="item.icon" alt="" />
              <p>{{ item.title }}</p>
            </div>
          </div>
        </div>
        <div :class="ns.b('homeSupplyDemandDockingRight')">
          <div :class="ns.b('homeTopSearch')">
            <el-input
              v-model="searchContent"
              placeholder="请输入关键字…"
              @keyup.enter="onSearch"
              autocomplete="off"
              :disabled="useUserStore().$state.openLoginVisible"
            />
            <div :class="ns.b('homeTopSearchIcon')" @click.stop="onSearch">
              搜索
            </div>
          </div>
          <div :class="ns.b('amount')" @click="onDemandHallTitle">
            <img
              src="@/assets/img/home/home-supply-demand-docking.png"
              alt=""
            />
            <div :class="ns.be('amount', 'list')">
              <img :src="AmountImg" alt="" />
              <div>
                <span>{{ amountData.alreadyEnded }}</span>
                <p>已解决需求</p>
              </div>
              <div>
                <span>{{ amountData.pendingDemand }}</span>
                <p>待解决需求</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div :class="ns.b('demandHall')">
        <div :class="ns.b('demandHallLeft')">
          <img
            @click="onReportWhitePaper"
            src="@/assets/img/home/home-demandHall.png"
            alt=""
          />
        </div>
        <div :class="ns.b('demandHallRight')">
          <div :class="ns.b('demandHallTitle')">
            <div :class="ns.b('demandHallTitleLeft')">
              <span>今日储能</span>
              <el-dropdown>
                <div
                  class="el-dropdown"
                  @mouseenter="hotSpotsUpType = true"
                  @mouseleave="hotSpotsUpType = false"
                >
                  <span class="el-dropdown-link">{{ choseDate }}</span>
                  <img
                    class="el-dropdown-icon"
                    :src="hotSpotsUpType ? HotSpotsUp : HotSpotsDown"
                    alt=""
                  />
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-scrollbar height="144px">
                      <el-dropdown-item
                        v-for="item in dateList"
                        :key="item"
                        @click="
                          choseDate = item;
                          getAmountData();
                        "
                        >{{ item }}</el-dropdown-item
                      >
                    </el-scrollbar>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <el-scrollbar height="343px">
            <div
              v-for="item in todayEnergyData"
              :key="item"
              :class="ns.b('demandHallContent')"
            >
              <h4>· {{ item.tag }}</h4>
              <p
                v-for="_item in item.data"
                :key="_item.id"
                @click="onDetailReport(item.tag, _item)"
              >
                {{ item.tag === "供需" ? _item.typeName + " | " : ""
                }}{{ _item.title }}
              </p>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div :class="ns.b('enterprise')">
        <div :class="ns.b('enterpriseTitle')">明星企业</div>
        <swiper
          :modules="modules"
          :space-between="8"
          :autoplay="autoplay"
          class="swiperBox swiperStar"
          ref="starSwiper"
          :navigation="{
            nextEl: '.starSwiper-next',
            prevEl: '.starSwiper-prev',
          }"
          :pagination="pagination"
        >
          <swiper-slide
            v-for="(data, i) in Math.ceil(logoList.length / 18)"
            :key="i"
          >
            <div :class="ns.b('enterpriseContent')">
              <template v-for="(item, index) in logoList" :key="index">
                <div
                  v-if="index >= i * 18 && index < (i + 1) * 18"
                  :class="ns.b('enterpriseItem')"
                  @click="handleGoEnterpriseDetails(item)"
                >
                  <img
                    :key="item"
                    :src="useUserStoreHook().$state.fileUrl + item.logoUrl"
                    alt=""
                  />
                </div>
              </template>
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div :class="ns.b('product')">
        <div :class="ns.b('productTitle')">产品动态</div>
        <swiper
          :modules="modules"
          :space-between="24"
          :pagination="pagination"
          :autoplay="autoplay"
          class="swiperBox"
          @slideChange="onSlideChange"
          :navigation="{
            nextEl: '.productSwiper-next',
            prevEl: '.productSwiper-prev',
          }"
        >
          <template v-for="(group, i) in productList" :key="i">
            <swiper-slide>
              <div :class="ns.b('productContent')" v-if="group.length">
                <div
                  :class="ns.b('productItem')"
                  v-for="(item, index) in group"
                  @click="handleGoDetails(item)"
                  :key="index"
                >
                  <img
                    v-if="item.logoUrl"
                    :class="ns.b('productItemLogo')"
                    :src="useUserStoreHook().$state.fileUrl + item.logoUrl"
                    alt=""
                  />
                  <div :class="ns.be('productItem', 'img-box')">
                    <img
                      v-if="item.image?.length"
                      :src="useUserStoreHook().$state.fileUrl + item.image[0]"
                      alt=""
                    />
                    <img
                      v-else
                      src="@/assets/img/common/empty-product-img.png"
                      alt=""
                    />
                  </div>
                  <div :class="ns.b('productItemDecs')">
                    <div :class="ns.b('productItemPrice')">
                      参考价
                      <span style="color: #f75964">¥</span>
                      <span
                        style="
                          color: #f75964;
                          font-weight: 600;
                          font-size: 20px;
                        "
                      >
                        1200/kWh起
                      </span>
                    </div>
                    <div :class="ns.b('productItemName')" :title="item.name">
                      {{ item.name }}
                    </div>
                    <div :class="ns.b('productItemCompany')">
                      {{ item.enterprise }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else
                style="
                  height: 388px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 40px;
                "
                :class="ns.b('productContent')"
              />
            </swiper-slide>
          </template>
        </swiper>
      </div>
    </div>
  </div>
  <UpdateLog />
</template>

<script lang="ts" setup>
import "swiper/css";
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { getToken } from "@/utils/auth";
import useNamespace from "@/utils/nameSpace";
import { generateDatesBackward } from "@/utils/index";
import { Swiper, SwiperSlide } from "swiper/vue";
import { useUserStore } from "@/store/modules/user";
import { useUserStoreHook } from "@/store/modules/user";
import Skeleton from "./homeComponents/skeleton.vue";
import HotSpotsUp from "@/assets/img/common/hotSpots-up.png";
import HotSpotsDown from "@/assets/img/common/hotSpots-down.png";
import { getProductListApi } from "@/api/searchProduct";
import {
  getHomePage,
  frontSelectList,
  getNeedAmountApi,
  getTodayEnergyStorageApi,
} from "@/api/home";
import homeNav_1 from "@/assets/img/home/home-nav-1.png";
import homeNav_2 from "@/assets/img/home/home-nav-2.png";
import homeNav_3 from "@/assets/img/home/home-nav-3.png";
import homeNavBottom_1 from "@/assets/img/home/home-nav-bottom-1.png";
import homeNavBottom_2 from "@/assets/img/home/home-nav-bottom-2.png";
import homeNavBottom_3 from "@/assets/img/home/home-nav-bottom-3.png";
import homeNavBottom_4 from "@/assets/img/home/home-nav-bottom-4.png";
import homeNavBottom_5 from "@/assets/img/home/home-nav-bottom-5.png";
import homeNavBottom_6 from "@/assets/img/home/home-nav-bottom-6.png";
import homeNavBottom_7 from "@/assets/img/home/home-nav-bottom-7.png";
import homeNavBottom_8 from "@/assets/img/home/home-nav-bottom-8.png";
import AmountImg from "@/assets/img/home/amount-bg.png";
import { Controller, Autoplay, Navigation, Pagination } from "swiper/modules";
const modules = [Controller, Autoplay, Navigation, Pagination];
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
const starSwiper = ref(); // 轮播图
const autoplay: any = ref({
  delay: 3000,
  pauseOnMouseEnter: false,
  disableOnInteraction: false,
});
const router = useRouter();
const ns = useNamespace("home");
const productList = ref([]);
const homeLoading: Ref<Boolean> = ref(false); // 需求量加载
const demandHallList = ref([]);
const searchContent: Ref<string> = ref("");
const logoList = ref([]);
const hotSpotsUpType = ref(false); // 需求量向上
const amountData: Ref<any> = ref({
  pendingDemand: 0,
  alreadyEnded: 0,
}); // 需求量
const params = {
  limit: 4,
  sortType: 1,
  sortMethod: false,
  enterpriseIds: null,
  coolingMethodIds: null,
  productType: "INDUSTRY_ENERGY_STORAGE",
};
const pagination = ref({
  clickable: true,
  renderBullet: function (index, className) {
    return `<span class="${className}"></span>`;
  },
});
const functionNav = ref([
  {
    title: "企业库",
    path: VITE_INDUSTRIALMAP_URL,
    icon: homeNav_1,
    bgc: "linear-gradient( 135deg, #F7FCFC 0%, #E7F7F6 100%)",
  },
  {
    title: "产品库",
    path: "/searchProduct",
    icon: homeNav_2,
    bgc: "linear-gradient( 90deg, #FFFCF6 0%, #FFF6E4 100%)",
  },
  {
    title: "查电价",
    path: "/electricityPrice",
    icon: homeNav_3,
    bgc: "linear-gradient( 90deg, #FFFAF5 0%, #FFF0E1 100%)",
  },
]);
const functionNavTwo = ref([
  { title: "项目", path: "/dataProject", icon: homeNavBottom_1 },
  { title: "招标", path: "/dataTender", icon: homeNavBottom_2 },
  { title: "中标", path: "/dataWinningBid", icon: homeNavBottom_3 },
  { title: "政策", path: "/policy", icon: homeNavBottom_4 },
  { title: "行业洞察", path: "/industryInsight", icon: homeNavBottom_5 },
  {
    title: "在线报告",
    path: "/reportOnLine?source=在线报告",
    icon: homeNavBottom_6,
  },
  {
    title: "周月季报",
    path: "/quarterlyMonthlyReports",
    icon: homeNavBottom_7,
  },
  { title: "工商业测算", path: "/calculationBasic", icon: homeNavBottom_8 },
]);
const dateList: Ref<Array<any>> = ref(generateDatesBackward(30)); // 日期列表
const choseDate: Ref<string> = ref(generateDatesBackward(30)[0]); // 日期选择
// 搜索事件
const onSearch = () => {
  if (searchContent.value === "") {
    return;
  }
  router.push({
    name: "HomeSearchDetail",
    params: { searchContent: searchContent.value },
  });
  window.trackFunction("pc_Home_Search_click");
};
// 查看热点详情
const onDetailReport = (type: String, data: any) => {
  switch (type) {
    case "热点":
      router.push(`/hotSpots?id=${data.id}`);
      break;
    case "供需":
      router.push(`/demandMatching/detail?id=${data.id}`);
      break;
    case "招标":
      router.push(`/dataTender?id=${data.id}&title=${data.title}`);
      break;
    case "政策":
      router.push(`/policy?id=${data.id}&title=${data.title}`);
      break;
    case "洞察":
      window.open(data.link, "externalWindow");
      break;
    default:
      break;
  }
};
const todayEnergyData: Ref<Array<any>> = ref([]);
// 获取今日储能数据
const getAmountData = async () => {
  const { resp_code, datas }: any = await getTodayEnergyStorageApi({
    homePage: false,
    date: choseDate.value,
  });
  if (resp_code === 0) {
    todayEnergyData.value = datas;
  }
};
getAmountData();

function handleGoDetails(row) {
  if (!getToken()) {
    useUserStore().openLogin(true);
    return;
  }
  router.push(
    `/searchProductDetail?id=${row.id}&productType=INDUSTRY_ENERGY_STORAGE`,
  );
}

// function handleGoDemandDetails(row) {
//   router.push(`/demandMatching/detail?id=${row.id}&source=home`);
// }

function onDemandHallTitle() {
  router.push("/demandMatching/list");
}

function onReportWhitePaper() {
  router.push("/reportWhitePaper");
}

function handleGoEnterpriseDetails(row) {
  window.open(
    `${VITE_INDUSTRIALMAP_URL}/home?enterpriseId=${row.id}`,
    "_blank",
  );
}

function onFunctionNav(row) {
  if (row.path.includes("http")) {
    window.open(row.path, "_blank");
  } else {
    router.push(row.path);
  }
}

const totalPages = ref(0); // 产品动态
async function getProductList(page) {
  const { datas } = await getProductListApi({ page, ...params });
  if (page === 1)
    for (let i = 0; i < datas.totalPages; i++) {
      productList.value.push([]);
    }
  totalPages.value = datas.totalPages;
  productList.value[page - 1] = datas.content;
  if (page === 1) {
    if (datas.totalPages > 1) {
      getProductList(2);
    }
    if (datas.totalPages >= 3) {
      getProductList(datas.totalPages);
    }
  } else {
    return;
  }
}
async function onSlideChange({ realIndex }) {
  changeGetProductList(realIndex);
}
async function changeGetProductList(page) {
  const { datas } = await getProductListApi({ page: page + 1, ...params });
  productList.value[page] = datas.content;
}

async function getHomeDemand() {
  homeLoading.value = true;
  const { datas } = await getHomePage();
  demandHallList.value = datas;
  homeLoading.value = false;
}

async function getFrontSelectList() {
  const { datas } = await frontSelectList();
  logoList.value = datas;
}

getHomeDemand();
getProductList(1);
getFrontSelectList();
// 获取需求数量
async function getDemandCount() {
  const { datas, resp_code } = await getNeedAmountApi();
  if (resp_code === 0) {
    amountData.value = {
      pendingDemand: datas.pendingDemand,
      alreadyEnded: datas.alreadyEnded,
    };
  }
}
getDemandCount();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home {
  min-height: 100vh;
  padding-bottom: 80px;
  @include relative(1, 0, none, none, none);
  padding-top: 104px;
  .es-home-homeTop {
    @include relative(-1, 0, none, none, none);
    img {
      @include widthAndHeight(1152px, 168px);
      @include absolute(-1, 0, none, none, none);
    }
  }
  .es-home-homeContent {
    .es-home-homeMiniNavList {
      @include flex(center);
      .es-home-homeMiniNavListItem {
        @include flex(center);
        padding: 2px 8px;
        height: 24px;
        background: #f2f3f5;
        border-radius: 4px;
        @include margin(0, 8px);
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          color: #244bf1;
          background-color: #eaedfe;
        }
      }
    }
    .es-home-homeSupplyDemandDocking {
      display: flex;
      .es-home-homeSupplyDemandDockingLeft {
        flex: 1;
        margin-right: 24px;
        .es-home-homeSupplyDemandDockingTop {
          display: flex;
          justify-content: space-between;
          .es-home-homeSupplyDemandDockingItem {
            padding: 24px 0 24px 24px;
            border-radius: 8px;
            @include flex(center, flex-start);
            border: 1px solid #dbdce2;
            width: calc((100% / 3) - (8px * 2 / 3));
            @include font(20px, 400, rgba(0, 0, 0, 0.9), 28px);
            cursor: pointer;

            img {
              width: 56px;
              height: 56px;
              margin-right: 16px;
            }

            &:hover {
              font-weight: 600;
              box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
            }
          }
        }
        .es-home-homeSupplyDemandDockingBottom {
          @include flex(center, space-between);
          .es-home-homeSupplyDemandDockingItem {
            cursor: pointer;
            margin-top: 8px;
            border-radius: 8px;
            padding: 18px 0 18px 16px;
            border: 1px solid #dbdce2;
            @include flex(center, flex-start, nowrap);
            width: calc((100% / 4) - (8px * 3 / 4));
            @include font(14px, 400, rgba(0, 0, 0, 0.6));

            img {
              width: 40px;
              height: 40px;
              margin-right: 8px;
            }
            p {
              flex: 1;
            }
            &:hover {
              font-weight: 600;
              box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
      .es-home-homeSupplyDemandDockingRight {
        cursor: pointer;

        img {
          width: 464px;
          height: 216px;
          margin-top: 24px;
        }
        .es-home-homeTopSearch {
          @include relative(1, 0, none, none, none);
          @include widthAndHeight(464px, 40px);
          border-radius: 0 8px 8px 0;
          overflow: hidden;
          @include relative();
          margin: 0 auto;
          .es-home-homeTopSearchIcon {
            @include widthAndHeight(104px, 40px);
            @include absolute(1, 0, 0, 0, none);
            background: #244bf1;
            @include flex(center, center);
            cursor: pointer;
            font-weight: 400;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            img {
              @include widthAndHeight(20px, 20px);
            }
          }
        }
        .es-home-amount {
          position: relative;
          .es-home-amount__list {
            @include widthAndHeight(192px, 60px);
            @include absolute(2, 132px, none, none, 0);
            @include flex(center, center);
            text-align: center;
            img {
              @include widthAndHeight(100%, 100%);
              @include absolute(2, 0, none, none, 0);
              margin: 0;
            }
            span {
              @include font(16px, 600, #ff892e, 24px);
            }
            div:nth-of-type(1) {
              margin-right: 16px;
              span {
                @include font(16px, 600, #244bf1, 24px);
              }
            }
            p {
              @include font(12px, 400, rgba(0, 0, 0, 0.6), 20px);
            }
          }
        }
      }
    }
    .es-home-demandHall {
      margin-top: 24px;
      display: flex;
      .es-home-demandHallLeft {
        flex: 1;
        margin-right: 24px;
        img {
          cursor: pointer;
          width: 100%;
        }
      }
      .es-home-demandHallRight {
        width: 464px;
        .es-home-demandHallTitle {
          @include flex(center, space-between);
          margin-bottom: 16px;
          .es-home-demandHallTitleLeft {
            @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
            @include flex(center, flex-start, nowrap);
          }
        }
        .es-home-demandList {
          margin-top: 16px;
          .es-home-demandItem {
            height: 32px;
            margin-top: 4px;
            padding: 0 8px;
            @include font(14px, 400, rgba(0, 0, 0, 0.9), 32px);
            cursor: pointer;
            &:hover {
              background: #f2f3f5;
              border-radius: 4px;
            }
          }
        }
      }
    }
    .es-home-enterprise {
      padding-top: 80px;
      .es-home-enterpriseTitle {
        @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
        @include flex(center, space-between, nowrap);
        img {
          @include widthAndHeight(24px, 24px);
          cursor: pointer;
          &:nth-of-type(1) {
            margin-right: 16px;
          }
          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }
      .es-home-enterpriseContent {
        display: flex;
        flex-wrap: wrap;
        .es-home-enterpriseItem {
          padding: 16px;
          cursor: pointer;
          margin-top: 8px;
          margin-left: 8px;
          border-radius: 8px;
          @include flex(center);
          background: #ffffff;
          border: 1px solid #dbdce2;
          @include widthAndHeight(calc(100% / 6 - 8px * 5 / 6), 128px);

          // &:hover {
          //   box-shadow: 0px 4px 10px 0px rgba(139, 139, 139, 0.1);
          // }

          img {
            max-width: 100%;
            max-height: 100%;
          }

          &:nth-child(6n-5) {
            margin-left: 0;
          }

          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(4),
          &:nth-child(5),
          &:nth-child(6) {
            margin-top: 0;
          }
        }
      }
    }
    .es-home-product {
      padding-top: 80px;
      .es-home-productTitle {
        @include font(36px, 600, rgba(0, 0, 0, 0.9), 44px);
        @include flex(center, space-between, nowrap);
        img {
          @include widthAndHeight(24px, 24px);
          cursor: pointer;
          &:nth-of-type(1) {
            margin-right: 16px;
          }
          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }
        }
      }
      .es-home-productContent {
        display: flex;
        .es-home-productItem {
          margin-left: 24px;
          height: 388px;
          cursor: pointer;
          border-radius: 4px;
          position: relative;
          background: #ffffff;
          padding: 0 16px 24px 16px;
          border: 1px solid #dbdce2;
          width: calc(100% / 4 - 24px * 3 / 4);

          &:first-child {
            margin-left: 0;
          }
          .es-home-productItemLogo {
            position: absolute;
            top: 0;
            left: 0;
            height: 40px;
          }
          .es-home-productItem__img-box {
            overflow: hidden;
            margin: 40px auto 0;
            @include flex(center);
            @include widthAndHeight(214px, 214px);
            img {
              height: 238px;
            }
          }
          .es-home-productItemDecs {
            text-align: center;
            .es-home-productItemPrice {
              margin-top: 16px;
              @include font(14px, 400, rgba(0, 0, 0, 0.9), 28px);
            }
          }
          .es-home-productItemName {
            margin-top: 16px;
            @include textOverflow(1);
            @include font(16px, 400, rgba(0, 0, 0, 0.9), 24px);
          }
          .es-home-productItemCompany {
            margin-top: 4px;
            @include textOverflow(1);
            @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
          }
        }
      }
    }
    .swiper {
      margin-top: 32px;
      .es-home-swiperBoxItem {
        height: 300px;
        background-color: #f00;
      }
    }
  }
}
.es-home-demandHallContent {
  h4 {
    margin-bottom: 4px;
  }
  p {
    padding: 5px 8px;
    @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
    margin-bottom: 4px;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-home-homeTopSearch {
  .el-input {
    height: 40px;
  }

  .el-input__wrapper.is-focus {
    box-shadow: none;
  }

  .el-input__wrapper:hover {
    box-shadow: none;
  }

  .el-input__wrapper {
    padding: 8px 64px 8px 24px;
    border-radius: 8px 0 0 8px;
  }
}
.swiper-pagination {
  height: 4px;
  @include flex(center, center, nowrap);
  margin-top: 30px;
}
.swiper-pagination-bullet {
  @include widthAndHeight(16px, 4px);
  background: rgba(0, 0, 0, 0.26);
  border-radius: 1px;
  // transition: width 0.1s;
  margin-right: 8px;
  cursor: pointer;
}
.swiper-pagination-bullet-active {
  @include widthAndHeight(32px, 4px);
  background: rgba(0, 0, 0, 0.9);
}
.es-home {
  .el-dropdown {
    @include flex(center, flex-start, nowrap);
    cursor: pointer;
  }
  .el-dropdown-link {
    display: inline-block;
    background: linear-gradient(
      270deg,
      rgba(234, 237, 254, 0) 0%,
      #eaedfe 100%
    );
    border-radius: 4px;
    margin-left: 8px;
    min-width: 61px;
    height: 20px;
    @include flex(center, flex-start, nowrap);
    padding: 0 8px;
    @include font(12px, 400, #244bf1, 20px);
  }
  .el-dropdown-icon {
    @include widthAndHeight(16px, 16px);
  }
}
</style>
