const G = module.exports = {}
const uu6 = require('../../uu6')

class Group {
  eq(a,b) { return uu6.eq(a,b) }
  isMember(a) { throw Error('Group.isMember() not defined!') }
  get e() { throw Error('Group.e() not defined!') }
  op(a,b) { throw Error('Group.op() not defined!') }
  inv(a)  { throw Error('Group.inv() not defined!') }
  test(a,b,c) {
    be(a.op(b).op(c).eq(a.op(b.op(c)))) // (a+b)+c = a+(b+c)
  }
}

class GroupMember {
  constructor() {}
  op(b) { throw Error('GroupMember.add not defined!') }
  eq(b) { return uu.eq(this, b) }
  inv() { throw Error('GroupMember.inv not defined!') }
}

Object.assign(G, { Group, GroupMember })
