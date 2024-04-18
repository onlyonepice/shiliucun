import { cloneDeep } from "lodash";
import { splicePicturePath, WORD_SETTING } from "./downReport";

// 转换图片大小
export const getImageInfo = (url) => {
  return new Promise((resolve, reject) => {
    try {
      let src = "";
      const image = document.createElement("img");
      image.onload = function () {
        if (this.width > WORD_SETTING.image.maxWidth) {
          const percentNum = this.width / WORD_SETTING.image.maxWidth;
          this.width = this.width / percentNum;
          this.height = this.height / percentNum;
          image.src = url;
        } else {
          src = `${url}?width=${this.width}&height=${this.height}`;
          resolve(src);
        }
      };
      image.onerror = function () {
        resolve(src);
      };
      image.src = url;
    } catch (err) {
      resolve(url);
    }
  });
};
// 解析状态树
/**
 *
 * @param {*} nodes string || NodeList
 * @returns
 */
export const stringifyData = (nodes) => {
  try {
    let fn = () => {};
    let node = null;
    const richState = [];
    const nodeType = Object.prototype.toString.call(nodes);
    node = nodes;
    if (nodeType.includes("String")) {
      const div = document.createElement("div");
      nodes = spliceAttr(nodes);
      div.innerHTML = nodes;
      if (
        div.childNodes[0].tagName &&
        div.childNodes[0].tagName.toLowerCase() === "table"
      ) {
        div.innerHTML = `<div class="table-container">${nodes}</div>`;
      }
      node = div.childNodes;
    }
    fn = (nodes, parent) => {
      nodes.forEach((item) => {
        const nodeState = {
          children: [],
          type: item.nodeType,
          tag: item.tagName ? item.tagName.toLowerCase() : "",
          attrs: getNodeAttr(item),
          content: "",
        };
        if (item.tagName) {
          if (item.tagName.toLowerCase() === "font") {
            nodeState.tag = "span";
          }
        }
        if (item.childNodes && item.childNodes.length > 0) {
          fn(item.childNodes, nodeState.children);
        }
        if (item.nodeValue) {
          nodeState.content = item.nodeValue;
        }
        parent.push(nodeState);
      });
    };
    fn(node, richState);
    return richState;
  } catch (err) {
    console.warn(err);
  }
};

/**
 *
 * @param {*} str
 * @returns
 */
export const spliceAttr = (str) => {
  return str
    .replaceAll(/^id$/g, "i")
    .replaceAll("data-slate-node", "dat-slat-nod")
    .replaceAll("data-selected", "dat-selecte")
    .replaceAll("<p><br></p>", "");
};

/**
 *
 * @param {*} str
 * @returns
 */
export const pushAttr = (str) => {
  return str
    .replaceAll(/^i$/g, "id")
    .replaceAll("dat-slat-nod", "data-slate-node")
    .replaceAll("dat-selecte", "data-selected");
};

/**
 *
 * @param {*} node
 * @returns
 */
export const getNodeAttr = (node) => {
  try {
    if (!node.getAttributeNames) return {};
    const attrs = node.getAttributeNames();
    const attrsState = {};
    attrs.forEach((item) => {
      if (item === "color") {
        if (attrsState.style) {
          attrsState.style += `color: ${node.getAttribute(item)};`;
        } else {
          attrsState.style = ``;
          attrsState.style += `color: ${node.getAttribute(item)};`;
        }
      } else {
        attrsState[item] = node.getAttribute(item);
      }
    });
    return attrsState;
  } catch (err) {
    Promise.reject(err);
  }
};

/**
 *
 * @param {*} node
 * @param {*} attrs
 * @returns
 */
export const setNodeAttr = (node, attrs) => {
  for (const attr in attrs) {
    if (attrs[attr].includes("white-space")) {
      attrs[attr] = "white-space: pre-wrap;";
    }
    if (attr === "contenteditable") {
      continue;
    }
    if (attrs[attr].includes("/eesa/"))
      node.setAttribute(attr, splicePicturePath(attrs[attr]));
    else node.setAttribute(attr, attrs[attr]);
  }
  return node;
};

// 解析状态树
/**
 *
 * @param {*} state
 * @param {*} parent
 * @returns
 */
