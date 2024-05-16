import * as math from "mathjs";
const arithmetic = {
  add(num1, num2) {
    return math.add(math.bignumber(num1), math.bignumber(num2)).toNumber();
  },
  // 乘
  multiply(num1, num2) {
    return math.multiply(math.bignumber(num1), math.bignumber(num2)).toNumber();
  },
  // 减
  subtract(num1, num2) {
    return math.subtract(math.bignumber(num1), math.bignumber(num2)).toNumber();
  },
  // 除
  divide(num1, num2) {
    return math.divide(math.bignumber(num1), math.bignumber(num2)).toNumber();
  },
};

export default arithmetic;
