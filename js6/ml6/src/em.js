// 參考文獻：Numerical example to understand Expectation-Maximization -- http://ai.stanford.edu/~chuongdo/papers/em_tutorial.pdf
// What is the expectation maximization algorithm? (PDF) -- http://stats.stackexchange.com/questions/72774/numerical-example-to-understand-expectation-maximization

class EM {
  constructor(p) {
    this.p = p || {}
    this.p.maxLoops = this.p.maxLoops || 1000
    this.p.minDelta = this.p.minDelta || 0.001
  }
  estimate() { throw Error('EM:estimate() not defined!') }
  maximize() { throw Error('EM:maximize() not defined!') }
  run() {
    console.log('===========run===============')
    let { maxLoops, minDelta } = this.p
    let delta = 9.99999
    console.log('p=%j', this.p)
    for (let gen=0; gen<maxLoops && delta > minDelta; gen++) {
      let p1 = this.estimate()
      delta = this.maximize(p1)
    }
  }
}

module.exports = {EM}