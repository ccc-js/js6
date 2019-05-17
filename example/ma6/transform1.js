// 參考 -- https://en.wikipedia.org/wiki/Discrete_Fourier_transform
// 反轉換參考 -- Four Ways to Compute an Inverse FFT Using the Forward FFT Algorithm
// https://www.dsprelated.com/showarticle/800.php
const ma6 = require('../../js6/ma6')

// let x = {r:[1, 2, 0, -1], i:[0, -1, -1, 2]}
let x = {r:[1, 2, 1, 2, 1, 2], i:[2, 1, 2, 1, 2, 1]}
// let x = {r:[1, 2, 0], i:[0, -1, -1]}

console.log('Before fft:x=%j', x)

// ma6.FFT(x)
ma6.fft(x)

console.log('After  fft:x=%j', x)

// ma6.iFFT(x)
ma6.ifft(x)

console.log('After ifft:x=%j', x)
