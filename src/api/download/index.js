import request from '@/utils/request'

export const download = ({ url, params, data, responseType, headers }) => {
  return request({
    url,
    method: 'GET',
    params,
    data,
    responseType,
    headers
  })
}

