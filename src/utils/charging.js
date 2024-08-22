export const setColor = (item) => {
  let color, backgroundColor;
  switch (item) {
    case "低":
      color = "#50B142";
      backgroundColor = "#EDF7EC";
      break;
    case "平":
      color = "#F1AD10";
      backgroundColor = "#FFFAE8";
      break;
    case "高":
      color = "#FF7D00";
      backgroundColor = "#FFF2E5";
      break;
    case "尖":
      color = "#F53F3F";
      backgroundColor = "#FEEBEB";
      break;
    case "深":
      color = "#C34FF1";
      backgroundColor = "#F9EDFD";
      break;
  }
  return `color:${color};background-color:${backgroundColor};`;
};
export const setChargeColor = (item) => {
  let color, backgroundColor;
  if (item) {
    if (item.indexOf("充电")) {
      color = "#50B142";
      backgroundColor = "#EDF7EC";
    } else if (item.indexOf("放电")) {
      color = "#F53F3F";
      backgroundColor = "#FEEBEB";
    }
  } else {
    color = "#fff";
    backgroundColor = "#fff";
  }
  return `color:${color};background-color:${backgroundColor};`;
};
