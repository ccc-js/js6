const S = module.exports = {}

// Space: https://en.wikipedia.org/wiki/Space_(mathematics)
//   In mathematics, a space is a set (sometimes called a universe) with some added structure.
//   Structure : https://en.wikipedia.org/wiki/Mathematical_structure
class Space extends Set {}

// Topological space : https://en.wikipedia.org/wiki/Topological_space
// 典型範例 圖形理論的平面圖 (例如尤拉的 V-E+F=2 公式在平面圖中是個定理)
/* Definition: 
1. If N is a neighbourhood of x (i.e., N ∈ N(x)), then x ∈ N. In other words, each point belongs to every one of its neighbourhoods.
2. If N is a subset of X and includes a neighbourhood of x, then N is a neighbourhood of x. I.e., every superset of a neighbourhood of a point x in X is again a neighbourhood of x.
3. The intersection of two neighbourhoods of x is a neighbourhood of x.
4. Any neighbourhood N of x includes a neighbourhood M of x such that N is a neighbourhood of each point of M.
*/
class TopologicalSpace extends Space {
  neighbor(p1, p2) {} // TopologicalSpace is a Space with neighbor() function.
  coarser(T1, T2) {} // 更粗糙的 (coarser, weaker or smaller) 的拓樸
  finer(T1, T2) { return !courser(T2,T1) } // 更細緻的 (finer, stronger or larger) 的拓樸
  continuous() {} // if for all x in X and all neighbourhoods N of f(x) there is a neighbourhood M of x such that f(M) is subset of N.
  homeomorphism() {} // 同胚: 同胚是拓撲空間範疇中的同構(存在 f 雙射，連續，且 f-1 也連續) (注意和代數的 Homomorphism (同態) 不同，差一個 e)
}

// KolmogorovSpace
// https://en.wikipedia.org/wiki/Separation_axiom
// Kolmogorov classification T0, T1, T2, ....
// every pair of distinct points of X, at least one of them has a neighborhood not containing the other	
class KolmogorovSpace extends TopologicalSpace {}
S.T1 = KolmogorovSpace

// 任兩點都可鄰域分離者，為郝斯多夫空間。
class HausdorffSpace extends KolmogorovSpace {}
S.T2 = HausdorffSpace

// https://en.wikipedia.org/wiki/Metric_space
class MetricSpace extends TopologicalSpace { // distances between all members are defined
  d(p1,p2) {}
  static test() {
    be(this, 3, (x,y,z)=>{
      d(x,y)>=0&&
      d(x,x)===0&&
      d(x,y)===d(y,x)&&
      d(x,z)<=d(x,y)+d(y,z)})
  }
}

// CompleteMetricSpace: https://en.wikipedia.org/wiki/Complete_metric_space
// M is called complete (or a Cauchy space) if every Cauchy sequence of points in M has a limit that is also in M 
//   or, alternatively, if every Cauchy sequence in M converges in M.
// 空間中的任何柯西序列都收斂在該空間之內。
class CompleteMetricSpace extends MericSpace {
}

/*
VectorSpace : https://en.wikipedia.org/wiki/Vector_space

A vector space over a field F is a set V together with two operations that satisfy the eight axioms listed below.

The first operation, called vector addition or simply addition + : V × V → V, takes any two vectors v and w and assigns to them a third vector which is commonly written as v + w, and called the sum of these two vectors. (Note that the resultant vector is also an element of the set V ).
The second operation, called scalar multiplication · : F × V → V， takes any scalar a and any vector v and gives another vector av. (Similarly, the vector av is an element of the set V).
Elements of V are commonly called vectors. Elements of F are commonly called scalars.

Axiom	Meaning
Associativity of addition	u + (v + w) = (u + v) + w
Commutativity of addition	u + v = v + u
Identity element of addition	There exists an element 0 ∈ V, called the zero vector, such that v + 0 = v for all v ∈ V.
Inverse elements of addition	For every v ∈ V, there exists an element −v ∈ V, called the additive inverse of v, such that v + (−v) = 0.
Compatibility of scalar multiplication with field multiplication	a(bv) = (ab)v [nb 2]
Identity element of scalar multiplication	1v = v, where 1 denotes the multiplicative identity in F.
Distributivity of scalar multiplication with respect to vector addition  	a(u + v) = au + av
Distributivity of scalar multiplication with respect to field addition	(a + b)v = av + bv */
class VectorSpace extends Space {
  constructor(V, C) {}

  static test(vs) {
    Group.test(vs.gadd)
    Group.test(vs.gmul)
    distr(a,u,v)
    ldistr(a,b,v)
  }
}

class NormedVectorSpace extends VectorSpace {

}

S.LinearSpace = VectorSpace
