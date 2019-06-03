const E = module.exports = {}
const uu6 = require('../../uu6')

class Expect {
  constructor(o) {
    this.o = o
    this.isNot = false
  }

  check(cond) {
    return (cond && !this.isNot) || (!cond && this.isNot)
  }

  pass(f) {
    let cond = f(this.o)
    if (this.check(cond)) return this
    throw Error('Expect.pass fail!')
  }

  each(f) {
    let o = this.o
    for (let k in o) {
      if (!f(o[k])) throw Error('Expect.each fail! key='+k)
    }
  }

  any(f) {
    let o = this.o
    for (let k in o) {
      if (f(o[k])) return true
    }
    throw Error('Expect.any fail!')
  }

  equal(o) {
    if (this.check(uu6.eq(this.o, o))) return this
    throw Error('Expect.equal fail!')
  }

  near(n, gap) {
    if (this.check(uu6.near(this.o, n, gap))) return this
    throw Error('Expect.near fail!')
  }

  type(type) { 
    if (this.check(uu6.type(this.o, type))) return this
    throw Error('Expect.type fail!')
  }

  a(type) {
    if (this.check(uu6.type(this.o, type) || uu6.eq(this.o, type))) return this
    throw Error('Expect.a fail!')
  }

  contain(member) {
    let m = uu6.member(this.o, member)
    if (this.check(m != null)) { this.o = m; return this }
    throw Error('Expect.contain fail!')
  }

  get not() {
    this.isNot = !this.isNot
    return this
  }
  get 不() { return this.not }
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
  get 那個() { return this.that }
  get and() { return this }
  get to() { return this }
}

E.expect = E.希望 = E.願 = E.驗證 = E.確認 = function (o) {
  return new Expect(o)
}

let p = Expect.prototype

p.property = p.contain
p.include = p.contain
p.包含 = p.include
p.通過 = p.pass
p.每個 = p.each
p.all = p.each
p.等於 = p.equal
p.靠近 = p.near
p.型態 = p.type
p.是 = p.a
p.有 = p.contain
p.屬性 = p.property
