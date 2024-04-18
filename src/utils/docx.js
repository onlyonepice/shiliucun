import hearImg from "@/assets/img/common/word-img-header.png";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ImageRun,
  UnderlineType,
  WidthType,
  AlignmentType,
  LineRuleType,
  VerticalAlign,
  Header,
  FrameAnchorType,
  TableOfContents,
  PageNumber,
  Footer,
  VerticalPositionRelativeFrom,
  HorizontalPositionRelativeFrom,
  TextWrappingType,
  TextWrappingSide,
  TextDirection,
  BorderStyle,
  ExternalHyperlink,
  Level,
} from "docx";
import { ElMessage } from "element-plus";
import { endsWith, get, cloneDeep, startsWith, has } from "lodash";
import {
  REPORT_TYPE,
  REGEXP,
  splicePicturePath,
  WORD_SETTING,
  NO_VALUE_PROPERTY,
  VALUE_PROPERTY,
  base64toFile,
  getJsonData,
} from "./downReport";
const VUE_APP_IMAGE_URL = "https://oss.eesaenergy.com";
const VUE_APP_IMAGE_PATH_FIELD = "test";

export const docxDict = {
  width: "width",
  " width": "width",
  height: "height",
  " height": "height",
  "background-color": "shading",
  " background-color": "shading",
  border: "borders",
  " border": "borders",
  margin: "margins",
  " margin": "margins",
  "text-align": "alignment",
  " text-align": "alignment",
  "font-family": "font",
  " font-family": "font",
  "text-decoration-line": "underline",
  " text-decoration-line": "underline",
  color: "color",
  " color": "color",
  "font-size": "size",
  " font-size": "size",
  tabs: "indent",
  "text-indent": "indent",
  " text-indent": "indent",
  "line-height": "spacing",
  " line-height": "spacing",
  b: "bold",
  strong: "bold",
  " strong": "bold",
  u: "underline",
  i: "italics",
  s: "strike",
  style: "style",
  colspan: "columnSpan",
  rowspan: "rowSpan",
  "text-rotate": "textDirection",
  btlr: TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT, // -90
  lrtb: TextDirection.LEFT_TO_RIGHT_TOP_TO_BOTTOM, // 0
  tbrl: TextDirection.TOP_TO_BOTTOM_RIGHT_TO_LEFT, // 90
  AlignmentType,
  LineRuleType,
  Document,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  ImageRun,
  Header,
  TableOfContents,
  Footer,
  Level,
  UnderlineType,
  WidthType,
};
const docxTextArr = [
  "bold",
  "italics",
  "smallCaps",
  "allCaps",
  "strike",
  "underline",
  "emphasisMark",
  "color",
  "size",
  "font",
  "characterSpacing",
  "shading",
];
const blockEl = [
  "div",
  "ul",
  "li",
  "p",
  "block",
  "dl",
  "dt",
  "dd",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "h7",
];

const characterSizeDict = {
  1: "18pt",
  2: "17pt",
  3: "16pt",
  4: "14pt",
  5: "12pt",
  6: "11pt",
  SIZE_NORMAL: "10pt",
  FONT_NORMAL: "微软雅黑",
};

/**
 * @param {Object} data
 */
const insertParagraph = (data) => {
  const _data = [...data];
  const parent = [];
  _data.map((op) => {
    replaceStyle(op, op.attrs);
    op["font"] = characterSizeDict.FONT_NORMAL;
    op.text = op.content ? op.content : "";
    if (op.children && op.children.length > 0) {
      // 将 strong标签转换为bold，加粗字体
      if (docxDict[op.tag] === "bold" || docxDict[op.tag] === "italics") {
        op[docxDict[op.tag]] = true;
      }
      // 添加下划线
      if (docxDict[op.tag] === "underline") {
        op[docxDict[op.tag]] = {
          type: UnderlineType.SINGLE,
          color: "000000",
        };
      }
      Object.keys(op).map((attr) => {
        const finds = docxTextArr.filter((option) => option === attr);
        finds.map((textAttr) => {
          op.children.map((opChild) => (opChild[textAttr] = op[textAttr]));
          delete op[textAttr];
        });
      });
      op.children = insertParagraph(op.children);
      // 根据标签名字，插入不同的段落样式
      if (blockEl.find((tag) => op.tag === tag)) {
        parent.push(
          new Paragraph({
            spacing: {
              line: 480, // 设置字体行高
              lineRule: LineRuleType.EXACTLY,
            },
            ...op,
          }),
        );
      } else {
        parent.push(
          new TextRun({
            size: characterSizeDict.SIZE_NORMAL,
            spacing: {
              line: 260,
              after: "3pt",
              lineRule: LineRuleType.AT_LEAST,
            },
            ...op,
          }),
        );
      }
    } else {
      delete op.children;
      if (op.tag === "br") {
        parent.push(
          new TextRun({
            size: pxToPt(characterSizeDict.SIZE_NORMAL),
            break: 1,
          }),
        );
      } else if (!op.tag) {
        parent.push(
          new TextRun({ size: pxToPt(characterSizeDict.SIZE_NORMAL), ...op }),
        );
      }
    }
  });
  return parent;
};

