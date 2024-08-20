export const stepOneBasics = [
  {
    type: "input",
    prop: "projectName",
    title: "项目名称",
    rules: [
      {
        required: true,
        message: "请输入项目名称",
        trigger: "change",
      },
    ],
  },
  {
    type: "input",
    prop: "projectName",
    title: "企业信息",
  },
  {
    type: "select",
    prop: "regionName",
    title: "项目地区",
    options: [],
    valueKey: "regionName",
    labelKey: "regionName",
    rules: [
      {
        required: true,
        message: "请输入项目地区",
        trigger: "change",
      },
    ],
  },
  {
    type: "select",
    prop: "electricityTypeOneName",
    title: "用电类型I",
    options: [],
    rules: [
      {
        required: true,
        message: "请输入用电类型I",
        trigger: "change",
      },
    ],
  },
  {
    type: "select",
    prop: "electricityTypeTwoName",
    title: "用电类型II",
    options: [],
    rules: [
      {
        required: true,
        message: "请输入用电类型II",
        trigger: "change",
      },
    ],
  },

  {
    type: "select",
    prop: "projectName",
    title: "电压等级",
    options: [],
    rules: [
      {
        required: true,
        message: "请输入电压等级",
        trigger: "change",
      },
    ],
  },
];

export const stepOneElectricity = [
  {
    type: "select",
    prop: "projectName",
    title: "变压器信息",
    options: [],
    rules: [
      {
        required: true,
        message: "请输入变压器信息",
        trigger: "change",
      },
    ],
  },
  {
    type: "input",
    prop: "projectName",
    title: "变压器容量",
    inputText: "kVA",
  },
  {
    type: "select",
    prop: "projectName",
    title: "年度用电量",
    options: [],
    rules: [
      {
        required: true,
        message: "请输入年度用电量",
        trigger: "change",
      },
    ],
  },
  {
    type: "input",
    prop: "projectName",
    title: "光伏装机量",
    inputText: "kWp",
  },
  {
    type: "select",
    prop: "projectName",
    title: "所属行业",
    options: [],
    rules: [
      {
        required: true,
        message: "请输入所属行业",
        trigger: "change",
      },
    ],
  },
];
