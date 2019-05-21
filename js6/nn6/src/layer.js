const L = module.exports = {}
const uu6 = require('../../uu6')
const ma6 = require('../../ma6')
const F = require('./func')
const N = require('./node')
const G = require('./gate')
const V = ma6.V

class Layer {
  constructor(x, p = {}) {
    this.x = x
    this.p = uu6.clone(p)
    console.log('p=', p, 'this.p=', this.p)
  }

  setOutput(y) { this.y = y }

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
      let xvi = x.v[xi]
      x.v[xi] += h  // 小幅調整 x.v[xi] 的值
      this.forward()
      let gxi = 0   // 計算所造成的輸出影響總和
      for (let oi=0; oi<olen; oi++) {
        gxi += (o.v[oi] - vo[oi])
      }
      gx[xi] = gxi  // 這就是 xi 軸的梯度 g_o^x[i]，簡寫為 gxi
      x.v[xi] = xvi // 還原 x.v[xi] 的值
    }
    // console.log('grad(): gx=', gx)
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

class FcActLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    this.fcLayer = new FullyConnectLayer(x, p)
    this.actLayer = new p.ActLayer(this.fcLayer.o)
    this.o = this.actLayer.o
  }
  forward() {
    this.fcLayer.forward()
    this.actLayer.forward()
    return super.forward()
  }
  backward() {
    this.actLayer.backward()
    this.fcLayer.backward()
  }

  adjust(step, moment) {
    this.fcLayer.adjust(step, moment)
    this.actLayer.adjust(step, moment)
  }
}

class PerceptronLayer extends FcActLayer {
  constructor(x, p) {
    super(x, Object.assign(p, {ActLayer: SigmoidLayer}))
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

class DropoutLayer extends Layer {
  constructor(x, p) {
    super(x)
    this.dropped = new Array(x.length)
    this.dropProb = p.dropProb || 0.5 // 預設 drop 掉一半
    this.isTraining = p.isTraining || false
    this.o = new N.TensorVariable(null, this.x.shape)
  }
  forward() {
    let {o, x, dropped, dropProb, isTraining } = this
    let len = x.length
    if(isTraining) { // 在訓練階段，隨機的掐掉一些節點 (do dropout) ，以提升容錯力！(在某些節點死掉時，網路還是穩定的！)
      for(var i=0;i<len;i++) {
        if(Math.random() < dropProb) { o.v[i]=0; dropped[i] = true } // drop! 這個節點已經被掐掉了 ..
        else { dropped[i] = false, o.v[i] = x.v[i] } // 需注意的是，每次 forward 都重設，所以每次被掐掉的節點都不一樣，這會讓訓練花更久的時間！
      }
    } else { // 使用階段是全員啟動的，所以將權重 * drop_prob 才會得到和訓練階段期望值一致的結果。// scale the activations during prediction
      for(var i=0;i<len;i++) { o.v[i] = this.dropProb * x.v[i] }
    }
    return super.forward()
  }
  backward() {
    let {x, o, dropped} = this
    let len = x.length
    for (let i=0; i<len; i++) { // 反向傳遞: 單純將沒 dropped 掉的梯度傳回去。(copy over the gradient)
      if(!dropped[i]) x.g[i] = o.g[i]
    }
  }
}

class PoolLayer extends Layer {
  constructor(x, p) {
    super(x, p)
    let i = x // i: input = x
    let {fw, fh, stride, pad} = p // fw, fh: 池化遮罩 (filter) 大小, stride: 步伐大小, pad: 超出寬度
    let [id, iw, ih] = x.shape
    let od = id
    let ow = Math.floor((iw + pad * 2 - fw) / stride + 1)
    let oh = Math.floor((ih + pad * 2 - fh) / stride + 1)
    let o = new N.TensorVariable(null, [od, ow, oh])
    let switchx = V.array(od*ow*oh) // store switches for x,y coordinates for where the max comes from, for each output neuron
    let switchy = V.array(od*ow*oh) // d 個池的最大點座標
    // console.log('p=', {o, fw, fh, switchx, switchy, stride, pad, id, iw, ih, od, ow, oh})
    Object.assign(this, {o, i, fw, fh, switchx, switchy, stride, pad, id, iw, ih, od, ow, oh})
  }

  forward() {
    let {o, x, id, iw, ih, fw, fh, switchx, switchy, stride, pad, od, ow, oh} = this
    for (let d = 0; d < od; d++) {
      let ix = -pad // ix = 目前區塊的右上角 x
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad // iy = 目前區塊的右上角 y
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          // 接下來尋找 (fw*fh) 區塊的最大值。 convolve at this particular location
          let max = -Number.MAX_VALUE
          let winx=-1, winy=-1
          for(let fx=0; fx<fw; fx++) {
            for(let fy=0; fy<fh; fy++) {
              let mx = ix+fx, my = iy+fy // (mx, my) 遮罩目前遮蔽的點位置 maskX, maskY
              if(mx>=0 && mx<iw && my>=0 && my<ih) {
                let v = x.v[(d*iw+mx)*ih+my]
                // perform max pooling and store pointers to where the max came from. 
                // This will speed up backprop and can help make nice visualizations in future
                if(v > max) { max = v; winx=mx; winy=my; } // 取得最大值
              }
            }
          }
          let oi = (d*ow + ox)*oh+oy
          // switch(x,y) 紀錄該 MaxPool 區塊的最大值位置，之後計算反傳遞梯度時會需要
          switchx[oi] = winx
          switchy[oi] = winy
          o.v[oi] = max
        }
      }
    }
    return super.forward()
  }

