/* $$
 $ @Author: luoluoa
 $ @Date: 2023-07-31 09:23:56
 $ @LastEditors: luoluoa
 $ @LastEditTime: 2023-10-08 15:10:43
 $ @Description:
 $ @
 $*/
import { request } from '@/utils'

// 精选置顶列表
export const getHandpickTopList = ({ limit = 12, page = 1, keyword = '', timeStamp = +new Date() }) => {
  return request({
    url: `/eesa-report/onlineReportNew/front/openApi/v1.1/getTopSelected`,
    method: 'GET',
    params: {
      limit,
      page,
      keyword,
      timeStamp
    }
  })
}

// 内容精选列表
export const getContentHandpickList = ({ limit = 12, page = 1, keyword = '', timeStamp = +new Date() }) => {
  return request({
    url: `/eesa-report/onlineReportNew/front/openApi/v1.1/getOnlineReportSelected`,
    method: 'GET',
    params: {
      limit,
      page,
      keyword,
      timeStamp
    }
  })
}

// 详情
export const getHandpickListDetail = (id = 0) => {
  return request({
    url: `/eesa-report/onlineReport/front/v1.1/getDetails`,
    method: 'GET',
    params: {
      id
    }
  })
}

export const getFreeReportList_V2 = ({ keyword = '', timeStamp = +new Date() }) => {
  return request({
    url: `/eesa-report/onlineReportNew/front/openApi/v1.1/getFreeReportSelected`,
    method: 'GET',
    params: {
      keyword,
      timeStamp
    }
  })
}

export default {
  getHandpickTopList,
  getContentHandpickList,
  getHandpickListDetail,
  getFreeReportList_V2
}
