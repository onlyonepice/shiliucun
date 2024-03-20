import { request } from '@/utils'

// 身份证
export const scanIdCard = data => {
  return request({
    url: `/api-file/v1.0/idCardRecognition`,
    method: 'POST',
    data
  })
}

export const scanLicense = data => {
  return request({
    url: `/api-file/v1.0/businessLicense`,
    method: 'POST',
    data
  })
}
