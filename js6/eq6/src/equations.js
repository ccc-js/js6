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

const S = module.exports = {} // require('./symDiff')
const sp6 = require('../../sp6')
const uu6 = require('../../uu6')
const ma6 = require('../../ma6')
const F = require('./functions')

class EqParser extends sp6.Parser {
  constructor() {
    super()
    this.varMap = {}
  }
  addVars(name, obj) {
    if (F[name] != null) return obj
    this.varMap[name] = obj
    return obj
  }
  call (fname, args) {
    return this.addVars(fname, ['call', fname, args.length])
  }
  variable (name) {
    return this.addVars(name, ['variable', name])
  }
}

class Equations {
  constructor(exps) {
    let g = new EqParser()
    this.exps = exps
    this.eqTrees = sp6.compile(exps, g)
    this.eList = []
    let eArray = exps.split(';')
    for (let e of eArray) {
      this.eList.push(e.split("="))
    }
    this.varMap = g.varMap
    this.vars = Object.keys(g.varMap)
  }
  eval(binds) {
    let vList = [], loss = 0
    for (let e of this.eList) {
      let v0 = S.call(e[0], binds)
      let v1 = S.call(e[1], binds)
      vList.push([v0, v1])
      loss += Math.abs(v0-v1)
    }
    return {vList, loss}
  }
}

let expandFunctions = function (binds) {
  let codes = []
  for (let name in binds) {
    let value = binds[name]
    if (typeof value === 'string') {
      codes.push(`var ${name}=eval("${value}")`)
    }
  }
  return codes.join(';')
}

S.call = function (exp, binds) {
  let ctx = {...binds}, $r = null // 加 $ 是為了避免 exp 裏有變數 r 的名稱。
  uu6.mixin(ctx, F) // uu6.mixin(ctx, Math) // uu6.mixin(ctx, ma6)
  let code = `with (ctx) { ${expandFunctions(binds)}; $r = ${exp} }`
  eval(code)
  return $r
}

S.equations = function (exps) {
  return new Equations(exps)
}

