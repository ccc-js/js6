const P = module.exports = {}

class Point {
  add(v) { throw Error('Point.add() not defined!') } // Point + Vector => Point
  sub(p) { throw Error('Point.sub() not defined!') } // Point - Point => Vector
}

Object.assign(P, { Point })
