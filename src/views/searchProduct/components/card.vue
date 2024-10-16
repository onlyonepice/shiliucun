<template>
  <div :class="ns.b()" @click="onDetail()" v-if="cardType === 'card'">
    <img
      :class="ns.b('logo')"
      :src="useUserStoreHook().$state.fileUrl + product.logoUrl"
      alt=""
      v-if="product.logoUrl"
    />
    <div :class="ns.be('img', 'box')">
      <img
        v-if="product.image && product.image.length !== 0"
        :class="ns.b('img')"
        :src="useUserStoreHook().$state.fileUrl + product.image[0]"
        alt=""
      />
      <EmptyProduct v-else size="120px" />
    </div>
    <p :class="ns.b('price')" v-if="!!product.price">
      参考价<span>{{ product.price + "/kWh起" }}</span>
    </p>
    <p :class="ns.b('price')" v-else />
    <h4 :class="ns.b('name')">{{ product.name }}</h4>
    <p :class="ns.b('company')">{{ product.enterprise }}</p>
    <div :class="ns.b('btn')">
      <el-button type="primary" @click.stop="onOpenWindow(product.enterpriseId)"
        >联系厂商</el-button
      >
      <el-button @click.stop="onCompared()" v-if="productType !== 'OTHERS'">
        <img :src="ComparedIcon" alt="" />
        <span>{{ !getType ? "产品对比" : "取消对比" }}</span>
      </el-button>
    </div>
  </div>
  <div v-else :class="ns.b('list')" @click="onDetail()">
    <div :class="ns.b('list-left')">
      <img
        :src="useUserStoreHook().$state.fileUrl + product.logoUrl"
        alt=""
        v-if="product.logoUrl"
        :class="ns.be('list-left', 'logo')"
      />
      <img
        v-if="product.image.length !== 0"
        :src="useUserStoreHook().$state.fileUrl + product.image[0]"
        alt=""
        :class="ns.be('list-left', 'img')"
      />
      <EmptyProduct
        v-else
        size="190px"
        :class="ns.be('list-left', 'img')"
        style="margin-left: 16px"
      />
    </div>
    <div :class="ns.b('list-right')">
      <div>
        <h3 :class="ns.be('list-right', 'name')">
          {{ product.name }}
        </h3>
        <h4 :class="ns.be('list-right', 'company')">
          {{ product.enterprise }}
        </h4>
        <div
          :class="['es-searchProduct-card-price', ns.be('list-right', 'price')]"
          v-if="!!product.price || productType !== 'OTHERS'"
        >
          参考价<span>{{ product.price }}/kWh起</span>
        </div>
      </div>
      <div :class="ns.be('list-right', 'info')">
        <div :class="ns.be('list-right', 'info-list')">
          <p
            v-for="item in productInfo"
            :key="item.label"
            :style="{ width: item.width ? item.width : '50%' }"
          >
            {{ item.label }}{{ item.value }}
          </p>
        </div>
        <div :class="ns.b('btn')">
          <el-button @click.stop="onCompared()">
            <img :src="ComparedIcon" alt="" />
            <span>{{ !getType ? "产品对比" : "取消对比" }}</span>
          </el-button>
          <el-button
            type="primary"
            @click.stop="onOpenWindow(product.enterpriseId)"
            >联系厂商</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import ComparedIcon from "@/assets/img/common/compared-icon.png";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { getToken } from "@/utils/auth";
