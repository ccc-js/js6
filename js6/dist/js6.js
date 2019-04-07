(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = require('./src/ai6')
},{"./src/ai6":4}],2:[function(require,module,exports){
var uu6 = require('../../uu6')

class GeneticAlgorithm {
  constructor() {
    this.population = []    // 族群
    this.mutationRate = 0.1 // 突變率
  }

  run(size, maxGen) { // 遺傳演算法主程式
    this.population = this.newPopulation(size); // 產生初始族群
    for (let t = 0; t < maxGen; t++) { // 最多產生 maxGen 代
      console.log("============ generation", t, "===============")
      this.population = this.reproduction(this.population); // 產生下一代
      this.dump(); // 印出目前族群
    }
  }
  
  newPopulation(size) {
    var newPop=[];
    for (var i=0; i<size; i++) {
      var chromosome = this.randomChromosome(); // 隨機產生新染色體
      newPop[i] = { chromosome:chromosome, 
                 fitness:this.calcFitness(chromosome) };
    }
    newPop.sort(GeneticAlgorithm.fitnessCompare); // 對整個族群進行排序
    return newPop;
  }
  
  static fitnessCompare(c1,c2) { return c1.fitness - c2.fitness }
  
  // 輪盤選擇法: 隨機選擇一個個體 -- 落點在 i*i ~ (i+1)*(i+1) 之間都算是 i
  selection() {
    var n = this.population.length;
    var shoot  = uu6.randomInt(0, n*n/2);
    var select = Math.floor(Math.sqrt(shoot*2));
    return this.population[select];
  }
  
  // 產生下一代
  reproduction() {
    var newPop = []
    for (var i = 0; i < this.population.length; i++) {
      var parent1 = this.selection(); // 選取父親
      var parent2 = this.selection(); // 選取母親
      var chromosome = this.crossover(parent1, parent2); // 父母交配，產生小孩
      var prob = uu6.random(0,1);
      if (prob < this.mutationRate) // 有很小的機率
        chromosome = this.mutate(chromosome); // 小孩會突變
      newPop[i] = { chromosome:chromosome, fitness:this.calcFitness(chromosome) }; // 將小孩放進下一代族群裡
    }
    newPop.sort(GeneticAlgorithm.fitnessCompare); // 對新一代根據適應性（分數）進行排序
    return newPop;
  }
  
  dump() { // 印出一整代成員
    for (var i=0; i<this.population.length; i++) {
      console.log(i, this.population[i]);
    }
  }
}

module.exports = GeneticAlgorithm

},{"../../uu6":33}],3:[function(require,module,exports){
class Solution { // 解答的物件模版 (類別)
  constructor(v) {
    this.v = v                // 參數 v 為解答的資料結構
  }

  // 以下兩個函數至少需要覆蓋掉一個，否則會無窮遞迴
  height() { // 爬山演算法的高度函數
    return -1*this.energy()               // 高度 = -1 * 能量
  }

  energy() { // 尋找最低點的能量函數
    return -1*this.height()               // 能量 = -1 * 高度
  }
}

Solution.prototype.step = 0.01          // 每一小步預設走的距離

module.exports = Solution   // 將解答類別匯出。
},{}],4:[function(require,module,exports){
const ai6 = module.exports = {
  gd: require('./gradientDescendent'),
  hillClimbing: require('./hillClimbing'),
  simulatedAnnealing: require('./simulatedAnnealing'),
  GeneticAlgorithm: require('./GeneticAlgorithm'),
  Solution: require('./Solution'),
}

ai6.gradientDescendent = ai6.gd


},{"./GeneticAlgorithm":2,"./Solution":3,"./gradientDescendent":5,"./hillClimbing":6,"./simulatedAnnealing":7}],5:[function(require,module,exports){
const ma6 = require('../../ma6')
const uu6 = require('../../uu6')

// 使用梯度下降法尋找函數最低點
const gradientDescendent = function (f, p0, args={}) {
  let args2 = uu6.defaults(args, {call:ma6.Point.call, grad:ma6.Point.grad, step:ma6.Point.step, stepLen:0.01, gap:0.0001, debug:true})
  let {call, grad, step, stepLen, gap, debug} = args2
  // let p = new ma6.Point(v0)
  let p = p0
  let e0 = Number.POSITIVE_INFINITY
  while (true) {
    let e = call(f, p)
    if (debug) console.log('p=', p.toString(), 'f(p)=', e) // .toString()
    if (e > e0 - gap) break
    let g = grad(f, p) // 計算梯度 gp
    if (debug) console.log('  g=', g.toString()) // .toString()
    p = step(p, g, -1*stepLen);
    e0 = e
    /*
    let d = g.mulc(-1*step)
    if (g.norm() < gap) break
    p =  p.add(d)
    */
  }
  return p // 傳回最低點！
}

module.exports = gradientDescendent

/*
    //console.log('d=', d)
    let p2 = p.add(d)
    let e2 = call(f, p2)
    console.log('e=', e, 'e2=', e2, 'p2=', p2)
    //process.exit(1)
    // if (e2 > e - gap) break
*/
},{"../../ma6":11,"../../uu6":33}],6:[function(require,module,exports){
function hillClimbing(s, maxGens, maxFails) { // 爬山演算法的主體函數
  console.log("start: %s", s); // 印出初始解
  var fails = 0;          // 失敗次數設為 0
  // 當代數 gen<maxGen，且連續失敗次數 fails < maxFails 時，就持續嘗試尋找更好的解。
  for (var gens=0; gens<maxGens && fails < maxFails; gens++) {
    var snew = s.neighbor();           // 取得鄰近的解
    var sheight = s.height();          // sheight=目前解的高度
    var nheight = snew.height();       // nheight=鄰近解的高度
    if (nheight >= sheight) {          // 如果鄰近解比目前解更好
      if (nheight > sheight) console.log("%d: %s", gens, snew);  //   印出新的解
      // console.log("%d: %s", gens, snew)
      s = snew;                        //   就移動過去
      fails = 0;                       //   移動成功，將連續失敗次數歸零
    } else                             // 否則
      fails++;                         //   將連續失敗次數加一
  }
  console.log("solution: %s", s);      // 印出最後找到的那個解
  return s;                            //   然後傳回。
}

module.exports = hillClimbing          // 將爬山演算法的類別匯出。
},{}],7:[function(require,module,exports){
function prob(e, enew, T) { // 模擬退火法的機率函數
  if (enew < e) 
    return 1;
  else
    return Math.exp((e-enew)/T);              
}

function simulatedAnnealing(s, maxGens) { // 模擬退火法的主要函數
  var sbest = s;                              // sbest:到目前為止的最佳解
  var ebest = s.energy();                     // ebest:到目前為止的最低能量
  var T     = 100;                            // 從 100 度開始降溫
  for (var gens=0; gens<maxGens; gens++) {    // 迴圈，最多作 maxGens 這麼多代。
    var snew = s.neighbor();                  // 取得鄰居解
    var e    = s.energy();                    // e    : 目前解的能量
    var enew = snew.energy();                 // enew : 鄰居解的能量
    T  = T * 0.999;                           // 每次降低一些溫度
    if (prob(e, enew, T) > Math.random()) { // 根據溫度與能量差擲骰子，若通過
      s = snew;                               // 則移動到新的鄰居解
      console.log("%d T=%s %s", gens, T.toFixed(3), s.toString()); // 印出觀察
    }
    if (enew < ebest) {                       // 如果新解的能量比最佳解好，則更新最佳解。
      sbest = snew;
      ebest = enew;
    }
  }
  console.log("solution: %s", sbest.toString()); // 印出最佳解
  return sbest;                                  // 傳回最佳解
}

module.exports = simulatedAnnealing;             // 將模擬退火演算法匯出。
},{}],8:[function(require,module,exports){
module.exports = {
  MapVector: require('../ma6/src/MapVector'),
}

},{"../ma6/src/MapVector":12}],9:[function(require,module,exports){
js6 = require('./index')

},{"./index":10}],10:[function(require,module,exports){
module.exports = {
  ai6: require('./ai6'),
  ds6: require('./ds6'),
  ma6: require('./ma6'),
  nn6: require('./nn6'),
  se6: require('./se6'),
  sp6: require('./sp6'),
  uu6: require('./uu6'),
}

},{"./ai6":1,"./ds6":8,"./ma6":11,"./nn6":22,"./se6":29,"./sp6":32,"./uu6":33}],11:[function(require,module,exports){
module.exports = require('./src/ma6')

},{"./src/ma6":15}],12:[function(require,module,exports){
const uu6 = require('../../uu6')
const V = require('./vector')

module.exports = class MapVector extends V.Vector {
  constructor(o={}) {
    super(null)
    this.o = {...o}
  }

  clone () {
    return new MapVector({...this.o})
  }

  add (v2) {
    let v = this.clone(), o0=v.o, o1=this.o, o2=v2.o
    for (let k in o1) {
      o0[k] = o1[k] + o2[k]
    }
    return v
  }
  
  sub (v2) {
    let v = this.clone(), o0=v.o, o1=this.o, o2=v2.o
    for (let k in o1) {
      o0[k] = o1[k] + o2[k]
    }
    return v
  }
  
  dot (v2) {
    let o1=this.o, o2=v2.o, r=0
    for (let k in o1) {
      r += o1[k] * o2[k]
    }
    return r
  }
  
  mul (c) {
    let v = this.clone(), o0=v.o, o1=this.o
    for (let k in o1) {
      o0[k] = o1[k] * c
    }
    return v
  }
  
  neg () {
    return this.mul(-1)
  }

  sum () {
    let r = 0, o = this.o
    for (let k in o) {
      r += o[k]
    }
    return r
  }

  norm () {
    let r = 0, o = this.o
    for (let k in o) {
      r += o[k] * o[k]
    }
    return Math.sqrt(r)
  }

  json (n=4) {
    return uu6.json(this.p, null, n)
  }
}

},{"../../uu6":33,"./vector":21}],13:[function(require,module,exports){
module.exports = {
  Pi: Math.PI,
  E: Math.E,
  Epsilon: 0.000001
}
},{}],14:[function(require,module,exports){
const F = module.exports = {}

F.grad = function (f, v, h=0.01) {
  let len = v.length, fv = f(v)
  let v2 = v.slce(0)
  let g = new Array(len)
  for (let i=0; i<len; i++) {
    let t = v2[i]
    v2[i] += h
    g[i] = (f(v2) - fv) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
    v2[i] = t
  }
  return new Vector(g)
}

F.neg = function (fx) {
  return function (v) { return -1 * fx(v) }
}

F.inv = function (fx) {
  return function (v) { return 1 / fx(v) }
}

F.add = function (fx, fy) {
  return function (v) { return fx(v).add(fy(v)) }
}

F.sub = function (fx, fy) {
  return function (v) { return fx(v).sub(fy(v)) }
}

F.mul = function (fx, fy) {
  return function (v) { return fx(v).mul(fy(v)) }
}

F.div = function (fx, fy) {
  return function (v) { return fx(v).div(fy(v)) }
}

F.compose = function (fx, fy) {
  return function (v) { return fx(fy(v)) }
}

F.eval = function (f, x) { return f(x) }

// f=(x,y)=>x*y+x*x;
// f0=fa(f); f0([x,y]);
F.fa = function (f) {
  return function (x) { return f.apply(null, x) }
}

// relation
F.eq = function (a, b) {
  return (typeof a === typeof b) && a.toString() === b.toString()
}

F.neq = function (a, b) { return !F.eq(a, b) }
F.leq = function (a, b) { return a <= b }
F.geq = function (a, b) { return a >= b }
F.lt = function (a, b) { return a < b }
F.gt = function (a, b) { return a > b }
F.near = function (a, b) { return Math.abs(a - b) < 0.0001 }

// =========== Integer ====================
F.isPrime = function (n) {
  for (var i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false
  }
  return n % 1 === 0
}

F.gcd = function (a, b) {
  if (!b) return a
  return F.gcd(b, a % b)
}

F.lcm = function (a, b) {
  return (a * b) / F.gcd(a, b)
}

},{}],15:[function(require,module,exports){
const uu6 = require('../../uu6')

const ma6 = module.exports = {
  P: require('./prob'),
  V: require('./vector'),
  T: require('./tensor'),
  M: require('./matrix'),
  S: require('./stat'),
  F: require('./function'),
  C: require('./constant'),
  // PointFunction: require('./PointFunction'),
}

uu6.mixin(ma6, ma6.P, ma6.V, ma6.T, ma6.M, ma6.S, ma6.F, ma6.C, 
  require('./point')
)

},{"../../uu6":33,"./constant":13,"./function":14,"./matrix":16,"./point":17,"./prob":18,"./stat":19,"./tensor":20,"./vector":21}],16:[function(require,module,exports){
const M = module.exports = {}

M.tr = M.transpose = function (m) {
  var r = []
  var rows = m.length
  var cols = m[0].length
  for (var j = 0; j < cols; j++) {
    var rj = r[j] = []
    for (var i = 0; i < rows; i++) {
      rj[i] = m[i][j]
    }
  }
  return r
}

M.dot = function (a, b, isComplex = false) {
  var arows = a.length
  var bcols = b[0].length
  var r = []
  var bt = M.tr(b)
  for (var i = 0; i < arows; i++) {
    var ri = r[i] = []
    for (var j = 0; j < bcols; j++) {
      ri.push(j6.V.dot(a[i], bt[j], isComplex))
    }
  }
  return r
}

M.diag = function (v) {
  var rows = v.length
  var r = M.new(rows, rows)
  for (var i = 0; i < rows; i++) {
    r[i][i] = v[i]
  }
  return r
}

M.identity = function (n) {
  return M.diag(j6.T.repeat([n], () => 1))
}

M.inv = function (m0) {
  var s = j6.T.dim(m0), abs = Math.abs, m = s[0], n = s[1]
  var A = j6.clone(m0), Ai, Aj
  var I = M.identity(m), Ii, Ij
  var i, j, k, x
  for (j = 0; j < n; ++j) {
    var i0 = -1
    var v0 = -1
    for (i = j; i !== m; ++i) {
      k = abs(A[i][j])
      if (k > v0) { i0 = i; v0 = k }
    }
    Aj = A[i0]; A[i0] = A[j]; A[j] = Aj
    Ij = I[i0]; I[i0] = I[j]; I[j] = Ij
    x = Aj[j]
    for (k = j; k !== n; ++k) Aj[k] /= x
    for (k = n - 1; k !== -1; --k) Ij[k] /= x
    for (i = m - 1; i !== -1; --i) {
      if (i !== j) {
        Ai = A[i]
        Ii = I[i]
        x = Ai[j]
        for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x
        for (k = n - 1; k > 0; --k) { Ii[k] -= Ij[k] * x; --k; Ii[k] -= Ij[k] * x }
        if (k === 0) Ii[0] -= Ij[0] * x
      }
    }
  }
  return I
}

M.det = function (x) {
  var s = j6.dim(x)
  if (s.length !== 2 || s[0] !== s[1]) { throw new Error('numeric: det() only works on square matrices') }
  var n = s[0], ret = 1, i, j, k, A = j6.clone(x), Aj, Ai, alpha, temp, k1
  for (j = 0; j < n - 1; j++) {
    k = j
    for (i = j + 1; i < n; i++) { if (Math.abs(A[i][j]) > Math.abs(A[k][j])) { k = i } }
    if (k !== j) {
      temp = A[k]; A[k] = A[j]; A[j] = temp
      ret *= -1
    }
    Aj = A[j]
    for (i = j + 1; i < n; i++) {
      Ai = A[i]
      alpha = Ai[j] / Aj[j]
      for (k = j + 1; k < n - 1; k += 2) {
        k1 = k + 1
        Ai[k] -= Aj[k] * alpha
        Ai[k1] -= Aj[k1] * alpha
      }
      if (k !== n) { Ai[k] -= Aj[k] * alpha }
    }
    if (Aj[j] === 0) { return 0 }
    ret *= Aj[j]
  }
  return ret * A[j][j]
}
},{}],17:[function(require,module,exports){
const P = module.exports = {}

const V = require('./vector')

class Point extends V.Vector {
  constructor(o) { super(o) }
  static call(f, p) {
    return f(p.v)
  }
  static grad(f, p, h=0.01) {
    let len = p.length, fp = f(p.v)
    let p2= p.clone(), v2 = p2.v
    let g = new Array(p.length)
    for (let i=0; i<len; i++) {
      let t = v2[i]
      v2[i] += h
      g[i] = (f(p2.v) - fp) / h // 對第 i 個變數取偏導數後，放入梯度向量 g 中
      v2[i] = t
    }
    return new V.Vector(g)
  }

  static step(p, g, stepLen) {
    let d = g.mulc(stepLen)
    return  p.add(d)
  }

  static distance(x, y) {
    return x.sub(y).norm()
  }
  // be(d(x,y)>=0);
  // be(d(x,x)==0);
  // be(d(x,y)==d(y,x));
  distance(y) {
    return Point.distance(this, y)
  }

  clone(v) { return new Point(v||this.v) }
}

P.Point = Point

},{"./vector":21}],18:[function(require,module,exports){
const P = module.exports = {}
const uu6 = require('../../uu6')

// var J = require('jStat').jStat
// var ncall = P.ncall

// ========== 離散分佈的 r, q 函數 ============
P.qcdf = function (cdf, q, N, p) {
  for (var i = 0; i <= N; i++) {
    if (cdf(i, N, p) > q) return i
  }
  return N
}

P.rcdf = function (cdf, n, N, p) {
  var a = []
  for (var i = 0; i < n; i++) {
    var q = Math.random()
    a.push(cdf(q, N, p))
  }
  return a
}

P.EPSILON = 0.0000000001
// 均等分布 : Uniform Distribution(a,b)    1/(b-a)
P.dunif = function (x, a = 0, b = 1) { return (x >= a && x <= b) ? 1 / (b - a) : 0 }
P.punif = function (x, a = 0, b = 1) { return (x >= b) ? 1 : (x <= a) ? 0 : (x - a) / (b - a) }
P.qunif = function (p, a = 0, b = 1) { return (p >= 1) ? b : (p <= 0) ? a : a + (p * (b - a)) }
P.runif1 = function (a = 0, b = 1) { return P.random(a, b) }
P.runif = function (n, a = 0, b = 1) { return ncall(n, P, 'random', a, b) }
/*
P.dunif=(x,a=0,b=1)=>J.uniform.pdf(x,a,b);
P.punif=(q,a=0,b=1)=>J.uniform.cdf(q,a,b);
P.qunif=(p,a=0,b=1)=>J.uniform.inv(p,a,b);
P.runif=(n,a=0,b=1)=>ncall(n, J.uniform, 'sample', a, b);
*/
// 常態分布 : jStat.normal( mean, sd )
P.dnorm = (x, mean = 0, sd = 1) => J.normal.pdf(x, mean, sd)
P.pnorm = (q, mean = 0, sd = 1) => J.normal.cdf(q, mean, sd)
P.qnorm = (p, mean = 0, sd = 1) => J.normal.inv(p, mean, sd)
P.rnorm1 = function () { // generate random guassian distribution number. (mean : 0, standard deviation : 1)
  var v1, v2, s
  do {
    v1 = (2 * Math.random()) - 1   // -1.0 ~ 1.0 ??? ?
    v2 = (2 * Math.random()) - 1   // -1.0 ~ 1.0 ??? ?
    s = (v1 * v1) + (v2 * v2)
  } while (s >= 1 || s === 0)

  s = Math.sqrt((-2 * Math.log(s)) / s)
  return v1 * s
}

P.rnorm = (n, mean = 0, sd = 1) => ncall(n, J.normal, 'sample', mean, sd)
// F 分布 : jStat.centralF( df1, df2 )
P.df = (x, df1, df2) => J.centralF.pdf(x, df1, df2)
P.pf = (q, df1, df2) => J.centralF.cdf(q, df1, df2)
P.qf = (p, df1, df2) => J.centralF.inv(p, df1, df2)
P.rf = (n, df1, df2) => ncall(n, J.centralF, 'sample', df1, df2)
// T 分布 : jStat.studentt( dof )
P.dt = (x, dof) => J.studentt.pdf(x, dof)
P.pt = (q, dof) => J.studentt.cdf(q, dof)
P.qt = (p, dof) => J.studentt.inv(p, dof)
P.rt = (n, dof) => ncall(n, J.studentt, 'sample', dof)
// Beta 分布 : jStat.beta( alpha, beta )
P.dbeta = (x, alpha, beta) => J.beta.pdf(x, alpha, beta)
P.pbeta = (q, alpha, beta) => J.beta.cdf(q, alpha, beta)
P.qbeta = (p, alpha, beta) => J.beta.inv(p, alpha, beta)
P.rbeta = (n, alpha, beta) => ncalls(n, J.beta, 'sample', alpha, beta)
// 柯西分布 : jStat.cauchy( local, scale )
P.dcauchy = (x, local, scale) => J.cauchy.pdf(x, local, scale)
P.pcauchy = (q, local, scale) => J.cauchy.cdf(q, local, scale)
P.qcauchy = (p, local, scale) => J.cauchy.inv(q, local, scale)
P.rcauchy = (n, local, scale) => ncall(n, J.cauchy, 'sample', local, scale)
// chisquare 分布 : jStat.chisquare( dof )
P.dchisq = (x, dof) => J.chisquare.pdf(x, dof)
P.pchisq = (q, dof) => J.chisquare.cdf(q, dof)
P.qchisq = (p, dof) => J.chisquare.inv(p, dof)
P.rchisq = (n, dof) => ncall(n, J.chisquare, 'sample', dof)
// 指數分布 : Exponential Distribution(b)  1/b e^{-x/b}
P.dexp = function (x, rate) { return rate * Math.exp(-rate * x) }
P.pexp = function (x, rate) { return x < 0 ? 0 : 1 - Math.exp(-rate * x) }
P.qexp = function (p, rate) { return -Math.log(1 - p) / rate }
P.rexp1 = function (rate) { return P.qexp(P.random(0, 1), rate) }
P.rexp = function (n, rate) { return ncall(n, P, 'rexp1', rate) }
/*
P.dexp=(x,rate)=>J.exponential.pdf(x,rate);
P.pexp=(q,rate)=>J.exponential.cdf(q,rate);
P.qexp=(p,rate)=>J.exponential.inv(p,rate);
P.rexp=(n,rate)=>ncall(n, J.exponential, 'sample', rate);
*/
// Gamma 分布 : jStat.gamma( shape, scale )
P.dgamma = (x, shape, scale) => J.gamma.pdf(x, shape, scale)
P.pgamma = (q, shape, scale) => J.gamma.cdf(q, shape, scale)
P.qgamma = (p, shape, scale) => J.gamma.inv(p, shape, scale)
P.rgamma = (n, shape, scale) => ncall(n, J.gamma, 'sample', shape, scale)
// 反 Gamma 分布 : jStat.invgamma( shape, scale )
P.rinvgamma = (n, shape, scale) => ncall(n, J.invgamma, 'sample', shape, scale)
P.dinvgamma = (x, shape, scale) => J.invgamma.pdf(x, shape, scale)
P.pinvgamma = (q, shape, scale) => J.invgamma.cdf(q, shape, scale)
P.qinvgamma = (p, shape, scale) => J.invgamma.inv(p, shape, scale)
// 對數常態分布 : jStat.lognormal( mu, sigma )
P.dlognormal = (n, mu, sigma) => J.lognormal.pdf(x, sigma)
P.plognormal = (n, mu, sigma) => J.lognormal.cdf(q, sigma)
P.qlognormal = (n, mu, sigma) => J.lognormal.inv(p, sigma)
P.rlognormal = (n, mu, sigma) => ncall(n, J.dlognormal, 'sample', mu, sigma)
// Pareto 分布 : jStat.pareto( scale, shape )
P.dpareto = (n, scale, shape) => J.pareto.pdf(x, scale, shape)
P.ppareto = (n, scale, shape) => J.pareto.cdf(q, scale, shape)
P.qpareto = (n, scale, shape) => J.pareto.inv(p, scale, shape)
P.rpareto = (n, scale, shape) => ncall(n, J.pareto, 'sample', scale, shape)
// Weibull 分布 jStat.weibull(scale, shape)
P.dweibull = (n, scale, shape) => J.weibull.pdf(x, scale, shape)
P.pweibull = (n, scale, shape) => J.weibull.cdf(q, scale, shape)
P.qweibull = (n, scale, shape) => J.weibull.inv(p, scale, shape)
P.rweibull = (n, scale, shape) => ncall(n, J.weibull, 'sample', scale, shape)
// 三角分布 : jStat.triangular(a, b, c)
P.dtriangular = (n, a, b, c) => J.triangular.pdf(x, a, b, c)
P.ptriangular = (n, a, b, c) => J.triangular.cdf(q, a, b, c)
P.qtriangular = (n, a, b, c) => J.triangular.inv(p, a, b, c)
P.rtriangular = (n, a, b, c) => ncall(n, J.triangular, 'sample', a, b, c)
// 類似 Beta 分布，但計算更簡單 : jStat.kumaraswamy(alpha, beta)
P.dkumaraswamy = (n, alpha, beta) => J.kumaraswamy.pdf(x, alpha, beta)
P.pkumaraswamy = (n, alpha, beta) => J.kumaraswamy.cdf(q, alpha, beta)
P.qkumaraswamy = (n, alpha, beta) => J.kumaraswamy.inv(p, alpha, beta)
P.rkumaraswamy = (n, alpha, beta) => ncalls(n, J.kumaraswamy, 'sample', alpha, beta)

// ========== 離散分佈的 r, q 函數 ============
// 二項分布 : jStat.binomial(n, p0)
P.dbinom = (x, size, prob) => J.binomial.pdf(x, size, prob)
P.pbinom = (q, size, prob) => J.binomial.cdf(q, size, prob)
P.qbinom = (p, size, prob) => P.qcdf(P.pbinom, p, size, prob)
P.rbinom = (n, size, prob) => P.rcdf(P.qbinom, n, size, prob)
// 負二項分布 : jStat.negbin(r, p)
P.dnbinom = (x, size, prob) => J.negbin.pdf(x, size, prob)
P.pnbinom = (q, size, prob) => J.negbin.cdf(q, size, prob)
P.qnbinom = (p, size, prob) => P.qcdf(P.pnbinom, p, size, prob)
P.rnbinom = (n, size, prob) => P.rcdf(P.qnbinom, n, size, prob)
// 超幾何分布 : jStat.hypgeom(N, m, n)
P.dhyper = (x, m, n, k) => J.hypgeom.pdf(k, m, n, k)
P.phyper = (q, m, n, k) => J.hypgeom.cdf(q, m, n, k)
P.qhyper = (p, m, n, k) => P.qcdf(P.phyper, p, m, n, k)
P.rhyper = (nn, m, n, k) => P.rcdf(P.qhyper, nn, m, n, k)
// 布瓦松分布 : jStat.poisson(l)
P.dpois = (x, lambda) => J.poisson.pdf(x, lambda)
P.ppois = (q, lambda) => J.poisson.cdf(q, lambda)
P.qpois = (p, lambda) => P.qcdf(P.ppois, p, lambda)
P.rpois = (n, lambda) => P.rcdf(P.qpois, n, lambda)
},{"../../uu6":33}],19:[function(require,module,exports){
const S = module.exports = {}

S.random = function (a = 0, b = 1) {
  let r = a + (Math.random() * (b - a))
  return r
}

S.randomInt = function (a, b) {
  let r = S.random(a, b + 0.999999999)
  return Math.floor(r)
}

S.sample = function (space, probs) {
  if (probs == null) return space[S.randomInt(0, space.length - 1)]
  let p = S.random(0, 1)
  let sump = 0
  for (let i = 0; i < space.length; i++) {
    sump += probs[i]
    if (p <= sump) return space[i]
  }
  throw new Error('S.sample fail!')
}

S.samples = function (space, size, arg) {
  arg = S._.defaults(arg, {replace: true})
  if (arg.replace) {
    var results = []
    for (let i = 0; i < size; i++) {
      results.push(S.sample(space, arg.prob))
    }
    return results
// return _.times(size, ()=>_.sample(space));
  } else {
    if (space.length < size) throw Error('statistics.samples() : size > space.length')
    return S._.sampleSize(space, size)
  }
}

S.normalize = function (a) {
  var sum = S.T.sum(a)
  return a.map(function (x) { return x / sum })
}
/*
S.max = S.T.max
S.min = S.T.min
S.sum = S.T.sum
S.product = S.T.product
*/
// graphics
S.curve = function (f, from = -10, to = 10, step = 0.1) {
  var x = S.steps(from, to, step)
  var y = x.map1(f)
  return {type: 'curve', x: x, y: y}
}

S.hist = function (a, from, to, step = 1) {
  from = from || a.min()
  to = to || a.max()
  var n = Math.ceil((to - from + S.EPSILON) / step)
  var xc = S.steps(from + step / 2.0, to, step)
  var bins = S.V.new(n, 0)
  for (var i in a) {
    var slot = Math.floor((a[i] - from) / step)
    if (slot >= 0 && slot < n) {
      bins[slot]++
    }
  }
  return {type: 'histogram', xc: xc, bins: bins, from: from, to: to, step: step}
}

S.ihist = function (a) {
  return S.hist(a, a.min() - 0.5, a.max() + 0.5, 1)
}
},{}],20:[function(require,module,exports){
const T = module.exports = {}

const uu6 = require('../../uu6')
const V   = require('./vector')

T.size = function (shape) {
  return V.product(shape)
}

T.offset = function (shape, idx, lo) {
  let len = shape.length
  lo = lo || V.array(len)
  let offset = idx[0]+lo[0]
  for (let i=1; i<len; i++) {
    offset = offset*shape[i] + idx[i] + lo[i]
  }
  return offset
}

T.sliceNdarray = function (v, shape, lo, hi) {
  let dim = shape.length
  let [wi,wj,wk] = shape
  let [wi2,wj2,wk2] = [hi[0]-lo[0],hi[1]-lo[1],hi[2]-lo[2]]

  if (dim === 1) {
    let rv = new Array(wi2)
    for (let ri = 0, i=lo[0]; i<hi[0]; ri++, i++) rv[ri] = v[i]
    return rv
  }
  if (dim === 2) {
    let rv = new Array(wi2)
    for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
      let rvi = rv[ri] = new Array(wj2)
      for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
        rvi[rj] = v[i*wj+j]
      }
    }
    return rv
  }

  if (dim === 3) {
    let rv = new Array(wi2)
    for (let ri=0, i=lo[0]; i<hi[0]; ri++, i++) {
      let rvi = rv[ri] = new Array(wj2)
      for (let rj=0, j=lo[1]; j<hi[1]; rj++, j++) {
        let rvj = rvi[rj] = new Array(wk2)
        for (let rk=0, k=lo[2]; k<hi[2]; rk++, k++) {
          rvj[rk] = v[(i*wj+j)*wk+k]
        }
      }
    }
    return rv
  }
  throw Error('sliceNdarray():dim > 3')
}

