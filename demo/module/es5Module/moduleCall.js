//引入模块，当前路径必须写 './'
const arithmetic = require('./arithmetic.js')
console.log(arithmetic);

const result_1 = arithmetic.sum(1, 2)
const result_2 = arithmetic.subtract(1, 2)
console.log(result_1, result_2);