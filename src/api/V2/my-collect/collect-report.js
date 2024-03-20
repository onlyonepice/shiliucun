import { request } from '@/utils'

export const getCollectReportList_V2 = ({ limit, page, keyword }) => request({
  url: `/eesa-report/collection/front/v1.1/allReportCollection`,
  method: 'GET',
  params: {
    limit,
    page,
    keyword
  }
})

export const collectReportListDelete_V2 = id => request({
  url: `/eesa-report/collection/front/v1.1/deleteById`,
  method: 'DELETE',
  params: { id }
})