T.tensor2ndarray = function (v, shape, lo, hi) {
  return T.sliceNdarray(v, shape, V.array(shape.length), shape)
} 

T.ndarray2tensor = function (nd) {
  let t = null
  if (!uu6.type(nd, 'array')) {
    t = { v: nd, shape:[] }
    return t
  }
  let rows = nd.length
  uu6.be(rows > 0)
  let v = [], cols = nd[0].length
  for (let i=0; i<rows; i++) {
    uu6.be(nd[i].length === cols)
    t = T.ndarray2tensor(nd[i])
    v = v.concat(t.v)
  }
  t.shape.unshift(nd.length)
  return {v: v, shape: t.shape }
}

class Tensor extends V.Vector {
  constructor(v, shape) {
    super()
    uu6.be(v || shape)
    if (v && !shape) {
      // if (typeof v === 'number') { // v = 1d size
      //   this.v = V.zeros(v)
      // } else { // from ndarray
        let nd = v
        let t = T.ndarray2tensor(nd)
        this.v = t.v
        this.shape = t.shape  
      // }
    } else {
      // console.log('Tensor():shape=', shape)
      this.v = v || uu6.array(T.size(shape))
      this.shape = shape || [this.v.length]
      uu6.be(T.size(this.shape) === this.v.length)
    }
  }
  get(...idx) {
    return this.v[T.offset(this.shape, idx)]
  }
  set(...idx) { // ...idx, o
    let o = idx.pop()
    this.v[T.offset(this.shape, idx)] = o
  }
  slice(v, shape, lo, hi) {

    this.lo = lo
    this.hi = hi
  }
  reshape(shape) {
    uu6.be(uu6.type(shape, 'array') && T.size(shape) === this.v.length)
    this.shape = shape
    return this
  }
  ndarray() {
    return T.tensor2ndarray(this.v, this.shape)
  }
  clone() {
    return new Tensor(this.v.slice(0), this.shape)
  }
  toString() {
    // return uu6.json({shape:this.shape, v:this.v})
    return uu6.json(this.ndarray())
  }
}

