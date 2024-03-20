import { request } from '@/utils'

export * from './search'
export * from './user'
export * from './file'

export const getReportList = (url, params, headers) => {
  return request({
    url,
    method: 'GET',
    params,
    headers
  })
}

export const getReportDetail_V2 = (url, { id = 0 } = {}, params, headers) => {
  return request({
    url,
    method: 'POST',
    params,
    data: {
      id
    },
    headers
  })
}

export const readReport_V2 = (url, { reading, reportId }, params, headers) => {
  return request({
    url,
    method: 'POST',
    params,
    data: {
      reading,
      reportId
    },
    headers
  })
}

export const getReportDetailRecommend_V2 = (url, { id, limit }) => {
  return request({
    url,
    params: {
      id,
      limit
    }
  })
}

export const setReportCollect_V2 = (
  url,
  { collectionType, reportId, uncollect }
) => {
  return request({
    url,
    method: 'POST',
    data: {
      collectionType,
      reportId,
      uncollect
    }
  })
}

export const setReportScore_V2 = ({ level, moduleName, reportId, score }) => {
  return request({
    url: `/eesa-report/onlineReportNewScore/front/v1.0/reportScoring`,
    method: 'POST',
    data: {
      level,
      moduleName,
      reportId,
      score
    }
  })
}

export const setReportFeedback_V2 = ({
  name,
  contactInformation,
  describe,
  url,
  moduleName,
  reportId,
  reportName
}) => {
  return request({
    url: `/eesa-report/onlineReportNewError/front/v1.0/addContentCorrection`,
    method: 'POST',
    data: {
      name,
      contactInformation,
      describe,
      url,
      moduleName,
      reportId,
      reportName
    }
  })
}

export const getRegion = ({ level, limit, page, pcode }) =>
  request({
    url: `/eesa-report/region`,
    method: 'GET',
    params: {
      level,
      limit,
      page,
      pcode
    }
  })

export const getPostType = type => request({
  url: `/api-user/sysDict/front/V1.0/frontSelectTreeByType/${type}`,
  method: 'POST'
})

export const recordReportShare = (url, { reportId, share = false }) => request({
  url,
  method: 'POST',
  params: {
    reportId,
    share
  }
})
export const recordReportDownload = (url, { reportId }) => request({
  url,
  method: 'POST',
  params: {
    reportId
  }
})
export const recordReportClick = (url, { reportId }) => request({
  url,
  method: 'POST',
  params: {
    reportId
  }
})
export const recordReportRead = (url, { reportId, reading }) => request({
  url,
  method: 'POST',
  params: {
    reportId,
    reading
  }
})

export const recordProductJoin = (newUser = false) => request({
  url: `/eesa-report/homePage/browsingHistory/front/openApi/V1.0/frontAddPageView?newUser=${newUser}`,
  method: 'POST'
})