  backward() {
    let {o, x, id, iw, ih, fw, fh, switchx, switchy, stride, pad, od, ow, oh} = this
    for(let d=0; d<od; d++) {
      let ix = -pad
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          let oi = (d*ow + ox)*oh+oy
          let swx = switchx[oi], swy = switchy[oi]
          let grad = o.g[oi]
          // 如果只有一個最大值，那麼以下這行確實能反映輸入點的梯度，但是如果有很多相同的最大值，那麼這行只會修改一個！
          // 所以應該要讓每個輸入的值都不同，才能確保這個結果和數值方法計算的梯度一樣！
          x.g[(d*iw+swx)*ih+swy] += grad
        }
      }
    }
  }
}

class ConvLayer extends Layer {
  // https://zhuanlan.zhihu.com/p/29534841
  // 目前沒有使用：权重衰减（weight decay）：对于目标函数加入正则化项，限制权重参数的个数，这是一种防止过拟合的方法，这个方法其实就是机器学习中的l2正则化方法，只不过在神经网络中旧瓶装新酒改名为weight decay [3]。
  constructor(x, p) { 
    super(x, p)
    // console.log('ConvLayer')
    let i = x // i: input = x
    let {od, fw, fh, stride, pad } = p // fw, fh: 池化遮罩 (filter) 大小, stride: 步伐大小, pad: 超出寬度
    let [id, iw, ih] = x.shape
    let ow = Math.floor((iw + pad * 2 - fw) / stride + 1)
    let oh = Math.floor((ih + pad * 2 - fh) / stride + 1)
    let o = new N.TensorVariable(null, [od, ow, oh])
    // console.log('o=', o)
    let fd = id
    let filters = []
    for(let oi=0; oi<od; oi++) {
      filters.push(new N.TensorVariable(null, [fd, fw, fh]))
      if (p.cw) V.assign(filters[oi].v, p.cw); else V.random(filters[oi].v, -1, 1)
    }
    // console.log('filters=', filters.toString())
    let bias = new N.TensorVariable(null, [1, 1, od])
    if (p.cbias) V.assign(bias.v, p.cbias); else V.random(bias.v, -1, 1)
    // console.log('bias=', bias.toString())
    Object.assign(this, { o, i, id, iw, ih, od, ow, oh, fd, fw, fh, stride, pad, bias, filters })
  }

  forward() {
    let {o, i, id, iw, ih, fd, fw, fh, stride, pad, od, ow, oh, filters, bias} = this
    for (let d = 0; d < od; d++) {
      let f = filters[d]
      let ix = -pad // ix = 目前區塊的右上角 x
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad // iy = 目前區塊的右上角 y
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          let a = 0.0
          for (let fz=0; fz<fd; fz++) {
            for(let fx=0; fx<fw; fx++) {
              let mx = ix + fx
              for(let fy=0; fy<fh; fy++) {
                let my = iy + fy
                if (mx >= 0 && mx < iw && my >=0 && my < ih) {
                    a += f.v[((fz*fw)+fx)*fh+fy] * i.v[((fz*iw)+mx)*ih+my]
                }
              }
            }
          }
          a += bias.v[d]
          o.v[((d*ow)+ox)*oh+oy] = a
        }
      }
    }
    // console.log('forward(): i=', i)
    // console.log('forward(): o=', o)
    return super.forward()
  }

  backward() {
    let {o, i, id, iw, ih, fd, fw, fh, stride, pad, od, ow, oh, filters, bias} = this
    for(let d=0; d<od; d++) {
      let f = filters[d]
      let ix = -pad
      for(let ox=0; ox<ow; ix+=stride, ox++) {
        let iy = -pad
        for(let oy=0; oy<oh; iy+=stride, oy++) {
          let oGrad = o.g[(d*ow+ox)*oh+oy] // 取得輸出 o 的梯度
          for (let fz=0; fz<fd; fz++) {
            for (let fx=0; fx < fw; fx++) {
              let mx = ix+fx
              for (let fy=0; fy < fh; fy++) {
                let my = iy+fy
                if (mx>=0 && mx<iw && my>=0 && my<ih) { // 反饋到每一個輸入與遮罩
                  let ii = ((fz*iw)+mx)*ih+my
                  let fi = ((fz*fw)+fx)*fh+fy
                  f.g[fi] += i.v[ii] * oGrad
                  i.g[ii] += f.v[fi] * oGrad
                }
              }
            }
          }
          bias.g[d] += oGrad
        }
      }
      // console.log('backward:f=', f)
    }
    // console.log('backward:i=', i)
    // console.log('backward:x=', this.x)
    // console.log('backward:bias=', bias)
  }
}

Object.assign(L, {
  Layer, FLayer, SigmoidLayer, TanhLayer, ReluLayer, 
  FullyConnectLayer, FcActLayer, PerceptronLayer,
  InputLayer, RegressionLayer, SoftmaxLayer, PoolLayer, DropoutLayer, ConvLayer
})