T.Tensor = Tensor

T.tensor = function (v, shape) {
  return new Tensor(v, shape)
}

},{"../../uu6":33,"./vector":21}],21:[function(require,module,exports){
const uu6 = require('../../uu6')
const V = module.exports = {}

V.array = uu6.array

V.random = function (r, min=0, max=1) {
  let len = r.length
  for (let i=0; i<len; i++) {
    r[i] = uu6.random(min, max)
  }
}

V.assign = function (r, o) {
  let isC = (typeof o === 'number')
  if (!isC) uu6.be(r.length === o.length)
  let len = r.length
  for (let i=0; i<len; i++) {
    r[i] = isC ? o : o[i]
  }
  return r
}

V.normalize = function (r) {
  let ar = V.abs(r)
  let s = V.sum(ar) // 不能用 sum，sum 只適用於機率。
  let len = r.length
  for (let i=0; i<len; i++) {
    r[i] = (s==0) ? 0 : r[i]/s
  }
  return r
}

V.oadd = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] + b[i]
}

V.osub = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] - b[i]
}

V.omul = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] * b[i]
}

V.odiv = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] / b[i]
}

V.omod = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] % b[i]
}

V.opow = function (r, a, b, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.pow(a[i], b[i])
}

V.op2 = function (a, b, f2) {
  uu6.be(a.length === b.length)
  let len = a.length
  let r = new Array(len)
  f2(r, a, b, len)
  return r
}

