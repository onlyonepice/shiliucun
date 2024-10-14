export const priceFormOptions = () => {
  return [
    {
      type: "select",
      title: "中标内容",
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
      title: "技术类型",
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
      title: "应用场景",
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

export const priceFormOptionsNews = () => {
  return [
    {
      type: "select",
      title: "中标内容",
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
      title: "储能时长",
      model: "energyStorageDuration",
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
      title: "技术类型",
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
      title: "步长",
      model: "stepSize",
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
      title: "中标内容",
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
      title: "技术类型",
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
      title: "储能时长",
      model: "energyStorageDuration",
      bind: {
        ref: "tariffLevel-cascade",
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
      title: "应用场景",
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
      title: "中标时间",
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
      title: "中标内容",
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
      title: "发布日期",
      model: "releaseTime",
      multiple: false,
      bind: {
        ref: "year-cascade",
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
      title: "统计单位",
      model: "unit",
      multiple: false,
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
