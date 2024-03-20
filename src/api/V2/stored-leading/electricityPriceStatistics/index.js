import { request } from '@/utils'

// 获取区域和用电类型1
export const getRegionIdsData = () => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/queryRegionIds?type=all`,
    method: 'GET'
  })
}

// 根据地区和用电类型I获取年月
export const getYears = (data) => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getYearsByRegionElectricityTypeOneName?electricityTypeOneName=${data.electricityTypeOneName}&regionName=${data.regionName}`,
    method: 'POST'
  })
}

// 根据用电类型I获取电压等级
export const getTariffLevelId = data => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getTariffLevelIdByElectricityTypeOneName?electricityTypeOneName=${data.electricityTypeOneName}`,
    method: 'POST'
  })
}
// 获取峰谷价差
export const getPeakValleySpread = () => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getPeakValleySpread`,
    method: 'POST'
  })
}

// 获取各省份电差排名
export const getDifferentialRanking = (data) => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getDifferentialRanking`,
    method: 'POST',
    data
  })
}
