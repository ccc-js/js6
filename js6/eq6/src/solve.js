const ai6 = require('../../ai6')
const uu6 = require('../../uu6')

const S = module.exports = {}

const step = 0.01

class SolutionEquations extends ai6.Solution {
  constructor(v) { // v={eqs, binds}
    super(null)
    this.v = {eqs: v.eqs, binds: Object.assign({}, v.binds)} // 重要：這裡若不重新指定 binds 會造成共用問題！
  }

  neighbor() {
    var n1 = new SolutionEquations(this.v)
    let {eqs, binds} = n1.v, {vars, varMap} = eqs
    let changes = uu6.randomInt(vars.length)
    for (let i=0; i<changes; i++) {
      let name = uu6.randomChoose(vars)
      let type = varMap[name][0]
      if (type === 'variable') {
        let d = uu6.random(-step, step)
        binds[name] = binds[name] + d
      } else if (type === 'call') {
        // 暫時不修改
      }
    }
    // console.log('vars=%j changes=%d binds=%j', vars, changes, binds)
    return n1
  }

  energy() {
    let {eqs, binds} = this.v
    let r = eqs.eval(binds)
    return r.loss
  }
  
  toString() {
    return 'energy('+JSON.stringify(this.v.binds)+')='+this.energy()
  }
}

S.solve = function (args) {
  let {eqs, binds, maxGens, maxFails, debug}=args
  let solution = ai6.hillClimbing(new SolutionEquations({eqs, binds}), maxGens, maxFails, debug)
  // console.log('solution=%j', solution)
  return {binds:solution.v.binds, loss: solution.energy()}
}

Object.assign(S, {SolutionEquations})