// 校验ip地址
export const regIP = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;

// 手机号正则
export const regMobile = /^1[23456789][0-9]{9}$/;

// 验证码校验
export const regCode = /^[0-9]{6}$/;

// 验证邮箱
export const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

// 验证密码
export const regPassword =
  /^(?![A-z0-9]+$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

export const regPasswordText = /^[^\u4e00-\u9fa5]+$/;

// excel 类型校验
export const regExcelType = /(\.csv|\.xlsx|\.xls)$/i;

// 人物姓名校验只包含中文、英文、空格
export const regName = /^[a-zA-Z\u4e00-\u9fa5\s]*$/;
