// 1st:  Coin B, {HTTTHHTHTH}, 5H,5T
// 2nd:  Coin A, {HHHHTHHHHH}, 9H,1T
// 3rd:  Coin A, {HTHHHHHTHH}, 8H,2T
// 4th:  Coin B, {HTHTTTHHTT}, 4H,6T
// 5th:  Coin A, {THHHTHHHTH}, 7H,3T
// so, from MLE: pA(heads) = 0.80 and pB(heads)=0.45

const ml6 = require('../../../js6/ml6')
const ma6 = require('../../../js6/ma6')
const {V} = ma6

var e = [ [5,5], [9,1], [8,2], [4,6], [7,3] ];
var pA = [0.6,0.4], pB = [0.5,0.5];

class EM1 extends ml6.EM {
  estimate () {
    var sumA=[0,0], sumB=[0,0];
    for (var i in e) {
      var lA = ma6.xplog(e[i], pA)
      var lB = ma6.xplog(e[i], pB)
      var a  = Math.exp(lA), b = Math.exp(lB)
      var wA = a/(a+b), wB=b/(a+b)
      var eA = V.mul(e[i], wA)
      var eB = V.mul(e[i], wB)
      sumA   = V.add(sumA, eA)
      sumB   = V.add(sumB, eB)
    }
    var npA = V.mul(sumA, 1.0/V.sum(sumA))
    var npB = V.mul(sumB, 1.0/V.sum(sumB))
    return {npA, npB}
  }
  
  maximize (p1) {
    let {npA, npB} = p1
    let dA  = V.sub(npA, pA)
    let dB  = V.sub(npB, pB)
    pA = npA; pB=npB;
    let delta = V.max(dA.concat(dB))
    console.log("pA=%s pB=%s delta=%d", pA, pB, delta.toFixed(4));
    return delta
  }
}

new EM1().run()


/*
var log=console.log;
var R = require("j6");



function EM() {

  var e = [ [5,5], [9,1], [8,2], [4,6], [7,3] ];
  var pA = [0.6,0.4], pB = [0.5,0.5];
  var gen=0, delta=9.9999;
  for (var gen=0; gen<1000 && delta > 0.001; gen++) {
    log("pA=%s pB=%s delta=%d", pA, pB, delta.toFixed(4));
    var sumA=[0,0], sumB=[0,0];
    for (var i in e) {
      var lA = R.xplog(e[i], pA);
      var lB = R.xplog(e[i], pB);
      var a  = lA.exp(), b = lB.exp();
      var wA = a/(a+b), wB=b/(a+b);
      var eA = wA.mul(e[i]);
      var eB = wB.mul(e[i]);
      sumA   = sumA.add(eA);
      sumB   = sumB.add(eB);
    }
    var npA = sumA.mul(1.0/sumA.sum());
    var npB = sumB.mul(1.0/sumB.sum());
    var dA  = npA.sub(pA);
    var dB  = npB.sub(pB);
    var delta = [dA, dB].max();
    pA = npA; pB=npB;
  }
}

EM();
*/