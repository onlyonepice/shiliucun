import { request } from '@/utils'

// ---报告收藏
// 收藏列表
export const getCollectListReport_V2 = ({ limit, page }) => {
  return request({
    url: `/eesa-report/collection/back/v1.1/findPage`,
    method: 'GET',
    params: {
      limit, page
    }
  })
}

// 复制收藏
export const getCollectListCopyReport_V2 = ({ fileid, ids, targetFileId }) => {
  return request({
    url: `/eesa-report/collection/front/v1.1/copy`,
    method: 'POST',
    data: {
      fileid, ids, targetFileId
    }
  })
}

// 批量删除收藏
export const getCollectListDeletesReport_V2 = ({ folderId, ids }) => {
  return request({
    url: `/eesa-report/collection/front/v1.1/deleteByIds`,
    method: 'DELETE',
    params: {
      folderId, ids
    }
  })
}

// 移动收藏
export const getCollectListMoveReport_V2 = ({ fileid, ids, targetFileId }) => {
  return request({
    url: `/eesa-report/collection/front/v1.1/move`,
    method: 'POST',
    data: {
      fileid, ids, targetFileId
    }
  })
}

// 更新收藏
export const getCollectListUpdateReport_V2 = ({ limit, page }) => {
  return request({
    url: `/eesa-report/collection/back/v1.1/findPage`,
    method: 'GET',
    params: {
      limit, page
    }
  })
}

// 查询收藏
export const getCollectListFindReport_V2 = ({ limit, page }) => {
  return request({
    url: `/eesa-report/collection/back/v1.1/findPage`,
    method: 'GET',
    params: {
      limit, page
    }
  })
}

// ---结果收藏
// 收藏结果列表
export const getCollectListResult_V2 = ({ limit, page }) => {
  return request({
    url: `/eesa-report/collectionResultData/front/v1.1/findPage`,
    method: 'POST',
    params: {
      limit, page
    }
  })
}
// 收藏结果添加
export const getCollectListAddResult_V2 = data => {
  return request({
    url: `/api-file/file/front/v1.1/cacheCollection`,
    method: 'POST',
    data
  })
}

// 删除收藏结果
export const getCollectListDeleteResult_V2 = ({ id, ids }) => {
  return request({
    url: `/eesa-report/collectionResultData/front/v1.1/delete`,
    method: 'POST',
    data: {
      id, ids
    }
  })
}

// 删除收藏s结果
export const getCollectListDeletesResult_V2 = ({ id, ids }) => {
  return request({
    url: `/eesa-report/collectionResultData/front/v1.1/deleteByIds`,
    method: 'POST',
    data: {
      id, ids
    }
  })
}

// 收藏结果查询
export const getCollectListFindResult_V2 = ({ id }) => {
  return request({
    url: `/eesa-report/collectionResultData/front/v1.1/preview`,
    method: 'POST',
    data: {
      id
    }
  })
}
