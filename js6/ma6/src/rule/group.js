module.exports = class Group extends Set {
  get e() { throw Error('Group.e() not defined!') }
  op(a,b) { throw Error('Group.op() not defined!') }
  inv(a)  { throw Error('Group.inv() not defined!') }

  static test() {
    rules([close, assoc, ident, inver], this)
  }
}
