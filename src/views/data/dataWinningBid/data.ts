export const priceFormOptions = () => {
  return [
    {
      type: "select",
      label: "中标内容",
      model: "biddingContent",
      bind: {
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramName",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "技术类型",
      model: "technologyType",
      bind: {
        ref: "business-electricity-cascade",
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramName",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "应用场景",
      model: "applicationScenarios",
      bind: {
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramName",
          emitPath: false,
        },
      },
    },
  ];
};
export const enterpriseFormOptions = () => {
  return [
    {
      type: "select",
      label: "中标内容",
      model: "biddingContent",
      bind: {
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramName",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "技术类型",
      model: "technologyType",
      bind: {
        ref: "business-electricity-cascade",
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramName",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "储能时长",
      model: "energyStorageDuration",
      bind: {
        ref: "tariffLevel-cascade",
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramName",
          value: "paramDesc",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "应用场景",
      model: "applicationScenarios",
      bind: {
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramName",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "中标时间",
      model: "year",
      bind: {
        ref: "year-cascade",
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramName",
          value: "paramDesc",
          emitPath: false,
        },
      },
    },
  ];
};
export const enterScenesFormOptions = () => {
  return [
    {
      type: "select",
      label: "中标内容",
      model: "contentDict",
      multiple: false,
      bind: {
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "id",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "发布日期",
      model: "releaseTime",
      multiple: false,
      bind: {
        ref: "year-cascade",
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramValue",
          emitPath: false,
        },
      },
    },
    {
      type: "select",
      label: "统计单位",
      model: "unit",
      multiple: true,
      bind: {
        ref: "unit-cascade",
        placeholder: "请选择",
        options: [],
        cascaderOption: {
          label: "paramDesc",
          value: "paramValue",
          emitPath: false,
        },
      },
    },
  ];
};