/**
 *
 * @param {String} data 目录下的富文本集合
 * @param {Array} parent word page
 */
const insertControlFn = (data, parent) => {
  try {
    data.map((option) => {
      const dataType = Number(option.dataType);
      // JSON数据格式与图片链接格式不同，需要做区分，dataType === 2 为图片链接无需JSON解析
      // TODO: 优化代码
      const _dataContent = getJsonData(option.dataContent);
      switch (dataType) {
        case 1:
          parent.push(insertParagraph(_dataContent));
          break;
        case 2:
          parent.push(
            ...insertImage(
              { img: getJsonData(_dataContent) },
              `${WORD_SETTING.countObj.pageOrder}-${WORD_SETTING.countObj.imageOrderCount++}`,
            ),
          );
          break;
        case 3:
          parent.push(
            ...insertTable(
              _dataContent,
              `${WORD_SETTING.countObj.pageOrder}-${WORD_SETTING.countObj.tableOrderCount++}`,
            ),
          );
          break;
        default:
          getJsonData(_dataContent).img &&
            parent.push(
              ...insertImage(
                { img: getJsonData(_dataContent) },
                `${WORD_SETTING.countObj.pageOrder}-${WORD_SETTING.countObj.imageOrderCount++}`,
              ),
            );
          break;
      }
    });
  } catch (err) {
    return err;
  }
};

/**
 *
 * @param {*} obj 要添加样式的对象
 * @param {*} style 样式
 * @param {*} el 当前节点
 */
const replaceStyle = (obj, style) => {
  let styleKeys = Object.keys(style);
  let tempKey = "";
  styleKeys.map((key) => {
    obj[docxDict[key]] = style[key];
    if (key === "style") {
      if (!style[key]) return;
      tempKey = style[key].split(";");
      tempKey.map((styleSet) => {
        if (styleSet) {
          const s = styleSet.split(": ");
          obj[docxDict[s[0]]] = s[1];
          if (docxDict[s[0]] === "shading") {
            obj[docxDict[s[0]]] = {};
            obj[docxDict[s[0]]]["fill"] = rgbToHtx(s[1]);
          }
          if (docxDict[s[0]] === "color") {
            obj[docxDict[s[0]]] = rgbToHtx(s[1]);
          }
          if (docxDict[s[0]] === "width") {
            if (isNaN(s[1].split("px")[0] * 1)) {
              obj[docxDict[s[0]]] = {
                type: s[1].includes("%")
                  ? WidthType.PERCENTAGE
                  : WidthType.AUTO,
                size: s[1].includes("%") ? s[1] : 100,
              };
            } else {
              obj[docxDict[s[0]]] = {
                type: WidthType.DXA,
                size: s[1].split("px")[0] * 3,
              };
            }
          }
          if (docxDict[s[0]] === "indent") {
            obj.indent = {
              firstLine: "1cm",
            };
          }
          if (docxDict[s[0]] === "spacing") {
            obj.spacing = {
              line: 20 * 27 * (s[1] * 0.445),
              lineRule: LineRuleType.AUTO,
            };
          }
          if (docxDict[s[0]] === "size") {
            obj[docxDict[s[0]]] = pxToPt(s[1]);
          }
        }
      });
    } else if (key === "width") {
      if (!isNaN(Number(style[key]))) {
        obj[docxDict[key]] = {
          type: WidthType.DXA,
          size: style[key] * 15,
        };
      } else {
        if (obj.children.length < 1) {
          obj[docxDict[key]] = {
            type: WidthType.DXA,
            size: 75 * 3,
          };
        }
      }
    }
    delete obj.undefined;
  });
  tempKey = null;
  styleKeys = null;
};

/**
 *
 * @param {*} value = 'rgb()'
 * @returns
 */
const rgbToHtx = (value) => {
  if (!REGEXP.colorRgbReg.test(value)) return value;
  const tempColor = value.replace(REGEXP.colorRgbReg, "$2,$3,$4").split(",");
  return tempColor
    .map((htx) => {
      if (htx > 16) return (+htx).toString(16);
      return `0${(+htx).toString(16)}`;
    })
    .join("");
};

/**
 * 插入表格
 * @param {Array} data table
 * @param {Array} parent tr || td
 */