V.add = function (a, b) { return V.op2(a, b, V.oadd) }
V.sub = function (a, b) { return V.op2(a, b, V.osub) }
V.mul = function (a, b) { return V.op2(a, b, V.omul) }
V.div = function (a, b) { return V.op2(a, b, V.odiv) }
V.mod = function (a, b) { return V.op2(a, b, V.omod) }
V.pow = function (a, b) { return V.op2(a, b, V.opow) }

// Constant Operation
V.oaddc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] + c
}

V.osubc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] - c
}

V.omulc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] * c
}

V.odivc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] / c
}

V.omodc = function (r, a, c, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = a[i] % c
}

V.opowc = function (r, a, c, len) {
  for (let i = 0; i < len; i++) r[i] = Math.pow(a[i], c)
}

V.opc = function (a, c, fc) {
  let len = a.length
  let r = new Array(len)
  fc(r, a, c, len)
  return r
}

V.addc = function (a, c) { return V.opc(a, c, V.oaddc) }
V.subc = function (a, c) { return V.opc(a, c, V.osubc) }
V.mulc = function (a, c) { return V.opc(a, c, V.omulc) }
V.divc = function (a, c) { return V.opc(a, c, V.odivc) }
V.modc = function (a, c) { return V.opc(a, c, V.omodc) }
V.powc = function (a, c) { return V.opc(a, c, V.opowc) }

// Uniary Operation
V.oneg = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = -a[i]
}

V.oabs = function (r, a, len = a.length) {
  for (let i = 0; i < len; i++) r[i] = Math.abs(a[i])
}

V.op1 = function (a, f1) {
  let len = a.length
  let r = new Array(len)
  f1(r, a, len)
  return r
}

V.neg = function (a) { return V.op1(a, V.oneg) }
V.abs = function (a) { return V.op1(a, V.oabs) }
/*
V.neg = function (a) {
  let len = a.length
  let r = new Array(len)
  for (let i=0; i<len; i++) {
    r[i] = -a[i]
  }
  return r
}
*/
V.dot = function (a,b) {
  let len = a.length
  let r = 0
  for (let i=0; i<len; i++) {
    r += a[i] * b[i]
  }
  return r
}

V.sum = function(a) {
  let len = a.length
  let r = 0
  for (let i=0; i<len; i++) {
    r += a[i]
  }
  return r
}

V.product = function(a) {
  let len = a.length
  let r = 1
  for (let i=0; i<len; i++) {
    r *= a[i]
  }
  return r
}

