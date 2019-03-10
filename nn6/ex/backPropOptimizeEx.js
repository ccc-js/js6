const ai6 = require('../../ai6')
const ma6 = require('../../ma6')
const f = require('./fnet4')

let p0 = new ma6.Point([1, 2])
ai6.gradientDescendent(f, p0)