const insertTable = (data, order) => {
  // TODO: 优化代码
  let tableOrder = ""; // 表格标题-表格头部 children[0]
  let table = []; // 表格内容 children[1]
  let tableStyle = {}; // 表格样式 children[1]
  let tableSource = ""; // 表格来源-表格底部 children[2]
  const result = []; // 返回值
  if (data[0] && data[0].children && data[0].children.length > 1) {
    tableOrder = data[0].children[0].children[0].content;
    table = data[0].children[1].children[0];
    tableStyle = data[0].children[1].attrs;
    if (data[0].children.length === 3)
      tableSource = data[0].children[2].children[0].content;
  } else {
    table = data[0].children[0].children[0];
    tableStyle = data[0].children[0].attrs;
  }
  let rows = [];
  const tableObj = {
    rows,
    cantSplit: true, // 表格被分页展示时不破坏一行内容
    alignment: AlignmentType.CENTER,
  };
  const tbodyMax = WORD_SETTING.table.maxWidth;
  const { tableDict, tableRowDict } = WORD_SETTING.table.dict;
  const isTableHead = get(tableStyle, tableDict.head);
  table.children.map((tr, trIndex) => {
    let cell = [];
    const tdMax = tbodyMax / tr.children.length;
    tr.children.map((td) => {
      const { colspan, rowspan } = td.attrs;
      if (colspan && colspan === "0" && rowspan && rowspan === "0") return;
      // cellObj设置表格单元格样式
      let cellObj = { children: [] };
      replaceStyle(cellObj, td.attrs);
      // 旋转
      const rotate = get(cellObj, "textDirection");
      if (rotate) cellObj["textDirection"] = docxDict[rotate];
      // 对齐方式
      const textAlign = get(cellObj, "alignment");
      // 是否有表头颜色值
      const fill = getTableCellBackColor(td.attrs, trIndex);
      if (td.children && td.children.length > 0) {
        const tdChild = cellObj["children"];
        td.children.map((tdNode) => {
          const tdAttrs = tdNode.attrs.style;
          // style字段以%/px结尾的，将宽高拼接到图片链接后面
          if (tdAttrs) {
            const percent = tdAttrs.match(/[0-9\.]+(\%|px)/)[0];
            if (endsWith(percent, "%") || endsWith(percent, "px")) {
              const percentNum = endsWith(percent, "%")
                ? tdMax * (percent.slice(0, -1) / 100)
                : percent.slice(0, percent.length - 2);
              tdNode.attrs.src = `${tdNode.attrs.src.split("?")[0]}?width=${percentNum}&height=${percentNum}`;
            }
          }
          // 区分插入表格中的图片和文字
          switch (tdNode.tag) {
            case "img":
              tdChild.push(...insertImage({ img: tdNode.attrs.src }));
              break;
            case "br":
              tdChild.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: " ",
                      size: pxToPt("9pt"),
                      font: characterSizeDict.FONT_NORMAL,
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                }),
              );
              break;
            default:
              tdChild.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: tdNode.content,
                      size: pxToPt("9pt"),
                      color: getTableCellTextColor(td.attrs, trIndex),
                      font: characterSizeDict.FONT_NORMAL,
                      bold: getTableCellTextBold(td.attrs, trIndex),
                    }),
                  ],
                  alignment: textAlign || AlignmentType.LEFT,
                  spacing: { line: "13.5pt" },
                }),
              );
              break;
          }
        });
      }
      cellObj["margins"] = {
        left: 116,
        right: 116,
        marginUnitType: WidthType.DXA,
      };
      const borderStyle = {
        color: cellObj.borders === "none" ? "FFFFFF" : "DEE1E8",
        style: BorderStyle.SINGLE,
        size: 8,
      };
      cellObj["borders"] = {
        top: borderStyle,
        right: borderStyle,
        bottom: borderStyle,
        left: borderStyle,
      };
      cellObj["verticalAlign"] = VerticalAlign.CENTER;
      // 行
      if (isTableHead && !fill) {
        // 16
        const isColor16 = REGEXP.color16Reg.test(isTableHead);
        isColor16 &&
          trIndex === 0 &&
          (cellObj["shading"] = {
            fill: isTableHead.replace(REGEXP.color16Reg, "$1"),
          });
        // rgb
        const isColorRgb = REGEXP.colorRgbReg.test(isTableHead);
        isColorRgb &&
          trIndex === 0 &&
          (cellObj["shading"] = { fill: rgbToHtx(isTableHead) });
        // index
        const isIndex = REGEXP.numberReg.test(isTableHead);
        isIndex &&
          trIndex.toString() === isTableHead &&
          (cellObj["shading"] = { fill: tableRowDict.BACK_COLOR });
      }
      fill && (cellObj["shading"] = { fill });
      cell.push(new TableCell(cellObj));
      cellObj = null;
    });
    rows.push(new TableRow({ children: cell, cantSplit: true }));
    cell = null;
  });
  replaceStyle(tableObj, tableStyle);
  // 插入表格标题并添加标题上下边距
  if (tableOrder) {
    result.push(
      new Paragraph({
        children: [new TextRun({ text: " ", size: "12pt" })],
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `表 ${order}  ${tableOrder}`,
            size: pxToPt("9pt"),
            font: characterSizeDict.FONT_NORMAL,
          }),
        ],
        spacing: {
          before: "3pt",
          after: "3pt",
        },
        widowControl: true,
      }),
      new Paragraph({
        children: [new TextRun({ text: " ", size: "3pt" })],
        alignment: AlignmentType.CENTER,
      }),
    );
  }
  result.push(new Table(tableObj));
  // 插入表格右下角数据来源，并添加上下边距
  result.push(
    new Paragraph({
      children: [new TextRun({ text: " ", size: "3pt" })],
      alignment: AlignmentType.CENTER,
    }),
  );
  if (tableSource) {
    result.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "数据来源：",
            size: pxToPt("9pt"),
            font: characterSizeDict.FONT_NORMAL,
          }),
          new TextRun({
            text: `${tableSource}`,
            size: pxToPt("9pt"),
            font: characterSizeDict.FONT_NORMAL,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: {
          line: 480, // 240 * 1
          lineRule: LineRuleType.EXACTLY,
        },
        widowControl: true,
      }),
      new Paragraph({
        children: [new TextRun({ text: " ", size: "12pt" })],
        alignment: AlignmentType.CENTER,
      }),
    );
  }
  rows = null;
  return result;
};