import { useUserStore } from "@/store/modules/user";
import { ElMessage } from "element-plus";
const router = useRouter();
const { VITE_INDUSTRIALMAP_URL } = import.meta.env;
const ns = useNamespace("searchProduct-card");
const emits = defineEmits(["onCompared"]);
const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  comparedList: {
    type: Array,
    default: () => [],
  },
  cardType: {
    type: String,
    default: "card",
  },
  productType: {
    type: String,
    default: "INDUSTRY_ENERGY_STORAGE",
  },
});
const onCompared = () => {
  emits("onCompared", props.product);
};
const productInfo = computed(() => {
  const _data = [];
  if (props.productType === "INDUSTRY_ENERGY_STORAGE") {
    _data.push(
      {
        label: "形式：",
        value: props.product.productFormName || "-",
      },
      {
        label: "冷却方式：",
        value: props.product.coolingMethodName || "-",
      },
      {
        label: "电池系统能量：",
        value: props.product.batterySystemEnergy || "-",
      },
      {
        label: "额定功率：",
        value: props.product.ratedPower || "-",
      },
      {
        label: "系统综合效率：",
        value: props.product.systemOverallEfficiency || "-",
      },
      {
        label: "年衰减率：",
        value: props.product.annualDecayRate || "-",
      },
    );
  } else if (props.productType === "ELECTRIC_CORE") {
    _data.push(
      {
        label: "形态：",
        value: props.product.shapeName || "-",
      },
      {
        label: "循环寿命：",
        value: props.product.cycleLife || "-",
      },
      {
        width: "100%",
        label: "能量密度：",
        value: props.product.energyDensity || "-",
      },
      {
        label: "容量：",
        value: props.product.batteryCapacity
          ? props.product.batteryCapacity + "Ah"
          : "-",
      },
    );
  } else {
    _data.push(
      {
        label: "直流电压范围：",
        value: props.product.dcVoltageRange + "V" || "-",
      },
      {
        label: "最大直流电流：",
        value: props.product.maximumDirectCurrent + "A" || "-",
      },
      {
        label: "额定功率：",
        value: props.product.ratedPower + "kW" || "-",
      },
      {
        label: "额定交流电压：",
        value: props.product.ratedACVoltage
          ? props.product.ratedACVoltage + "V"
          : "-",
      },
      {
        label: "最大效率：",
        value: props.product.maximumEfficiency
          ? props.product.maximumEfficiency + "%"
          : "-",
      },
      {
        label: "频率：",
        value: props.product.ratedACFrequency
          ? props.product.ratedACFrequency
          : "-",
      },
    );
  }
  return _data;
});
const getType = computed(() => {
  return props.comparedList.some((item: any) => item.id === props.product.id)
    ? true
    : false;
});
const onOpenWindow = (id: number) => {
  id === null && ElMessage.warning("该企业暂未入驻");
  id &&
    window.open(
      `${VITE_INDUSTRIALMAP_URL}/home?enterpriseId=${id}`,
      "externalWindow",
    );
};
const onDetail = () => {
  if (!getToken()) {
    useUserStore().openLogin(true);
    return;
  }
  router.push(
    `/searchProductDetail?id=${props.product.id}&productType=${props.productType}`,
  );
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-card {
  @include widthAndHeight(270px, 444px);
  background: rgba(255, 255, 255, 0);
  border-radius: 8px;
  border: 1px solid #dbdce2;
  margin-top: 24px;
  box-shadow: none;
  transition: all 0.3s;
  cursor: pointer;
  padding: 0 16px 24px 16px;
  text-align: center;
  @include relative();
  &:hover {
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  }
}
.es-searchProduct-card-logo {
  @include widthAndHeight(96px, 40px);
  @include absolute(1, 0, none, none, 0);
  object-fit: contain;
}
.es-searchProduct-card-img__box {
  @include widthAndHeight(214px, 214px);
  @include flex();
  overflow: hidden;
  margin: 40px auto 0;
}
.es-searchProduct-card-img {
  height: 238px;
  object-fit: contain;
}
.es-searchProduct-card-price {
  height: 28px;
  margin: 16px 0 0 8px;
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  span {
    @include font(20px, 600, #f75964, 28px);
    &::before {
      content: "¥";
      display: inline-block;
      @include font(14px, 600, #f75964, 22px);
      margin-left: 4px;
    }
  }
  p {
    @include font(20px, 600, #f75964, 28px);
  }
}
.es-searchProduct-card-name {
  margin: 16px 0 4px 0;
  line-height: 24px;
  @include one-ellipsis();
}
.es-searchProduct-card-company {
  @include font(14px, 400, rgba(0, 0, 0, 0.6), 22px);
  @include one-ellipsis();
}
.es-searchProduct-card-btn {
  margin-top: 24px;
  @include flex(center, space-between, nowrap);
}

.es-searchProduct-card-list {
  @include widthAndHeight(1152px, 246px);
  @include flex(center, space-between, nowrap);
  border-radius: 4px;
  border: 1px solid #dbdce2;
  margin-bottom: 24px;
  transition: all 0.3s ease-in-out;
  padding-right: 32px;
  &:nth-of-type(1) {
    margin-top: 16px;
  }
  &:hover {
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  }
}
.es-searchProduct-card-list-left {
  @include widthAndHeight(230px, 246px);
  @include relative();
}
.es-searchProduct-card-list-left__logo {
  @include widthAndHeight(96px, 40px);
  @include absolute(1, 1px, none, none, 0);
  object-fit: contain;
}
.es-searchProduct-card-list-left__img {
  @include widthAndHeight(190px, 190px);
  margin-left: 16px;
  @include absolute(1, none, none, 16px, 0);
  object-fit: contain;
}
.es-searchProduct-card-list-right {
  @include widthAndHeight(100%, 176px);
  @include relative();
  flex: 1;
}
.es-searchProduct-card-list-right__name {
  margin-bottom: 4px;
  @include one-ellipsis();
}
.es-searchProduct-card-list-right__company {
  font-weight: 400;
  @include one-ellipsis();
}
.es-searchProduct-card-list-right__price {
  @include absolute(1, 0, 0, none, none);
  margin: 0;
}
.es-searchProduct-card-list-right__info {
  @include flex(flex-end, space-between, nowrap);
  margin-top: 32px;
  p {
    @include widthAndHeight(240px, 24px);
    @include font(16px, 400, rgba(0, 0, 0, 0.6), 24px);
    margin-bottom: 8px;
  }
}
.es-searchProduct-card-list-right__info-list {
  width: 564px;
  @include flex(flex-end, space-between, wrap);
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-searchProduct-card-btn {
  .el-button {
    @include widthAndHeight(116px, 32px);
  }
  img {
    @include widthAndHeight(12px, 12px);
    margin-right: 10px;
  }
}
</style>
