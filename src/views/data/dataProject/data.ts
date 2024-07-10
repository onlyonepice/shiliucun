export const operationProjectFormOptions = () => {
  return [
    {
      type: "date",
      title: "时间",
      model: "yearTimeFrame",
      dateType: "monthrange",
      rangeSeparator: "至",
      defaultValue: [],
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
          label: "label",
          value: "id",
          emitPath: false,
        },
      },
    },
  ];
};