V.norm = function (a) {
  let a2 = V.powc(a, 2)
  return Math.sqrt(V.sum(a2))
}

V.mean = function(a) {
  return V.sum(a)/a.length
}

V.sd = function (a) {
  let m = V.mean(a)
  let diff = V.subc(a, m)
  let d2 = V.powc(diff, 2)
  return Math.sqrt(V.sum(d2)/(a.length-1))
}

class Vector {
  constructor(o) { this.v = (Array.isArray(o))?o.slice(0):new Array(o) }
  static random(n, min=0, max=1) { return new Vector(V.random(n, min, max)) }
  static range(begin, end, step=1) { return new Vector(V.range(begin, end, step)) }
  static zero(n) { return new Vector(n) }
  assign(o) { let a=this; V.assign(a.v, o); return a }
  random(min=0, max=1) { this.v = V.random(n, min, max) }
  add(b) { let a=this; return a.clone(V.add(a.v,b.v)) }
  sub(b) { let a=this; return a.clone(V.sub(a.v,b.v)) } 
  mul(b) { let a=this; return a.clone(V.mul(a.v,b.v)) } 
  div(b) { let a=this; return a.clone(V.div(a.v,b.v)) } 
  mod(b) { let a=this; return a.clone(V.mod(a.v,b.v)) } 
  mulc(c) { let a=this; return a.clone(V.mulc(a.v,c)) } 
  divc(c) { let a=this; return a.clone(V.divc(a.v,c)) } 
  addc(c) { let a=this; return a.clone(V.addc(a.v,c)) } 
  subc(c) { let a=this; return a.clone(V.subc(a.v,c)) } 
  powc(c) { let a=this; return a.clone(V.powc(a.v,c)) }
  neg() { let a=this; return a.clone(V.neg(a.v)) }
  dot(b) { let a=this; return V.dot(a.v,b.v) } 
  sum() { let a=this; return V.sum(a.v) }
  norm() { let a=this; return V.norm(a.v)  }
  mean() { let a=this; return V.mean(a.v) }
  sd() { let a=this; return V.sd(a.v) }
  toString() { return this.v.toString() }
  clone(v) { return new Vector(v||this.v) }
  get length() { return this.v.length }
  // size() { return this.v.length }
}

V.Vector = Vector

V.vector = function (o) {
  return new Vector(o)
}

/*
V.new = function (n, value = 0) {
  let a = new Array(n)
  return a.fill(value)
}

V.fill = function (a, value = 0) {
  return a.fill(value)
}

V.range = function (begin, end, step=1) {
  let len = Math.floor((end-begin)/step)
  let a = new Array(len)
  let i = 0
  for (let t=begin; t<end; t+=step) {
    a[i++] = t
  }
  return a
}

V.random = function (len, min=0, max=1) {
  let r = new Array(len)
  for (var i = 0; i < len; i++) {
    r[i] = R.random(min, max)
  }
  return r
}
*/

},{"../../uu6":33}],22:[function(require,module,exports){
module.exports = require('./src/nn6')
},{"./src/nn6":27}],23:[function(require,module,exports){
const N = require('./node')
const G = require('./gate')
const L = require('./layer')
const F = require('./func')
const ma6 = require('../../ma6')
const uu6 = require('../../uu6')

module.exports = class Net {
  static call(net, p) {
    let o = net.forward()
    return o.v
  }

  static grad(net, p) {
    net.backward()
    return net
  }

  static step(p, gnet, stepLen) {
    for (let node of gnet.vars) {
      node.v += stepLen * node.g
    }
    return gnet
  }

  constructor (p={}) {
    this.gates = []
    this.vars = []
    this.step = p.step || -0.01
    this.moment = p.moment || 0
  }

  variable (v, g) {
    let node = new N.Variable(v, g)
    this.vars.push(node)
    return node
  }
  
  constant (v) { return new N.Constant(v) }

  tensorVariable (shape) {
    let node = new N.TensorVariable(null, shape)
    this.vars.push(node)
    return node
  }

  tensorConstant (a) { return new N.TensorConstant(a) }

  op1 (x, f, gfx) {
    let o = new N.Variable()
    let g = new G.Gate1(o, x, f, gfx)
    this.gates.push(g)
    this.o = o
    return o
  }

  op2 (x, y, f, gfx, gfy) {
    let o = new N.Variable()
    let g = new G.Gate2(o, x, y, f, gfx, gfy)
    this.gates.push(g)
    this.o = o
    return o
  }

  // op1
  neg (x) { return this.op1(x, (x)=>-x, (x)=>-1) }
  rev (x) { return this.op1(x, (x)=>1/x, (x)=>-1/(x*x)) }
  /* 這些要從輸出值 o 回饋 
  exp (x) { return this.op1(x, F.exp, F.dexp) }
  relu (x, leaky=0) { return this.op1(x, (x)=>F.relu(x, leaky), (x)=>F.drelu(x, leaky)) }
  sigmoid (x) { return this.op1(x, F.sigmoid, F.dsigmoid) }
  tanh (x) { return this.op1(x, F.tanh, F.dtanh) }
  */
  // op2
  add (x, y) { return this.op2(x, y, (x,y)=>x+y, (x,y)=>1) }
  sub (x, y) { return this.op2(x, y, (x,y)=>x-y, (x,y)=>1, (x,y)=>-1) }
  mul (x, y) { return this.op2(x, y, (x,y)=>x*y, (x,y)=>y, (x,y)=>x) }
  div (x, y) { return this.op2(x, y, (x,y)=>x/y, (x,y)=>1/y, (x,y)=>-x/(y*y)) }
  pow (x, y) { return this.op2(x, y, F.pow, F.dpowx, F.dpowy) }

  // Layer
  inputLayer(shape) {
    let iLayer = new L.InputLayer(shape)
    this.gates.push(iLayer)
    this.i =iLayer.x
    this.o = iLayer.o
    return iLayer
  }

  push(Layer, p) {
    let lastLayer = this.gates[this.gates.length-1]
    let x = lastLayer.o
    let thisLayer = new Layer(x, p)
    this.gates.push(thisLayer)
    this.o = thisLayer.o
    return thisLayer
  }

  forward() { // 正向傳遞計算結果
    let len = this.gates.length
    for (let i=0; i<len; i++) {
      this.gates[i].forward()
    }
    return this.o
  }

  backward() { // 反向傳遞計算梯度
    if (typeof this.o.g === 'number') this.o.g = 1 // 單變數輸出，非向量，這是優化問題，直接將梯度設為 1
    let len = this.gates.length
    for (let i=len-1; i>=0; i--) { // 反向傳遞計算每個節點 Node 的梯度 g
      let gate = this.gates[i]
      gate.backward()
    }
  }

  adjust(step, moment) {
    let len = this.gates.length
    for (let i=0; i<len; i++) {
      this.gates[i].adjust(step, moment)
    }
  }

  setInput(input) { this.gates[0].setInput(input) }
  setOutput(out) { this.lastGate().setOutput(out) }

  lastGate() { return this.gates[this.gates.length-1] }
  predict() { return this.lastGate().predict }
  loss() { return this.lastGate().loss }

  learn(input, out) {
    this.setInput(input)
    this.setOutput(out)
    this.forward()
    this.backward()
    this.adjust(this.step, this.moment)
    return this.loss()
  }

  dump(p) {
    let {inputs, outs} = p
    let len = inputs.length
    for (let i=0; i<len; i++) {
      this.setInput(inputs[i])
      this.setOutput(outs[i])
      this.forward()
      console.log('input:', inputs[i], 'out:', outs[i], 'predict:', uu6.json(this.predict()), 'loss:', this.loss())
    }
  }

  optimize(p) {
    let {inputs, outs, gap, minLoops, maxLoops} = p
    uu6.be(inputs && outs)
    gap = gap || 0.00001
    let len = inputs.length
    let loss0 = Number.MAX_VALUE
    for (let loops=0; loops < maxLoops; loops++) {
      let loss = 0
      for (let i=0; i<len; i++) {
        loss += this.learn(inputs[i], outs[i])
      }
      if (loss < loss0 - gap)
        loss0 = loss
      else if (loops >= minLoops)
        break
      console.log(loops+': loss=', loss)
    }
    this.dump(p)
  }

  watch (nodeMap) {
    this.watchNodes = nodeMap
  }

  toString() {
    let watchNodes = this.watchNodes || {i:this.i, o:this.o}
    console.log('watchNodes=', watchNodes)
    let list=[]
    for (let key in watchNodes) {
      list.push('  ' + key + ":" + watchNodes[key].toString())
    }
    return this.constructor.name + ':\n' + list.join("\n")
  }
}

},{"../../ma6":11,"../../uu6":33,"./func":24,"./gate":25,"./layer":26,"./node":28}],24:[function(require,module,exports){
var F = module.exports = {}

F.near = function (a, b, diff=0.000001) {
  return Math.abs(a - b) < diff
}

F.neg = function (x) {
  return -x
}

F.dneg = function (o) {
  return -1
}

F.rev = function (x) {
  return 1.0 / x
}

F.drev = function (o) {
  return -1 / (o*o)
}

F.exp = function (x) {
  return Math.exp(x)
}

F.dexp = function (o) {
  return Math.exp(o)
}

// 問題是，當所有的輸出值都小於 0，就會都被 Relu 截掉，於是變成 [0,0,0....]
// 所以 relu 通常要加上 leaky 成為 leakyRelu
// 即使小於 0 也會給一個很小的梯度。
F.relu = function (x, leaky=0.05) {
  return x > 0 ? x : leaky * x
}

F.drelu = function (o, leaky=0.05) {
  return o > 0 ? 1 : leaky
}

F.sigmoid = function (x) {
  return 1 / (1 + Math.exp(-x))
}

F.dsigmoid = function (o) {
  return o * (1 - o)
}

F.tanh = function (x) {
  return Math.tanh(x)
}

F.dtanh = function (o) {
  return 1.0 - o*o
}

F.pow = function (x, y) {
  return Math.pow(x, y)
}

F.dpowx = function (x, y) {
  return y * Math.pow(x, y-1)
}

F.dpowy = function (x, y) {
  return Math.pow(x, y) * Math.log(x)
}

F.add = function (x, y) {
  return x + y
}

F.dadd = function (x, y) {
  return 1
}

F.sub = function (x, y) {
  return x - y
}

F.dsubx = function (x, y) {
  return 1
}

F.dsuby = function (x, y) {
  return -1
}

F.mul = function (x, y) {
  return x * y
}

F.dmul = function (x, y) {
  return y
}

F.div = function (x, y) {
  return x / y
}

F.ddivx = function (x, y) {
  return 1 / y
}

F.ddivy = function (x, y) {
  return -x / (y * y)
}

F.max = function (a) {
  let r = Number.MIN_VALUE
  let len = a.length
  for (let i=0; i<len; i++) {
    if (a[i] > r) r = a[i]
  }
  return r
}

// 這版的 softmax 會有 overflow, underflow 的危險 (只要總和超過幾百，或者小於幾百，就會爆了)，改一下！
// 參考： http://freemind.pluskid.org/machine-learning/softmax-vs-softmax-loss-numerical-stability/
F.softmax = function (x) {
  let len = x.length, r = new Array(len), e = new Array(len)
  let max = F.max(x), sum = 0
  for (let i=0; i<x.length; i++) {
    e[i] = Math.exp(x[i]-max)
    sum += e[i]
  }
  for (let i=0; i<x.length; i++) {
    r[i] = e[i] / sum
  }
  // console.log('Softmax: x=%j r=%j', x, r)
  return r
}

// Softmax 的梯度計算是 x.g = o.v * (1 - o.v) * o.g
F.dsoftmax = function (x, o) {
  let len = x.length
  for (let i=0; i<len; i++) {
    x.g[i] += o.v[i] * (1-o.v[i]) * o.g[i]
  }
}


},{}],25:[function(require,module,exports){
module.exports = G = {}

class Gate {}

class Gate1 extends Gate {
  constructor(o, x, f, gfx) {
    super()
    this.p = {o:o, x:x, f:f, gfx:gfx}
  }

  forward() {
    let {o, x, f} = this.p
    o.v = f(x.v)
    o.g = x.g = 0
  }

  backward() {
    let {o,x,gfx} = this.p
    x.g += gfx(x.v) * o.g
  }
}

class Gate2 extends Gate {
  constructor(o, x, y, f, gfx, gfy) {
    super()
    this.p = {o:o, x:x, y:y, f:f, gfx:gfx, gfy:gfy||gfx}
  }

  forward() {
    let {o, x, y, f} = this.p
    o.v = f(x.v, y.v)
    o.g = x.g = y.g = 0
  }

  backward() {
    let {o,x,y,gfx,gfy} = this.p
    x.g += gfx(x.v, y.v) * o.g
    y.g += gfy(x.v, y.v) * o.g
  }
}

Object.assign(G, {Gate, Gate1, Gate2 })

},{}],26:[function(require,module,exports){
const L = module.exports = {}
const uu6 = require('../../uu6')
const ma6 = require('../../ma6')
const F = require('./func')
const N = require('./node')
const V = ma6.V

class Layer {
  constructor(x, p = {}) {
    this.x = x
    this.p = uu6.clone(p)
  }

  forward() {
    let {o, x} = this
    V.assign(x.g, 0) // 清除 x 的梯度
    V.assign(o.g, 0) // 清除 o 的梯度
    return o
  }

  backward() {}

  grad(h=0.00001) {
    let {x, o} = this
    let xlen = x.length, olen = o.length
    let gx = V.array(xlen, 0)
    this.forward()
    let vo = uu6.clone(o.v)
    for (let xi=0; xi<xlen; xi++) {
      let xvi = x.v[xi]
      x.v[xi] += h  // 小幅調整 x.v[xi] 的值
      this.forward()
      let gxi = 0   // 計算所造成的輸出影響總和
      for (let oi=0; oi<olen; oi++) {
        gxi += (o.v[oi] - vo[oi])
      }
      gx[xi] = gxi  // 這就是 xi 軸的梯度 g_o^x[i]，簡寫為 gxi
      x.v[xi] = xvi // 還原 x.v[xi] 的值
    }
    // console.log('grad(): gx=', gx)
    return V.normalize(gx)
  }

  toString() {
    let {o,x} = this
    return this.constructor.name + ':\n  x:' + x.toString() + '\n  o:' + o.toString()
  }
}

class FLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = new N.TensorVariable(null, x.shape)
  }
  forward() {
    let {o, x} = this, {f} = this.p
    let len = x.length
    for (let i=0; i<len; i++) {
      o.v[i] = f(x.v[i])
    }
    return super.forward()
  }

  backward() {
    let {o, x} = this, {gf} = this.p
    let len = x.length
    for (let i=0; i<len; i++) {
      x.g[i] += o.g[i] * gf(x.v[i], o.v[i])
    }
  }

  adjust(step, moment) {
    let {o,x} = this
    let len = x.length
    for (let i=0; i<len; i++) {
      x.v[i] += step * x.g[i]
      x.g[i] = 0 // 調過後就設為 0，這樣才不會重複調整 ...
    }
  }
}

