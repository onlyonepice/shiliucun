import downloadBg from '@/assets/img/eesa-waterMark.png'

// 下载 blob 文件
export const downloadBase64 = (base64: string, filename: string) => {
  // 完整的base64编码格式：真正描述文件内容的base64编码前面会有类似于 'data:application/pdf;base64,' 的字符串来描述文件MIME类型（媒体类型，即文件类型相关）
  // 借助<a>标签实现下载：a标签的href属性可以设置为base64编码，然后同时a标签拥有download属性，a标签点击后的行为就是让浏览器下载资源(download的属性值为下载后的文件名)，而不是页面转跳
  let a = document.createElement('a')
  a.href = base64
  a.download = filename // 如果为空，默认文件名为：下载.xxx（后缀名与base64MIME部分指定）
  a.click()
  a = null // a标签下载作用用完了，解除对它的引用即释放内存
}

// 解析图片
function loadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (error) => reject(error)
    img.src = src
  }) as any
}

/**
 * downLoadName 下载的文件名
 * picInfo 图片的地址
 * incomingBg 传入的水印图片地址
 * watermarkWidth 水印图片的宽度
 * watermarkHeight 水印图片的高度
 * **/
export const exportImg = (type = 'png', downLoadName: string, picInfo, incomingBg = null, watermarkWidth = 489, watermarkHeight = 319) => {
  const contentImagePromise = loadImage(picInfo)
  const watermarkImagePromise = loadImage(incomingBg || downloadBg)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  return new Promise((resolve, reject) => {
    Promise.all([contentImagePromise, watermarkImagePromise])
      .then(([contentImage, watermarkImage]) => {
        canvas.width = contentImage.width // canvas宽度取决于传入的picInfo的宽度
        canvas.height = contentImage.height // canvas宽度取决于传入的picInfo的高度
        if (type !== 'png') {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        const watermarkImageWidth = watermarkWidth // 水印宽度
        const watermarkImageHeight = watermarkHeight // 水印高度
        // 绘制内容图片，先绘制的图片在下方,将水印绘制在 canvas 中央
        ctx.drawImage(watermarkImage, contentImage.width / 2 - (watermarkImageWidth / 2), contentImage.height / 2 - (watermarkImageHeight / 2), watermarkImageWidth, watermarkImageHeight)
        // 绘制图表 eCharts 图表
        ctx.drawImage(contentImage, 0, 0, contentImage.width, contentImage.height)
        const watermarkedDataURL = canvas.toDataURL('image/png')
        downloadBase64(watermarkedDataURL, downLoadName)
        resolve('success')
      })
      .catch((error) => {
        console.error('Error loading images:', error)
        reject(error)
      })
  })
}

// H5导出canvas
export const exportCanvas = (title:string, desc:string, downLoadName: string, picInfo, incomingBg = null, watermarkWidth = 489, watermarkHeight = 319) => {
  const contentImagePromise = loadImage(picInfo)
  const watermarkImagePromise = loadImage(incomingBg || downloadBg)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  return new Promise((resolve, reject) => {
    Promise.all([contentImagePromise, watermarkImagePromise])
      .then(([contentImage, watermarkImage]) => {

        canvas.width = contentImage.width // canvas宽度取决于传入的picInfo的宽度
        canvas.height = contentImage.height + 200 // canvas宽度取决于传入的picInfo的高度
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height + 200)
        // 设置文字的属性
        ctx.font = '40px Arial';
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        if( title.length > 24 ){
          let strArr = [];
          for (let i = 0; i < title.length ; i+=24) {
            strArr.push(title.slice(i,i+24))
          }
          ctx.fillText(strArr[0], 10, 60);
          ctx.fillText(strArr[1], 10, 120);
        }else{
          ctx.fillText(title, 10, 60);
        }
        ctx.font = '40px Arial';
        ctx.fillStyle = 'rgba(153,153,153,0.9)';
        ctx.fillText(desc, 10, title.length > 24 ? 180 : 120);


        const watermarkImageWidth = watermarkWidth // 水印宽度
        const watermarkImageHeight = watermarkHeight // 水印高度
        // 绘制内容图片，先绘制的图片在下方,将水印绘制在 canvas 中央
        ctx.drawImage(watermarkImage, contentImage.width / 2 - (watermarkImageWidth / 2), contentImage.height / 2 - (watermarkImageHeight / 2), watermarkImageWidth, watermarkImageHeight)
        // 绘制图表 eCharts 图表
        ctx.drawImage(contentImage, 0, 200, contentImage.width, contentImage.height)
        const watermarkedDataURL = canvas.toDataURL('image/png')
        downloadBase64(watermarkedDataURL, downLoadName)
        resolve('success')
      })
      .catch((error) => {
        console.error('Error loading images:', error)
        reject(error)
      })
  })
}
