export const step2Field = [
  {
    label: "产品名称",
    prop: "productName",
    type: "input",
    rules: [
      {
        required: true,
        message: "请输入产品名称",
        trigger: "change",
      },
    ],
  },
  {
    label: "企业名称",
    prop: "enterpriseName",
    type: "autocomplete",
    rules: [
      {
        required: true,
        message: "请选择企业名称",
        trigger: "change",
      },
    ],
  },
  {
    label: "产品发布时间",
    prop: "releaseTime",
    type: "month",
    rules: [
      {
        required: true,
        message: "请选择产品发布时间",
        trigger: "change",
      },
    ],
  },
  {
    label: "产品图片",
    prop: "images",
    type: "uploadImgs",
    accept: ["png", "jpg", "jpeg"],
    limit: 5,
    text: "上传1:1，格式jpg、png且不大于10M的图片，最多5张",
    size: 10,
    rules: [
      {
        required: true,
        message: "请上传图片",
        trigger: "change",
      },
    ],
  },
  {
    label: "产品说明书/产品文档",
    prop: "specificationDocumentFileList",
    type: "uploadField",
    accept: ["pdf", "jpg", "jpeg"],
    limit: 5,
    text: "",
    size: 10,
    rules: [
      {
        required: true,
        message: "请上传图片",
        trigger: "change",
      },
    ],
  },
];

export const step3Field = [
  {
    label: "产品型号",
    prop: "modelName",
    showProp: "modelName",
    type: "input",
    rules: [
      {
        required: true,
        message: "请输入产品型号",
        trigger: "change",
      },
    ],
  },
  { label: "电池参数", type: "title" },
  {
    label: "电芯类型",
    prop: "batteryType",
    showProp: "batteryTypeName",
    options: [],
    type: "select",
    rules: [
      {
        required: true,
        message: "请选择电芯类型",
        trigger: "change",
      },
    ],
  },
  {
    label: "电池系统能量/kWh",
    prop: "batterySystemEnergy",
    showProp: "batterySystemEnergy",
    type: "input",
    rules: [
      {
        required: true,
        message: "请输入电池系统能量",
        trigger: "change",
      },
    ],
  },
  {
    label: "放电深度/%",
    prop: "dischargeDepth",
    showProp: "dischargeDepth",
    type: "input",
  },
  { label: "PCS参数", type: "title" },
  {
    label: "标称电压/V",
    prop1: "nominalVoltageMin",
    prop2: "nominalVoltageMax",
    showProp: "nominalVoltage",
    type: "inputs",
  },
  {
    label: "额定功率/kW",
    prop: "ratedPower",
    type: "input",
    showProp: "ratedPower",
    rules: [
      {
        required: true,
        message: "请输入额定功率",
        trigger: "change",
      },
    ],
  },
  { label: "系统参数", type: "title" },
  {
    label: "产品形态",
    prop: "productForm",
    type: "select",
    showProp: "productFormName",
    options: [],
    rules: [
      {
        required: true,
        message: "请选择产品形态",
        trigger: "change",
      },
    ],
  },
  {
    label: "系统综合效率/%",
    prop: "systemOverallEfficiency",
    showProp: "systemOverallEfficiency",
    type: "input",
  },
  {
    label: "年衰减率/%",
    prop: "annualDecayRate",
    showProp: "annualDecayRate",
    type: "input",
  },
  {
    label: "冷却方式",
    prop: "coolingMethod",
    multiple: true,
    showProp: "coolingMethodName",
    type: "select",
    options: [],
  },
  {
    label: "尺寸/m*m*m",
    prop: "size",
    showProp: "size",
    type: "input",
  },
  {
    label: "产品单价/元/kWh",
    showProp: "energyStorageSystemProductUnitPrice",
    prop: "energyStorageSystemProductUnitPrice",
    type: "number",
  },
];
