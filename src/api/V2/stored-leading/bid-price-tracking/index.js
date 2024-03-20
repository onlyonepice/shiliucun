/*
 * @Date: 2023-11-06 15:33:44
 * @Author: luoluoa
 * @LastEditors: luoluoa
 * @LastEditTime: 2023-11-29 09:32:35
 * @FilePath: \i-report-frontend\src\api\V2\stored-leading\bid-price-tracking\index.js
 * @Description:
 */
import { request } from '@/utils'

// 容量分析
export const capacityAnalysis_V2 = (data) => {
  return request({
    // url: '/eesa-report/priceTracking/front/openApi/v1.0/analyze',
    url: '/eesa-report/priceTracking/front/openApi/v1.0/analyzeBarGraph',
    method: 'post',
    data
  })
}
// 应用场景下拉框 包括全部数据
export const applicationScenariosBox = (data) => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/V1.0/applicationScenariosBox?type=all',
    method: 'post',
    data
  })
}
// 中标内容列表
export const bidWinningContentData_V2 = () => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/V1.0/biddingContentBox',
    method: 'post'
  })
}
// 中标时间
export const winingBidTime = () => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/v1.0/winningBidTime',
    method: 'post'
  })
}
// 时长列表
export const durationData_V2 = () => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/V1.0/energyStorageDurationBox',
    method: 'post'
  })
}
// 技术类型列表
export const technologyType_V2 = () => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/V1.0/technologyTypeBox',
    method: 'post'
  })
}
// 企业分析
export const enterpriseAnalysis = (data) => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/v1.0/enterpriseAnalysis',
    method: 'post',
    data
  })
}
// 区域分析
export const bidRegionAnalysis = (data) => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/v1.0/bidRegionAnalysis',
    method: 'post',
    data
  })
}
// 应用场景
export const applicationData = () => {
  return request({
    url: '/eesa-report/priceTracking/front/openApi/V1.0/applicationScenariosBox',
    method: 'post'
  })
}
