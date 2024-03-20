import { request } from '@/utils'

// 户储
export const householdAnalysis = data => {
  return request({
    url: `/eesa-report/investmentHouseholdSaving/front/v1.1/startAnalysis`,
    method: 'POST',
    data
  })
}

export const getHouseholdRegionIds = params => {
  return request({
    url: `/eesa-report/investmentHouseholdSaving/front/openApi/v1.1/queryRegionIds`,
    method: 'GET',
    params
  })
}

export const getHouseHoldRegionData = params => {
  return request({
    url: `/eesa-report/investmentHouseholdSaving/front/v1.1/search`,
    method: 'GET',
    params
  })
}

// 工商业
export const businessAnalysis_V2 = data => {
  return request({
    url: `/eesa-report/investmentIndustryCommerce/front/v1.1/search`,
    method: 'POST',
    params: {
      hideError: true
    },
    data
  })
}

export const getBusinessRegionIds = params => {
  return request({
    url: `/eesa-report/investmentIndustryCommerce/front/v1.1/queryRegionIds`,
    method: 'GET',
    params
  })
}

// --用电类型1
export const getElectricityTypeListOne_V2 = () => {
  return request({
    url: `/eesa-report/investmentElectricityTypeOne/front/openApi/v1.1/getFindList`,
    method: 'GET'
  })
}

// --充放电策略
export const getChargeDischargeStrategy_230925 = ({ electricityTypeOneName, regionName }) => {
  return request({
    url: `/eesa-report/front/openApi/v1.1/getChargeDischargeStrategy`,
    method: 'GET',
    params: {
      electricityTypeOneName,
      region: regionName.length === 1 ? regionName[0] : regionName
    }
  })
}

// --用电类型2 & 电压等级
export const getElectricityTypeListTwo_V2 = ({ electricityTypeOneName, regionName }) => {
  return request({
    url: `/eesa-report/investmentIndustryCommerce/front/v1.1/getElectricityType`,
    method: 'GET',
    params: {
      electricityTypeOneName, regionName
    }
  })
}

// --系统综合效率
export const getSystemEfficientList_V2 = () => {
  return request({
    url: `/eesa-report/reInvestmentSystemEfficiency/front/v1.1/getFindList`,
    method: 'GET'
  })
}

// --放电深度
export const getDepthOfDischargeList_V2 = () => {
  return request({
    url: `/eesa-report/reInvestmentDischargeDepth/front/v1.1/getFindList`,
    method: 'GET'
  })
}

// --年衰减率
export const getYearAttenuationRateList_V2 = () => {
  return request({
    url: `/eesa-report/reInvestmentAnnualDecay/front/v1.1/getFindList`,
    method: 'GET'
  })
}

// --年利用天数
export const getYearUseDaysList_V2 = () => {
  return request({
    url: `/eesa-report/reInvestmentAnnualDays/front/v1.1/getFindList`,
    method: 'GET'
  })
}

// --贴现率
export const getDiscountRateList_V2 = () => {
  return request({
    url: `/eesa-report/reInvestmentBankRate/front/v1.1/getFindList`,
    method: 'GET'
  })
}

// --测算周期
export const getMeasurementCycleList_V2 = () => {
  return request({
    url: `/eesa-report/reInvestmentCalculationPeriod/front/v1.1/getFindList`,
    method: 'GET'
  })
}

// --查询电价
export const getElectrovalencePrice_V2 = ({ electricityTypeOneName, electricityTypeTwoName, regionName, voltageLevel }) => {
  return request({
    url: `/eesa-report/investmentIndustryCommerce/front/v1.1/getElectrovalence`,
    method: 'GET',
    params: {
      electricityTypeOneName, electricityTypeTwoName, regionName, voltageLevel
    }
  })
}

// 查询产品
export const getProductList_V2 = () => request({
  url: `/eesa-report/investmentProductLibrary/front/v1.0/frontFindList`,
  method: 'GET'
})

// --查询产品详情
export const getProductDetail_V2 = (id) => request({
  url: `/eesa-report/investmentProductLibrary/frontBack/v1.0/findUserById`,
  method: 'GET',
  params: { id }
})
