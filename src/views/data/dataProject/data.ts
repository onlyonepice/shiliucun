export const operationProjectFormOptions = () => {
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
      type: "cascader",
      title: "地区",
      model: "region",
      bind: {
        ref: "project-area-cascade",
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
