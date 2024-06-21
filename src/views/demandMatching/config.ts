interface DemandStatusType {
  name: string;
  value: string;
  background: string;
  color: string;
  borderColor: string;
}
interface ApplicationStatusType {
  name: string;
  value: string;
  background: string;
  color: string;
  borderColor: string;
}

export const demandStatus: DemandStatusType[] = [
  {
    name: "待审核",
    value: "1",
    background: "#EAEDFE",
    color: "#244BF1",
    borderColor: "#244BF1",
  },
  {
    name: "需求中",
    value: "2",
    background: "#FFF3EB",
    color: "#FF892E",
    borderColor: "#FF892E",
  },
  {
    name: "审核未通过",
    value: "3",
    background: "#FEEFF0",
    color: "#F75964",
    borderColor: "#F75964",
  },
  {
    name: "已解决",
    value: "4",
    background: "#E6F8EA",
    color: "#01B82B",
    borderColor: "#01B82B",
  },
  {
    name: "已下架",
    value: "99",
    background: "#F2F3F5",
    color: "rgba(0,0,0,0.9)",
    borderColor: "#DBDCE2",
  },
];
export const applicationStatus: ApplicationStatusType[] = [
  {
    name: "待查阅",
    value: "1",
    background: "#FFF3EA",
    color: "#ED832E",
    borderColor: "#FF892E",
  },
  {
    name: "已同意",
    value: "2",
    background: "#E6F8EA",
    color: "#01B82B",
    borderColor: "#01B82B",
  },
  {
    name: "已拒绝",
    value: "3",
    background: "#FEEFF0",
    color: "#F75964",
    borderColor: "#F75964",
  },
  {
    name: "已查阅",
    value: "4",
    background: "#F2F3F5",
    color: "rgba(0,0,0,0.9)",
    borderColor: "#DBDCE2",
  },
];

// 查询状态
export function searchDemandStatus(params: string | number) {
  let _data = null;
  demandStatus.forEach((item: DemandStatusType) => {
    if (item.name == params || item.value == params) {
      _data = item;
    }
  });
  return _data;
}
// 查询报名状态
export function searchApplicationStatus(params: string | number) {
  let _data = null;
  applicationStatus.forEach((item: ApplicationStatusType) => {
    if (item.name == params || item.value == params) {
      _data = item;
    }
  });
  return _data;
}
