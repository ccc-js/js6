module.exports = class Field {
  constructor(gadd, gmul) {
    this.gadd = gadd
    this.gmul = gmul
  }
  add(a,b) { throw Error('Field.add not defined!') }
  sub(a,b) { return this.add(a, b.neg()) }
  mul(a,c) { throw Error('Field.mul not defined!') }
  div(a,c) { return this.mul(a, c.rev()) }
  neg(a)   { throw Error('Field.neg not defined!') }
  rev(a)   { throw Error('Field.rev not defined!') }
  
  static test (f) {
    Group.test(f.gadd)
    Group.test(f.gmul)
    rules([distr], f)
  }
}
