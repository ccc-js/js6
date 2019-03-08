const nu6 = require('..')
const f = require('./f')
console.log('df(f(x:1,y:2), x) = ', nu6.df(f, {x:1, y:2}, 'x'))
console.log('grad(f(x:1,y:2))=', nu6.grad(f, {x:1, y:2}))
