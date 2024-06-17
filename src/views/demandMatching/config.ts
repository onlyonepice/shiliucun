interface DemandStatusType {
  name: string;
  value: string;
  background: string;
  color: string;
}
interface ApplicationStatusType {
  name: string;
  value: string;
  background: string;
  color: string;
}

export const demandStatus: DemandStatusType[] = [
  {
    name: "待审核",
    value: "1",
    background: "#FFF3EA",
    color: "#ED832E",
  },
  {
    name: "需求中",
    value: "2",
    background: "#FFF3EA",
    color: "#FF8D32",
  },
  {
    name: "审核未通过",
    value: "3",
    background: "#FEEFF0",
    color: "#F75964",
  },
  {
    name: "已解决",
    value: "4",
    background: "#E9F6F2",
    color: "#25AB7B",
  },
];
export const applicationStatus: ApplicationStatusType[] = [
  {
    name: "待查阅",
    value: "1",
    background: "#FFF3EA",
    color: "#ED832E",
  },
  {
    name: "已同意",
    value: "2",
    background: "#E9F6F2",
    color: "#25AB7B",
  },
  {
    name: "已拒绝",
    value: "3",
    background: "#FEEFF0",
    color: "#F75964",
  },
  {
    name: "已查阅",
    value: "4",
    background: "#ECF6FF",
    color: "#39A7FD",
  },
];

// 查询状态
export const searchDemandStatus = (params: string): DemandStatusType | any => {
  demandStatus.forEach((item: DemandStatusType) => {
    if (item.name === params || item.value === params) {
      return item;
    }
  });
};
// 查询报名状态
export const searchApplicationStatus = (
  params: string,
): ApplicationStatusType | any => {
  applicationStatus.forEach((item: ApplicationStatusType) => {
    if (item.name === params || item.value === params) {
      return item;
    }
  });
};
