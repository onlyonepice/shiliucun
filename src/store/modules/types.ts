export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: string;
  device: string;
};

export type multiType = {
  path: string;
  parentPath: string;
  name: string;
  meta: any;
  query?: object;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
};

export type userType = {
  username?: string;
  roles?: Array<string>;
  userInfo?: any;
  accountInfo?: any;
  fileUrl?: any;
  imgUrl?: any;
  userAccount?: object;
  isRememberPsd?: boolean;
  userAccountMobile?: string;
  userAccountPsd?: string;
  publicKey?: any;
  token: string;
  openLoginVisible: boolean;
  openVipVisible: boolean;
  permissionList: Array<any>;
  showMembersBuy: boolean;
  openVipTitle: string;
  openVipSubmitTitle: string;
  comparedList: Array<any>;
  showConsultationNav: boolean;
  showNewUserVip: boolean;
  businessList: Array<any>;
  hasNotRead: number;
};
export type productType = {
  industryCommerce: string;
  batteryCell: string;
  converter: string;
  other: string;
};
