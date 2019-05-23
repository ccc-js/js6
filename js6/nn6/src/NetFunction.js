const Net = require('./Net')

class NetFunction extends Net {
  constructor() {
    super()
    this.symTable = {}
  }

  call() { return this.forward().v }

//  diff(x) { return this.symTable[name].g }

  grad(args) {
    this.forward()
    this.backward()
    // console.log('NetFunction: this=%j', this)
    let len = args.length, gv = new Array(len)
    for (let i=0;i<len; i++) {
      let name = args[i]
      gv[i] = this.symTable[name].g
    }
    return gv
  }
}

module.exports = NetFunction
