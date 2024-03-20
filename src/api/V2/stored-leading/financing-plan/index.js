import { request } from '@/utils'

export const submitFinancing = data => request({
  url: `/eesa-report/energyStorageFront/financingPlan/front/v1.0/sddFindList`,
  method: 'POST',
  data
})
