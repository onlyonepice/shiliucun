import { request } from '@/utils'

export const getRealTimeConsult_V2 = ({ limit, page }) => {
  return request({
    url: `/eesa-home/openApi/article/front/v1.0/listFrontReport`,
    method: 'POST',
    data: {
      limit,
      page
    }
  })
}

export const getRealTimeConsultDetail_V2 = id => {
  return request({
    url: `/eesa-home/openApi/article/front/v1.0/detailFrontReport/${id}`,
    method: 'POST'
  })
}
