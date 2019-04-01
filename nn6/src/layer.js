const L = module.exports = {}
const F = require('./func')
const N = require('./node')
const uu6 = require('../../uu6')

class Layer {
  constructor(x, p = {}) {
    this.x = x
    this.p = uu6.clone(p)
  }
  toString() {
    return uu6.json({x:this.x, o:this.o})
  }
}

class FLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = N.tensorVariable(x.v.shape)
  }
  forward() {
    let {o,x} = this, {f} = this.p
    let vx = x.v, vo=o.v, len = vx.length
    console.log("FLayer: vx=", vx.toString())
    for (let i=0; i<len; i++) {
      console.log("  vx.v[i]=", vx.v[i])
      vo.v[i] = f(vx.v[i])
      console.log("  vo.v[i]=", vo.v[i])
    }
    console.log("FLayer: vo=", vo.toString())
    o.g = x.g = 0
  }

  backward() {
    let {o,x} = this, {gf} = this.p
    let vx = x.v, vo=o.v, gx=x.g, go=o.g, len = vx.length
    console.log("FLayer: go=", go.toString())
    for (let i=0; i<len; i++) {
      console.log("  go: v[i]=", go.v[i])
      gx.v[i] += go.v[i] * gf(vx.v[i], vo.v[i])
      console.log("  gx: v[i]=", gx.v[i])
    }
    console.log("FLayer: gx=", gx.toString())
    // o.g = x.g = 0
  }
}

class InputLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    uu6.be(x)
    this.o = this.x // 單純把 x 傳給 o
    // console.log('InputLayer: p=', p, '\nthis.o=', this.o)
  }
  forward() {}  // o = x
  backward() {} // 輸入層不需反向傳遞
}

class FullyConnectLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    uu6.be(x)
    // console.log('Fc:x=', x)
    this.w = N.tensorVariable(x.v.shape)
    this.o = N.tensorVariable([p.n])
    this.bias = N.tensorVariable([p.n])
  }
  forward() {
    let vx = this.x.v, vo =this.o.v, vw = this.w.v, vbias = this.bias.v
    // console.log('FullyConnectLayer.forward: vx=', vx, 'vo=', vo)
    let len = vx.length, olen = vo.length
    for (let oi=0; oi<olen; oi++) {
      let sum = 0
      for (let i=0; i<len; i++) {
        sum += vx.v[i] * vw.v[i]
      }
      sum += -1 * vbias.v[oi]
      vo.v[oi] = sum
    }
  }

  backward() {
    let vx = this.x.v, vo =this.o.v, vw = this.w.v, gw = this.w.g, gx = this.x.g, go = this.o.g, gbias = this.bias.g
    let len = vx.length, olen = vo.length
    for (let oi=0; oi<olen; oi++) {
      let goi = go.v[oi]
      for (let i=0; i<len; i++) { 
        gw.v[i] += vx.v[i] * goi
        gx.v[i] += vw.v[i] * goi
      }
      gbias.v[oi] += -1 * goi
    }
    console.log("  fcLayer: backward()\n  gw=", gw.toString(), "\n  gbias=", gbias.toString(), "\n  gx=", gx.toString())
  }
}

class SigmoidLayer extends FLayer {
  constructor(x) { super(x, {f:F.sigmoid, gf:F.dsigmoid}) }
}

class PerceptronLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.fcLayer = new FullyConnectLayer(x, {n:p.n})
    this.sigLayer = new SigmoidLayer(this.fcLayer.o)
    this.o = this.sigLayer.o
  }
  forward() {
    console.log('fcLayer.x=', this.fcLayer.x.toString())
    console.log('fcLayer.w=', this.fcLayer.w.toString())
    console.log('fcLayer.bias=', this.fcLayer.bias.toString())
    this.fcLayer.forward()
    console.log('fcLayer.o=', this.fcLayer.o.toString())
    console.log('sigLayer.x=', this.sigLayer.x.toString())
    this.sigLayer.forward()
    console.log('sigLayer.o=', this.sigLayer.o.toString())
  }
  backward() {
    this.sigLayer.backward()
    this.fcLayer.backward()
  }
}

class TanhLayer extends FLayer {
  constructor(x) { super(x, {f:F.tanh, gf:F.dtanh}) }
}

class ReluLayer extends FLayer {
  constructor(x) { super(x, {f:F.relu, gf: F.drelu}) }
}

class SoftmaxLayer extends Layer {
  constructor(x) { super(x) }

  forward() {
    let len = x.length, e = new Array(len)
    let max = F.max(x.v), sum = 0
    for (let i=0; i<len; i++) {
      e[i] = Math.exp(x.v[i]-max)
      sum += e[i]
    }
    for (let i=0; i<x.length; i++) {
      o.v[i] = e[i] / sum
    }
  }

