import { request } from '@/utils'

// 可用区域
export const getElectricityPriceRegionIds_V2 = (params) => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/queryRegionIds`,
    method: 'GET',
    params
  })
}

// 用电类型2
export const getElectricityPriceTypeTwoName_V2 = ({
  electricityTypeOneName,
  regionName
}) => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getElectricityType`,
    method: '',
    params: {
      electricityTypeOneName,
      regionName
    }
  })
}

// 月份列表
export const getElectricityPriceMonthList_V2 = ({ electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId
}) => {
  return request({
    url: `/eesa-report/electricityTimeShare/front/openApi/v1.1/getSelectMonth`,
    method: 'POST',
    params: {
      hideError: true
    },
    data: {
      electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId
    }
  })
}

// 查询分月电价
export const getElectricityPriceMonth_V2 = ({ electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId }) => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getMonthlyTariff`,
    method: 'POST',
    params: {
      hideError: true
    },
    data: {
      electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId
    }
  })
}

// 查询分月电价
export const getElectricityPriceMonth_V2_1213 = (data) => {
  return request({
    url: `/eesa-report/electricityPriceTracking/front/openApi/v1.1/getMonthlyDifference`,
    method: 'POST',
    params: {
      hideError: true
    },
    data
  })
}

// 查询分时电价
export const getElectricityPriceTime_V2 = ({ electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId, years }) => {
  return request({
    url: `/eesa-report/electricityTimeShare/front/openApi/v1.1/getTimeElectricityPrice`,
    method: 'POST',
    params: {
      hideError: true
    },
    data: {
      electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId, years
    }
  })
}

// 峰谷价差滑块
export const dynamicPeriodType = ({ electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId }) => {
  return request({
    url: `/eesa-report/electricityTimeShare/front/openApi/v1.1/dynamicPeriodType`,
    method: 'POST',
    data: {
      electricityTypeOneName, electricityTypeTwoName, regionName, tariffLevelId
    }
  })
}