/**
 *
 * @param { style } Attrs
 * @param { index } trIndex
 * @returns
 */
const getTableCellBackColor = (Attrs, trIndex) => {
  let result = "";
  const { tableRowDict, tableCellDict } = WORD_SETTING.table.dict;
  // 是否存在行表头
  const TableRowHeadHas = has(Attrs, tableRowDict.head);
  // 行表头值
  const TableRowHeadValue = get(Attrs, tableRowDict.head, false);
  const TableCellHeadHas = has(Attrs, tableCellDict.head);
  const TableCellHeadValue = get(Attrs, tableCellDict.head, false);
  // 优先设置单元格
  if (TableCellHeadHas) {
    // 有属性
    if (TableCellHeadValue) {
      // 判断值是色值还是索引
      if (REGEXP.color16Reg.test(TableCellHeadValue))
        result = TableCellHeadValue.replace(REGEXP.color16Reg, "$1");
      else if (
        REGEXP.numberReg.test(TableCellHeadValue) &&
        trIndex === TableCellHeadValue
      )
        result = "005EC8";
    } else {
      // 默认颜色
      result = "005EC8";
    }
  } else if (TableRowHeadHas) {
    // 设置行
    if (TableRowHeadValue) {
      if (REGEXP.color16Reg.test(TableRowHeadValue) && trIndex === 0)
        result = TableRowHeadValue.replace(REGEXP.color16Reg, "$1");
      else if (
        REGEXP.numberReg.test(TableRowHeadValue) &&
        trIndex === +TableRowHeadValue
      )
        result = "005EC8";
    } else if (trIndex === 0) result = "005EC8";
  } else if (!TableRowHeadHas && !TableRowHeadHas && trIndex === 0)
    result = "005EC8";
  return result;
};

/**
 *
 * @param { style } Attrs
 * @param { index } trIndex
 * @returns
 */
const getTableCellTextColor = (Attrs, trIndex) => {
  let result = "";
  const { tableRowDict, tableCellDict } = WORD_SETTING.table.dict;
  // 是否存在行表头
  const TableRow = has(Attrs, tableRowDict.textColor);
  // 行表头值
  const TableRowValue = get(Attrs, tableRowDict.textColor, false);
  const TableCellHas = has(Attrs, tableCellDict.textColor);
  const TableCellValue = get(Attrs, tableCellDict.textColor, false);
  // 优先设置单元格
  if (TableCellHas) {
    // 有属性
    if (TableCellValue) {
      // 判断值是色值还是索引
      if (REGEXP.color16Reg.test(TableCellValue))
        result = TableCellValue.replace(REGEXP.color16Reg, "$1");
      else if (
        REGEXP.numberReg.test(TableCellValue) &&
        trIndex === TableCellValue
      )
        result = tableCellDict.TEXT_COLOR;
    } else {
      // 默认颜色
      result = tableCellDict.TEXT_COLOR;
    }
  } else if (TableRow) {
    // 设置行
    if (TableRowValue) {
      if (REGEXP.color16Reg.test(TableRowValue) && trIndex === 0)
        result = TableRowValue.replace(REGEXP.color16Reg, "$1");
      else if (
        REGEXP.numberReg.test(TableRowValue) &&
        trIndex === +TableRowValue
      )
        result = tableRowDict.TEXT_COLOR;
    } else if (trIndex === 0) result = tableRowDict.TEXT_COLOR;
  } else if (!TableRow && !TableRow && trIndex === 0)
    result = tableRowDict.TEXT_COLOR;
  return result;
};

/**
 *
 * @param { style } Attrs
 * @param { index } trIndex
 * @returns
 */
const getTableCellTextBold = (Attrs, trIndex) => {
  let result = false;
  const { tableRowDict, tableCellDict } = WORD_SETTING.table.dict;
  // 是否存在行表头
  const TableRow = has(Attrs, tableRowDict.textBold);
  // 行表头值
  const TableRowValue = get(Attrs, tableRowDict.textBold, false);
  const TableCellHas = has(Attrs, tableCellDict.textBold);
  const TableCellValue = get(Attrs, tableCellDict.textBold, false);
  // 优先设置单元格
  if (TableCellHas) {
    // 有属性
    if (TableCellValue) {
      // 判断值是色值还是索引
      if (REGEXP.numberReg.test(TableCellValue) && trIndex === +TableCellValue)
        result = true;
    } else result = true;
  } else if (TableRow) {
    // 设置行
    if (TableRowValue) {
      if (REGEXP.numberReg.test(TableRowValue) && trIndex === +TableRowValue)
        result = true;
    } else if (trIndex === 0) result = true;
  } else if (!TableRow && !TableRow && trIndex === 0)
    result = tableRowDict.TEXT_COLOR;
  return result;
};

