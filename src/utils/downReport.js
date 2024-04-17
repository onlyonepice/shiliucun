import { useUserStore } from "@/store/modules/user";
import { AlignmentType, TextDirection, BorderStyle } from "docx";

export const REGEXP = {
  imgUrlReg: /https\:\/\/storageenergy\.oss\-cn\-shanghai\.aliyuncs\.com/,
  imgUrl_page: {
    dev: /https\:\/\/storageenergy\.oss\-accelerate\.aliyuncs\.com/,
    test: /https\:\/\/storageenergy\.oss\-accelerate\.aliyuncs\.com/,
    prod: /https\:\/\/storageenergy\.oss\-accelerate\.aliyuncs\.com/,
  },
  isVarText: /[a-zA-Z]*/g,
  isCreateTime: /[0-9\-]*\s/,
  color16Reg: /^#([0-9a-fA-F]{6}){1}$/,
  colorRgbReg: /^(rgb|RGB|rgba|RGBA)\((\d+),\s*(\d+),\s*(\d+)(,\s*)?(\d+)?\)$/,
  numberReg: /^-?\d+(\.\d+)?$/,
  stringReg: /^[\w\-\_\.\/0-9\?\=\&]+$/,
  emailReg: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  integerReg: /^-?\d+$/,
  minusReg: /^-\d+(,\d{3})*(\.\d+)?$/,
  percentReg: /^-?\d+(,\d{3})*(\.\d+)?%$/,
};

export const REPORT_TYPE = {
  MARKET: "market",
  PATENT: "patent",
  TENDER: "tender",
  ATTESTATION: "attestation",
  FINANCE: "finance",
  SYSTEM: "system",
  ENTERPRISE: "enterprise",
  MARKET_MENU: "reportSubMenus",
  PATENT_MENU: "patentLayoutMenus",
  TENDER_MENU: "biddingSampleMenuResps",
  MARKET_ROOT_MENU: "reportRootMenu",
  PATENT_ROOT_MENU: "patentLayoutRootMenu",
  TENDER_ROOT_MENU: "biddingSampleRootMenu",
  MARKET_MENU_DATA: "reportMenuData",
  PATENT_MENU_DATA: "patentLayoutData",
  TENDER_MENU_DATA: "biddingSampleDataResp",
  MARKET_TAGS: "reportTags",
  PATENT_TAGS: "reportTags",
  TENDER_TAGS: "reportTags",
  ATTESTATION_TAGS: "reportTags",
  FINANCE_TAGS: "reportTags",
  ONLINE_REPORT: "online",
  QUARTERLY_AND_MONTHLY_REPORTS: "month",
  WHITE_PAPER: "white",
  WEEK: "WEEKLY_REPORT",
  MONTH: "MONTHLY_REPORT",
  SEASON: "QUARTERLY_REPORT",
};
/**
 * @type Object
 * @description word Setting default
 */
export const WORD_SETTING = {
  headerImg: new Blob([], { type: "image/png" }),
  countObj: {
    imageOrderCount: 1,
    tableOrderCount: 1,
    pageOrder: 0,
    menuRootId: 1,
  },
  properties: {
    page: {
      margin: {
        left: "3.17cm",
        right: "3.17cm",
        top: "2.54cm",
        bottom: "2.54cm",
      },
    },
  },
  table: {
    maxWidth: 600,
    dict: {
      tableDict: {
        borderStyle: {
          color: "DEE1E8",
          style: BorderStyle.SINGLE,
          size: 8,
        },
        head: "table-header",
      },
      tableRowDict: {
        BACK_COLOR: "005EC8",
        TEXT_COLOR: "FFFFFF",
        head: "row-header",
        textColor: "row-color",
      },
      tableCellDict: {
        BACK_COLOR: "005EC8",
        TEXT_COLOR: "FFFFFF",
        head: "cell-header",
        textAlign: AlignmentType.LEFT,
        textRotate: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM,
        textColor: "cell-color",
        textBold: "cell-bold",
      },
    },
  },
  image: {
    maxWidth: 552,
  },
  cover: [],
  report: {},
};

export const NO_VALUE_PROPERTY = {
  page: {
    margin: {
      left: "0cm",
      right: "0cm",
      top: "0cm",
      bottom: "0cm",
    },
  },
};

