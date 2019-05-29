/*
Python SymPy : 

ODE : https://docs.sympy.org/latest/modules/solvers/ode.html
Source : https://docs.sympy.org/latest/_modules/sympy/solvers/ode.html

PDE : https://docs.sympy.org/latest/modules/solvers/pde.html
Source : https://docs.sympy.org/latest/_modules/sympy/solvers/pde.html

考慮使用 http://algebrite.org/ 做更複雜的事情！

Other Javascript CAS are:

javascript-cas by Anthony Foster supporting "differentiation, complex numbers, sums, vectors (dot products, cross products, gradient/curl etc)"
Coffeequate by Matthew Alger supporting "quadratic and linear equations, simplification of most algebraic expressions, uncertainties propagation, substitutions, variables, constants, and symbolic constants"
Algebra.js by Nicole White which among other things can build and solve equations (up to cubic) via a "chainable" API.
Nerdamer by Martin Donk and others which among other things solves symbolically polynomials up to 3rd degree, supports symbolic integration and differentiation, and handles complex numbers.
Mathsteps by Evy Kassirer, Ahmed Elnaiem and others focuses on providing "step-by-step solutions for a subset of high school algebra", including polyomials with basic fractions and radicals.
Polynomial.js by Robert Eisele specifically performs operations on polynomials in the fields: Q, C, Zp and R. (roots/factorisation routines not included).
Kas by the Khan Academy's team can simplify and compare expressions and equations.
Math.js by Jos de Jong and others can simplify expressions and figure out derivatives. Handles big numbers, complex numbers, units and matrices

https://github.com/jiggzson/nerdamer (讚! 但沒有微分方程求解)
-- a symbolic math expression evaluator for javascript

繪圖 : https://mauriciopoppe.github.io/function-plot/

*/


const S = module.exports = require('./symDiff')
const uu6 = require('../../uu6')
const ma6 = require('../../ma6')

S.call = function (exp, context) {
  let c = {...context}, $r = null // 加 $ 是為了避免 exp 裏有變數 r 的名稱。
  uu6.mixin(c, ma6)
  eval(`with (c) { $r = ${exp} }`)
  return $r
}

// 將 D(exp) 中的 exp 展開
S.expand = function (exp, x) {

}

