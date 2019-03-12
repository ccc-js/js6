const ai6 = require('../../ai6')
const ma6 = require('../../ma6')
const nn6 = require('../../nn6')
const f = require('./net4')

let p0 = [1, 2]
ai6.gradientDescendent(f, p0, {call: nn6.Net.call, grad: nn6.Net.grad})