export const VALUE_PROPERTY = {
  page: {
    margin: {
      left: "3.17cm",
      right: "3.17cm",
      top: "2.54cm",
      bottom: "2.54cm",
    },
  },
};

export function splicePicturePath(url) {
  if (url && REGEXP.stringReg.test(url)) {
    return url.includes("http")
      ? url
      : url.includes("static")
        ? url
        : `${useUserStore().$state.imgUrl || ""}${url}`;
  } else return url;
}

// base64转文件
export const base64toFile = (base, filename = "1") => {
  let arr = base.split(",");
  if (arr.length < 2) {
    base = `data:application/pdf;base64,${base}`;
    arr = base.split(",");
  }
  const type = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  // 转换成file对象
  return new File([u8arr], filename, { type });
};

// 返回JSON解析数据或者原始数据
export const getJsonData = (data) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};
export const WORD_COVER = () => {
  return '[{"class":"Paragraph","frame":{"anchor":{"horizontal":"PAGE","vertical":"PAGE"},"width":"535.5pt","height":"780pt","position":{"y":"30pt","x":"30pt"}},"border":{"left":{"style":"single","color":"1D3B80","size":5},"top":{"style":"single","color":"1D3B80","size":5},"bottom":{"style":"single","color":"1D3B80","size":5},"right":{"style":"single","color":"1D3B80","size":5}},"children":[{"class":"ImageRun","data":"https://oss.eesaenergy.com/eesa/ci/static/report/word-img-header.png","transformation":{"width":88,"height":40},"floating":{"horizontalPosition":{"relative":"PAGE","offset":760000},"verticalPosition":{"relative":"CHARACTER","offset":760000},"behindDocument":true,"layoutInCell":true,"wrap":{"type":"TOP_AND_BOTTOM","side":"BOTH_SIDES"}}}]},{"class":"Paragraph","frame":{"anchor":{"horizontal":"PAGE","vertical":"PAGE"},"width":"567pt","height":"180pt","position":{"x":"0pt","y":"210pt"}},"shading":{"fill":"1D3B80","type":"pct50"}},{"class":"Paragraph","frame":{"anchor":{"horizontal":"PAGE","vertical":"PAGE"},"width":"420pt","height":"72pt","position":{"x":"60pt","y":"240pt"}},"children":[{"class":"TextRun","text":"$report.reportName","size":"24pt","font":"微软雅黑","color":"ffffff","bold":true},{"class":"TextRun","text":"$report.reportSubtitle","size":"18pt","font":"微软雅黑","color":"ffffff","break":1}],"alignment":"LEFT"},{"class":"Paragraph","frame":{"height":"16.5pt","anchor":{"horizontal":"PAGE","vertical":"PAGE"},"position":{"x":"60pt","y":"420pt"}},"alignment":"LEFT","children":[{"class":"TextRun","text":"储能领跑者联盟","size":"12pt","font":"微软雅黑","color":"011617"},{"class":"TextRun","text":" ","size":"3pt"},{"class":"TextRun","text":"www.eesaenergy.com","size":"12pt","font":"微软雅黑","color":"011617","break":1}]},{"class":"Paragraph","frame":{"width":"150pt","height":"16.5pt","anchor":{"horizontal":"PAGE","vertical":"PAGE"},"position":{"x":"386.25pt","y":"420pt"}},"alignment":"RIGHT","children":[{"class":"TextRun","text":"编撰日期：","size":"12pt","font":"微软雅黑","color":"011617"},{"class":"TextRun","text":"$report.updateTime","size":"11pt","font":"微软雅黑","color":"011617"}]},{"class":"Paragraph","frame":{"width":"120pt","height":"24pt","anchor":{"horizontal":"PAGE","vertical":"PAGE"},"position":{"x":"447pt","y":"785.25pt"}},"shading":{"fill":"1D3B80","type":"pct50"},"alignment":"CENTER","spacing":{"line":240,"lineRule":"auto"},"children":[{"class":"TextRun","text":"一心向储 · 坚定不移","size":"10.5pt","font":"微软雅黑","color":"ffffff"}]}]';
};

export const PREVIEW_TYPE = {
  NORMAL: "html",
  WORD: "word",
};
