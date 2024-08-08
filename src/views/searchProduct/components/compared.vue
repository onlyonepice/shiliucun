<template>
  <div
    :class="[
      ns.b('compared'),
      'animate__animated',
      showCompared ? 'animate__fadeInUp' : 'animate__fadeOutDown',
    ]"
  >
    <div :class="ns.be('compared', 'head')">
      <h3>产品对比</h3>
      <h5 @click="onCloseCompared()">隐藏</h5>
    </div>
    <div :class="ns.be('compared', 'content')">
      <div
        :class="ns.be('compared', 'item')"
        v-for="(item, index) in 4"
        :key="item"
      >
        <div
          :class="ns.be('compared-item', 'box')"
          v-if="comparedList[index] && comparedList[index].id"
          @mouseenter="choseComputed = comparedList[index].id"
          @mouseleave="choseComputed = ''"
        >
          <img
            :src="
              useUserStoreHook().$state.fileUrl + comparedList[index].image[0]
            "
            alt=""
            v-if="comparedList[index].image.length !== 0"
          />
          <EmptyProduct v-else size="60px" fontSize="12px" />
          <div>
            <h5>{{ comparedList[index].enterprise }}</h5>
            <span v-if="comparedList[index].price"
              >¥ {{ comparedList[index].price }}/kWh起</span
            >
            <text
              v-if="choseComputed === comparedList[index].id"
              class="animate__animated animate__fadeIn"
              @click="onDelComputed(comparedList[index].id)"
              >删除</text
            >
          </div>
        </div>
        <div :class="ns.be('compared-item', 'empty')" v-else>
          <div>{{ index + 1 }}</div>
          <p>可继续添加产品</p>
        </div>
      </div>
      <div :class="ns.be('compared', 'btn')">
        <el-button type="primary" @click="onCompared()">对比</el-button>
        <h5 @click="onEmptyCompared()">清空产品</h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { useUserStoreHook } from "@/store/modules/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
const router = useRouter();
const ns = useNamespace("searchProduct-compared");
const emits = defineEmits([
  "onDelComputed",
  "onCloseCompared",
  "onEmptyCompared",
]);
const props = defineProps({
  showCompared: {
    type: Boolean,
    default: false,
  },
  comparedList: {
    type: Array as any,
    default: () => [],
  },
  productType: {
    type: String,
    default: "INDUSTRY_ENERGY_STORAGE",
  },
});
// 删除对比产品
const onDelComputed = (id: string) => {
  emits("onDelComputed", id);
};
const onCloseCompared = () => {
  emits("onCloseCompared");
};
// 清空产品对比
const onEmptyCompared = () => {
  emits("onEmptyCompared");
};
const choseComputed: Ref<String> = ref("");
// 进行对比
const onCompared = () => {
  let _data: any[] = [];
  props.comparedList.forEach((item: any) => {
    _data.push(item.id);
  });
  if (_data.length < 2) {
    return ElMessage.warning("请选择两个产品进行对比");
  }
  router.push(
    `/searchProductCompared?ids=${_data.join(",")}&productType=${props.productType}`,
  );
};
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-searchProduct-compared-compared {
  @include widthAndHeight(1152px, 180px);
  background: #ffffff;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 2px solid #ff892e;
  @include fixed(1, none, none, 24px, 50%);
  margin-left: -576px;
  padding: 24px 24px 32px;
  &__head {
    @include flex(center, space-between, nowrap);
    cursor: pointer;
    margin-bottom: 16px;
    h5 {
      font-weight: 400;
    }
  }
  &__content {
    @include flex(center, flex-start, nowrap);
    @include relative();
    height: 80px;
  }
  &__item {
    @include widthAndHeight(220px, 80px);
    @include flex(flex-start, space-between, nowrap);
    padding-right: 15px;
    border-right: 1px solid #dbdce2;
    margin-right: 16px;
    box-sizing: content-box;
    .es-searchProduct-compared-compared-item__box {
      width: 100%;
      @include flex(flex-start, space-between, nowrap);
      img {
        object-fit: contain;
      }
    }
    .es-searchProduct-compared-compared-item__empty {
      width: 100%;
      @include flex(center, flex-start, nowrap);
      div {
        @include widthAndHeight(80px, 80px);
        margin-right: 8px;
        @include font();
        background: #f2f3f5;
        border-radius: 4px;
        @include font(40px, 600, rgba(0, 0, 0, 0.26), 48px);
        @include flex(center, center);
      }
      p {
        @include font(14px, 400, rgba(0, 0, 0, 0.4), 22px);
      }
    }
    img {
      @include widthAndHeight(80px, 80px);
    }
    div {
      width: 132px;
    }
    h5 {
      font-weight: 400;
      margin-bottom: 8px;
      line-height: 22px;
    }
    span {
      @include font(12px, 600, #f75964, 20px);
    }
    text {
      @include font(12px, 400, #244bf1, 20px);
      cursor: pointer;
      margin-left: 8px;
    }
  }
  &__btn {
    @include widthAndHeight(88px, 100%);
    @include absolute(1, 0, 0, none, none);
    text-align: center;
    @include flex(center, center, wrap);
    h5 {
      width: 100%;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
