const F = module.exports = {}

class Field {
  add(a,b) { throw Error('Field.add not defined!') }
  sub(a,b) { return this.add(a, b.neg()) }
  mul(a,c) { throw Error('Field.mul not defined!') }
  div(a,c) { return this.mul(a, c.rev()) }
  neg(a)   { throw Error('Field.neg not defined!') }
  rev(a)   { throw Error('Field.rev not defined!') }
}

class FieldMember {
  add(b) { throw Error('FieldMember.add not defined!') }
  sub(b) { return this.add(b.neg()) }
  mul(c) { throw Error('Field.mul not defined!') }
  div(c) { return this.mul(c.rev()) }
  neg(a) { throw Error('Field.neg not defined!') }
  rev(a) { throw Error('Field.rev not defined!') }
}

Object.assign(F, {Field, FieldMember})
