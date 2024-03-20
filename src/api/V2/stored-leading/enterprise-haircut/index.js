import { request } from '@/utils'

// 业务类别列表
export const getBusinessCategoryData_V2 = () => {
  return request({
    url: `/eesa-report/valuationEnterpriseCategory/front/v1.1/getEnterpriseCategoryS`,
    method: 'GET'
  })
}

// 企业轮次
export const getEnterpriseRounds_V2 = () => {
  return request({
    url: `/eesa-report/valuationEnterpriseRound/front/v1.1/getEnterpriseRounds`,
    method: 'GET'
  })
}

// 开始估值
// 可比倍数
export const startValueOfAssessmentOption_V2 = data => {
  return request({
    url: `/eesa-report/userEnterpriseValuation/front/v1.1/comparableMultipleValuation`,
    method: 'POST',
    data
  })
}
// 绝对值倍数
export const startValueOfAssessmentAbsolute_V2 = ({ applicationScenario, applicationScenarioId, businessCategoryId, enterpriseRound, enterpriseRoundId, expectedNewAssets, marketInfos, totalAssetValue, year }) => {
  return request({
    url: `/eesa-report/userEnterpriseValuation/front/v1.1/absoluteValuation`,
    method: 'POST',
    data: {
      applicationScenario, applicationScenarioId, businessCategoryId, enterpriseRound, enterpriseRoundId, expectedNewAssets, marketInfos, totalAssetValue, year
    }
  })
}

// 获取可比倍数数据
export const getEChartsData_V2 = ({ type }) => {
  return request({
    url: `/eesa-report/valuationComparableMultiple/front/v1.1/getEnterpriseData`,
    method: 'GET',
    params: {
      type
    }
  })
}
