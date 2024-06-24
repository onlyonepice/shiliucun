<template>
  <div class="province-peak-valley-time">
    <div class="province-peak-valley-time-top">
      <el-button type="primary" @click="clickGeneratePicture">
        下载图片
      </el-button>
    </div>
    <div class="content">
      <el-table :data="elTableData" style="width: 100%" height="100%">
        <el-table-column width="150" fixed prop="regionName" label="地区" />
        <el-table-column width="140" fixed prop="month" label="月份" />
        <el-table-column width="35" prop="" label="" />
        <el-table-column
          v-for="(item, index) in tableKeys"
          :key="item"
          width="64"
          :prop="item"
          :label="item"
        >
          <template #default="scope">
            <div
              v-if="index !== tableKeys.length"
              class="electricity-price-status"
            >
              <div
                v-for="status in scope.row[item]"
                :key="status"
                class="electricity-price-status-item"
                :style="setColor(status)"
              >
                {{ status }}
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column width="64" prop="" label="1:00" /> -->
      </el-table>
      <div ref="faultTree" class="box">
        <div v-if="showLoading">
          <img
            v-for="i in 6"
            :key="i"
            class="masker-img"
            :style="{ top: i * 600 + 'px' }"
            src="@/assets/img/common/eesa-waterMark.png"
          />
        </div>

        <div class="th-box">
          <p
            v-for="item in thList"
            :key="item"
            class="td"
            :style="setStyle(item)"
          >
            {{ item }}
          </p>
        </div>
        <div class="trs">
          <div v-for="(item, index) in tableData" :key="index" class="tr-box">
            <template v-for="(row, rowIndex) in item">
              <div
                v-if="rowIndex === item.length - 1"
                :key="row[0]"
                class="td-s"
                style="width: 156px"
              >
                {{ row[0] }}
              </div>
            </template>
            <template v-for="(row, rowIndex) in item">
              <div
                v-if="rowIndex === item.length - 2"
                :key="row[0]"
                class="td-s"
                style="width: 184px"
              >
                {{ row[0] }}
              </div>
            </template>
            <template v-for="(row, rowIndex) in item">
              <div
                v-if="
                  rowIndex !== item.length - 1 && rowIndex !== item.length - 2
                "
                :key="`${rowIndex}${index}${item.at(-1)}${item.at(-2)}${thList[rowIndex]}`"
                class="td"
                :style="{ border: rowIndex === item.length - 3 ? '0' : '' }"
              >
                <p
                  v-for="(children, __index) in row"
                  :key="`${children}${rowIndex}${index}${item.at(-1)}${item.at(-2)}${thList[rowIndex]}${__index}`"
                  :style="setColor(children)"
                >
                  {{ children }}
                </p>
              </div>
            </template>
          </div>
        </div>
        <p class="tip">来源：EESA储能领跑者联盟 数据库</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { cloneDeep } from "lodash";
import { timeLIstTr } from "./data";
import html2canvas from "html2canvas";
import { ref, nextTick, computed } from "vue";
import { getNewTimeSharing } from "@/api/priceTracking";
const showLoading = ref(false);
const tableData = ref([]);
const elTableData = ref([]);
const dataURL = ref("");
const faultTree = ref(null);
const thList = ref<Array<string>>(timeLIstTr);

const tableKeys = computed(() => {
  const keyArr = cloneDeep(timeLIstTr);
  keyArr.splice(0, 2);
  return keyArr;
});

function clickGeneratePicture() {
  showLoading.value = true;
  nextTick(() => {
    html2canvas(faultTree.value, {
      backgroundColor: "white",
    })
      .then((canvas) => {
        const url = canvas.toDataURL("image/png");
        dataURL.value = url;
        const creatDom = document.createElement("a");
        document.body.appendChild(creatDom);
        creatDom.href = dataURL.value;
        creatDom.download = "各省峰谷时段";
        creatDom.click();
        showLoading.value = false;
      })
      .catch((err) => {
        showLoading.value = false;
        console.error(err);
      });
  });
}

