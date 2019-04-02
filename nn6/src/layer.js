const L = module.exports = {}
const F = require('./func')
const N = require('./node')
const uu6 = require('../../uu6')

class Layer {
  constructor(x, p = {}) {
    this.x = x
    this.p = uu6.clone(p)
  }
  forward() {
    let {o,x} = this
    o.g = x.g = 0
    return o
  }
  backward() {}
  toString() {
    let {o,x} = this
    return this.constructor.name + ':\n  x:' + x.toString() + '\n  o:' + o.toString()
  }
}

class FLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = N.tensorVariable(null, x.v.shape)
  }
  forward() {
    let {o, x} = this, {f} = this.p
    let vx = x.v, vo=o.v, len = vx.length
    for (let i=0; i<len; i++) {
      vo.v[i] = f(vx.v[i])
    }
    return super.forward()
  }

  backward() {
    let {o,x} = this, {gf} = this.p
    let vx = x.v, vo=o.v, gx=x.g, go=o.g, len = vx.length
    for (let i=0; i<len; i++) {
      gx.v[i] += go.v[i] * gf(vx.v[i], vo.v[i])
    }
  }

  adjust(step, moment) {
    let {o,x} = this
    let vx = x.v, vo=o.v, gx=x.g, go=o.g, len = vx.length
    for (let i=0; i<len; i++) {
      vx.v[i] += step * gx.v[i]
      gx.v[i] = 0 // 調過後就設為 0，這樣才不會重複調整 ...
    }
  }
}

class SigmoidLayer extends FLayer {
  constructor(x) { super(x, {f:(vx)=>F.sigmoid(vx), gf:(vx,vo)=>F.dsigmoid(vo) }) }
}

class TanhLayer extends FLayer {
  constructor(x) { super(x, {f:(vx)=>F.tanh(vx), gf:(vx,vo)=>F.dtanh(vo) }) }
}

class ReluLayer extends FLayer {
  constructor(x, leaky) {
    super(x, {f:(vx,l=leaky)=>F.relu(vx,l) , gf: (vx,vo,l=leaky)=>F.drelu(vo,l)})
  }
}

// 參考 -- https://www.oreilly.com/library/view/tensorflow-for-deep/9781491980446/ch04.html
class FullyConnectLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    uu6.be(x)
    let wshape = uu6.clone(x.v.shape)
    wshape.push(p.n)
    // console.log('wshape=', wshape)
    this.w = N.tensorVariable(null, wshape)
    this.o = N.tensorVariable(null, [p.n])
    this.bias = N.tensorVariable(null, [p.n])
    this.w.v = 0.2
    this.bias.v = 0.1
  }
  forward() {
    let {o, x, w, bias} = this
    let vx = x.v, vo =o.v, vw = w.v, vbias = bias.v
    let xlen = vx.length, olen = vo.length
    for (let oi=0; oi<olen; oi++) {
      let sum = 0
      for (let xi=0; xi<xlen; xi++) {
        sum += vx.v[xi] * vw.v[oi*xlen+xi]
      }
      sum += -1 * vbias.v[oi]
      vo.v[oi] = sum
    }
    return super.forward()
  }

  backward() {
    let {o, x, w, bias} = this
    let vx=x.v, vo=o.v, vw=w.v, gw=w.g, gx=x.g, go=o.g, gbias=bias.g
    let xlen = vx.length, olen = vo.length
    for (let oi=0; oi<olen; oi++) {
      let goi = go.v[oi]
      for (let xi=0; xi<xlen; xi++) { 
        gw.v[oi*xlen+xi] += vx.v[xi] * goi
        gx.v[xi] += vw.v[oi*xlen+xi] * goi
      }
      gbias.v[oi] += -1 * goi
    }
  }

  adjust(step, moment) {
    let {o, x, w, bias} = this
    let vx=x.v, vo=o.v, vw=w.v, gw=w.g, gx=x.g, go=o.g, gbias=bias.g
    let xlen = vx.length, olen = vo.length
    for (let xi=0; xi<xlen; xi++) {
      vx.v[xi] += step * gx.v[xi]
      gx.v[xi] = 0
    }
    for (let oi=0; oi<olen; oi++) {
      for (let xi=0; xi<xlen; xi++) {
        vw.v[oi*xlen+xi] += step * gw.v[oi*xlen+xi]
        gw.v[oi*xlen+xi] = 0
      }
      vbias.v[oi] += step * gbias.v[oi]
      gbias.v[oi] = 0
    }
  }

  toString() {
    let {w, bias} = this
    return super.toString() + '\n  w:'+w.toString()+'\n  bias:'+bias.toString()
  }
}

class PerceptronLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.fcLayer = new FullyConnectLayer(x, {n:p.n})
    this.sigLayer = new SigmoidLayer(this.fcLayer.o)
    this.o = this.sigLayer.o
  }
  forward() {
    this.fcLayer.forward()
    this.sigLayer.forward()
    return super.forward()
  }
  backward() {
    this.sigLayer.backward()
    this.fcLayer.backward()
  }
}

class RegressionLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = N.tensorVariable(null, [1])
  }

  setOutput(y) {
    this.y = y
  }

  forward() {
    super.forward() // 清除梯度 g
    let {o, x, y} = this
    let vx = x.v, gx = x.g, vo = o.v, go = o.g
    let len = vx.length, loss = 0.0
    for (let i=0; i<len; i++) {
      let d = vx.v[i] - y[i]   // y 是正確輸出值 (正確答案)，d[i] 是第 i 個輸出的差異
      gx.v[i] = d              // 梯度就是網路輸出 x 與答案 y 之間的差異
      loss += 0.5 * d * d      // 誤差採用最小平方法 1/2 (x-y)^2，這樣得到的梯度才會是 (xi-yi)
    }
    vo.v[0] = loss             // 錯誤的數量 loss 就是想要最小化的能量函數 => loss = 1/2 (x-y)^2
                               // 整體的能量函數應該是所有 loss 的加總，也就是 sum(loss(x, y)) for all (x,y)
    return o
  }
  backward() {} // 輸出層的反傳遞已經在正傳遞時順便計算掉了！

  toString() {
    let {y} = this
    return super.toString() + '\n  y:' + uu6.json(y)
  }
}

class InputLayer extends Layer {
  constructor(shape) {
    super()
    this.x = N.tensorVariable(null, shape)
    this.o = this.x
  }
  setInput(inputs) {
    this.x.v.assign(inputs)
    /*
    let {o, x} = this
    let vx = x.v, gx = x.g, vo = o.v, go = o.g
    let len = x.length
    for (let i=0; i<len; i++) {
      vx.v[i] = inputs[i]
    }
    */
  }
  forward() { // 輸出 o = 輸入 x
    return super.forward()
  }
  backward() {}
}

// ====================== 以下尚未完成，尚未測試 ==========================

class DropoutLayer extends Layer {
  constructor(x, pDrop) {
    super(x)
    this.dropped = new Array(x.length)
    this.pDrop = pDrop
  }
  forward() {
    let {o, x} = this
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
    return super.forward()
  }
  backward() {
    let len = x.len, dropped = this.dropped
    for(var i=0; i<len; i++) { // 反向傳遞: 單純將梯度傳回去。(copy over the gradient)
      if(!dropped[i]) x.g[i] = o.g[i]
    }
  }
}

class SoftmaxLayer extends Layer {
  constructor(x) { super(x) }

  forward() {
    let {o, x} = this
    let len = x.length, e = new Array(len)
    let max = F.max(x.v), sum = 0
    for (let i=0; i<len; i++) {
      e[i] = Math.exp(x.v[i]-max)
      sum += e[i]
    }
    for (let i=0; i<x.length; i++) {
      o.v[i] = e[i] / sum
    }
    return super.forward() 
  }

  backward(y) { // y 是正確的那個輸出
    let len = x.length
    for (let i=0; i<len; i++) {
      x.g[i] += o.v[i] * (1-o.v[i]) * o.g[i] // // Softmax 的梯度計算是 x.g = o.v * (1 - o.v) * o.g
    }
    return -Math.log(o.v[y]);
  }
}

class PoolLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    let {sx, sy, stride, pad} = p
    let xw = x.shape[0], xh=x.shape[1], xd = x.shape[2]
    let ow = Math.floor((xw + pad * 2 - sx) / stride + 1)
    let oh = Math.floor((xh + pad * 2 - sy) / stride + 1)
    let od = xd
    this.o = new ma6.tensor(null, [ow, oh, od])
  }
  forward() {
    let {o, x} = this
    let xw = x.shape[0], xh=x.shape[1], xd = x.shape[2]
    for (let d = 0; d < od; d++) {

    }
    return super.forward()
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
    return o
  }

}

Object.assign(L, {
  Layer, FLayer, SigmoidLayer, TanhLayer, ReluLayer, FullyConnectLayer, PerceptronLayer,
  InputLayer, PoolLayer, DropoutLayer, RegressionLayer, SoftmaxLayer
})