// 插入图片
const insertImage = ({ img: dataContent }, order) => {
  try {
    const result = [];
    const _img =
      typeof dataContent === "string" ? dataContent : dataContent.img;
    const img = getImgFile(
      splicePicturePath(_img)
        .replace(REGEXP.imgUrlReg, VUE_APP_IMAGE_URL)
        .replace(
          REGEXP.imgUrl_page[VUE_APP_IMAGE_PATH_FIELD],
          VUE_APP_IMAGE_URL,
        )
        .replace(/\"/g, ""),
    );
    // 图片链接中是否有宽高 有则取宽高 没有则取style中的宽高 没有则取默认宽高
    let transformation = { width: 550, height: 300 };
    // 拆解图片链接中的宽高
    if (_img.indexOf("?") > -1) {
      const imgStyle = _img.split("?")[1].split("&");
      transformation.width = imgStyle[0].split("=")[1];
      transformation.height = imgStyle[1].split("=")[1];
    } else {
      dataContent.style && (transformation = dataContent.style);
    }
    // 插入图片
    result.push(
      new Paragraph({
        children: [new ImageRun({ data: img, transformation })],
        alignment: AlignmentType.CENTER,
      }),
    );
    if (order) {
      // 设置图片标题
      if (dataContent.title || dataContent.order) {
        result.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `图 ${order}  ${dataContent.title ? dataContent.title.text : dataContent.order}`,
                size: pxToPt("9pt"),
                font: characterSizeDict.FONT_NORMAL,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: "3pt", after: "3pt" },
            widowControl: true,
          }),
        );
      }
      // 设置图片来源
      if (dataContent.other || dataContent.source) {
        result.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `数据来源：${dataContent.other ? dataContent.other.sources : dataContent.source}`,
                font: characterSizeDict.FONT_NORMAL,
                size: pxToPt("9pt"),
              }),
            ],
            alignment: AlignmentType.RIGHT,
            widowControl: true,
            spacing: { line: 480, lineRule: LineRuleType.EXACTLY },
          }),
        );
      }
    }
    return result;
  } catch (error) {
    return [];
  }
};

// 将目录扁平化
const flatMenu = (data, arr = [], heading) => {
  heading !== undefined ? heading++ : (heading = 1);
  data.map((item, index) => {
    arr.push({
      ...item,
      heading: heading < 7 ? heading : 7,
      headSize: heading,
      menuSort: ++index,
    });
    if (
      item[REPORT_TYPE.MARKET_MENU] &&
      item[REPORT_TYPE.MARKET_MENU].length > 0
    ) {
      flatMenu(item[REPORT_TYPE.MARKET_MENU], arr, heading);
    }
  });
  return arr;
};

const chapterDict = (option, data) => {
  if (option.headSize > WORD_SETTING.countObj.menuOrder) {
    return `${option.menuName}`;
  }
  let order = [];
  const _fn = (current) => {
    const parentId = current.parentId;
    if (parentId) {
      const parent = data.find((item) => item.id === parentId);
      if (parent) {
        order.push(parent.menuSort);
        _fn(parent);
      }
    }
  };
  _fn(option);
  order = order.reverse().join(".");
  if (!order) order += `${option.menuSort}`;
  else order += `.${option.menuSort}`;
  return `${order}.  ${option.menuName}`;
};

const pxToPt = (num) => {
  if (endsWith(num, "px")) {
    const numCount = num.split("px")[0];
    return `${numCount * 0.75}pt`;
  }
  return num;
};

