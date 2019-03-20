const ai6 = require('../../ai6')
const ma6 = require('../../ma6')
const nn6 = require('../../nn6')
const net = require('./net4')

let f = p0 = net
ai6.gradientDescendent(f, p0, {call: nn6.Net.call, grad: nn6.Net.grad, step: nn6.Net.step})
