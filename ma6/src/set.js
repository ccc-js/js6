const S = module.exports = {}

S.intersection = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e) && y.has(e) }
  return xy
}

S.union = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e) || y.has(e) }
  return xy
}

S.difference = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e) && !y.has(e) }
  return xy
}

S.symmetricDifference = function (x, y) {
  return x.union(y).difference(x.intersection(y))
}

S.cartesianProduct = function (x, y) {
  var xy = new EnumSet()
  xy.has = function (e) { return x.has(e[0]) && y.has(e[1]) }
  return xy
}

class EnumSet {
  constructor (enumHead, has) {
    this.set = new Set(enumHead)
    this.enumHead = S.isUndefined(enumHead) ? [] : enumHead
    if (typeof has !== 'undefined') this.has = has
  }
  add (e) { this.set.add(e) }
  has (e) { return this.set.has(e) }
  sample (n) {
    if (S.isUndefined(n)) {
      return S.sample(this.enumHead)
    } else {
      var a = []
      for (var i = 0; i < n; i++) a.push(this.sample())
      return a
    }
  }
  enumerate () { return this.enumHead }
  intersection (y) { return S.intersection(this, y) }
  union (y) { return S.union(this, y) }
  difference (y) { return S.difference(this, y) }
  symmetricDifference (y) { return S.symmetricDifference(this, y) }
  cartesianProduct (y) { return S.cartesianProduct(this, y) }
}

S.create = function (enumHead, has) { return new EnumSet(enumHead, has) }

var enumFloat = [-3.2, -1, 0, 1, 2.3, 4.7]
var enumInt = [-10, -5, -1, 0, 1, 3, 5, 6]
var enumN0 = S.steps(0, 10, 1)
var enumN1 = S.steps(1, 10, 1)
var enumOdd = S.steps(1, 15, 2)
var enumEven = S.steps(2, 15, 2)
var enumPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
var enumAll = [ 'hi', 5, Math.PI, EnumSet, S.isBool, enumPrime, new Set() ]

S.All = new EnumSet(enumAll, S.yes) // 全體集合
S.Empty = new EnumSet([], S.no) // 空集合
S.Float = new EnumSet(enumFloat, S.isFloat) // 浮點數集合
S.Z = S.Integer = new EnumSet(enumInt, S.isInteger) // 整數集合
S.N0 = new EnumSet(enumN0, (e) => S.isInteger(e) && e >= 0)// 自然數集合 N0
S.N1 = new EnumSet(enumN1, (e) => S.isInteger(e) && e >= 1) // 自然數集合 N1
S.Even = new EnumSet(enumEven, S.isEven)// 偶數集合
S.Odd = new EnumSet(enumOdd, S.isOdd) // 奇數集合
S.Prime = new EnumSet(enumPrime, S.isPrime) // 質數集合
S.Finite = (n) => new EnumSet(S.steps(0, n - 1, 1)) // 有限集合 0...n-1
S.Russel = S.NoSelf = new EnumSet(enumAll, function (e) { return !e.has(e) }) // 羅素集合悖論
S.Set = EnumSet
// =========== 集合的相關數學性質 ==================

// 測度（Measure）: https://en.wikipedia.org/wiki/Measure_(mathematics)
// 請注意不要和幾何的《度量 Metric》搞混，度量是距離函數，但測度是集合的函數
// Measure(Set)=>S
S.Measure = {
  // Non-negativity: For all E in Σ: μ(E) ≥ 0.
  // Null empty set: μ({}) = 0.
  // Countable additivity (or σ-additivity): μ(E1+E2+...) = μ(E1)+μ(E2)+...
}

// Counting measure : is defined by μ(S) = number of elements in S.
// Lebesgue measure : μ([0, 1]) = 1; https://en.wikipedia.org/wiki/Lebesgue_measure
// Circular angle measure :
// Haar measure : https://en.wikipedia.org/wiki/Haar_measure