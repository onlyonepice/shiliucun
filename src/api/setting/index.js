import request from '@/utils/request.js'

// 基本信息
export function getAccountInfo(data) {
  return request({
    url: '/api-user/account/getAccountInfo',
    method: 'POST',
    data
  })
}

// 修改信息/
export function modifyAccountInfo(data) {
  return request({
    url: '/api-user/account/modifyAccountInfo',
    method: 'POST',
    data
  })
}
// 修改信息/
export function updateAccountInfo(data) {
  return request({
    url: '/api-user/account/updateAccountInfo',
    method: 'POST',
    data
  })
}

// 修改手机号
export function modifyMobile(data) {
  return request({
    url: '/api-user/account/modifyMobile',
    method: 'POST',
    data
  })
}

// 创建子账号
export function createSubAccount(data) {
  return request({
    url: '/api-user/subAccount/createSubAccount',
    method: 'POST',
    data: {
      ...data
    }
  })
}

// 删除子账号
export function deleteSubAccount(params) {
  return request({
    url: '/api-user/subAccount/deleteSubAccount',
    method: 'GET',
    params
  })
}

// 获取子账号信息
export function getSubAccount(data) {
  return request({
    url: '/api-user/subAccount/getSubAccount',
    method: 'POST',
    data: {
      ...data
    }
  })
}

// 更改账号状态
export function updateSubAccount(params) {
  return request({
    url: '/api-user/subAccount/updateSubAccount',
    method: 'GET',
    params
  })
}

// 修改联络方式发送验证码
export function sendMobileSMS(data) {
  return request({
    url: '/api-user/account/sendMobileSMS',
    method: 'GET',
    params: {
      ...data
    }
  })
}

// 修改账号密码发送验证码
export function sendPasswordSMS() {
  return request({
    url: '/api-user/account/sendPasswordSMS',
    method: 'GET'
  })
}

// 修改账号密码
export function modifyPassword(data) {
  return request({
    url: '/api-user/account/modifyPassword',
    method: 'POST',
    data
  })
}

// 获取上传图片地址
export function fileUpload(data) {
  return request({
    url: '/api-file/fileUpload',
    method: 'POST',
    data
  })
}

// 修改联络方式 ---> 发送已绑定手机号验证码
export function sendBoundMobileSMS(params) {
  return request({
    url: '/api-user/account/sendBoundMobileSMS',
    method: 'GET',
    params
  })
}

// 修改联系方式 下一步
export function getSetPhoneNextStep(params) {
  return request({
    url: '/api-user/account/nextStep',
    method: 'GET',
    params
  })
}

// 修改电子邮箱 发送验证码
export function sendEmailSMS(email) {
  return request({
    url: `/api-user/account/addEmail?email=${email}`,
    method: 'GET'
  })
}

// 绑定电子邮箱
export function bandingEmail(data) {
  return request({
    url: '/api-user/account/confirmAddEmail',
    method: 'POST',
    data
  })
}

// 解绑邮箱
export function getUnbindingFn(code) {
  return request({
    url: `/api-user/account/unbindEmail?code=${code}`,
    method: 'get'
  })
}

// 修改邮箱
export function postModifyEmail(data) {
  return request({
    url: `/api-user/account/modifyEmail`,
    method: 'post',
    data
  })
}

// 修改邮箱发送验证码
export function postModifyEmailSendCode() {
  return request({
    url: `/api-user/account/verifyEmail`,
    method: 'post'
  })
}

// 修改邮箱发送验证码
export function getModifyNewEmailCode(email) {
  return request({
    url: `/api-user/account/bindEmail?newEmail=${email}`,
    method: 'get'
  })
}
// 查询当前用户企业详情
export function getUserEnterpriseInfo() {
  return request({
    url: '/eesa-search/enterprise/es/reQueryByUserId',
    method: 'GET'
  })
}
// 获取融资轮次
export function getFinancingRound(params) {
  return request({
    url: '/eesa-search/dict/byTypeAndType',
    method: 'GET',
    params
  })
}
// 删除融资信息
export function delEnterprise(id) {
  return request({
    url: `/eesa-search/enterpriseFinancingMerger/delEnterprise/${id}`,
    method: 'POST'
  })
}
// 添加融资信息
export function addFinancingRound(data) {
  return request({
    url: '/eesa-search/enterpriseFinancingMerger/addEnterprise',
    method: 'POST',
    data
  })
}
// 更新融资信息
export function editFinancingRound(data) {
  return request({
    url: '/eesa-search/enterpriseFinancingMerger/updEnterprise',
    method: 'POST',
    data
  })
}
// 更新用户企业信息
export function upEnterpriseInfo(data) {
  return request({
    url: '/eesa-search/enterprise/es/modifyByUserId',
    method: 'POST',
    data
  })
}
// 下一步 验证验证码

export function nextCheckCode(params) {
  return request({
    url: '/api-user/account/front/v1.0/verifyPasswordSMS',
    method: 'GET',
    params
  })
}

export * from './version-notice'
