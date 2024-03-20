/* $$
 $ @Author: luoluoa
 $ @Date: 2023-07-31 09:23:56
 $ @LastEditors: luoluoa
 $ @LastEditTime: 2023-09-21 13:24:38
 $ @Description:
 $ @
 $*/
import { request } from '@/utils'

export const getProductRecords = () => request({
  url: `/api-user/users/getRecordingTime`,
  method: 'GET'
})

export const setProductRecord = ({ project, time }) => request({
  url: `/api-user/users/recordingTime`,
  method: 'POST',
  params: {
    hideError: true
  },
  data: {
    project, time
  }
})
