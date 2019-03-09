const gd6 = require('../..')
const ds6 = require('../../../ds6')
const f = require('../pf')

gd6.gradientDescendent(f, new ds6.MapVector({x:1, y:1}))