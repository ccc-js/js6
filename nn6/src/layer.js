const L = module.exports = {}
const uu6 = require('../../uu6')
const ma6 = require('../../ma6')
const F = require('./func')
const N = require('./node')
const V = ma6.V

class Layer {
  constructor(x, p = {}) {
    this.x = x
    this.p = uu6.clone(p)
  }

  forward() {
    let {o, x} = this
    V.assign(x.g, 0) // 清除 x 的梯度
    V.assign(o.g, 0) // 清除 o 的梯度
    return o
  }

  backward() {}

  grad(h=0.00001) {
    let {x, o} = this
    let xlen = x.length, olen = o.length
    let gx = V.array(xlen, 0)

    this.forward()
    let vo = uu6.clone(o.v)
    for (let xi=0; xi<xlen; xi++) {
      x.v[xi] += h
      this.forward()
      let gxi = 0
      for (let oi=0; oi<olen; oi++) {
        gxi += (o.v[oi] - vo[oi])
      }
      gx[xi] = gxi
      x.v[xi] -= h
    }
    return V.normalize(gx)
  }

  toString() {
    let {o,x} = this
    return this.constructor.name + ':\n  x:' + x.toString() + '\n  o:' + o.toString()
  }
}

class FLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = new N.TensorVariable(null, x.shape)
  }
  forward() {
    let {o, x} = this, {f} = this.p
    let len = x.length
    for (let i=0; i<len; i++) {
      o.v[i] = f(x.v[i])
    }
    return super.forward()
  }

  backward() {
    let {o, x} = this, {gf} = this.p
    let len = x.length
    for (let i=0; i<len; i++) {
      x.g[i] += o.g[i] * gf(x.v[i], o.v[i])
    }
  }

  adjust(step, moment) {
    let {o,x} = this
    let len = x.length
    for (let i=0; i<len; i++) {
      x.v[i] += step * x.g[i]
      x.g[i] = 0 // 調過後就設為 0，這樣才不會重複調整 ...
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
    let wshape = uu6.clone(x.shape)
    wshape.unshift(p.n)  // shape = [o.length, x.length]
    // wshape.push(p.n)
    this.w = new N.TensorVariable(null, wshape)
    this.o = new N.TensorVariable(null, [p.n])
    this.bias = new N.TensorVariable(null, [p.n])
    if (p.cw) V.assign(this.w.v, p.cw); else V.random(this.w.v, -1, 1)
    if (p.cbias) V.assign(this.bias.v, p.cbias); else V.random(this.bias.v, -1, 1)
  }

  forward() {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let oi=0; oi<olen; oi++) {
      let sum = 0
      for (let xi=0; xi<xlen; xi++) {
        sum += x.v[xi] * w.v[oi*xlen+xi]
      }
      sum += -1 * bias.v[oi]
      o.v[oi] = sum
    }
    V.assign(w.g, 0)       // 清除 w 的梯度
    V.assign(bias.g, 0)    // 清除 bias 的梯度
    return super.forward() // 清除 x, o 的梯度
  }

  backward() {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let oi=0; oi<olen; oi++) { 
      for (let xi=0; xi<xlen; xi++) {
        w.g[oi*xlen+xi] += x.v[xi] * o.g[oi]
        x.g[xi] += w.v[oi*xlen+xi] * o.g[oi]
      }
      bias.g[oi] += -1 * o.g[oi]
    }
  }

  adjust(step, moment) {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let xi=0; xi<xlen; xi++) {
      x.v[xi] += step * x.g[xi]
      x.g[xi] = 0
    }
    for (let oi=0; oi<olen; oi++) {
      for (let xi=0; xi<xlen; xi++) {
        w.v[oi*xlen+xi] += step * w.g[oi*xlen+xi]
        w.g[oi*xlen+xi] = 0
      }
      bias.v[oi] += step * bias.g[oi]
      bias.g[oi] = 0
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
    this.fcLayer = new FullyConnectLayer(x, p)
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

  adjust(step, moment) {
    this.fcLayer.adjust(step, moment)
    this.sigLayer.adjust(step, moment)
  }
}

