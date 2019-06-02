const expect = require('../../js6/se6').expect
const ma6 = require('../../js6/ma6')
const {M} = ma6
// let a = new Matrix([1,2,3,4], [2,2])
let a = [[1,2],[3,4]]
var at = null

describe('Matrix test', function() {

  it('transpose test', function() {
    console.log('a=%j', a)
    at = M.transpose(a)
    console.log('at=%j', at)
    expect(at).to.equal([[1,3], [2,4]])
  })
  it('diag test', function() {
    let D = M.diag([1,2,3])
    expect(M.flatten(D)).to.equal([1,0,0, 0,2,0, 0,0,3])
  })
  it('identity test', function() {
    let I = M.identity(3)
    expect(M.flatten(I)).to.equal([1,0,0, 0,1,0, 0,0,1])
  })
  it('dot test', function() {
    console.log('a=%j', a)
    let aat = M.dot(a, at)
    console.log('aat=%j', aat)
    expect(aat).to.equal([[5,11], [11,25]])
  })
  it('inv test', function() {
    // let a = [[0,1],[1,0]]
    console.log('a=%j', a)
    let b = M.inv(a)
    console.log('a=%j', a)
    console.log('b=%j', b)
    let ab = M.dot(a, b)
    console.log('ab=%j', ab)
    console.log('a=%j', a)
    expect(M.flatten(ab)).to.near([1,0, 0,1])
  })
  it('det test', function() {
    console.log('a=%j', a)
    let d = M.det(a)
    console.log('d=%d', d)
    expect(d).to.near(-2)
  })
  it('LU test', function() {
    let lup = M.lu(a)
    console.log('lup=', lup)
    expect(M.flatten(lup.LU)).to.near([3, 4, 0.3333, 0.6667])
    let b = [17, 39]
    let x = [5, 6]
    let s = M.luSolve(lup, b)
    console.log('s=', s)
    expect(s).to.near(x)
    // expect(a.solve(b).v.r).to.near(x)
  })
  it('svd test', function() {
    let svd = M.svd(a)
    console.log('svd=', svd)
    let {U, S, V} = svd
    let Ut = M.transpose(U)
    let Vt = M.transpose(V)
    let UtU = M.dot(Ut, U)
    let VVt = M.dot(V, Vt)
    console.log('UtU=', UtU)
    console.log('VVt=', VVt)
    expect(M.flatten(UtU)).to.near(M.flatten(M.identity(U.length))) // U*iU = I
    expect(M.flatten(VVt)).to.near(M.flatten(M.identity(V.length))) // U*iU = I
    let US = M.dot(U, M.diag(S))
    let USVt = M.dot(US, Vt)
    console.log('USV=', USVt)
    expect(M.flatten(USVt)).to.near(M.flatten(a))
  })
  /*
  it('Matrix from Vector, Tensor test', function() {
    let a3 = a.addc(3)
    let a0 = a3.subc(3)
    console.log('a3=', a3)
    expect(a0.v).to.equal(a.v)
    let a2a = a.add(a0)
    let a2m = a.mulc(2)
    expect(a2a.v).to.equal(a2m.v)
  })
  */
})

  /*
  // Note that eigenvalues and eigenvectors are returned as complex numbers (type numeric.T). 
     This is because eigenvalues are often complex even when the matrix is real.
  // 目前不支援複數版，也不支援 Eigen Value Decomposition
  it('eig test', function() {
    let e = M.eig(a)
    console.log('e=', e)
    let lambdaE = M.dot(M.diag(e.lambda), e.E)
    console.log('lambda*E=', lambdaE)
  })
  */
