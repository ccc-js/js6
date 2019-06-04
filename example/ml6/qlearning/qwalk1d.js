const uu6 = require('../../../js6/uu6')
const Q = require('../../../js6/ml6').Q

class QWalk1D extends Q {
  constructor() {
    super()
  }
  init() {
    this.q = []
    this.len = 6
    this.goal = 2
    for (let i=0; i<=this.len; i++) {
      this.q[i] = {left:0, right:0}
    }
  }
  isGoal(s) { return s === this.goal }
  getStart() {
    return uu6.randomInt(0, this.len+1)
  }
  chooseAction(s) {
    let a = uu6.randomChoose(['left', 'right'])
    if (s <= 0) return 'right'
    if (s >= this.len) return 'left'
    return a
  }
  doAction(s, a) {
    let s1 = (a === 'right') ? s+1 : s-1
    let r = this.isGoal(s1) ? 1 : 0
    return {s1, r}
  }
  dump() {
    const q = this.q
    let r = []
    for (let i=0; i<q.length; i++) {
      r.push(i + ':l=' + q[i].left.toFixed(4) + ' r=' + q[i].right.toFixed(4))
    }
    return r.join('\n')
  }
}

const q = new QWalk1D()
q.learning({maxLoops:200, rate:0.1, decay: 0.5})
