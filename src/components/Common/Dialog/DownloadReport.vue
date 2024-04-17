<template>
  <div class="export_container">
    <div class="container">
      <div class="content_head">
        <div class="head_title">编辑报告名称</div>
        <div class="head_icon">
          <img :src="icon_closure" @click.stop="handleCancel" />
        </div>
      </div>
      <div class="content_inp">
        <input
          ref="input_name"
          v-model.trim="inputVal"
          type="text"
          placeholder="请输入20字以内的名称"
          @focus="inputFocus('input_name')"
          @blur="inputBlur('input_name')"
        />
        <p v-show="errTitle.errTitleShow" class="errTitle">
          {{ errTitle.errTitleText }}
        </p>
      </div>
      <div class="content_export_type">
        <div
          v-for="(item, index) in list"
          :key="item.type"
          class="export_type_item"
          @click="selectType(index)"
        >
          <div class="img_top">
            <img :src="getImgUrl(item.flag)" />
          </div>
          <div class="img_bottom">
            <img v-show="item.type === 'pdf'" :src="exportPdf" />
            <img v-show="item.type === 'docx'" :src="exportWord" />
          </div>
        </div>
      </div>
      <div class="content_foot">
        <el-button type="primary" @click="exportAll" style="margin-left: 8px">
          下载
        </el-button>
        <el-button @click="handleCancel"> 取消 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import icon_closure from "@/assets/img/common/cancel.png";
import exportPdf from "@/assets/img/common/icon_export_pdf.png";
import exportWord from "@/assets/img/common/icon_export_word.png";
import radioFalse from "@/assets/img/common/i-Report-radio-false.png";
import radioTrue from "@/assets/img/common/i-Report-radio-true.png";
import { WORD_COVER, PREVIEW_TYPE } from "@/utils/downReport";
import { cloneDeep } from "lodash";
import { exportDocument } from "@/utils/docx";
export default {
  props: {
    defaultTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputVal: "",
      report: {
        id: REPORT_ID.PARENT_ID,
        reportName: "0",
        reportSubMenus: [],
        reportYear: "",
        reportTags: [],
        reportSubtitle: "",
      },
      list: [
        {
          flag: true,
          type: "docx",
        },
        {
          flag: false,
          type: "pdf",
        },
      ],
      errTitle: {
        errTitleText: null,
        errTitleShow: false,
      },
      type: "",
      icon_closure,
      exportPdf,
      exportWord,
      radioFalse,
      radioTrue,
    };
  },
  computed: {
    getImgUrl() {
      return (flag) => {
        return flag ? radioTrue : radioFalse;
      };
    },
  },
  mounted() {
    this.inputVal = this.defaultTitle;
  },
  methods: {
    async exportAll() {
      if (this.checkFunction("input_name")) {
        this.$refs["input_name"].style["border-color"] = "#c2bebe";
        this.errTitle = {
          errTitleText: null,
          errTitleShow: false,
        };
        const index = this.list.findIndex((item) => item.flag);
        this.type = this.list[index].type;
        if (index === -1) return;
        this.generateFile();
      }
    },
    // 生成报告
    async dataToFile() {
      let cover = WORD_COVER();
      console.log("11111111", this.report);
      this.report.createTime = new Date()
        .toLocaleDateString()
        .split("/")
        .join("-");

      const res = await exportDocument(cloneDeep(this.report), VALUE_PROPERTY, {
        type: PREVIEW_TYPE.WORD,
        report: "",
        menu: false,
        cover,
      });
      const wordFile = new window.File([res.formData], `${res.name}.docx`, {
        type: res.formData.type,
      });
      return { wordFile, res };
    },
    // 上传文件并下载
    async generateFile() {
      try {
        const { wordFile, res } = await this.dataToFile();
        convertFile({
          file: wordFile,
          fileType: this.type,
          moduleName: "INDUSTRIAL_COMMERCIAL_ENERGY_STORAGE",
        }).then((data) => {
          this.exportLoading = false;
          const blob = new Blob([data]);
          const link = document.createElement("a");
          link.download = `${res.name + "." + this.type}`;
          link.style.display = "none";
          link.href = window.URL.createObjectURL(blob);
          this.type === "pdf" && (link.target = "_blank");
          document.body.append(link);
          link.click();
          window.URL.revokeObjectURL(link.href);
        });
      } catch (error) {
        return false;
      }
    },

    handleCancel() {
      this.list.forEach((item) => {
        item.flag = false;
      });
      this.inputVal = "";
      this.$emit("handleCancel");
    },
    selectType(index) {
      this.list.forEach((item) => {
        item.flag = false;
      });
      this.list[index].flag = true;
    },
    inputFocus(refName) {
      this.$refs[refName].style["border-color"] = "#165DFF";
    },
    inputBlur(refName) {
      if (this.checkFunction(refName)) {
        this.$refs[refName].style["border-color"] = "#c2bebe";
        this.errTitle = {
          errTitleText: null,
          errTitleShow: false,
        };
      }
    },
    checkFunction(refName) {
      if (this.inputVal === "") {
        this.$refs[refName].style["border-color"] = "#F00";
        this.errTitle = {
          errTitleText: "请输入报告名称",
          errTitleShow: true,
        };
        return false;
      }
      if (this.inputVal.length > 20) {
        this.$refs[refName].style["border-color"] = "#F00";
        this.errTitle = {
          errTitleText: "请输入20字以内的名称",
          errTitleShow: true,
        };
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.export_container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  .container {
    width: 368px;
    height: 324px;
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    box-sizing: border-box;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .content_head {
      display: flex;
      justify-content: space-between;
      height: 24px;
      line-height: 24px;
      .head_title {
        font-weight: 600;
        font-size: 18px;
        color: #1c232f;
      }
      .head_icon {
        img {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }
      }
    }
    .content_inp {
      width: 100%;
      height: 58px;
      margin-top: 16px;
      input {
        height: 32px;
        width: 100%;
        padding: 0px 16px;
        border-radius: 4px;
        border: 1px solid #c2bebe;
        font-size: 14px;
      }
      .errTitle {
        height: 26px;
        line-height: 22px;
        font-size: 12px;
        color: #ff0000;
        padding-left: 8px;
      }
    }
    .content_export_type {
      margin-top: 4px;
      display: flex;
      justify-content: space-between;
      height: 120px;
      width: 100%;
      .export_type_item {
        cursor: pointer;
        width: 156px;
        height: 100%;
        border: 1px solid #f1f2f7;
        border-radius: 8px;
        .img_top {
          img {
            width: 24px;
            height: 24px;
          }
        }
        .img_bottom {
          img {
            margin-top: 16px;
            height: 49px;
            width: 48px;
            margin-left: 26px;
          }
        }
      }
    }
    .content_foot {
      display: flex;
      padding-top: 16px;
      flex-direction: row-reverse;
      .btn {
        width: 80px;
        height: 32px;
        font-size: 14px;
        line-height: 32px;
        text-align: center;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn_export {
        background-color: #165dff;
        color: #ffffff;
        margin-left: 8px;
      }
      .btn_cancel {
        background-color: #f3f4f7;
        color: #5b6985;
      }
    }
  }
}
</style>
