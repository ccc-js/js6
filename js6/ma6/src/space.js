const S = module.exports = {}

S.cosineSimilarity = function (v1, v2) {
  return v1.vdot(v2) / (v1.norm() * v2.norm())
}

S.euclidDistance = function (v1, v2) { // sqrt((v1-v2)*(v1-v2)T)
  let dv = v1.sub(v2)
  return Math.sqrt(dv * (dv.tr()))
}

S.manhattanDistance = function (v1, v2) { // sum(|v1-v2|)
  return v1.sub(v2).abs().sum()
}

S.chebyshevDistance = function (v1, v2) { // max(|v1-v2|)
  return v1.sub(v2).abs().max()
}

// Space = HllbertSpace + BanachSpace + Manifold (流形)
S.Space = extend({}, S.Set);

// ============= Topology ====================
// https://en.wikipedia.org/wiki/Topological_space
// p : point
S.TopologicalSpace={ // 拓撲空間 : a Space with neighbor()
	neighbor:function(p1, p2) {}, // TopologicalSpace is a Space with neighbor() function.
  coarser:function(T1, T2) {}, // 更粗糙的 (coarser, weaker or smaller) 的拓樸
	finer:function(T1, T2) { return !courser(T2,T1) }, // 更細緻的 (finer, stronger or larger) 的拓樸
	continuous:function() {}, // if for all x in X and all neighbourhoods N of f(x) there is a neighbourhood M of x such that f(M) is subset of N.
	homeomorphism:function() {}, // 同胚: 同胚是拓撲空間範疇中的同構(存在 f 雙射，連續，且 f-1 也連續) (注意和代數的 Homomorphism (同態) 不同，差一個 e)
}

extend(S.TopologicalSpace, S.Space);

// Kolmogorov classification T0, T1, T2, ....
// https://en.wikipedia.org/wiki/Separation_axiom

S.T0 = S.KolmogorovSpace = {
// every pair of distinct points of X, at least one of them has a neighborhood not containing the other	
}

extend(S.T0, S.TopologicalSpace);

S.T1 = S.FrechetSpace = {}

// 任兩點都可鄰域分離者，為郝斯多夫空間。
S.T2 = S.HausdorffSpace = {}

S.T2Complete = {}

S.T2p5	= S.Urysohn = {} // T2?

S.T3 = S.RegularSpace = {
	// every closed subset C of X and a point p not contained in C admit non-overlapping open neighborhoods
}

S.T3p5	= S.TychonoffSpace = {} // T3?

S.T4 = S.NormalHausdorff = {}

S.T5 = S.CompletelyNormalHausdorff = {}

S.T6 = S.PerfectlyNormalHausdorff = {}

// https://en.wikipedia.org/wiki/Discrete_space
S.DiscreteSpace = {} // 

extend(S.DiscreteSpace, S.TopologicalSpace);

// 1. d(x,y)>=0, 2. d(x,y)=0 iff x=y 3. d(x,y)=d(y,x) 4. d(x,z)<=d(x,y)+d(y,z)
S.Metric = {
	d:function(x,y) {}, 
	test0:function() {
		be(d(x,y)>=0);
		be(d(x,x)==0);
		be(d(x,y)==d(y,x));
	},
	test:function() {
		test0();
		be(d(x,z)<=d(x,y)+d(y,z));
	},
}

S.UltraMetric = {
	test:function() {
		test0();
		be(d(x,z)<=max(d(x,y),d(y,z)));
	},
}

extend(S.UltraMetric, S.Metric);

// https://en.wikipedia.org/wiki/Metric_space
S.MetricSpace = { // distances between all members are defined
	d:function(p1,p2) {},
	test:function() {
		be(d(x,y)>=0);
		be(d(x,x)===0);
		be(d(x,y)===d(y,x));
		be(d(x,z)<=d(x,y)+d(y,z));
	}
}

S.CompleteMetricSpace = { // 空間中的任何柯西序列都收斂在該空間之內。
}

extend(S.CompleteMetricSpace, S.MetricSpace);

// https://en.wikipedia.org/wiki/Complete_metric_space
S.CompleteMetricSpace = {
	// M is called complete (or a Cauchy space) if every Cauchy sequence of points in M has a limit that is also in M or, alternatively, if every Cauchy sequence in M converges in M.
}

// https://en.wikipedia.org/wiki/Uniform_space
S.UniformSpace = { // 帶有一致結構的集合，「x 鄰近於a 勝過y 鄰近於b」之類的概念，在均勻空間中是有意義的。
	
}

S.Rn = {
	
} // (S,S,....)

// 向量空間： VectorSpace = Rn + Linearity
// V:AbelGroup(交換群), F:Field
// 1. F × V → V，(r,v)→ rv
// 2. r(x+y) = rx+ry
// 3. (r+s)x = rx+sx
// 4. (rs)x = r(sx)
// 5. 1x = x
S.VectorSpace = S.LinearSpace = {
	add(x,y) { return x.add(y) },
	mul(a,x) { return a.mul(x) },
	bilinear(b) { // https://en.wikipedia.org/wiki/Bilinear_form
		linear((u)=>b(u,w));
		linear((w)=>b(u,w));
	},
	positiveDefinite(b) { }, // 正定
	symmetric(b) {}, // 對稱
	dualSpace() {}, // https://en.wikipedia.org/wiki/Dual_space
}

extend(S.VectorSpace, S.Rn);

S.FiniteVectorSpace = {} // 有限體向量空間

extend(S.FiniteVectorSpace, S.VectorSpace);

S.NormedVectorSpace={ // 賦範空間
	norm:function(v) { return x.norm() },
}

extend(S.NormedVectorSpace, S.VectorSpace);

S.InnerProductSpace={ // 內積空間
	dot(x,y) { return x.vdot(y) },
}

