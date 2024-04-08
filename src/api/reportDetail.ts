import { http } from "@/utils/http";

export const setReportCollect_V2 = (
  url,
  { collectionType, reportId, uncollect },
) => {
  return http.request<void>("post", url, {
    data: {
      collectionType,
      reportId,
      uncollect,
    },
  });
};

export const setReportScore_V2 = ({ level, moduleName, reportId, score }) => {
  return http.request<void>(
    "post",
    `/eesa-report/onlineReportNewScore/front/v1.0/reportScoring`,
    {
      data: {
        level,
        moduleName,
        reportId,
        score,
      },
    },
  );
};

export const setReportFeedback_V2 = ({
  name,
  contactInformation,
  describe,
  url,
  moduleName,
  reportId,
  reportName,
}) => {
  return http.request<void>(
    "post",
    `/eesa-report/onlineReportNewError/front/v1.0/addContentCorrection`,
    {
      data: {
        name,
        contactInformation,
        describe,
        url,
        moduleName,
        reportId,
        reportName,
      },
    },
  );
};

// 获取上传图片地址
export function fileUpload(data) {
  return http.request<void>("post", "/api-file/fileUpload", {
    data,
  });
}

export function recordReportShare(url, { reportId, share = false }) {
  return http.request<void>("post", url, {
    params: {
      reportId,
      share,
    },
  });
}

export function recordReportRead(url, { reportId, reading }) {
  return http.request<void>("post", url, {
    params: {
      reportId,
      reading,
    },
  });
}

export function recordReportClick(url, { reportId }) {
  return http.request<void>("post", url, {
    params: {
      reportId,
    },
  });
}

export function getPayInfoList() {
  return http.request<void>(
    "post",
    "/eesa-report/product/product/front/v1.0/clientList",
    {},
  );
}

// V3
// 获取报告详情
export function getReportDetailApi(data: any) {
  return http.request<void>(
    "post",
    "/eesa-report/onlineReportNew/front/v1.1/getOnlineReportDetails",
    {
      data,
    },
  );
}

// 获取推荐报告
export function getReportDetailRecommendApi(id: number) {
  return http.request<void>(
    "get",
    `/eesa-report/onlineReportNew/front/v1.1/reportTagRecommendation?id=${id}&limit=10`,
  );
}

// 报告打分
export function setReportScoreApi(data: any) {
  return http.request<void>(
    "post",
    "/eesa-report/onlineReportNewScore/front/v1.0/reportScoring",
    {
      data,
    },
  );
}

// 获取pdf链接
export const getFilePathApi = (params: any) => {
  return http.request<void>("get", "/eesa-report/PdfFile/v1.0/getURL", {
    params,
  });
};

// 下载报告
export const getFileApi = (url, token) => {
  return http.request<void>("get", url, {
    params: { hideError: true },
    headers: {
      "x-oss-meta-token": token,
    },
    responseType: "blob",
  });
};
