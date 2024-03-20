import request from '@/utils/request'

export const getVersionList = () => {
  return request({
    url: `/eesa-report/system/sysUpdateLog/getSysUpdateLog`,
    method: 'GET'
  })
}
