<template>
  <div :class="[ns.b(), 'es-commonPage']">
    <div :class="ns.b('homeTop')">
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
    </div>
    <div :class="ns.b('homeContent')">
      <div :class="ns.b('homeMiniNavList')">
        <div
          v-for="item in searchKey"
          @click="onSearchKey(item)"
          :key="item.title"
          :class="ns.b('homeMiniNavListItem')"
        >
          {{ item.title }}
        </div>
      </div>
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
          <img
            @click="onDemandHallTitle"
            src="@/assets/img/home/home-supply-demand-docking.png"
            alt=""
          />
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
            <div :class="ns.b('demandHallTitleLeft')">需求大厅</div>
            <div
              :class="ns.b('demandHallTitleRight')"
              @click="onDemandHallTitle"
            >
              查看更多
            </div>
          </div>
          <div :class="ns.b('demandList')">
            <div
              v-for="item in demandHallList"
              :key="item.id"
              @click="handleGoDemandDetails(item)"
              :class="ns.b('demandItem')"
            >
              {{ item.typeName }}｜{{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <div :class="ns.b('enterprise')">
        <div :class="ns.b('enterpriseTitle')">明星企业</div>
        <swiper
          :modules="modules"
          :space-between="8"
          :loop="true"
          class="swiperBox"
          :autoplay="autoplay"
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
          :loop="true"
          class="swiperBox"
          :autoplay="autoplay"
          @slideChange="onSlideChange"
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
import { Swiper, SwiperSlide } from "swiper/vue";
import { useUserStore } from "@/store/modules/user";
import { useUserStoreHook } from "@/store/modules/user";

import { getProductListApi } from "@/api/searchProduct";
import { getHomePage, frontSelectList } from "@/api/home";

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
import { Controller, Autoplay, Navigation, Pagination } from "swiper/modules";
const modules = [Controller, Autoplay, Navigation, Pagination];
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;

const autoplay: any = ref({
  delay: 3000,
  pauseOnMouseEnter: false,
  disableOnInteraction: false,
});
const router = useRouter();
const ns = useNamespace("home");
const productList = ref([]);
const demandHallList = ref([]);
const searchContent: Ref<string> = ref("");
const logoList = ref([]);
const params = {
  limit: 4,
  sortType: 1,
  sortMethod: false,
  enterpriseIds: null,
  coolingMethodIds: null,
  productType: "INDUSTRY_ENERGY_STORAGE",
};
const searchKey = ref([
  { title: "工商业" },
  { title: "电价" },
  { title: "招标" },
  { title: "中标" },
  { title: "行业数据" },
  { title: "企业排名" },
]);

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
  { title: "工商业测算", path: "/calculate", icon: homeNavBottom_8 },
]);
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

const onSearchKey = (row) => {
  searchContent.value = row.title;
  router.push({
    name: "HomeSearchDetail",
    params: { searchContent: row.title },
  });
  window.trackFunction("pc_Home_Search_click");
};

function handleGoDetails(row) {
  if (!getToken()) {
    useUserStore().openLogin(true);
    return;
  }
  router.push(
    `/searchProductDetail?id=${row.id}&productType=INDUSTRY_ENERGY_STORAGE`,
  );
}

function handleGoDemandDetails(row) {
  router.push(`/demandMatching/detail?id=${row.id}`);
}

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

async function getProductList(page) {
  const { datas } = await getProductListApi({ page, ...params });
  if (page === 1)
    for (let i = 0; i < datas.totalPages; i++) {
      productList.value.push([]);
    }
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
let lastTimeIndex = 0;
async function onSlideChange({ realIndex }) {
  if (
    isNaN(realIndex) ||
    !productList.value.length ||
    lastTimeIndex === realIndex ||
    realIndex === 0
  ) {
    return;
  }
  if (lastTimeIndex === productList.value.length) {
    changeGetProductList(realIndex + 1);
  } else if (
    lastTimeIndex === 0 &&
    realIndex === productList.value.length - 1
  ) {
    changeGetProductList(realIndex - 1);
  } else if (
    realIndex > lastTimeIndex &&
    productList.value[realIndex + 1] &&
    !productList.value[realIndex + 1]?.length
  ) {
    changeGetProductList(realIndex + 1);
  } else if (
    realIndex < lastTimeIndex &&
    productList.value[realIndex - 1] &&
    !productList.value[realIndex - 1]?.length
  ) {
    changeGetProductList(realIndex - 1);
  }
  lastTimeIndex = realIndex;
}
async function changeGetProductList(page) {
  const { datas } = await getProductListApi({ page: page + 1, ...params });
  productList.value[page] = datas.content;
}

async function getHomeDemand() {
  const { datas } = await getHomePage();
  demandHallList.value = datas;
}

async function getFrontSelectList() {
  const { datas } = await frontSelectList();
  logoList.value = datas;
}

getHomeDemand();
getProductList(1);
getFrontSelectList();
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";

.es-home {
  min-height: 100vh;
  @include padding(160px, 0, 80px, 0);
  @include relative();
  .es-home-homeTop {
    height: 168px;
    background-image: url(../../assets/img/common/home-top-icon.png);
    background-size: auto 100%;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    align-items: end;
    .es-home-homeTopSearch {
      @include widthAndHeight(564px, 40px);
      border-radius: 0 8px 8px 0;
      margin: 0 auto;
      overflow: hidden;
      @include relative();
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
  }
  .es-home-homeContent {
    margin-top: 20px;
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
      margin-top: 82px;
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
          width: 478px;
          height: 280px;
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
        width: 478px;
        .es-home-demandHallTitle {
          @include flex(center, space-between);
          .es-home-demandHallTitleLeft {
            @include font(20px, 600, rgba(0, 0, 0, 0.9), 28px);
          }
          .es-home-demandHallTitleRight {
            @include font(14px, 400, #244bf1, 22px);
            cursor: pointer;
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
</style>
<style lang="scss">
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
</style>
