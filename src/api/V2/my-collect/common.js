import { request } from '@/utils'

// 收藏/取消
export const reportCollect_V2 = (url, { fileId, moduleName, reportId }) => {
  return request({
    url,
    method: 'POST',
    data: {
      fileId, moduleName, reportId
    }
  })
}

// 点赞/取消
export const reportGood_V2 = (url, { fileId, moduleName, reportId }) => {
  return request({
    url,
    method: 'POST',
    data: {
      fileId,
      moduleName,
      reportId
    }
  })
}
