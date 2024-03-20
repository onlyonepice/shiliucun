/* $$
 $ @Author: luoluoa
 $ @Date: 2023-09-21 15:20:16
 $ @LastEditors: luoluoa
 $ @LastEditTime: 2023-10-07 14:07:14
 $ @Description:
 $ @
 $*/
import { request } from '@/utils'

export const appearDownloadTime_V2 = ({ menu, moduleName, reportId, reportNo }) => {
  return request({
    url: `/eesa-report/userDownload/export`,
    method: 'POST',
    data: {
      menu, moduleName, reportId, reportNo
    }
  })
}

export const getSN_V2 = () => {
  return request({
    url: `/eesa-report/userGenerate/front/v1.1/generateNumber`,
    method: 'POST'
  })
}

export const getPublicKeyApi = () => {
  return request({
    url: `/api-uaa/clients/findPublicKey`,
    method: 'POST'
  })
}

export const getUpdateRecordsTip_V2 = () => {
  return request({
    url: `/eesa-report/homePage/public/v1.0/newReport`,
    method: 'POST'
  })
}

export const setViewRecord_V2 = moduleName => {
  return request({
    url: `/eesa-report/homePage/public/v1.0/viewUser`,
    method: 'POST',
    params: {
      moduleName
    }
  })
}

export const userFeedback_V2 = (moduleName, satisfactionLevel) => {
  return request({
    url: `/eesa-report/sysFeedback/front/v1.1/userFeedback`,
    method: 'POST',
    data: {
      moduleName, satisfactionLevel
    }
  })
}

export const getMenus_231007 = () => request({
  url: `/api-user/menus/openApi/current`,
  method: 'GET',
  params: {
    hideError: true
  }
})

export function score(data) {
  return request({
    url: '/api-user/satisfaction/front/openApi/V1.0/getSatisfaction',
    method: 'POST',
    data
  })
}

export function getSatisfactionQuestionnaire(params) {
  return request({
    url: '/api-user/satisfaction/front/openApi/V1.0/getSatisfactionQuestionnaire',
    method: 'GET',
    params
  })
}
