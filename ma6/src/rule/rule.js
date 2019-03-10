const R = module.exports = {}

let eq = uu6.eq

// Group
R.close = (set, op, a,b)=>set.contain(op(a,b))
R.assoc = (op, a,b,c)=>eq(op(op(a,b),c), op(a, op(b,c)))
R.ident = (op, a, e)=>eq(op(a, e), a)
R.inver = (op, a, na, e)=>eq(op(a, na), e)

// Abel Group
R.commu = (op, a,b)=>(eq(op(a,b), op(b,a)))

// Field : Object
R.distr = (F, a, b, c)=F.mul(a, F.add(b,c)).eq(F.mul(a,b).add(F.mul(a,c)))



// Space : Object


