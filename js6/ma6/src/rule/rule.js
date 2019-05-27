const R = module.exports = {}
let {max} = Math
let {eq, near} = uu6

// Group
R.close = (set, op, a, b)=>set.contain(op(a,b))
R.assoc = (op, a, b, c)=>eq(op(op(a,b),c), op(a, op(b,c)))
R.ident = (op, a, e)=>eq(op(a, e), a)
R.inver = (op, a, na, e)=>eq(op(a, na), e)

// Abel Group
R.commu = (op, a, b)=>(eq(op(a,b), op(b,a)))

// Field
R.distr = (F, a, b, c)=F.mul(a, F.add(b,c)).eq(F.mul(a,b).add(F.mul(a,c)))

// Space
R.order = (eq, lt, gt, a, b)=>eq(a,b)||lt(a,b)||(gt(a,b)) // an order: each number is either less or more than any other number. => https://en.wikipedia.org/wiki/Mathematical_structure
R.meric = (d, x, y, z)=>d(x,y)>=0&&d(x,x)==0&&d(x,y)==d(y,x)&&d(x,z)<=d(x,y)+d(y,z) // https://en.wikipedia.org/wiki/Metric_(mathematics)
R.umeric= (d, x, y, z)=>R.meric(d, x, y, z)&&d(x,z)<=max(d(x,y),d(y,z)) // https://en.wikipedia.org/wiki/Metric_(mathematics)
R.imeric= (d, x, y, z)=> // https://en.wikipedia.org/wiki/Intrinsic_metric

// Calculus

// first, f has to be defined at c (guaranteed by the requirement that c is in the domain of f). Second, the limit on the left hand side of that equation has to exist. Third, the value of this limit must equal f(c).
R.continuous = (f, c, d)=> near(f(c+d), f(c)) // https://en.wikipedia.org/wiki/Continuous_function
R.CauchySequence = (f, n, d)=> abs(f(n+1)-f(n+2)) < d // https://en.wikipedia.org/wiki/Cauchy_sequence
R.CompleteMetric = (f, c, n, d)=>R.continuous(f,c,d)&&R.Cauchy



