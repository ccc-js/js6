module.exports = class FNet {

  constructor(net, args) {
    this.net = net
    this.args = args
  }

  setValues(vars) {
    for (let k in vars) {
      this.args[k].v = vars[k]
    }
  }

  getGrads() {
    let grads = []
    for (let k in this.args) {
      grads.push(this.args[k].g)
    }
    return grads
  }

  call(vars) {
    this.setValues(vars)
    let o = this.net.forward()
    return o.v
  }

  grad(vars) {
    this.call(vars)
    this.net.backward()
    return this.getGrads()
  }

  dump() {
    return this.net.dump()
  }
}
