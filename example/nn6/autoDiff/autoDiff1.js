const nn6 = require('../../../js6/nn6')
// const ai6 = require('../../../js6/ai6')
const AD = nn6.AD

// let r = AD.compile('(x*x)+(2*x)+3')
// let r = AD.compile('(x*x)+3')
// let r = AD.compile('sin(x)')
let r = AD.compile('2*sin(3*x)')
// let r = AD.compile('x^2')
// let r = AD.compile('sin(x)^2')
// let r = AD.compile('exp(x)')
console.log('r=%j', r)
let x = r.symTable['x']
// x.v = 3
// x.v = Math.PI/4
x.v = 1

console.log('r=', r)
console.log('r.call()=', r.call())
console.log('r.grad([x])=', r.grad(['x']))


/*
let o = r.net.forward()
r.net.backward()
console.log('o=', o)
*/
/*
r.net.watch({x})
r.net.optimize({maxLoops:100})
console.log(r.net.toString())
*/
/*
let f = p0 = r.net
ai6.gradientDescendent(f, p0, {call: nn6.Net.call, grad: nn6.Net.grad, step: nn6.Net.step})
*/