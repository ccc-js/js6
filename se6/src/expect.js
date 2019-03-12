const E = module.exports = {}
const uu6 = require('../../uu6')

class Expect {
  constructor(o) {
    this.o = o
    this.isNot = false
  }

  check(cond) {
    uu6.be((cond && !this.isNot) || (!cond && this.isNot))
  }

  equal(o) {
    this.check(uu6.eq(this.o, o))
    return this
  }

  type(type) { 
    this.check(uu6.type(this.o, type))
    return this
  }

  a(type) {
    this.check(uu6.type(this.o, type) || uu6.eq(this.o, type))
    return this
  }

  contain(member) {
    let m = uu6.member(this.o, member)
    this.check(m != null)
    this.o = m
    return this
  }

  property(member) { return this.contain(member) }
  
  include(member) { return this.contain(member) }

  get not() {
    this.isNot = !this.isNot
    return this
  }

  get to() { return this }
  get but() { return this }
  get at() { return this }
  get of() { return this }
  get same() { return this }
  get does() { return this }
  get do() { return this }
  get still() { return this }
  get is() { return this }
  get be() { return this }
  get should() { return this }
  get has() { return this }
  get have() { return this }
  get been() { return this }
  get that() { return this }
  get and() { return this }
  get to() { return this }
  get to() { return this }
  get to() { return this }
}

// let p = Expect.prototype
// p.to = 
// p.but = p.at = p.of = p.same = p.does = p.do = p.still = p.is = p.be = p.should = p.has = p.have = p.been = p.with = p.that = p.and = p.self
// p.include = p.property = p.contain
// p.a = p.type

E.expect = function (o) {
  return new Expect(o)
}