// 递归循环生成封面内容 包括封面图片，编撰日期等
const parsingCover = (data) => {
  const children = [];
  const parent = [];
  const _data = cloneDeep(data);
  _data.map((item) => {
    if (item.children && item.children.length > 0) {
      item.children = parsingCover(item.children, children);
    }
    // 设置图片居中
    if (item.alignment) {
      item.alignment = AlignmentType[item.alignment];
    }
    // 样式信息
    if (item.frame) {
      item.frame = {
        ...item.frame,
        anchor: {
          horizontal: FrameAnchorType[item.frame.anchor.horizontal],
          vertical: FrameAnchorType[item.frame.anchor.vertical],
        },
      };
    }
    if (item.floating) {
      item.floating = {
        ...item.floating,
        horizontalPosition: {
          relative:
            HorizontalPositionRelativeFrom[
              item.floating.horizontalPosition.relative
            ],
          offset: item.floating.horizontalPosition.offset,
        },
        verticalPosition: {
          relative:
            VerticalPositionRelativeFrom[
              item.floating.verticalPosition.relative
            ],
          offset: item.floating.verticalPosition.offset,
        },
        wrap: {
          type: TextWrappingType[item.floating.wrap.type],
          side: TextWrappingSide[item.floating.wrap.side],
        },
      };
    }
    // 将Blob类型的图片插入到word中用于生成封面图
    if (item.class === "ImageRun") {
      const type = item.class;
      delete item.class;
      item.data = splicePicturePath(item.data);
      const data = getImgFile(
        item.data
          .replace(REGEXP.imgUrlReg, VUE_APP_IMAGE_URL)
          .replace(
            REGEXP.imgUrl_page[VUE_APP_IMAGE_PATH_FIELD],
            VUE_APP_IMAGE_URL,
          )
          .replace(/\"/g, ""),
      );
      const image = new docxDict[type]({ ...item, data });
      parent.push(image);
    }
    if (item.class === "TextRun") {
      const type = item.class;
      delete item.class;
      const isVar = item.text;
      if (isVar && startsWith(isVar, "$")) {
        const _text = item.text.slice(1);
        const _textMatching = _text
          .match(REGEXP.isVarText)
          .filter((item) => item);
        let variable = WORD_SETTING;
        _textMatching.map((item) => {
          variable = variable[item];
        });
        if (variable) {
          const createTime = variable.match(REGEXP.isCreateTime);
          if (createTime) {
            item.text = createTime[0].slice(0, -1);
          } else {
            item.text = variable;
          }
        } else item.text = "";
      }
      const text = new docxDict[type]({ ...item, size: pxToPt(item.size) });
      parent.push(text);
    }
    if (item.class === "Paragraph") {
      const type = item.class;
      delete item.class;
      const paragraph = new docxDict[type]({ ...item });
      parent.push(paragraph);
    }
  });
  return parent;
};

// 设置封面左上角角标及目录
export const exportDocument = async (
  data,
  properties = {},
  setting = {
    report: REPORT_TYPE.MARKET,
    cover: [], // 封面
    menu: true, // 是否导出目录
    menuLevel: "1-2", // 目录层级 1-2 1-3 1-4
    menuOrder: 2, // 目录排序 1 2 3
    username: "EESA", // 导出人
    disclaimer: true,
  },
) => {
  WORD_SETTING.report = data;
  WORD_SETTING.cover = get(setting, "cover", []);
  try {
    if (!WORD_SETTING.headerImg.size) {
      WORD_SETTING.headerImg = await getWordHeaderImg();
    }
  } catch (headerErr) {
    console.warn("页眉LOGO加载失败");
  }
  try {
    WORD_SETTING.countObj = {
      imageOrderCount: 1, // 图片序号
      tableOrderCount: 1, // 表格序号
      pageOrder: 0, // 页码
      menuRootId: data[REPORT_TYPE.MARKET_ROOT_MENU].id, // 目录根节点id
      menuOrder: get(setting, "menuOrder", 2), // 目录排序 1 2 3
    };
    const menuData = flatMenu(data[REPORT_TYPE.MARKET_MENU]);
    const section = [];
    const cover = parsingCover(WORD_SETTING.cover);
    // 设置封面左上角公司icon图片 以段落的形式插入到word中
    if (WORD_SETTING.cover.length) {
      section.push({
        children: cover,
        titlePage: true,
        properties: NO_VALUE_PROPERTY,
      });
    }
    // 导出目录配置
    const insertMenu = get(setting, "menu", true);
    if (insertMenu) {
      const menuLevel = get(setting, "menuLevel", "1-2");
      section.push({
        children: [
          new TableOfContents("目录", {
            headingStyleRange: menuLevel, // 目录层级 1-2 1-3 1-4
            hideTabAndPageNumbersInWebView: false, // 网页模式下隐藏页码数
            hyperlink: true, // 是否链接标题跳转
            preserveNewLineInEntries: true, // 是否保留换行符*
            preserveTabInEntries: true,
          }),
        ],
        titlePage: true, // 将目录设置为第一页
      });
    }
    // 生成报告内容
    convertToWord(menuData, section, properties);
    const username = get(setting, "username", "EESA");
    // 添加免责声明
    const disclaimer = get(setting, "disclaimer", true);
    if (disclaimer) appendDisclaimer(section);
    // 导出
    return exportWord(section, data.reportName, username);
  } catch (err) {
    console.log("=======", err);
    ElMessage.warning("下载失败，请检查文档");
  }
};

const convertToWord = async (data, parent, properties = {}) => {
  const menuList = [];
  const parentMap = {};
  data.map(async (option) => {
    // 根据几级标题设置不一样的样式
    option.heading === 1 &&
      (WORD_SETTING.countObj.imageOrderCount = 1) &&
      (WORD_SETTING.countObj.tableOrderCount = 1) &&
      (WORD_SETTING.countObj.pageOrder += 1);
    const menuData = [];
    // 设置标题，区分第几级标题并设置其他样式
    const menuTitle = new Paragraph({
      children: [
        new TextRun({
          text: chapterDict(option, data),
          color: "#000000",
          font: characterSizeDict.FONT_NORMAL,
          bold: true,
          size: pxToPt(characterSizeDict[option.heading]),
        }),
      ],
      heading: `Heading${option.heading}`,
      alignment: AlignmentType.LEFT,
      spacing: {
        before: "3pt",
        after: "3pt",
        line: 360,
        lineRule: LineRuleType.EXACTLY,
      },
      pageBreakBefore: option.heading === 1,
    });
    // 渲染正文内容
    if (
      option[REPORT_TYPE.MARKET_MENU_DATA] &&
      option[REPORT_TYPE.MARKET_MENU_DATA].length > 0
    ) {
      insertControlFn(option[REPORT_TYPE.MARKET_MENU_DATA], menuData);
    }
    if (option.parentId === WORD_SETTING.countObj.menuRootId) {
      parentMap[`${option.id}-w`] = {
        id: option.id,
        pid: option.parentId,
        menuTitle,
        menuData,
      };
    }
    menuList.push({
      id: option.id,
      pid: option.parentId,
      menuTitle,
      menuData,
    });
  });
  menuList.map((menu) => {
    if (!parentMap[menu.id]) {
      const menuParent = menuList.find((item) => item.id === menu.pid);
      if (menuParent) {
        menuParent.menuData.push(menu.menuTitle, menu.menuData);
      }
    }
  });
  const chapterList = Object.values(parentMap);
  chapterList.map((item) => {
    parent.push({
      children: [item.menuTitle, ...item.menuData.flat(Infinity)],
      properties: Object.assign(VALUE_PROPERTY, properties),
      // 设置每一页的页眉图片
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: WORD_SETTING.headerImg,
                  transformation: {
                    width: 88,
                    height: 40,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: VerticalPositionRelativeFrom.PAGE,
                      offset: 9500 * 40,
                    },
                    verticalPosition: {
                      relative: VerticalPositionRelativeFrom.PAGE,
                      offset: 9500 * 40,
                    },
                  },
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: "3pt", before: "11pt" },
            }),
          ],
        }),
      },
      // 设置页脚 页码
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new ExternalHyperlink({
                  children: [
                    new TextRun({
                      text: "www.eesaenergy.com",
                      size: "9pt",
                    }),
                  ],
                  link: "https://www.eesaenergy.com",
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: {
                lineRule: LineRuleType.EXACTLY,
                line: 240,
                after: "3pt",
                before: "3pt",
              },
              frame: {
                width: "85pt",
                height: "15pt",
                anchor: {
                  horizontal: FrameAnchorType.PAGE,
                  vertical: FrameAnchorType.PAGE,
                },
                position: {
                  x: "30pt",
                  y: "797.25pt",
                },
              },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                }),
                new TextRun(" / "),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                }),
              ],
              alignment: AlignmentType.RIGHT,
              style: "PageNumber",
              spacing: {
                lineRule: LineRuleType.EXACTLY,
                line: 240,
                after: "3pt",
                before: "3pt",
              },
              frame: {
                width: "75pt",
                height: "15pt",
                anchor: {
                  horizontal: FrameAnchorType.PAGE,
                  vertical: FrameAnchorType.PAGE,
                },
                position: {
                  x: "490.5pt",
                  y: "797.25pt",
                },
              },
            }),
          ],
        }),
      },
    });
  });
};

