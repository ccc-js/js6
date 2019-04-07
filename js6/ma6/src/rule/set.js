module.exports = class Set {
  contain(a) { throw Error('Set.isMember() not defined!') }
  generate() { throw Error('Set.generate() not defined!') }

  static test(set) {
    let a = set.generate()
    be(set.contain(a))
    be(a.eq(a))
  }
}
