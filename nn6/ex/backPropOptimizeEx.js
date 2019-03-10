const gd6 = require('../../gd6')
const f = require('./fnet4')

let p0 = new gd6.Point({x:1, y:2})
gd6.gradientDescendent(f, p0)
