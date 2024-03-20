import { request } from '@/utils'

// 文件夹列表
export const getFolderList_V2 = ({ limit, page, keyword }) => {
  return request({
    url: `/eesa-report/folder/front/v1.1/list`,
    method: 'GET',
    params: {
      limit, page, keyword
    }
  })
}

// 文件夹添加
export const getFolderListAdd_V2 = ({ name }) => {
  return request({
    url: `/eesa-report/folder/front/v1.1/add`,
    method: 'POST',
    data: {
      name
    }
  })
}

// 文件夹删除
export const getFolderListDel_V2 = ({ id }) => {
  return request({
    url: `/eesa-report/folder/front/v1.1/deleteById`,
    method: 'DELETE',
    params: {
      id
    }
  })
}

// 文件夹更新
export const getFolderListUpdate_V2 = ({ id, name }) => {
  return request({
    url: `/eesa-report/folder/front/v1.1/updateById`,
    method: 'POST',
    data: {
      id, name
    }
  })
}

// 文件夹查询
export const getFolderListFind_V2 = ({ id }) => {
  return request({
    url: `/eesa-report/folder/front/v1.1/getById`,
    method: 'GET',
    params: {
      id
    }
  })
}

// 文件夹下文件
export const getFolderListFindFile_V2 = ({ folderId, limit, page, keyword }) => {
  return request({
    url: `/eesa-report/collection/front/v1.1/findList`,
    method: 'GET',
    params: {
      folderId, limit, page, keyword
    }
  })
}
