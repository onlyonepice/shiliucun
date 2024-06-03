// import downloadBg from "@/assets/img/common/eesa-waterMark.png";

// 自定义判断元素类型JS
export function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
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
        const _type = true;
        if (_type) {
          ctx.drawImage(
            canvasMask(274, 455),
            canvas.width - 274 - 30,
            0,
            274,
            455,
          );
          canvasText(ctx, canvas.width - 170, 200);
          canvasBtn(ctx, canvas.width - 210, 220);
        }

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

/**
 * 绘制蒙层
 * **/
const canvasMask = (width: number, height: number) => {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.fillStyle = "rgba(255, 255, 255, 0.9)"; // 半透明白色
  tempCtx.fillRect(0, 0, width, height);
  tempCtx.filter = "blur(25px)";
  tempCtx.drawImage(tempCanvas, 0, 0);
  return tempCanvas;
};
/**
 * 绘制文字及按钮
 * **/
const canvasText = (ctx: any, x: number, y: number) => {
  ctx.fillStyle = "black";
  ctx.font = "14px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("开通企业VIP查看完整数据", x, y);
};
/**
 * 绘制按钮
 * **/
const canvasBtn = (ctx: any, x: number, y: number) => {
  // 绘制按钮背景
  ctx.fillStyle = "#244BF1";
  // ctx.fillRect(x, y, 88, 32);
  drawRoundedRect(ctx, x, y, 88, 32, 4);
  ctx.fill();
  // 绘制按钮文本
  ctx.fillStyle = "white";
  ctx.font = "14px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("立即开通", x + 44, y + 16);
};
// 绘制带圆角的矩形
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
