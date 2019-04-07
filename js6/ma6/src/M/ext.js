const E = module.exports = {}
const V = require('../vector')
const uu6 = require('../../../uu6')
const array = V.array

E.svd = require('./svd')

E.eig = function (m) {
  let USV = E.svd(m)
  let {U, S, V:V1} = USV
  console.log('S=', S)
  let lambda = V.mul(S, S)
  let E1 = uu6.clone(V1)
  let rows = U.length, cols = U[0].length
  for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        E1[i][j] /= S[j]
    }
  }
  return {lambda, E:E1}
}

// AX = b
E.LU = function(A) {
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

E.LUSolve = function (LUP, b) {
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

E.solve = function (A,b) { return E.LUSolve(E.LU(A), b) }

/*
E.det = function (x) {
  let rows = x.length, cols = x[0].length
  if(rows !== cols) { throw new Error('ma6: det() only works on square matrices'); }
  let abs = Math.abs
  var n = rows, ret = 1,i,j,k,A = uu6.clone(x),Aj,Ai,alpha,temp,k1,k2,k3;
  for(j=0;j<n-1;j++) {
      k=j;
      for(i=j+1;i<n;i++) { if(abs(A[i][j]) > abs(A[k][j])) { k = i; } }
      if(k !== j) {
          temp = A[k]; A[k] = A[j]; A[j] = temp;
          ret *= -1;
      }
      Aj = A[j];
      for(i=j+1;i<n;i++) {
          Ai = A[i];
          alpha = Ai[j]/Aj[j];
          for(k=j+1;k<n-1;k+=2) {
              k1 = k+1;
              Ai[k] -= Aj[k]*alpha;
              Ai[k1] -= Aj[k1]*alpha;
          }
          if(k!==n) { Ai[k] -= Aj[k]*alpha; }
      }
      if(Aj[j] === 0) { return 0; }
      ret *= Aj[j];
  }
  return ret*A[j][j];
}
*/
/*
https://en.wikipedia.org/wiki/Singular_value_decomposition

The singular-value decomposition can be computed using the following observations:

The left-singular vectors of M are a set of orthonormal eigenvectors of MM∗.
The right-singular vectors of M are a set of orthonormal eigenvectors of M∗M.
The non-zero singular values of M (found on the diagonal entries of Σ) are the square roots of the non-zero eigenvalues of both M∗M and MM∗.
*/

/*
// 6. Coordinate matrices
E.cLU = function (A) {
  var I = A[0], J = A[1], V = A[2];
  var p = I.length, m=0, i,j,k,a,b,c;
  for(i=0;i<p;i++) if(I[i]>m) m=I[i];
  m++;
  var L = Array(m), U = Array(m), left = array(m, Infinity), right = array(m, -Infinity);
  var Ui, Uj,alpha;
  for(k=0;k<p;k++) {
      i = I[k];
      j = J[k];
      if(j<left[i]) left[i] = j;
      if(j>right[i]) right[i] = j;
  }
  for(i=0;i<m-1;i++) { if(right[i] > right[i+1]) right[i+1] = right[i]; }
  for(i=m-1;i>=1;i--) { if(left[i]<left[i-1]) left[i-1] = left[i]; }
  var countL = 0, countU = 0;
  for(i=0;i<m;i++) {
      U[i] = array(right[i]-left[i]+1, 0);
      L[i] = array(i-left[i], 0);
      countL += i-left[i]+1;
      countU += right[i]-i+1;
  }
  for(k=0;k<p;k++) { i = I[k]; U[i][J[k]-left[i]] = V[k]; }
  for(i=0;i<m-1;i++) {
      a = i-left[i];
      Ui = U[i];
      for(j=i+1;left[j]<=i && j<m;j++) {
          b = i-left[j];
          c = right[i]-i;
          Uj = U[j];
          alpha = Uj[b]/Ui[a];
          if(alpha) {
              for(k=1;k<=c;k++) { Uj[k+b] -= alpha*Ui[k+a]; }
              L[j][i-left[j]] = alpha;
          }
      }
  }
  var Ui = [], Uj = [], Uv = [], Li = [], Lj = [], Lv = [];
  var p,q,foo;
  p=0; q=0;
  for(i=0;i<m;i++) {
      a = left[i];
      b = right[i];
      foo = U[i];
      for(j=i;j<=b;j++) {
          if(foo[j-a]) {
              Ui[p] = i;
              Uj[p] = j;
              Uv[p] = foo[j-a];
              p++;
          }
      }
      foo = L[i];
      for(j=a;j<i;j++) {
          if(foo[j-a]) {
              Li[q] = i;
              Lj[q] = j;
              Lv[q] = foo[j-a];
              q++;
          }
      }
      Li[q] = i;
      Lj[q] = i;
      Lv[q] = 1;
      q++;
  }
  return {U:[Ui,Uj,Uv], L:[Li,Lj,Lv]};
}
*/