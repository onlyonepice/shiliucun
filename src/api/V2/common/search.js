import { request } from '@/utils'

// 获取搜索历史记录
export function getSearchHistory_V2(moduleName) {
  return request({
    url: `/eesa-report/homePage/marketReportHot/querySearch`,
    method: 'GET',
    params: {
      moduleName
    }
  })
}

// 获取推荐素材
export function getRecommendList_V2(moduleName) {
  return request({
    url: `/eesa-report/onlineReportNew/front/openApi/v1.1/reportRecommendation`,
    method: 'GET',
    params: {
      moduleName
    }
  })
}