const getWordHeaderImg = async () => await getImgFile(hearImg);

/**
 *  @description 将本地图片转为Blob对象
 *  @param {String} url 图片路径
 */
export const getImgFile = (url) => {
  return new Promise((resolve, reject) => {
    let img = null;
    try {
      const imgContainer = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      imgContainer.crossOrigin = "Anonymous";
      imgContainer.onload = () => {
        canvas.height = imgContainer.height;
        canvas.width = imgContainer.width;
        ctx.drawImage(
          imgContainer,
          0,
          0,
          imgContainer.width,
          imgContainer.height,
        );
        const type = imgContainer.src
          .substring(imgContainer.src.lastIndexOf(".") + 1)
          .toLowerCase();
        const dataURL = canvas.toDataURL("image/" + type, 1);
        img = base64toFile(dataURL);
        resolve(new Blob([img], { type }));
      };
      imgContainer.src = url;
    } catch (err) {
      img = new FormData();
      img.append("data", {});
      resolve(new Blob([img], { type: "image/png" }));
    }
  });
};

const appendDisclaimer = (section) => {
  const bold = true;
  const font = characterSizeDict.FONT_NORMAL;
  const disclaimer = {
    children: [
      new Paragraph({
        children: [new TextRun({ text: "法律声明&版权声明：", bold, font })],
        spacing: {
          line: 480, // 设置字体行高
          lineRule: LineRuleType.EXACTLY,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "本报告为上海领储信息咨询有限公司制作，其版权归属新赋领储。未经允许，任何组织和个人不得以任何形式复制、传播或输出中华人民共和国境外。任何未经授权使用本报告的相关商业行为都将违反《中华人民共和国著作权法》和其它法律法规以及有关国际公约的规定。",
            font,
          }),
        ],
        spacing: {
          line: 480, // 设置字体行高
          lineRule: LineRuleType.EXACTLY,
        },
      }),
      new Paragraph({
        children: [new TextRun({ text: "免责条款：", bold, font })],
        spacing: {
          line: 480, // 设置字体行高
          lineRule: LineRuleType.EXACTLY,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "iReport平台上所有报告以及素材中的数据均基于企业研究员采用但不限于桌面调研、行业访谈、市场调查及其它合法的研究方法所得，部分预测数据采集于公开信息，并且结合新赋领储后台统计预测模型估算获得；企业数据主要为授权的访谈以及资料获得，新赋领储对该信息的准确性、完整性或可靠性作尽最大努力的追求，但不做任何保证。 在任何情况下，iReport的报告以及素材中的信息或所表述的观点均不构成任何建议。 ",
            font,
          }),
        ],
        spacing: {
          line: 480, // 设置字体行高
          lineRule: LineRuleType.EXACTLY,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "iReport的报告以及素材中发布的调研数据采用样本调研方法，其数据结果受到样本的影响。由于调研方法及样本的限制，调查资料收集范围的限制，该数据仅代表调研时间和人群的基本状况，仅服务于当前的调研目的，为市场和客户提供基本参考。受研究方法和数据获取资源的限制，iReport的报告以及素材只提供给会员用户作为市场参考资料，本公司对该报告的数据和观点不承担法律责任。",
            font,
          }),
        ],
        spacing: {
          line: 480, // 设置字体行高
          lineRule: LineRuleType.EXACTLY,
        },
      }),
    ],
    properties: Object.assign(VALUE_PROPERTY),
    // 设置每一页的页眉图片
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: WORD_SETTING.headerImg,
                transformation: { width: 88, height: 40 },
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: "3pt", before: "11pt" },
          }),
        ],
      }),
    },
    // 设置页脚 页码
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                children: [PageNumber.CURRENT],
              }),
              new TextRun(" / "),
              new TextRun({
                children: [PageNumber.TOTAL_PAGES],
              }),
            ],
            alignment: AlignmentType.CENTER,
            style: "PageNumber",
            spacing: {
              lineRule: LineRuleType.EXACTLY,
              line: 240,
              after: "3pt",
              before: "3pt",
            },
          }),
        ],
      }),
    },
  };
  section.push(disclaimer);
};