class SigmoidLayer extends FLayer {
  constructor(x) { super(x, {f:(vx)=>F.sigmoid(vx), gf:(vx,vo)=>F.dsigmoid(vo) }) }
}

class TanhLayer extends FLayer {
  constructor(x) { super(x, {f:(vx)=>F.tanh(vx), gf:(vx,vo)=>F.dtanh(vo) }) }
}

class ReluLayer extends FLayer {
  constructor(x, leaky) {
    super(x, {f:(vx,l=leaky)=>F.relu(vx,l) , gf: (vx,vo,l=leaky)=>F.drelu(vo,l)})
  }
}

// 參考 -- https://www.oreilly.com/library/view/tensorflow-for-deep/9781491980446/ch04.html
class FullyConnectLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    uu6.be(x)
    let wshape = uu6.clone(x.shape)
    wshape.unshift(p.n)  // shape = [o.length, x.length]
    // wshape.push(p.n)
    this.w = new N.TensorVariable(null, wshape)
    this.o = new N.TensorVariable(null, [p.n])
    this.bias = new N.TensorVariable(null, [p.n])
    if (p.cw) V.assign(this.w.v, p.cw); else V.random(this.w.v, -1, 1)
    if (p.cbias) V.assign(this.bias.v, p.cbias); else V.random(this.bias.v, -1, 1)
  }

  forward() {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let oi=0; oi<olen; oi++) {
      let sum = 0
      for (let xi=0; xi<xlen; xi++) {
        sum += x.v[xi] * w.v[oi*xlen+xi]
      }
      sum += -1 * bias.v[oi]
      o.v[oi] = sum
    }
    V.assign(w.g, 0)       // 清除 w 的梯度
    V.assign(bias.g, 0)    // 清除 bias 的梯度
    return super.forward() // 清除 x, o 的梯度
  }

  backward() {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let oi=0; oi<olen; oi++) { 
      for (let xi=0; xi<xlen; xi++) {
        w.g[oi*xlen+xi] += x.v[xi] * o.g[oi]
        x.g[xi] += w.v[oi*xlen+xi] * o.g[oi]
      }
      bias.g[oi] += -1 * o.g[oi]
    }
  }

  adjust(step, moment) {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let xi=0; xi<xlen; xi++) {
      x.v[xi] += step * x.g[xi]
      x.g[xi] = 0
    }
    for (let oi=0; oi<olen; oi++) {
      for (let xi=0; xi<xlen; xi++) {
        w.v[oi*xlen+xi] += step * w.g[oi*xlen+xi]
        w.g[oi*xlen+xi] = 0
      }
      bias.v[oi] += step * bias.g[oi]
      bias.g[oi] = 0
    }
  }

  toString() {
    let {w, bias} = this
    return super.toString() + '\n  w:'+w.toString()+'\n  bias:'+bias.toString()
  }
}

class PerceptronLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.fcLayer = new FullyConnectLayer(x, p)
    this.sigLayer = new SigmoidLayer(this.fcLayer.o)
    this.o = this.sigLayer.o
  }
  forward() {
    this.fcLayer.forward()
    this.sigLayer.forward()
    return super.forward()
  }
  backward() {
    this.sigLayer.backward()
    this.fcLayer.backward()
  }

  adjust(step, moment) {
    this.fcLayer.adjust(step, moment)
    this.sigLayer.adjust(step, moment)
  }
}

