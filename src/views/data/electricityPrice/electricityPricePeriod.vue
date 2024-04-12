<template>
  <div class="province-peak-valley-time">
    <el-button type="primary" @click="clickGeneratePicture">下载图片</el-button>
    <div class="content">
      <div ref="faultTree" class="box">
        <div v-if="showLoading">
          <img
            v-for="i in 6"
            :key="i"
            class="masker-img"
            :style="{ top: i * 600 + 'px' }"
            src="@/assets/img/eesa-waterMark.png"
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
                  :style="setColor(children, rowIndex)"
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
<script>
import { getNewTimeSharing } from "@/api/priceTracking";
import html2canvas from "html2canvas";
export default {
  name: "ProvincePeakValleyTime",
  inject: ["Home"],

  data() {
    return {
      showLoading: false,
      thList: [
        "地区",
        "月份",
        "0:00",
        "1:00",
        "2:00",
        "3:00",
        "4:00",
        "5:00",
        "6:00",
        "7:00",
        "8:00",
        "9:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "0:00",
      ],
      tableData: [],
      dataURL: "",
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    clickGeneratePicture() {
      this.showLoading = true;
      const ref = this.$refs.faultTree; // 截图区域
      this.$nextTick(() => {
        html2canvas(ref, {
          backgroundColor: "white",
        })
          .then((canvas) => {
            const dataURL = canvas.toDataURL("image/png");
            this.dataURL = dataURL;
            const creatDom = document.createElement("a");

            document.body.appendChild(creatDom);

            creatDom.href = dataURL;

            creatDom.download = "各省峰谷时段";
            creatDom.click();

            this.showLoading = false;
          })
          .catch((err) => {
            this.showLoading = false;
            console.error(err);
          });
      });
    },

    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime,
      });
    },

    async getData() {
      const { datas } = await getNewTimeSharing();
      if (datas.length > 0) {
        this.tableData = datas.map((item) => {
          let row = Object.values(item);
          row = row.map((key) => {
            return key.split(",");
          });
          return row;
        });
      }
    },
    setColor(item) {
      let color, backgroundColor;
      switch (item) {
        case "低":
          color = "#50B142";
          backgroundColor = "#EDF7EC";
          break;
        case "平":
          color = "#F1AD10";
          backgroundColor = "#FFFAE8";
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
    },
    setStyle(item) {
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
    },
  },
};
</script>
<style lang="scss" scoped>
.province-peak-valley-time {
  width: 100%;
}

.content {
  margin-top: 16px;
  width: 100%;
  height: 68vh;
  overflow: auto;
}

.box {
  background-color: white;
  position: relative;
  width: 1928px;
  padding-bottom: 24px;
}

.masker-img {
  position: absolute;
  left: 20px;
  top: 100px;
  width: 489px;
  height: 319px;
}

.th-box {
  width: 100%;
  height: 48px;
  background: #f2f3f5;
  border-radius: 4px 4px 0px 0px;
  display: flex;
  align-items: center;
  padding: 16px 13px;
  box-sizing: border-box;
  margin-bottom: 4px;

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
</style>
