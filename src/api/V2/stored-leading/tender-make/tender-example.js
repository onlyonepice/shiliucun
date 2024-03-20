import { request } from '@/utils'

export const getTenderExampleFree_V2 = ({ keyword = '', timeStamp = +new Date() } = {}) => {
  return request({
    url: `/eesa-report/bidDocument/front/v1.1/getFreeReportSelected`,
    method: 'GET',
    params: {
      keyword,
      timeStamp
    }
  })
}
