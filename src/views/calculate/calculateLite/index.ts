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
    prop: "enterpriseName",
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
    valueKey: "paramName",
    labelKey: "paramDesc",
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
    valueKey: "paramName",
    labelKey: "paramDesc",
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
    prop: "tariffLevelId",
    title: "电压等级",
    valueKey: "paramName",
    labelKey: "paramDesc",
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
    prop: "transformerInformation",
    title: "变压器信息",
    options: [
      { label: "按容缴费", value: 1 },
      { label: "按需缴费", value: 2 },
    ],
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
    prop: "transformerCapacity",
    title: "变压器容量",
    inputText: "kVA",
    rules: [
      {
        required: true,
        message: "请输入变压器容量",
        trigger: "change",
      },
    ],
  },
  {
    type: "input",
    prop: "annualElectricityConsumption",
    title: "年度用电量",
    inputText: "万度",
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
    prop: "photovoltaicInstalledCapacity",
    title: "光伏装机量",
    inputText: "kWp",
  },
  {
    type: "select",
    prop: "industry",
    title: "所属行业",
    options: [
      {
        label: "轻工业",
        value: "轻工业",
        recommendId: 2,
        list: [
          { src: "load_3.png", type: "", recommend: true, chartId: 3 },
          { src: "load_4.png", type: "", recommend: true, chartId: 4 },
          { src: "load_6.png", type: "", recommend: true, chartId: 6 },
          { src: "load_7.png", type: "", recommend: true, chartId: 7 },
        ],
      },
      {
        label: "重工业",
        value: "重工业",
        recommendId: 3,
        list: [
          { src: "load_3.png", type: "", recommend: true, chartId: 3 },
          { src: "load_4.png", type: "", recommend: true, chartId: 4 },
          { src: "load_6.png", type: "", recommend: true, chartId: 6 },
          { src: "load_7.png", type: "", recommend: true, chartId: 7 },
        ],
      },
      {
        label: "园区及商业",
        value: "园区及商业",
        recommendId: 4,
        list: [
          { src: "load_4.png", type: "", recommend: true, chartId: 4 },
          { src: "load_5.png", type: "", recommend: true, chartId: 5 },
        ],
      },
      {
        label: "公用充电站",
        value: "公用充电站",
        recommendId: 1,
        list: [
          { src: "load_1.png", type: "", recommend: false, chartId: 1 },
          { src: "load_2.png", type: "", recommend: false, chartId: 2 },
        ],
      },
    ],
    rules: [
      {
        required: true,
        message: "请输入所属行业",
        trigger: "change",
      },
    ],
  },
];

// 第二步
export const stepTwoCapacity = [
  {
    type: "input",
    prop: "amount",
    title: "设备数量",
    inputText: "台",
    rules: [
      {
        required: true,
        message: "请输入设备数量",
        trigger: "change",
      },
    ],
  },
];

export const stepTwoCooperate = [
  {
    type: "select",
    prop: "investmentModel",
    title: "投资模式",
    options: [
      {
        label: "EMC合同能源管理",
        value: 1,
      },
      {
        label: "业主自投",
        value: 2,
      },
    ],
    rules: [
      {
        required: true,
        message: "请输入投资模式",
        trigger: "change",
      },
    ],
  },
  {
    type: "slider",
    prop: "sharingRatio",
    title: "分成比例",
    sliderText: [],
    rules: [
      {
        required: true,
        message: "请输入分成比例",
        trigger: "change",
      },
    ],
  },
  {
    type: "input",
    prop: "totalCost",
    title: "系统初始投资",
    inputText: "元/Wh",
    rules: [
      {
        required: true,
        message: "请输入系统初始投资",
        trigger: "change",
      },
    ],
  },
  {
    type: "radio",
    prop: "isFinance",
    title: "是否融资",
    options: [
      { label: "是", value: 1 },
      { label: "否", value: 0 },
    ],
    rules: [
      {
        required: true,
        message: "请选择是否融资",
        trigger: "change",
      },
    ],
  },
];
