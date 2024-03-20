import { request } from '@/utils'

// 收藏|取消收藏
export const quarterlyMonthlyCollect_V2 = ({ fileId, moduleName, reportId }) => {
  return request({
    url: `/eesa-report/alliance/quarterlyMonthlyReport/front/v1.1/getSystemCollection`,
    method: 'POST',
    data: {
      fileId, moduleName, reportId
    }
  })
}