  backward(y) { // y 是正確的那個輸出
    let len = x.length
    for (let i=0; i<len; i++) {
      x.g[i] += o.v[i] * (1-o.v[i]) * o.g[i] // // Softmax 的梯度計算是 x.g = o.v * (1 - o.v) * o.g
    }
    return -Math.log(o.v[y]);
  }
}

class RegressionLayer extends Layer {
  forward() {} // 這層是輸出層，不用再向前傳遞了
  backward(y) { // y 是正確輸出值
    let len = x.length, loss = 0.0
    for(var i=0; i<len; i++) {
      var d = x.v[i] - y[i] // 計算網路輸出 x.v[i] 與正確輸出 y[i] 之間的誤差
      x.g[i] = d
      loss += 0.5 * d * d
    }
    return loss
  }
}

class DropoutLayer extends Layer {
  constructor(x, pDrop) {
    super(x)
    this.dropped = new Array(x.length)
    this.pDrop = pDrop
  }
  forward() {
    let N = x.length, dropped = this.dropped, pDrop = this.pDrop
    if(is_training) { // 在訓練階段，隨機的掐掉一些權重。
      // do dropout
      for(var i=0;i<N;i++) {
        if(Math.random() < pDrop) { o.v[i]=0; dropped[i] = true } // drop!  這個節點已經被掐掉了 ..
        else { dropped[i] = false }
      }
    } else { // 在使用階段，將權重 * drop_prob 以得到正規化後的結果。
      // scale the activations during prediction
      for(var i=0;i<N;i++) { o.v[i] *= this.pDrop }
    }
  }
  backward() {
    let len = x.len, dropped = this.dropped
    for(var i=0; i<len; i++) { // 反向傳遞: 單純將梯度傳回去。(copy over the gradient)
      if(!dropped[i]) x.g[i] = o.g[i]
    }
  }
}

class PoolLayer extends Layer {
  constructor(x, sx, sy, stride, pad) {
    super(null, x, null, null)
    let xw = x.shape[0], xh=x.shape[1], xd = x.shape[2]
    let ow = Math.floor((xw + pad * 2 - sx) / stride + 1)
    let oh = Math.floor((xh + pad * 2 - sy) / stride + 1)
    let od = xd
    let o = new ma6.tensor(null, [ow, oh, od])
  }
  forward() {
    let xw = x.shape[0], xh=x.shape[1], xd = x.shape[2]
    for (let d = 0; d < od; d++) {

    }
/*
  this.in_act = V;

  var A = new Vol(this.out_sx, this.out_sy, this.out_depth, 0.0); // PoolLayer 的輸出張量
  
  var n=0; // a counter for switches
  for(var d=0;d<this.out_depth;d++) {
    var x = -this.pad; // x 軸超出部分
    var y = -this.pad; // y 軸超出部分
    for(var ax=0; ax<this.out_sx; x+=this.stride,ax++) {
      y = -this.pad; // y 軸超出部分
      for(var ay=0; ay<this.out_sy; y+=this.stride,ay++) {
        // 接下來尋找 (stride*stride) 區塊的最大值。
        // convolve centered at this particular location
        var a = -99999; // hopefully small enough ;\
        var winx=-1,winy=-1;
        for(var fx=0;fx<this.sx;fx++) {
          for(var fy=0;fy<this.sy;fy++) {
            var oy = y+fy;
            var ox = x+fx;
            if(oy>=0 && oy<V.sy && ox>=0 && ox<V.sx) {
              var v = V.get(ox, oy, d);
              // perform max pooling and store pointers to where
              // the max came from. This will speed up backprop 
              // and can help make nice visualizations in future
              if(v > a) { a = v; winx=ox; winy=oy;} // 取得最大值
            }
          }
        }
        // switch(x,y) 紀錄該 MaxPool 區塊的最大值位置，之後計算反傳遞梯度時會需要
        this.switchx[n] = winx;
        this.switchy[n] = winy;
        n++;
        A.set(ax, ay, d, a); // 設定 MaxPool 縮小後的輸出值
      }
    }
  }
  this.out_act = A;
  return this.out_act;
}
*/
  }
}

Object.assign(L, {
  Layer, FLayer, SigmoidLayer, TanhLayer, ReluLayer, FullyConnectLayer, PerceptronLayer,
  InputLayer, PoolLayer, DropoutLayer, RegressionLayer, SoftmaxLayer
})


/*

Layer2, 
class Layer2 extends G.Gate2 {
  constructor(o, x, y, f, gf) {
    super()
    this.p = {o:o, x:x, y:y, f:f, gf:gf}
  }

  forward() {
    let {o, x, y, f} = this.p
    o.v = f(x.v, y.v)
    o.g = x.g = 0
  }

  backward() {
    let {o, x, gf} = this.p
    gf(o, x, y)
  }
}
*/
