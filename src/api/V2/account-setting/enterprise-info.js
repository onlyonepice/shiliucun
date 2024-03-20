import { request } from '@/utils'

// 主营业务列表
export const getMainBusinessList_V2 = () => {
  return request({
    url: `/eesa-report/enterprise/queryMainBusiness`,
    method: 'POST'
  })
}

// ---企业
// 用户企业信息
export const getUserEnterpriseInfo_V2 = () => {
  return request({
    url: `/eesa-report/enterprise/queryUserEnterprise`,
    method: 'POST'
  })
}

// 修改企业名称
export const editEnterpriseName_V2 = ({ name, id }) => {
  return request({
    url: `/eesa-report/enterprise/updateEnterprise`,
    method: 'POST',
    params: {
      name, id
    }
  })
}

// 修改企业其他
export const editEnterpriseOther_V2 = ({ logo, mainBusiness, summarized, website, id }) => {
  return request({
    url: `/eesa-report/enterprise/updateOther`,
    method: 'POST',
    params: {
      logo, mainBusiness, summarized, website, id
    }
  })
}
// ---融资
// 融资轮次列表
export const getFinancingList_V2 = () => {
  return request({
    url: `/eesa-report/investmentMerger/queryFinancingSequence`,
    method: 'POST'
  })
}
// 添加融资
export const appendFinancing_V2 = ({ amount, enterpriseId, financingTime, investor, round }) => {
  return request({
    url: `/eesa-report/investmentMerger/addEnterprise`,
    method: 'POST',
    data: {
      amount, enterpriseId, financingTime, investor, round
    }
  })
}
// 删除融资
export const deleteFinancing_V2 = ({ id }) => {
  return request({
    url: `/eesa-report/investmentMerger/deleteEnterprise`,
    method: 'POST',
    params: {
      id
    }
  })
}
// 查询融资
export const findFinancingList_V2 = ({ id }) => {
  return request({
    url: `/eesa-report/investmentMerger/queryFinancing`,
    method: 'POST',
    params: {
      financingId: id
    }
  })
}
// 更新融资
export const updateFinancingList_V2 = ({ amount, enterpriseId, financingTime, investor, round, id }) => {
  return request({
    url: `/eesa-report/investmentMerger/updateEnterprise`,
    method: 'POST',
    data: {
      amount, enterpriseId, financingTime, investor, round, id
    }
  })
}
