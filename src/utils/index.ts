// import downloadBg from "@/assets/img/common/eesa-waterMark.png";

// 自定义判断元素类型JS
export function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}

// 对比两个对象是否相同
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true; // 快速检查引用相等

  if (obj1 === null || obj2 === null) return false; // null 或 undefined 不相等

  if (typeof obj1 !== typeof obj2) return false; // 类型不同不相等

  if (typeof obj1 === "object") {
    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false; // 判断是否同为数组

    if (Array.isArray(obj1)) {
      if (obj1.length !== obj2.length) return false; // 数组长度不相等

      // 对数组进行排序然后比较
      obj1 = [...obj1].sort();
      obj2 = [...obj2].sort();

      for (let i = 0; i < obj1.length; i++) {
        if (!deepEqual(obj1[i], obj2[i])) return false; // 递归比较数组元素
      }

      return true;
    } else {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false; // 对象键数量不同

      // 对对象键进行排序然后比较
      keys1.sort();
      keys2.sort();

      for (const key of keys1) {
        if (keys2.indexOf(key) === -1 || !deepEqual(obj1[key], obj2[key]))
          return false; // 递归比较对象值
      }

      return true;
    }
  }

  return false; // 其他类型（如数字、字符串）直接比较
}

// 获取对象最里层的对象
export function getInnermostObject(obj) {
  if (
    obj === null ||
    typeof obj !== "object" ||
    Object.keys(obj).length === 0
  ) {
    return obj;
  }

  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty("subRegion") && obj.subRegion !== null) {
    return getInnermostObject(obj.subRegion);
  }

  return obj;
}

// 下载 blob 文件
export const downloadBase64 = (base64: string, filename: string) => {
  // 完整的base64编码格式：真正描述文件内容的base64编码前面会有类似于 'data:application/pdf;base64,' 的字符串来描述文件MIME类型（媒体类型，即文件类型相关）
  // 借助<a>标签实现下载：a标签的href属性可以设置为base64编码，然后同时a标签拥有download属性，a标签点击后的行为就是让浏览器下载资源(download的属性值为下载后的文件名)，而不是页面转跳
  let a = document.createElement("a");
  a.href = base64;
  a.download = filename; // 如果为空，默认文件名为：下载.xxx（后缀名与base64MIME部分指定）
  a.click();
  a = null; // a标签下载作用用完了，解除对它的引用即释放内存
};

// 解析图片
function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  }) as any;
}

/**
 * downLoadName 下载的文件名
 * picInfo 图片的地址
 * incomingBg 传入的水印图片地址
 * watermarkWidth 水印图片的宽度
 * watermarkHeight 水印图片的高度
 * **/
export const exportImg = (type = "png", downLoadName: string, picInfo) => {
  const contentImagePromise = loadImage(picInfo);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  return new Promise((resolve, reject) => {
    Promise.all([contentImagePromise])
      .then(([contentImage]) => {
        canvas.width = contentImage.width; // canvas宽度取决于传入的picInfo的宽度
        canvas.height = contentImage.height; // canvas宽度取决于传入的picInfo的高度
        if (type !== "png") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(contentImage, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/png");
        downloadBase64(dataURL, downLoadName);
        resolve("success");
      })
      .catch((error) => {
        console.error("Error loading images:", error);
        reject(error);
      });
  });
};

// 强制保留两位小数
export function formatNumberWithTwoDecimals(number) {
  // 使用 Number() 将输入转换为数字类型
  const parsedNumber = Number(number);
  // 如果是 NaN 或者 Infinity，返回原始输入
  if (isNaN(parsedNumber) || !isFinite(parsedNumber)) {
    return number;
  }
  // 使用 toFixed 获取两位小数，再转换为字符串
  const formattedNumber = parsedNumber.toFixed(2).toString();
  // 返回格式化后的字符串
  return formattedNumber;
}

// 使用 、拼接字符串或者拆分
export function splitOrJoin(
  str: String | Array<String>,
  separator = "、",
): String | Array<String> {
  // 如果是数组，则使用 join 方法，否则使用 split 方法
  return Array.isArray(str)
    ? str.join(separator)
    : str && str.length
      ? str.split(separator)
      : "";
}
