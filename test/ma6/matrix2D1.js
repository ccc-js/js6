const expect = require('../../js6/se6').expect
const uu6 = require('../../js6/uu6')
const ma6 = require('../../js6/ma6')
const {M} = ma6
let a = [[1,2],[3,4]]

describe('Matrix test', function() {
  it('transpose test', function() {
    let at = M.transpose(a)
    expect(at).to.equal([[1,3], [2,4]])
  })
  it('identity test', function() {
    let I = M.identity(3)
    expect(I).to.equal([[1,0,0], [0,1,0], [0,0,1]])
  })
  it('diag test', function() {
    let D = M.diag([1,2,3])
    expect(D).to.equal([[1,0,0], [0,2,0], [0,0,3]])
  })
  it('dot test', function() {
    let at = M.transpose(a)
    let aat = M.dot(a, at)
    expect(aat).to.equal([[5,11], [11,25]])
  })
  it('inv test', function() {
    let b = M.inv(a)
    let ab = M.dot(a, b)
    expect(M.flatten(ab)).to.near([1,0, 0,1])
  })
  it('svd test', function() {
    let svd = M.svd(a)
    console.log('svd=', svd)
    let {U, S, V} = svd
    let Ut = M.transpose(U)
    let Vt = M.transpose(V)
    let UtU = M.dot(Ut, U)
    let VVt = M.dot(V, Vt)
    // console.log('iU=', iU)
    // console.log('iV=', iV)
    console.log('UtU=', UtU)
    expect(M.flatten(UtU)).to.near(M.flatten(M.identity(U.length))) // U*iU = I
    expect(M.flatten(VVt)).to.near(M.flatten(M.identity(V.length))) // U*iU = I
    let US = M.dot(U, M.diag(S))
    let USVt = M.dot(US, Vt)
    console.log('USV=', USVt)
    expect(M.flatten(USVt)).to.near(M.flatten(a))
  })
  it('LU test', function() {
    let lu = M.LU(a)
    console.log('lu=', lu)
    expect(M.flatten(lu.LU)).to.near([3, 4, 0.3333, 0.6667])
    let b = [17, 39]
    let x = [5, 6]
    let s = M.LUSolve(lu, b)
    expect(s).to.near(x)
    expect(M.solve(a, b)).to.near(x)
  })
  it('det test', function() {
    let d = M.det(a)
    expect(d).to.near(-2)
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
})