class InputLayer extends Layer {
  constructor(shape) {
    super()
    this.x = new N.TensorVariable(null, shape)
    this.o = this.x
  }
  setInput(input) {
    V.assign(this.x.v, input)
  }
  forward() { // 輸出 o = 輸入 x
    return super.forward()
  }
  backward() {} // 輸入層不用反傳遞
  adjust(step, moment) {} // 輸入層不用調梯度
}

class RegressionLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = new N.TensorVariable(null, [1])
  }

  setOutput(y) {
    this.y = y
  }

  forward() {
    super.forward() // 清除梯度 g
    let {o, x, y} = this
    let len = x.length, loss = 0.0
    for (let i=0; i<len; i++) {
      let d = x.v[i] - y[i]   // y 是正確輸出值 (正確答案)，d[i] 是第 i 個輸出的差異
      x.g[i] = d              // 梯度就是網路輸出 x 與答案 y 之間的差異
      loss += 0.5 * d * d     // 誤差採用最小平方法 1/2 (x-y)^2，這樣得到的梯度才會是 (xi-yi)
    }
    this.loss = o.v[0] = loss // 錯誤的數量 loss 就是想要最小化的能量函數 => loss = 1/2 (x-y)^2
                              // 整體的能量函數應該是所有 loss 的加總，也就是 sum(loss(x, y)) for all (x,y)
    this.predict = x.v
    return loss
  }
  backward() {} // 輸出層的反傳遞已經在正傳遞時順便計算掉了！

  adjust(step, moment) {} // 輸出層不用調梯度

  toString() {
    let {y} = this
    return super.toString() + '\n  y:' + uu6.json(y)
  }
}

// 說明: 這個和 RegressionLayer 一樣，是輸出層，只要輸出 loss
// softmax 的梯度參考 https://math.stackexchange.com/questions/945871/derivative-of-softmax-loss-function
// 中文請參考: https://zhuanlan.zhihu.com/p/25723112
class SoftmaxLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.o = new N.TensorVariable(null, [1])
  }

  setOutput(y) { // y 是正確的那個輸出
    this.y = y
  }

  forward() {
    let {o, x, y} = this
    let len = x.length, e = new Array(len)
    let max = F.max(x.v), sum = 0
    let iMax = 0
    for (let i=0; i<len; i++) {
      e[i] = Math.exp(x.v[i]-max)
      if (e[i] > e[iMax]) iMax = i
      sum += e[i]
    }
    for (let i=0; i<len; i++) {
      e[i] = e[i] / sum
    }
    this.e = e
    this.predict = iMax
    this.loss = o.v[0] = -Math.log(e[y]) // 這個對嗎？是否應該用 -Math.log(o.v[y])
    return super.forward()
  }

  backward() {
    let {o, x, y, e} = this
    let len = x.length
    for (let i=0; i<len; i++) {
      let indicator = i === y ? 1.0 : 0.0
      x.g[i] = e[i] - indicator
    }
  }

  adjust(step, moment) {
    let {o, x} = this
    let len = x.length
    for (let i=0; i<len; i++) {
      x.v[i] += step * x.g[i]
      x.g[i] = 0
    }
  }
}

Object.assign(L, {
  Layer, FLayer, SigmoidLayer, TanhLayer, ReluLayer, FullyConnectLayer, PerceptronLayer,
  InputLayer, RegressionLayer, SoftmaxLayer // PoolLayer, DropoutLayer, ConvLayer
})


