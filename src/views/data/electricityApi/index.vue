<template>
  <div :class="[ns.b()]">
    <div :class="['es-commonPage', ns.b('content')]">
      <h1>电价API</h1>
      <div :class="ns.be('content', 'desc')">
        <div :class="ns.be('desc', 'info')">
          <div
            v-for="item in info"
            :key="item.id"
            :class="ns.be('desc__info', 'item')"
          >
            <h4>{{ item.title }}</h4>
            <h5 v-for="(_item, _index) in item.desc" :key="_index">
              {{ _item }}
            </h5>
          </div>
        </div>
        <el-button type="primary" @click="onOpen()">立即开通</el-button>
      </div>
      <h4 :class="ns.be('content', 'title')">请求参数说明</h4>
      <el-table :data="requestTable" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="value" label="示例值" />
        <el-table-column prop="isMust" label="必须" />
        <el-table-column prop="desc" label="说明" />
      </el-table>
      <h4 :class="ns.be('content', 'title')">返回参数说明</h4>
      <el-table :data="responseTable" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="type" label="类型" />
        <el-table-column prop="value" label="示例值" />
        <el-table-column prop="desc" label="说明" />
        <el-table-column prop="none" label="" />
      </el-table>
      <h4 :class="ns.be('content', 'title')">错误码参照</h4>
      <el-table :data="errorTable" style="width: 100%">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="desc" label="说明" />
        <el-table-column prop="none" label="" />
        <el-table-column prop="none" label="" />
        <el-table-column prop="none" label="" />
      </el-table>
    </div>
  </div>
  <openDialog
    title="开通API"
    :visible="visibleInfo"
    @onClose="visibleInfo = false"
  />
</template>

<script lang="ts" setup>
import { Ref, ref } from "vue";
import useNamespace from "@/utils/nameSpace";
import { getApiTime } from "@/api/data";
const ns = useNamespace("electricityApi");
const visibleInfo: Ref<boolean> = ref(false); // 开通弹窗
const onOpen = () => {
  visibleInfo.value = true;
};
// 获取最新api时间
const getApiTimeFn = async () => {
  const { resp_code, datas } = await getApiTime();
  if (resp_code === 0) {
    const _data = datas.filter((item) => {
      return item.name === "电价库";
    });
    info.value[1].desc = [
      _data[0].lastUpdateTime.split("-")[0] +
        "年" +
        _data[0].lastUpdateTime.split("-")[1] +
        "月",
    ];
  }
};
getApiTimeFn();
const info: Ref<Array<any>> = ref([
  {
    id: 1,
    title: "产品介绍",
    desc: [
      "· 包含30个省份、37个地区的电价数据。",
      "· 每月底27日后逐步更新次月电价数据。",
      "· 适用于各地区工商业投资回报性测算、分析各省份电价走势等场景。",
    ],
  },
  {
    id: 2,
    title: "最新数据",
    desc: ["2024年7月"],
  },
  {
    id: 3,
    title: "计费方式",
    desc: ["年付，详情咨询客服人员"],
  },
]);
const requestTable: Ref<Array<any>> = ref([
  {
    id: 1,
    name: "regionName",
    type: "string",
    value: "上海市",
    isMust: "否",
    desc: "区域名称",
  },
  {
    id: 2,
    name: "years",
    type: "string",
    value: "2024.04",
    isMust: "否",
    desc: "年月",
  },
]);
const responseTable: Ref<Array<any>> = ref([
  {
    id: 1,
    name: "electricityTypeOneName",
    type: "string",
    value: "两部制",
    desc: "用电类型I",
  },
  {
    id: 2,
    name: "electricityTypeTwoName",
    type: "string",
    value: "一般工商业",
    desc: "用电类型II",
  },
  {
    id: 3,
    name: "tariffLevelId",
    type: "string",
    value: "不满一千伏",
    desc: "电压等级",
  },
  {
    id: 4,
    name: "topTime",
    type: "number",
    value: "-",
    desc: "尖峰时刻",
  },
  {
    id: 5,
    name: "highTime",
    type: "number",
    value: "-",
    desc: "高峰时刻",
  },
  {
    id: 6,
    name: "flatTime",
    type: "number",
    value: "-",
    desc: "平时刻",
  },
  {
    id: 7,
    name: "lowTime",
    type: "number",
    value: "-",
    desc: "低谷时刻",
  },
  {
    id: 8,
    name: "deepTime",
    type: "number",
    value: "-",
    desc: "深谷时刻",
  },
  {
    id: 9,
    name: "regionName",
    type: "string",
    value: "上海市",
    desc: "区域名称",
  },
  {
    id: 10,
    name: "years",
    type: "string",
    value: "2024.04",
    desc: "年月",
  },
]);
const errorTable: Ref<Array<any>> = ref([
  {
    id: 1,
    name: "200",
    desc: "请求成功",
  },
  {
    id: 1,
    name: "201",
    desc: "请求取消",
  },
  {
    id: 1,
    name: "401",
    desc: "没有权限",
  },
  {
    id: 1,
    name: "403",
    desc: "禁止访问",
  },
  {
    id: 1,
    name: "404",
    desc: "没有找到",
  },
]);
</script>

<style lang="scss" scoped>
@import "@/style/mixin.scss";
.es-electricityApi-content {
  padding: 80px 0;
}
.es-electricityApi-content__desc {
  @include widthAndHeight(100%, auto);
  padding: 24px;
  background: #f4f6fe;
  border-radius: 8px;
  @include flex(flex-start, space-between, nowrap);
  margin: 32px 0 24px;
}
.es-electricityApi-desc__info__item {
  margin-bottom: 16px;
  &:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
.es-electricityApi-desc__info__item {
  h4 {
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 24px;
  }
  h5 {
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    line-height: 22px;
  }
}
.es-electricityApi-input--codeBtn {
  width: 100px;
  text-align: center;
  cursor: pointer;
  @include font(14px, 400, #244bf1, 22px);
}
.es-electricityApi-input--down {
  color: #999999;
}
</style>
<style lang="scss">
@import "@/style/mixin.scss";
.es-electricityApi-content {
  thead {
    .el-table__cell {
      @include font(14px, 600, rgba(0, 0, 0, 0.9), 22px);
    }
  }
  tbody {
    .el-table__cell {
      @include font(14px, 400, rgba(0, 0, 0, 0.9), 22px);
    }
  }
}
</style>