class InputLayer extends Layer {
  constructor(shape) {
    super()
    this.x = new N.TensorVariable(null, shape)
    this.o = this.x
  }
  setInput(input) {
    V.assign(this.x.v, input)
  }
  forward() { // 輸出 o = 輸入 x
    return super.forward()
  }
  backward() {} // 輸入層不用反傳遞
  adjust(step, moment) {} // 輸入層不用調梯度
}

class RegressionLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = new N.TensorVariable(null, [1])
  }

  setOutput(y) {
    this.y = y
  }

  forward() {
    super.forward() // 清除梯度 g
    let {o, x, y} = this
    let len = x.length, loss = 0.0
    for (let i=0; i<len; i++) {
      let d = x.v[i] - y[i]   // y 是正確輸出值 (正確答案)，d[i] 是第 i 個輸出的差異
      x.g[i] = d              // 梯度就是網路輸出 x 與答案 y 之間的差異
      loss += 0.5 * d * d     // 誤差採用最小平方法 1/2 (x-y)^2，這樣得到的梯度才會是 (xi-yi)
    }
    this.loss = o.v[0] = loss // 錯誤的數量 loss 就是想要最小化的能量函數 => loss = 1/2 (x-y)^2
                              // 整體的能量函數應該是所有 loss 的加總，也就是 sum(loss(x, y)) for all (x,y)
    this.predict = x.v
    return loss
  }
  backward() {} // 輸出層的反傳遞已經在正傳遞時順便計算掉了！

  adjust(step, moment) {} // 輸出層不用調梯度

  toString() {
    let {y} = this
    return super.toString() + '\n  y:' + uu6.json(y)
  }
}

// 說明: 這個和 RegressionLayer 一樣，是輸出層，只要輸出 loss
// softmax 的梯度參考 https://math.stackexchange.com/questions/945871/derivative-of-softmax-loss-function
// 中文請參考: https://zhuanlan.zhihu.com/p/25723112
class SoftmaxLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = new N.TensorVariable(null, [1])
  }

  setOutput(y) { // y 是正確的那個輸出
    this.y = y
  }

  forward() {
    let {o, x, y} = this
    let len = x.length, e = new Array(len)
    let max = F.max(x.v), sum = 0
    let iMax = 0
    for (let i=0; i<len; i++) {
      e[i] = Math.exp(x.v[i]-max)
      if (e[i] > e[iMax]) iMax = i
      sum += e[i]
    }
    for (let i=0; i<len; i++) {
      e[i] = e[i] / sum
    }
    this.e = e
    this.predict = iMax
    this.loss = o.v[0] = -Math.log(e[y]) // 這個對嗎？是否應該用 -Math.log(o.v[y])
    return super.forward()
  }

  backward() {
    let {o, x, y, e} = this
    let len = x.length
    for (let i=0; i<len; i++) {
      let indicator = i === y ? 1.0 : 0.0
      x.g[i] = e[i] - indicator
    }
  }

  adjust(step, moment) {
    let {o, x} = this
    let len = x.length
    for (let i=0; i<len; i++) {
      x.v[i] += step * x.g[i]
      x.g[i] = 0
    }
  }
}

class DropoutLayer extends Layer {
  constructor(x, p) {
    super(x)
    this.dropped = new Array(x.length)
    this.dropProb = p.dropProb || 0.5 // 預設 drop 掉一半
    this.isTraining = p.isTraining || false
    this.o = new N.TensorVariable(null, this.x.shape)
  }
  forward() {
    let {o, x, dropped, dropProb, isTraining } = this
    let len = x.length
    if(isTraining) { // 在訓練階段，隨機的掐掉一些節點 (do dropout) ，以提升容錯力！(在某些節點死掉時，網路還是穩定的！)
      for(var i=0;i<len;i++) {
        if(Math.random() < dropProb) { o.v[i]=0; dropped[i] = true } // drop! 這個節點已經被掐掉了 ..
        else { dropped[i] = false, o.v[i] = x.v[i] } // 需注意的是，每次 forward 都重設，所以每次被掐掉的節點都不一樣，這會讓訓練花更久的時間！
      }
    } else { // 使用階段是全員啟動的，所以將權重 * drop_prob 才會得到和訓練階段期望值一致的結果。// scale the activations during prediction
      for(var i=0;i<len;i++) { o.v[i] = this.dropProb * x.v[i] }
    }
    return super.forward()
  }
  backward() {
    let {x, o, dropped} = this
    let len = x.length
    for (let i=0; i<len; i++) { // 反向傳遞: 單純將沒 dropped 掉的梯度傳回去。(copy over the gradient)
      if(!dropped[i]) x.g[i] = o.g[i]
    }
  }
}

class PoolLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    let i = x // i: input = x
    let {fw, fh, stride, pad} = p // fw, fh: 池化遮罩 (filter) 大小, stride: 步伐大小, pad: 超出寬度
    let [id, iw, ih] = x.shape
    let od = id
    let ow = Math.floor((iw + pad * 2 - fw) / stride + 1)
    let oh = Math.floor((ih + pad * 2 - fh) / stride + 1)
    let o = new N.TensorVariable(null, [od, ow, oh])
    let switchx = V.array(od*ow*oh) // store switches for x,y coordinates for where the max comes from, for each output neuron
    let switchy = V.array(od*ow*oh) // d 個池的最大點座標
    // console.log('p=', {o, fw, fh, switchx, switchy, stride, pad, id, iw, ih, od, ow, oh})
    Object.assign(this, {o, i, fw, fh, switchx, switchy, stride, pad, id, iw, ih, od, ow, oh})
  }

  forward() {
    let {o, x, id, iw, ih, fw, fh, switchx, switchy, stride, pad, od, ow, oh} = this
    for (let d = 0; d < od; d++) {
      let ix = -pad // ix = 目前區塊的右上角 x
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad // iy = 目前區塊的右上角 y
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          // 接下來尋找 (fw*fh) 區塊的最大值。 convolve at this particular location
          let max = -Number.MAX_VALUE
          let winx=-1, winy=-1
          for(let fx=0; fx<fw; fx++) {
            for(let fy=0; fy<fh; fy++) {
              let mx = ix+fx, my = iy+fy // (mx, my) 遮罩目前遮蔽的點位置 maskX, maskY
              if(mx>=0 && mx<iw && my>=0 && my<ih) {
                let v = x.v[(d*iw+mx)*ih+my]
                // perform max pooling and store pointers to where the max came from. 
                // This will speed up backprop and can help make nice visualizations in future
                if(v > max) { max = v; winx=mx; winy=my; } // 取得最大值
              }
            }
          }
          let oi = (d*ow + ox)*oh+oy
          // switch(x,y) 紀錄該 MaxPool 區塊的最大值位置，之後計算反傳遞梯度時會需要
          switchx[oi] = winx
          switchy[oi] = winy
          o.v[oi] = max
        }
      }
    }
    return super.forward()
  }

  backward() {
    let {o, x, id, iw, ih, fw, fh, switchx, switchy, stride, pad, od, ow, oh} = this
    for(let d=0; d<od; d++) {
      let ix = -pad
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          let oi = (d*ow + ox)*oh+oy
          let swx = switchx[oi], swy = switchy[oi]
          let grad = o.g[oi]
          // 如果只有一個最大值，那麼以下這行確實能反映輸入點的梯度，但是如果有很多相同的最大值，那麼這行只會修改一個！
          // 所以應該要讓每個輸入的值都不同，才能確保這個結果和數值方法計算的梯度一樣！
          x.g[(d*iw+swx)*ih+swy] += grad
        }
      }
    }
  }
}

class ConvLayer extends Layer {
  // https://zhuanlan.zhihu.com/p/29534841
  // 目前沒有使用：权重衰减（weight decay）：对于目标函数加入正则化项，限制权重参数的个数，这是一种防止过拟合的方法，这个方法其实就是机器学习中的l2正则化方法，只不过在神经网络中旧瓶装新酒改名为weight decay [3]。
  constructor(x, p) { 
    super(x, p)
    // console.log('ConvLayer')
    let i = x // i: input = x
    let {od, fw, fh, stride, pad } = p // fw, fh: 池化遮罩 (filter) 大小, stride: 步伐大小, pad: 超出寬度
    let [id, iw, ih] = x.shape
    let ow = Math.floor((iw + pad * 2 - fw) / stride + 1)
    let oh = Math.floor((ih + pad * 2 - fh) / stride + 1)
    let o = new N.TensorVariable(null, [od, ow, oh])
    // console.log('o=', o)
    let fd = id
    let filters = []
    for(let oi=0; oi<od; oi++) {
      filters.push(new N.TensorVariable(null, [fd, fw, fh]))
      if (p.cw) V.assign(filters[oi].v, p.cw); else V.random(filters[oi].v, -1, 1)
    }
    // console.log('filters=', filters.toString())
    let bias = new N.TensorVariable(null, [1, 1, od])
    if (p.cbias) V.assign(bias.v, p.cbias); else V.random(bias.v, -1, 1)
    // console.log('bias=', bias.toString())
    Object.assign(this, { o, i, id, iw, ih, od, ow, oh, fd, fw, fh, stride, pad, bias, filters })
  }