// ====================== 以下尚未完成，尚未測試 ==========================
/*
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

    return o
  }

}

  ConvLayer.prototype = {
    forward: function(V, is_training) {
      // optimized code by @mdda that achieves 2x speedup over previous version

      this.in_act = V;
      var A = new Vol(this.out_sx |0, this.out_sy |0, this.out_depth |0, 0.0);
      
      var V_sx = V.sx |0;
      var V_sy = V.sy |0;
      var xy_stride = this.stride |0;

      for(var d=0;d<this.out_depth;d++) {
        var f = this.filters[d];
        var x = -this.pad |0;
        var y = -this.pad |0;
        for(var ay=0; ay<this.out_sy; y+=xy_stride,ay++) {  // xy_stride
          x = -this.pad |0;
          for(var ax=0; ax<this.out_sx; x+=xy_stride,ax++) {  // xy_stride

            // convolve centered at this particular location
            var a = 0.0;
            for(var fy=0;fy<f.sy;fy++) {
              var oy = y+fy; // coordinates in the original input array coordinates
              for(var fx=0;fx<f.sx;fx++) {
                var ox = x+fx;
                if(oy>=0 && oy<V_sy && ox>=0 && ox<V_sx) {
                  for(var fd=0;fd<f.depth;fd++) {
                    // avoid function call overhead (x2) for efficiency, compromise modularity :(
                    a += f.w[((f.sx * fy)+fx)*f.depth+fd] * V.w[((V_sx * oy)+ox)*V.depth+fd];
                  }
                }
              }
            }
            a += this.biases.w[d];
            A.set(ax, ay, d, a);
          }
        }
      }
      this.out_act = A;
      return this.out_act;
    },
    backward: function() {

      var V = this.in_act;
      V.dw = global.zeros(V.w.length); // zero out gradient wrt bottom data, we're about to fill it

      var V_sx = V.sx |0;
      var V_sy = V.sy |0;
      var xy_stride = this.stride |0;

      for(var d=0;d<this.out_depth;d++) {
        var f = this.filters[d];
        var x = -this.pad |0;
        var y = -this.pad |0;
        for(var ay=0; ay<this.out_sy; y+=xy_stride,ay++) {  // xy_stride
          x = -this.pad |0;
          for(var ax=0; ax<this.out_sx; x+=xy_stride,ax++) {  // xy_stride

            // convolve centered at this particular location
            var chain_grad = this.out_act.get_grad(ax,ay,d); // gradient from above, from chain rule
            for(var fy=0;fy<f.sy;fy++) {
              var oy = y+fy; // coordinates in the original input array coordinates
              for(var fx=0;fx<f.sx;fx++) {
                var ox = x+fx;
                if(oy>=0 && oy<V_sy && ox>=0 && ox<V_sx) {
                  for(var fd=0;fd<f.depth;fd++) {
                    // avoid function call overhead (x2) for efficiency, compromise modularity :(
                    var ix1 = ((V_sx * oy)+ox)*V.depth+fd;
                    var ix2 = ((f.sx * fy)+fx)*f.depth+fd;
                    f.dw[ix2] += V.w[ix1]*chain_grad;
                    V.dw[ix1] += f.w[ix2]*chain_grad;
                  }
                }
              }
            }
            this.biases.dw[d] += chain_grad;
          }
        }
      }
    },

  forward() {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let oi=0; oi<olen; oi++) {
      let sum = 0
      for (let xi=0; xi<xlen; xi++) {
        sum += x.v[xi] * w.v[oi*xlen+xi]
        w.g[oi*xlen+xi] = 0 // 清除 w 的梯度
        x.g[xi] = 0 // 清除 x 的梯度
      }
      sum += -1 * bias.v[oi]
      bias.g[oi] = 0 // 清除 bias 的梯度
      o.v[oi] = sum
    }
    return super.forward()
  }

  backward() {
    let {o, x, w, bias} = this
    let xlen = x.length, olen = o.length
    for (let oi=0; oi<olen; oi++) {
      let goi = o.g[oi]
      for (let xi=0; xi<xlen; xi++) { 
        w.g[oi*xlen+xi] += x.v[xi] * goi
        x.g[xi] += w.v[oi*xlen+xi] * goi
      }
      bias.g[oi] += -1 * goi
    }
  }
*/
