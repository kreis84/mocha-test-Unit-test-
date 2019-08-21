const chalk = require('chalk')


const Calculator = {
  add(a, b){
    // console.trace()
    return a + b;
  },
  sub(a, b){
    return a - b;
  },
  mul(a, b){
    return a * b;
  },
  div(a, b){
    return a / b;
  },
}

module.exports = {
  Calculator,
}
