import { request } from '@/utils'
// 前台_查询最新分时列表
export const getNewTimeSharing = () => {
  return request({
    url: `/eesa-report/front/openApi/v1.1/getNewTimeSharing`,
    method: 'POST'
  })
}