  forward() {
    let {o, i, id, iw, ih, fd, fw, fh, stride, pad, od, ow, oh, filters, bias} = this
    for (let d = 0; d < od; d++) {
      let f = filters[d]
      let ix = -pad // ix = 目前區塊的右上角 x
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad // iy = 目前區塊的右上角 y
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          let a = 0.0
          for (let fz=0; fz<fd; fz++) {
            for(let fx=0; fx<fw; fx++) {
              let mx = ix + fx
              for(let fy=0; fy<fh; fy++) {
                let my = iy + fy
                if (mx >= 0 && mx < iw && my >=0 && my < ih) {
                    a += f.v[((fz*fw)+fx)*fh+fy] * i.v[((fz*iw)+mx)*ih+my]
                }
              }
            }
          }
          a += bias.v[d]
          o.v[((d*ow)+ox)*oh+oy] = a
        }
      }
    }
    // console.log('forward(): i=', i)
    // console.log('forward(): o=', o)
    return super.forward()
  }

  backward() {
    let {o, i, id, iw, ih, fd, fw, fh, stride, pad, od, ow, oh, filters, bias} = this
    for(let d=0; d<od; d++) {
      let f = filters[d]
      let ix = -pad
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          let oGrad = o.g[(d*ow+ox)*oh+oy] // 取得輸出 o 的梯度
          for (let fz=0; fz<fd; fz++) {
            for (let fx=0; fx < fw; fx++) {
              let mx = ix+fx
              for (let fy=0; fy < fh; fy++) {
                let my = iy+fy
                if (mx>=0 && mx<iw && my>=0 && my<ih) { // 反饋到每一個輸入與遮罩
                  let ii = ((fz*iw)+mx)*ih+my
                  let fi = ((fz*fw)+fx)*fh+fy
                  f.g[fi] += i.v[ii] * oGrad
                  i.g[ii] += f.v[fi] * oGrad
                }
              }
            }
          }
          bias.g[d] += oGrad
        }
      }
      // console.log('backward:f=', f)
    }
    // console.log('backward:i=', i)
    // console.log('backward:x=', this.x)
    // console.log('backward:bias=', bias)
  }
}

Object.assign(L, {
  Layer, FLayer, SigmoidLayer, TanhLayer, ReluLayer, FullyConnectLayer, PerceptronLayer,
  InputLayer, RegressionLayer, SoftmaxLayer, PoolLayer, DropoutLayer, ConvLayer
})

},{"../../ma6":11,"../../uu6":33,"./func":24,"./node":28}],27:[function(require,module,exports){
module.exports = nn6 = {
  N: require('./node'),
  G: require('./gate'),
  L: require('./layer'),
  Net: require('./Net'),
}

Object.assign(nn6, nn6.N, nn6.G, nn6.L)

},{"./Net":23,"./gate":25,"./layer":26,"./node":28}],28:[function(require,module,exports){
const ma6 = require('../../ma6')
const uu6 = require('../../uu6')
const V = ma6.V
const T = ma6.T
const N = {}

class Node {
  toString() {
    return 'v:' + this.v + ' g:' + this.g
  }
}

class Constant extends Node {
  constructor(v = 0) {
    super()
    this._v = v
  }
  get v() { return this._v }
  set v(c) { } // 常數不能事後設定值
  get g() { return 0 } // 常數的梯度 = 0
  set g(c) { } // 常數不能設定梯度
}

class Variable extends Node {
  constructor(v = 0, g = 0) {
    super()
    this.v = v // 輸出值 (f(x))
    this.g = g // 梯度值 (偏微分)
  }
}

class TensorNode extends Node {
  constructor(v, shape) {
    super()
  }

  get length() { return this.v.length }

  toString() {
    return this.constructor.name + ' v:' + uu6.json(this.v) + ' g:' + uu6.json(this.g) + ' shape:' + uu6.json(this.shape)
  }
}

class TensorVariable extends TensorNode {
  constructor(v, shape) {
    super(v, shape)
    let size = (v) ? v.length : T.size(shape)
    this.v = v || V.array(size, 0) // 輸出值 (f(x))
    this.g = V.array(size, 0)      // 梯度值 (偏微分)
    this.shape = shape || [size]
  }
}

class TensorConstant extends TensorNode {
  constructor(v) {
    super()
    this._v = v || V.array(size, 0)      // 輸出值 (f(x))
  }
  get v() { return this._v }
  get g() { return 0 }
}

module.exports = Object.assign(N, {
  Constant, Variable, TensorVariable, TensorConstant
})
},{"../../ma6":11,"../../uu6":33}],29:[function(require,module,exports){
module.exports = require('./src/se6')

},{"./src/se6":31}],30:[function(require,module,exports){
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
p.等於 = p.equal
p.靠近 = p.near
p.型態 = p.type
p.是 = p.a
p.有 = p.contain
p.屬性 = p.property

},{"../../uu6":33}],31:[function(require,module,exports){
const se6 = module.exports = {}

Object.assign(se6, require('./expect'))

},{"./expect":30}],32:[function(require,module,exports){
module.exports = {}

},{}],33:[function(require,module,exports){
module.exports = require('./src/uu6')
},{"./src/uu6":41}],34:[function(require,module,exports){
const A = module.exports = {}

A.defaults = function (args, defs) {
  let r = Object.assign({}, args)
  for (let k in defs) {
    r[k] = (args[k] == null) ? defs[k] : args[k]
  }
  return r
}

},{}],35:[function(require,module,exports){
const U = module.exports = {}

U.array = function (n, value=0) {
  let a = new Array(n)
  return a.fill(value)
}

U.repeats = function (n, f) {
  let r = []
  for (let i=0; i<n; i++) {
    r.push(f())
  }
  return r
}

U.last = function (a) {
  return a[a.length-1]
}

U.push = function (a, o) {
  a.push(o)
}

U.pop = function (a) {
  return a.unshift()
}

U.enqueue = function (a, o) {
  a.unshift(o)
}

U.dequeue = function (a) {
  return a.unshift()
}

U.amap2 = function (a, b, f) {
  let len = a.length, c = new Array(len)
  for (let i=0; i<len; i++) {
    c[i] = f(a[i], b[i])
  }
  return c
}

U.repeats = function (n, value = 0) {
  let a = new Array(n)
  return a.fill(value)
}

U.range = function (begin, end, step=1) {
  let len = Math.floor((end-begin)/step)
  let a = new Array(len)
  let i = 0
  for (let t=begin; t<end; t+=step) {
    a[i++] = t
  }
  return a
}

},{}],36:[function(require,module,exports){
const U = module.exports = {}


},{}],37:[function(require,module,exports){
const U = module.exports = {}

U.assert = function (cond, msg='assert fail!') {
  if (!cond) throw Error(msg)
}

U.be = U.assert 


},{}],38:[function(require,module,exports){
const U = module.exports = {}

U.eq = function (o1, o2) {
  if (o1 == o2) return true
  if (Object.is(o1,o2)) return true
  return JSON.stringify(o1) === JSON.stringify(o2)
}

U.nNear = function (n1, n2, gap=0.01) {
  let d = Math.abs(n1-n2)
  return d < gap
}

U.near = function (n1, n2, gap=0.01) {
  if (Array.isArray(n1)) {
    for (let i=0; i<n1.length; i++) {
      if (!U.nNear(n1[i], n2[i], gap))
        return false
    }
    return true
  } else {
    return U.nNear(n1, n2, gap)
  }
}

U.clone = function (o) {
  let type = typeof o
  if (Array.isArray(o))
    return o.slice(0)
  else if (type === 'object')
    return {...o}
  else
    return o
}

U.type = function (o, type) { // U.is
  if (typeof o === type) return true
  if (type==='array' && Array.isArray(o)) return true
  if (typeof o === 'object' && o instanceof type) return true
  return false
}

U.member = function (o, member) {
  if (typeof o === 'string') return member
  if (Array.isArray(o)) return o[o.indexOf(member)]
  if (o instanceof Set && o.has(member)) return member
  if (o instanceof Map) return o.get(member)
  return o[member]
}

U.contain = function (o, member) {
  return U.member(o, member) != null
}

U.omap2 = function (o1, o2, f) {
  let o = {}
  for (let k in o1) {
    o[k] = f(o1[k], o2[k])
  }
  return o
}

U.array2map = function (a) {
  let map = {}
  for (let i in a) {
    map[i] = a[i]
  }
  return map
}

U.key2value = function (o) {
  let r = {}
  for (let k in o) {
    let v = o[k]
    r[v] = k 
  }
  return r
}

U.mixin = Object.assign

},{}],39:[function(require,module,exports){
const U = module.exports = {}

U.random = function (min=0, max=1) {
  return min + Math.random()*(max-min)
}

U.randomInt = function (min, max) {
  return Math.floor(U.random(min, max))
}

U.randomChoose = function (a) {
  return a[U.randomInt(0, a.length)]
}

},{}],40:[function(require,module,exports){
const U = module.exports = {
  precision: 4,
  tab: undefined
}

U.json = function (o, tab, n) {
  let digits = n || this.precision || 4
  return JSON.stringify(o, function(key, val) {
    return (val && val.toFixed) ? Number(val.toFixed(digits)) : val
  }, tab)
}

},{}],41:[function(require,module,exports){
const uu6 = module.exports = require('./object')

uu6.mixin(uu6, 
  require('./array'),
  require('./error'),
  require('./string'),
  require('./random'),
  require('./control'),
  require('./args'),
)
},{"./args":34,"./array":35,"./control":36,"./error":37,"./object":38,"./random":39,"./string":40}]},{},[9]);