extend(S.InnerProductSpace, S.NormedVectorSpace);

// 仿射空間：a1 v1 + ... + an vn 中 sum(ai)=1
// https://en.wikipedia.org/wiki/Affine_space
S.AffineSpace = {
	sub(x,y) { }, // 點與點的差是一向量
	add(x,v) { }, // 點加向量得一點，但點與點不可作加法
}

// ============= Euclidean Geometry 歐氏幾何 ====================
S.EuclideanSpace = {
	d(x,y) { return x.sub(y).norm() }, // v= x.sub(y); v.dot(v).sqrt()
	dot(x,y) { return x.vdot(y) },
}

S.LocallyConvaxSpace={}
extend(S.LocallyConvaxSpace, S.VectorSpace);

S.HilbertSpace={} // HilbertSpace => InnerProductSpace => LocallyConvaxSpace => VectorSpace (LinearSpace)
extend(S.HilbertSpace, S.InnerProductSpace);

// BanachSpace => NormedVectorSpace => MetricSpace => TopologicalSpace
// NormedVectorSpace that Cauchy sequence of vectors always converges to a well defined limit
S.BanachSpace={}

extend(S.BanachSpace, S.NormedVectorSpace);

S.MeasureSpace = {} // 測度空間 M(Set) => S

S.ProbabilitySpace = {} // 機率空間 M(Set) = 1/3


// ============= Elliptic Geometry 橢圓幾何 ====================
S.EllipticGeometry = {} // 橢圓幾何

S.SphericalGeometry = {} // 球面幾何

S.SphericalTrigonometry = {} // 球面三角學

S.Geodesy = {} // 大地測量學

S.GreatCircleDistance = {} // 大球距離

// 圓： x^2+y^2 = 1 =>  (x,y)=(sin t, cos t)
// 雙曲線： x^2-y^2 = 1 => (x,y) = (sinh t, cosh t)
// sinh = (e^x-e^{-x})/2, cosh = (e^x+e^{-x})/2
// https://en.wikipedia.org/wiki/Hyperbolic_function
// sinh x = -i sin ix ; cosh x = cos ix
// sin x  泰勒展開 = x - 1/3! x^3 + 1/5! x^5 ....
// sinh x 泰勒展開 = x + 1/3! x^3 + 1/5! x^5 ....
// int sinh cx dx = 1/c cosh cx + C 
  

// ============= Hyperbolic Geometry 雙曲幾何 ====================
S.HyperbolicGeometry = {}

// ============= Riemannian Geometry ====================
// https://en.wikipedia.org/wiki/Riemannian_geometry
S.RiemannianGeometry = {} // 黎曼幾何

S.RiemannianMetrics = {} // 黎曼度規

S.MetricTensor = {} // 度規張量

S.GaussBonnetTheorem = {} // 高斯博內定理

// ============= Manifold : 流形 ====================
S.Manifold={}

S.C0 = {}

S.Coo = {}

// https://en.wikipedia.org/wiki/Topological_vector_space
S.TopologicalVectorSpace = {}  

// https://en.wikipedia.org/wiki/Locally_convex_topological_vector_space
S.LocallyConvexSpace = {}

extend(S.LocallyConvexSpace, S.TopologicalVectorSpace);
extend(S.LocallyConvexSpace, S.NormedVectorSpace);

// m 維拓撲流形
S.TopologicalManifold={
// M是豪斯多夫空間，x in M 有鄰域 U 同胚於 m 維歐幾里得空間 S^{m}的一個開集
}

S.BanachManifold = {}

// =========== Topological Ring ==============
S.TopologicalRing = extend({}, S.Ring);
S.TopologicalField = extend({}, S.Field);

// ref : https://en.wikipedia.org/wiki/Group_homomorphism
//  https://en.wikipedia.org/wiki/Fundamental_theorem_on_homomorphisms
// 同態：h(a • b) = h(a) x h(b) 
S.homomorphism=function(h, g1, g2) {
  var a=g1.random(), b=g2.random();
  return eq(h(group1.op(a,b)), group2.op(h(a), h(b)))
}

// ref : https://en.wikipedia.org/wiki/Isomorphism
//  https://en.wikipedia.org/wiki/Isomorphism_theorem
// 同構：h(a • b) = h(a) • h(b)
S.isomorphism=function(h1, h2, g1, g2) {
  var a1=g1.random(), b1=g2.random();
  var a2=g1.random(), b2=g2.random();
  return homorphism(h1,g1,g2)&&homorphism(h2,g2,g1);
}


// 多邊形：Polygon
// 多面體：Polyhedron : V-E+F = 2
// 多胞形：Polytope
// ============= Spherical Geometry ====================
S.SphericalGeometry = {}

S.MandelbrotSet = {}

// 碎形幾何 : Fractal
// http://andrew-hoyer.com/
// http://andrew-hoyer.com/experiments/fractals/
// http://flam3.com/flame.pdf
// https://en.wikipedia.org/wiki/List_of_fractals_by_Hausdorff_dimension

// http://rembound.com/articles/drawing-mandelbrot-fractals-with-html5-canvas-and-javascript
// https://github.com/rembound/Mandelbrot-Fractal-HTML5/blob/master/mandelbrot-fractal.js


// 操控繪圖
// http://fabricjs.com/ (讚！)
// https://github.com/kangax/fabric.js

// 3D 動畫
// https://threejs.org/
// http://haptic-data.com/toxiclibsjs/

// 地理資訊
// ArcGIS : https://developers.arcgis.com/javascript/3/

// 動畫
// http://paperjs.org/features/
// https://processing.org/

// 向量
// http://victorjs.org/
// 3d: https://evanw.github.io/lightgl.js/docs/vector.html