async function getData() {
  const { datas } = await getNewTimeSharing();
  if (datas.length > 0) {
    elTableData.value = datas.map((item) => {
      const tableTrObj = {};
      for (const key in item) {
        if (key.includes("-")) {
          const str = key.split("-")[0];
          tableTrObj[str.startsWith("0") ? str.substring(1) : str] =
            item[key].split(",");
        } else {
          tableTrObj[key] = item[key];
        }
      }
      return tableTrObj;
    });
    tableData.value = datas
      .map((item) => {
        let row = Object.values(item);
        row = row.map((key: string) => {
          return key.split(",");
        });
        return row;
      })
      .map((item) => {
        return item.filter((_item: Array<string>) => {
          return _item.every((__item) => {
            return isNaN(Number(__item));
          });
        });
      });
  }
}

const setColor = computed(() => {
  return (item) => {
    let color, backgroundColor;
    switch (item) {
      case "低":
        color = "rgba(1, 184, 43, 1)";
        backgroundColor = "rgba(1, 184, 43, .1)";
        break;
      case "平":
        color = "rgba(255, 175, 11, 1)";
        backgroundColor = "rgba(255, 175, 11, .1)";
        break;
      case "高":
        color = "#FF7D00";
        backgroundColor = "#FFF2E5";
        break;
      case "尖":
        color = "#F53F3F";
        backgroundColor = "#FEEBEB";
        break;
      case "深":
        color = "#C34FF1";
        backgroundColor = "#F9EDFD";
        break;
    }
    return `color:${color};background-color:${backgroundColor};`;
  };
});

function setStyle(item) {
  let width = 64;
  switch (item) {
    case "地区":
      width = 156;
      break;
    case "月份":
      width = 180;
      break;
  }
  return `width:${width}px;`;
}

getData();
window.trackFunction("pc_Elecprice_PeakValley_click");
</script>
<style lang="scss" scoped>
@import "@/style/mixin.scss";

.province-peak-valley-time {
  width: 100%;
  padding-bottom: 80px;

  .province-peak-valley-time-top {
    margin: 24px 0;
    display: flex;
    flex-direction: row-reverse;
  }

  .content {
    width: 100%;
    height: 68vh;
    overflow: hidden;
    position: relative;

    .box {
      transform: scale(1);
      position: absolute;
      left: 300%;
      top: 0;
      background-color: white;
      position: relative;
      width: 1928px;
      padding-bottom: 24px;

      .masker-img {
        position: absolute;
        left: 20px;
        top: 100px;
        width: 489px;
        height: 319px;
      }

      .th-box {
        height: 48px;
        background: #f2f3f5;
        border-radius: 4px 4px 0px 0px;
        display: flex;
        align-items: center;
        padding: 16px 13px;
        box-sizing: border-box;

        .td {
          font-size: 14px;
          font-weight: 400;
          color: #1c232f;
          line-height: 22px;
        }
      }

      .tr-box {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 16px 13px;
        height: 48px;
        margin-bottom: 8px;

        .td-s {
          font-size: 14px;
          font-weight: 400;
          color: #1c232f;
          line-height: 22px;
          width: 156px;
        }

        .td {
          width: 64px;
          border-right: 1px solid #d0d6e2;
          display: flex;
          height: 48px;

          p {
            flex: 1;
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            line-height: 49px;
          }
        }
      }

      .trs {
        width: 100%;
      }

      .tip {
        width: 100%;
        text-align: right;
        font-size: 14px;
        font-weight: 400;
        color: #1c232f;
        margin-top: 24px;
        padding-right: 32px;
      }
    }
  }

  ::v-deep(.el-table) {
    .el-table__body-wrapper {
      margin-top: 4px;
    }

    .el-table__header {
      .el-table__cell {
        transform: translate(-32px, 0);

        .cell {
          padding: 0;
          text-align: center;
        }

        &:nth-child(1) {
          padding-left: 24px;
        }

        &:nth-child(1),
        &:nth-child(2) {
          transform: translate(0, 0);

          .cell {
            text-align: left;
          }
        }
      }
    }

    .el-table__body {
      .el-table__row {
        background-color: none !important;

        .el-table__cell {
          padding: 0;
          border: none;

          &:nth-child(1) {
            padding-left: 24px;
          }

          &:last-child {
            .cell {
              .electricity-price-status {
                border: 0px;
              }
            }
          }

          .cell {
            padding: 0;

            .electricity-price-status {
              border-right: 1px solid #d0d6e2;
              @include flex(flex-start, flex-start);
              width: 64px;
              height: 48px;
              margin: 4px 0;

              .electricity-price-status-item {
                height: 100%;
                @include flex();
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
