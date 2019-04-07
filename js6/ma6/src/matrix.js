const uu6 = require("../../uu6")
const V = require("./vector")
const T = require("./tensor")

const M = module.exports = {}

M.new = function (rows, cols) {
  let r = new Array(rows)
  for (let i=0; i<rows; i++) {
    r[i] = V.array(cols, 0)
  }
  return r
}

M.flatten = function (m) {
  let rows = m.length, cols = m[0].length
  let r = new Array()
  for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++)
    r[i*cols+j] = m[i][j]
  }
  return r
}

M.identity = function (n) {
  let v = V.array(n, 1)
  return M.diag(v)
}

M.diag = function (v) {
  let rows = v.length
  let r = new Matrix(null, [rows, rows]), rv = r.v
  for (let i = 0; i < rows; i++) {
    rv[i*rows+i] = v[i]
  }
  return r
}

M.inv = function (m0) {
  let m = m0.length, n = m0[0].length, abs = Math.abs
  let A = uu6.clone(m0), Ai, Aj
  let I = M.identity(m).ndarray(), Ii, Ij
  let i, j, k, x, i0, v0
  for (j = 0; j < n; ++j) {
    i0 = -1
    v0 = -1
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
  let abs = Math.abs
  if (x.length !== x[0].length) { throw new Error('numeric: det() only works on square matrices') }
  let n = x.length, ret = 1, i, j, k, A = uu6.clone(x), Aj, Ai, alpha, temp, k1
  for (j = 0; j < n - 1; j++) {
    k = j
    for (i = j + 1; i < n; i++) { if (abs(A[i][j]) > abs(A[k][j])) { k = i } }
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

// AX = b
M.LU = function(A) {
  var abs = Math.abs
  var i, j, k, absAjk, Akk, Ak, Pk, Ai
  var max
  var n = A.length, n1 = n-1
  var P = new Array(n)
  A = uu6.clone(A)

  for (k = 0; k < n; ++k) {
    Pk = k
    Ak = A[k]
    max = abs(Ak[k])
    for (j = k + 1; j < n; ++j) {
      absAjk = abs(A[j][k])
      if (max < absAjk) {
        max = absAjk
        Pk = j
      }
    }
    P[k] = Pk

    if (Pk != k) {
      A[k] = A[Pk]
      A[Pk] = Ak
      Ak = A[k]
    }

    Akk = Ak[k]

    for (i = k + 1; i < n; ++i) {
      A[i][k] /= Akk
    }

    for (i = k + 1; i < n; ++i) {
      Ai = A[i]
      for (j = k + 1; j < n1; ++j) {
        Ai[j] -= Ai[k] * Ak[j]
        ++j
        Ai[j] -= Ai[k] * Ak[j]
      }
      if(j===n1) Ai[j] -= Ai[k] * Ak[j]
    }
  }

  return { LU: A, P:  P }
}

M.LUSolve = function (LUP, b) {
  var i, j;
  var LU = LUP.LU;
  var n   = LU.length;
  var x = uu6.clone(b);
  var P   = LUP.P;
  var Pi, LUi, LUii, tmp;

  for (i=n-1;i!==-1;--i) x[i] = b[i];
  for (i = 0; i < n; ++i) {
    Pi = P[i];
    if (P[i] !== i) {
      tmp = x[i];
      x[i] = x[Pi];
      x[Pi] = tmp;
    }

    LUi = LU[i];
    for (j = 0; j < i; ++j) {
      x[i] -= x[j] * LUi[j];
    }
  }

  for (i = n - 1; i >= 0; --i) {
    LUi = LU[i];
    for (j = i + 1; j < n; ++j) {
      x[i] -= x[j] * LUi[j];
    }

    x[i] /= LUi[i];
  }

  return x;
}

M.solve = function (A,b) { return M.LUSolve(M.LU(A), b) }

class Matrix extends T.Tensor {
  constructor(v, shape) {
    super(v, shape)
  }

  transpose() {
    let a = this, av = a.v, [rows, cols] = a.shape
    let r = new Matrix(null, [cols, rows]), rv = r.v
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rv[j*rows+i] = av[i*rows+j]
      }
    }
    return r
  }

  dot (b) {
    let a = this, av = a.v, [arows, acols] = a.shape
    let bv = b.v, [brows, bcols] = b.shape
    let r = new Matrix(null, [arows, bcols]), rv = r.v
    for (let i = 0; i < arows; i++) {
      for (let k = 0; k < acols; k++) {
        for (let j = 0; j < bcols; j++) {
          rv[i*bcols+j] += av[i*acols+k] * bv[k*brows+j]
        }
      }
    }
    return r
  }

  diag () {
    let a = this, av = a.v, [rows, cols] = a.shape
    let r = new Matrix(a.v, a.shape), rv = r.v
    let v = V.array(rows)
    for (let i = 0; i < rows; i++) {
      v[i] = av[i][i]
    }
    return v
  }

  inv () {
    let a = this.ndarray()
    console.log('inv: a=', a)
    let ia = M.inv(a)
    return new Matrix(ia)
  }

  det() {
    let a = this.ndarray()
    return M.det(a)
  }
}

Object.assign(M, {Matrix })

/*
M.new = function (rows, cols) {
  let r = new Array(rows)
  for (let i=0; i<rows; i++) {
    r[i] = V.array(cols, 0)
  }
  return r
}



M.tr = M.transpose = function (m) {
  let r = []
  let rows = m.length
  let cols = m[0].length
  for (let j = 0; j < cols; j++) {
    let rj = r[j] = []
    for (let i = 0; i < rows; i++) {
      rj[i] = m[i][j]
    }
  }
  return r
}

M.dot = function (a, b) {
  let arows = a.length
  let bcols = b[0].length
  let r = []
  let bt = M.tr(b)
  for (let i = 0; i < arows; i++) {
    let ri = r[i] = []
    for (let j = 0; j < bcols; j++) {
      ri.push(V.dot(a[i], bt[j]))
    }
  }
  return r
}

M.diag = function (v) {
  let rows = v.length
  let r = M.new(rows, rows)
  for (let i = 0; i < rows; i++) {
    r[i][i] = v[i]
  }
  return r
}

M.vdiag = function (m) {
  let rows = v.length
  let v = V.array(rows)
  for (let i = 0; i < rows; i++) {
    v[i] = m[i][i]
  }
  return v
}

M.identity = function (n) {
  let v = V.array(n, 1)
  return M.diag(v)
}


*/