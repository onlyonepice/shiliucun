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
    prop: "region",
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
    prop: "electricityUsageType1",
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
    prop: "electricityUsageType2",
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
    prop: "voltageLevel",
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
    type: "number",
    prop: "transformerCapacity",
    title: "变压器容量",
    inputText: "kVA",
    controls: false,
    precision: 0,
    rules: [
      {
        required: true,
        message: "请输入变压器容量",
        trigger: "change",
      },
    ],
  },
  {
    type: "number",
    prop: "annualElectricityConsumption",
    title: "年度用电量",
    inputText: "万度",
    controls: false,
    precision: 0,
    rules: [
      {
        required: true,
        message: "请输入年度用电量",
        trigger: "change",
      },
    ],
  },
  {
    type: "number",
    prop: "photovoltaicInstalledCapacity",
    title: "光伏装机量",
    inputText: "kWp",
    controls: false,
    precision: 0,
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
    show: true,
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
    show: true,
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
    type: "number",
    show: true,
    prop: "totalCost",
    title: "系统初始投资",
    inputText: "元/Wh",
    controls: false,
    precision: 0,
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
    show: true,
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
  {
    type: "number",
    show: false,
    prop: "financeRatio",
    title: "融资比例",
    inputText: "%",
    controls: false,
    precision: 0,
    rules: [
      {
        required: true,
        message: "请输入系统初始投资",
        trigger: "change",
      },
    ],
  },
  {
    type: "number",
    show: false,
    prop: "financeRate",
    title: "融资利率",
    inputText: "%",
    controls: false,
    precision: 0,
    rules: [
      {
        required: true,
        message: "请输入系统初始投资",
        trigger: "change",
      },
    ],
  },
  {
    type: "number",
    show: false,
    prop: "financePeriod",
    title: "融资年限",
    inputText: "年",
    controls: false,
    precision: 0,
    rules: [
      {
        required: true,
        message: "请输入系统初始投资",
        trigger: "change",
      },
    ],
  },
];

export function getUnit(amount: number) {
  const _kw =
    amount * 100 >= 1000
      ? ((amount * 100) / 1000).toFixed(3) + "MW"
      : amount * 100 + "kW";
  const _kWh =
    amount * 233 >= 1000
      ? ((amount * 233) / 1000).toFixed(3) + "MWh"
      : amount * 233 + "kWh";
  return {
    kw: _kw,
    kWh: _kWh,
  };
}
