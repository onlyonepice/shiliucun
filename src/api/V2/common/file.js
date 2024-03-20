/*
 * @Date: 2023-10-12 19:17:21
 * @Author: luoluoa
 * @LastEditors: luoluoa
 * @LastEditTime: 2023-12-04 14:53:08
 * @FilePath: \i-report-frontend\src\api\V2\common\file.js
 * @Description:
 */
import { request } from '@/utils'

export const getFilePath = params => {
  return request({
    url: `/eesa-report/PdfFile/v1.0/getURL`,
    method: `GET`,
    params
  })
}

export const getFile = (url, token, { hideError = true } = {}) => {
  return request({
    url,
    method: `GET`,
    params: {
      hideError
    },
    headers: {
      'x-oss-meta-token': token
    },
    responseType: 'blob'
  })
}

export function batchGetFilePaths(data) {
  return request({
    url: '/eesa-report/PdfFile/v1.0/getBatchURL',
    method: 'POST',
    data
  })
}