export const parseData = (state) => {
  try {
    if (!state) return "";
    let el = null;
    let parseState;
    let richText = "";
    let div = document.createElement("div");
    const _div = document.createElement("div");
    if (typeof state === "string") {
      el = document.createElement("img");
      try {
        parseState = JSON.parse(state);
        if (Object.prototype.toString.call(parseState).includes("Object")) {
          if (parseState.other) {
            el.src = splicePicturePath(parseState.img);
            el.style = parseState.style;
            _div.appendChild(el);
            _div.style = "text-align: center;";
            el.style = `text-align: center; width:${parseState.style.width}px;`;
            div.appendChild(_div);
            richText = div.innerHTML;
            parseState = null;
            parseState = null;
            return richText;
          } else {
            el.src = splicePicturePath(parseState.img);
            el.title = parseState.order;
            el.style = "min-width:450px;max-width:700px;width:100%;";
            _div.appendChild(el);
            _div.style = "text-align: center;";
            div.appendChild(_div);
            richText = div.innerHTML;
            return richText;
          }
        }
      } catch (error) {
        el.src = state;
        el.style = "min-width:450px;max-width:700px;width:100%;";
        _div.appendChild(el);
        _div.style = "text-align: center;";
        div.appendChild(_div);
        richText = div.innerHTML;
        return richText;
      }
    } else if (Object.prototype.toString.call(state).includes("Array")) {
      parseState = cloneDeep(state);
    }
    const fn = (state, parent) => {
      try {
        if (state.forEach) {
          state.forEach((elOption) => {
            let el = null;
            if (elOption.tag) {
              if (elOption.tag === "font") {
                elOption.tag = "span";
              }
              el = document.createElement(elOption.tag);
              el = setNodeAttr(el, elOption.attrs);
              el.innerText = elOption.content;
              if (elOption.children && elOption.children.length > 0) {
                fn(elOption.children, el);
              }
            } else {
              el = document.createTextNode(elOption.content);
            }
            parent.appendChild(el);
            el = null;
          });
        }
      } catch (err) {
        return err;
      }
    };
    fn(parseState, div);
    richText = div.innerHTML;
    div = null;
    return richText;
  } catch (err) {
    Promise.reject(err);
  }
};
export const parseDataImg = (state) => {
  try {
    if (!state) return "";
    let el = null;
    let parseState;
    let richText = "";
    const div = document.createElement("div");
    const _div = document.createElement("div");
    if (typeof state === "string") {
      try {
        parseState = JSON.parse(state);
      } catch (err) {
        el = document.createElement("img");
        el.src = state;
        el.title = state;
        el.style = "min-width:450px;max-width:700px;width:100%;";
        _div.appendChild(el);
        _div.style = "text-align: center;";
        div.appendChild(_div);
        richText = div.innerHTML;
        return richText;
      }
    } else if (Object.prototype.toString.call(state).includes("Array")) {
      parseState = cloneDeep(state);
    }
    const fn = (state, parent) => {
      try {
        if (state.forEach) {
          state.forEach((elOption) => {
            let el = null;
            if (elOption.tag) {
              if (elOption.tag === "font") {
                elOption.tag = "span";
              }
              el = document.createElement(elOption.tag);
              el = setNodeAttr(el, elOption.attrs);
              el.innerText = elOption.content;
              if (elOption.children && elOption.children.length > 0) {
                fn(elOption.children, el);
              }
            } else {
              el = document.createTextNode(elOption.content);
            }
            parent.appendChild(el);
          });
        }
      } catch (err) {
        Promise.reject(err);
      }
    };
    fn(parseState, div);
    richText = div.innerHTML;
    return richText;
  } catch (err) {
    Promise.reject(err);
  }
};

// 富文本转义
/**
 *
 * @param {*} data
 * @returns
 */
export const specific = (data) => {
  let str = cloneDeep(data);
  str = str
    .split("")
    .filter((item) => item !== "")
    .join("");
  str = str
    .replaceAll(/\&lt\;/g, "<")
    .replaceAll(/\&gt\;/g, ">")
    .replaceAll(/\&amp\;/g, "&")
    .replaceAll(/\&quo\;/g, '"')
    .replaceAll(/\&amp\;/g, "&")
    .replaceAll(/\&reg\;/g, "®")
    .replaceAll(/\&copy\;/g, "©")
    .replaceAll(/\&trade\;/g, "™")
    .replaceAll(/\&ensp\;/g, " ")
    .replaceAll(/\&emsp\;/g, " ")
    .replaceAll(/\&nbsp\;/g, " ")
    .replaceAll(/\&iquest\;/g, "¿");
  return str;
};