export const exportWord = (sections, wordName = "报告", username) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new Document({
        sections,
        creator: `新赋领储（上海）能源科技有限公司 导出人：${username}`,
        title: wordName,
        description: wordName,
        styles: {
          paragraphStyles: [
            {
              id: "PageNumber",
              name: "PageNumber",
              basedOn: "Normal",
              next: "Normal",
              quickFormat: true,
              run: {
                color: "000000",
                size: "9pt",
                font: characterSizeDict.FONT_NORMAL,
              },
              paragraph: {
                alignment: AlignmentType.CENTER,
                spacing: {
                  after: "4.5pt",
                  line: "27pt",
                  lineRule: LineRuleType.AT_LEAST,
                },
              },
            },
          ],
        },
      });
      Packer.toBlob(doc)
        .then((blob) => {
          resolve({ name: wordName, formData: blob }) &&
            (WORD_SETTING.report = {});
        })
        .catch(() => {
          return ElMessage.warning("导出失败");
        });
    } catch (err) {
      reject(err) && (WORD_SETTING.report = {});
    }
  });
};

/**
 *
 * @param {string} text
 * @param {object} option
 * @returns
 */
export const appendParagraph = (text = "", option = {}) => {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: {
      lineRule: LineRuleType.EXACTLY,
      line: 240,
      before: "3pt",
      after: "3pt",
    },
    children: [appendText(text)],
    ...option,
  });
};

/**
 *
 * @param {string} text
 * @param {object} option
 * @returns
 */
export const appendText = (text = "", option = {}) => {
  return new TextRun({
    font: characterSizeDict.FONT_NORMAL,
    size: pxToPt("9pt"),
    text,
    ...option,
  });
};

/**
 *
 * @param {object<array>} rows
 * @param {object} option
 * @returns
 */
export const appendTable = (rows = [], option = {}) => {
  return new Table({
    rows,
    ...option,
  });
};

/**
 *
 * @param {object<array>} children
 * @param {object} option
 * @returns
 */
export const appendTableRow = (children = [], option = {}) => {
  return new TableRow({
    children,
    ...option,
  });
};

/**
 *
 * @param {object<array>} children
 * @param {object} option
 * @returns
 */
export const appendTableCell = (children = [], option = {}) => {
  return new TableCell({
    children,
    ...option,
  });
};

/**
 *
 * @param {string|buffer|arraybuffer} data
 * @param {object} transformation
 * @param {object} floating
 * @param {object} altText
 * @returns
 */
export const appendImage = (data, transformation, floating, altText) => {
  return new ImageRun({
    data,
    transformation: {
      width: 300,
      height: 200,
      ...transformation,
    },
    floating,
    altText,
  });
};

export default {
  docxDict,
  appendParagraph,
  appendImage,
  appendText,
  appendTable,
  appendTableRow,
  appendTableCell,
  exportWord,
  getImgFile,
};
