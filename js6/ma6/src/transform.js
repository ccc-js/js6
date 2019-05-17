// 來源 -- https://gist.github.com/mbitsnbites/a065127577ff89ff885dd0a932ec2477
// 參考 -- https://en.wikipedia.org/wiki/Discrete_Fourier_transform

function FFT(x) {
  var m = x.r.length / 2, k, X={r:[], i:[]}, Y={r:[], i:[]}

  for (k = 0; k < m; ++k) {
    X.r[k] = x.r[2 * k];
    X.i[k] = x.i[2 * k];
    Y.r[k] = x.r[2 * k + 1];
    Y.i[k] = x.i[2 * k + 1];
  }

  if (m > 1) {
    FFT(X)
    FFT(Y)
  }

  for (k = 0; k < m; ++k) {
    var a, b, tw = {}
    a = -Math.PI * k / m, tw.r = Math.cos(a), tw.i = Math.sin(a);
    a = tw.r * Y.r[k] - tw.i * Y.i[k];
    b = tw.r * Y.i[k] + tw.i * Y.r[k];
    x.r[k] = X.r[k] + a;
    x.i[k] = X.i[k] + b;
    x.r[k + m] = X.r[k] - a;
    x.i[k + m] = X.i[k] - b;
  }
}

// 參考: Four Ways to Compute an Inverse FFT Using the Forward FFT Algorithm
// https://www.dsprelated.com/showarticle/800.php
function iFFT(x) {
  let X = {r:[x.r[0]].concat(x.r.slice(1).reverse()),
           i:[x.i[0]].concat(x.i.slice(1).reverse())}
  FFT(X)
  let N = X.r.length
  for (let i=0; i<N; i++) {
    x.r[i] = X.r[i]/N
    x.i[i] = X.i[i]/N
  }
}

// 找出 2^k > n 的 k 傳回
function toPow2(n) {
  let k = Math.ceil(Math.log2(n))
  return Math.pow(2, k)
}

function extendPow2(a) {
  let alen = a.length
  let N = toPow2(a.length)
  for (let i=alen; i<N; i++) a.push(a[i-alen])
}

function fft(x) {
  extendPow2(x.r)
  extendPow2(x.i)
  FFT(x)
}

function ifft(X) {
  iFFT(X)
}

module.exports = { fft, ifft }

