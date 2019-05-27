const {ode} = require('../../js6/ma6')

let sol = ode({x0:0, x1:1, y0:1, f:function(t,y) { return y; }})
console.log('sol=', sol)
console.log('sol.at([0.3, 0.7])=', sol.at([0.3,0.7]))

sol = ode({x0:0, x1:10, y0:[3,0], f:function (x,y) { return [y[1],-y[0]]; }}) // y' = -y, 解答為 y=e^{-ix}
// console.log('sol=', sol)
console.log('sol.at([0, pi/2, pi, 3/2pi, 2pi])=', sol.at([0,0.5*Math.PI,Math.PI,1.5*Math.PI,2*Math.PI]))


let p = ode({x0:0, x1:20, y0:[2,0], f:function(t,y) { return [y[1], (1-y[0]*y[0])*y[1]-y[0]]; }}).at([18,19,20])
console.log('p=%j', p)



sol = ode({x0:0, x1:2, y0:1, f:function (x,y) { return y; }, tol:1e-8, maxit:100, event: function (x,y) { return y-1.3; }})
// console.log('sol=', sol)
