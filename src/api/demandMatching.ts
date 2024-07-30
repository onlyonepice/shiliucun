import { http } from "@/utils/http";

// 获取需求详情
export const getDemandDetailApi = (params: any) => {
  return http.request<{ datas; resp_code }>(
    "get",
    "/eesa-data-center/need/need/openApi/v1.0/getNeedById",
    { params },
  );
};

// 报名需求
export const applyDemandApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-data-center/need/apply/front/V1.0/apply",
    { data },
  );
};

// 获取报名列表
export const getApplyListApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-data-center/need/apply/openApi/v1.0/apply/getApplyByNeedId",
    { data },
  );
};

// 同意或拒绝申请
export const agreeOrRefuseApplyApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-data-center/need/apply/front/V1.0/apply/change/status",
    { data },
  );
};

// 查阅状态修改
export const changeApplyStatusApi = (params: number) => {
  return http.request<{ datas; resp_code }>(
    "get",
    `/eesa-data-center/need/apply/front/V1.0/apply/${params}`,
  );
};

// 查询关闭需求原因
export const getCloseReasonApi = (params: any) => {
  return http.request<{ datas; resp_code }>(
    "get",
    `/eesa-data-center/sysDict/back/V1.0/findListByTypeAndValue`,
    { params },
  );
};

// 关闭需求打分
export const closeDemandApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-data-center/need/needNps/front/v1.0/submitNps",
    { data },
  );
};
// 删除需求
export const deleteDemandApi = (id: number) => {
  return http.request<{ datas; resp_code }>(
    "get",
    `/eesa-data-center/need/need/front/v1.0/closeNeedById?needId=${id}`,
  );
};

// 查询打分配置
export const getAssignConfigApi = (params: any) => {
  return http.request<{ datas; resp_code }>(
    "get",
    `/eesa-data-center/sysDict/back/v1.0/findAllByTypeAndValue`,
    { params },
  );
};

// 撤销报名
export const cancelApplyApi = (id: number) => {
  return http.request<{ datas; resp_code }>(
    "post",
    `/eesa-data-center/need/apply/front/v1.0/applyCancel?id=${id}`,
  );
};

// 解决需求
export const solveDemandApi = (id: number) => {
  return http.request<{ datas; resp_code }>(
    "get",
    `/eesa-data-center/need/need/front/v1.0/finishNeedById?needId=${id}`,
  );
};

// 提交评价
export const submitEvaluateApi = (data: any) => {
  return http.request<{ datas; resp_code }>(
    "post",
    "/eesa-data-center/need/applyEvaluate/front/v1.0/SubmitEvaluate",
    { data },
  );
};
