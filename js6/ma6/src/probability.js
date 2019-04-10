const uu6 = require('../../uu6')
const V = require('./vector')
const P = module.exports = require('./probFunction')
let {exp, log, pow, sqrt, PI, tan, atan, min } = Math

class Distribution {
  pdf(arg) {}
  cdf(arg) {}
  inv(arg) { let {p} = arg; uu6.be(p>=0 && p<=1) }
  mean(arg) {}
  medium(arg) { return this.mean(arg) }
  mode(arg) { return this.median(arg) } // 密度最大的點 -- https://en.wikipedia.org/wiki/Mode_(statistics)
  sample(arg) {
    let p = uu6.random(0, 1)
    return this.inv(Object.assign({}, arg, {p}))
  }
  variance(arg) {}
  sd(arg) { return sqrt(this.variance(arg)) }
}

class Uniform extends Distribution {
  pdf(arg) {
    let {x, a, b} = arg
    return (x < a || x > b) ? 0 : 1 / (b - a)
  }
  cdf(arg) {
    let {x, a, b} = arg
    if (x < a) return 0
    else if (x < b) return (x - a) / (b - a)
    return 1
  }
  inv(arg) {
    let {p, a, b} = arg
    return a + (p * (b - a))
  }
  mean(arg) {
    let {a, b} = arg
    return 0.5 * (a + b)
  }
  mode(arg) { throw new Error('Uniform has no mode() !') }
  variance(arg) {
    let {a, b} = arg
    return pow(b - a, 2) / 12;
  }
}

class Exp extends Distribution {
  pdf(arg) {
    let {x, rate} = arg
    return (x<0) ? 0: rate*exp(-rate*x)
  }
  cdf(arg) {
    let {x, rate} = arg
    return (x<0) ? 0: 1-exp(-rate*x)
  }
  inv(arg) {
    let {p, rate} = arg
    return -log(1-p)/rate
  }
  mean(arg) {
    let {rate} = arg
    return 1/rate
  }
  medium(arg) {
    let {rate} = arg
    return (1 / rate) * log(2)
  }
  mode(arg) { return 0 }
  variance(arg) {
    let {rate} = arg
    return 1/(rate*rate)
  }
}

class Normal extends Distribution {
  pdf(arg) {
    let {x, mu, sd} = arg
    let d = x-mu
    return 1/(sqrt(2*PI)*sd) * exp(-(d*d)/(2*sd*sd))
  }
  cdf(arg) {
    let {x, mu, sd} = arg
    return 0.5 * (1 + P.erf((x - mu) / sqrt(2*sd*sd)))
  }
  inv(arg) {
    let {p, mu, sd} = arg
    return -1.41421356237309505 * sd * P.erfcinv(2*p) + mu
  }
  mean(arg) {
    let {mu, sd} = arg
    return mu
  }
  variance(arg) {
    let {mu, sd} = arg
    return sd*sd
  }
}

class Beta extends Distribution {
  pdf(arg) {
    let {x, alpha, beta} = arg
    if (x > 1 || x < 0) return 0 // PDF is zero outside the support
    if (alpha == 1 && beta == 1) return 1 // PDF is one for the uniform case
    if (alpha < 512 && beta < 512) {
      return (pow(x, alpha - 1) * pow(1 - x, beta - 1)) / P.betafn(alpha, beta)
    } else {
      return exp((alpha - 1) * log(x) +
                      (beta - 1) * log(1 - x) -
                      P.betaln(alpha, beta))
    }
  }
  cdf(arg) {
    let {x, alpha, beta} = arg
    return (x > 1 || x < 0) ? (x > 1) * 1 : P.ibeta(x, alpha, beta)
  }
  inv(arg) {
    let {p, alpha, beta} = arg
    return P.ibetainv(p, alpha, beta)
  }
  mean(arg) {
    let {alpha, beta} = arg
    return alpha / (alpha + beta)
  }
  median(arg) {
    let {alpha, beta} = arg
    return P.ibetainv(0.5, alpha, beta)
  }
  mode(arg) {
    let {alpha, beta} = arg
    return (alpha - 1 ) / ( alpha + beta - 2)
  }
  variance(arg) {
    let {alpha, beta} = arg
    return (alpha * beta) / (pow(alpha + beta, 2) * (alpha + beta + 1));
  }
}

class F extends Distribution {
  pdf(arg) {
    let {x, df1, df2} = arg
    var p, q, f;
    if (x < 0) return 0
    if (df1 <= 2) {
      if (x === 0 && df1 < 2) return Infinity
      if (x === 0 && df1 === 2) return 1;
      return (1 / P.betafn(df1 / 2, df2 / 2)) *
              pow(df1 / df2, df1 / 2) *
              pow(x, (df1/2) - 1) *
              pow((1 + (df1 / df2) * x), -(df1 + df2) / 2)
    }
    p = (df1 * x) / (df2 + x * df1)
    q = df2 / (df2 + x * df1)
    f = df1 * q / 2.0
    return f * P.binomial.pdf({k:(df1 - 2) / 2, n:(df1 + df2 - 2) / 2, p})
  }
  cdf(arg) {
    let {x, df1, df2} = arg
    if (x < 0) return 0
    return P.ibeta((df1 * x) / (df1 * x + df2), df1 / 2, df2 / 2)
  }
  inv(arg) {
    let {p, df1, df2} = arg
    return df2 / (df1 * (1 / P.ibetainv(p, df1 / 2, df2 / 2) - 1))
  }
  mean(arg) {
    let {df1, df2} = arg
    return (df2 > 2) ? df2 / (df2 - 2) : undefined
  }
  variance(arg) {
    let {df1, df2} = arg
    if (df2 <= 4) return undefined
    return 2 * df2 * df2 * (df1 + df2 - 2) / (df1 * (df2 - 2) * (df2 - 2) * (df2 - 4))
  }
}

class Cauchy extends Distribution {
  pdf(arg) {
    let {x, local, scale} = arg
    if (scale < 0) return 0
    return (scale / (pow(x - local, 2) + pow(scale, 2))) / PI
  }
  cdf(arg) {
    let {x, local, scale} = arg
    return atan((x - local) / scale) / PI + 0.5
  }
  inv(arg) {
    let {p, local, scale} = arg
    return local + scale * tan(PI * (p - 0.5));
  }
  mean(arg) {
    let {local, scale} = arg
    return local
  }
}

class ChiSquare extends Distribution {
  pdf(arg) {
    let {x, dof} = arg
    if (x < 0) return 0
    return (x === 0 && dof === 2) ? 0.5 :
      exp((dof / 2 - 1) * log(x) - x / 2 - (dof / 2) * log(2) - P.gammaln(dof / 2))
  }
  cdf(arg) {
    let {x, dof} = arg
    if (x < 0) return 0
    return P.lowRegGamma(dof / 2, x / 2)
  }
  inv(arg) {
    let {p, dof} = arg
    return 2 * P.gammapinv(p, 0.5 * dof)
  }
  mean(arg) {
    let {dof} = arg
    return dof
  }
  median(arg) {
    let {dof} = arg
    return dof * pow(1 - (2 / (9 * dof)), 3)
  }
  mode(arg) {
    let {dof} = arg
    return (dof - 2 > 0) ? dof - 2 : 0
  }
  variance(arg) {
    let {dof} = arg
    return 2 * dof
  }
}

class Gamma extends Distribution {
  pdf(arg) {
    let {x, shape, scale} = arg
    if (x < 0) return 0
    return (x === 0 && shape === 1) ? 1 / scale :
          exp((shape - 1) * log(x) - x / scale - P.gammaln(shape) - shape * log(scale));
  }
  cdf(arg) {
    let {x, shape, scale} = arg
    if (x < 0) return 0
    return P.lowRegGamma(shape, x / scale)
  }
  inv(arg) {
    let {p, shape, scale} = arg
    return P.gammapinv(p, shape) * scale
  }
  mean(arg) {
    let {shape, scale} = arg
    return shape * scale
  }
  mode(arg) {
    let {shape, scale} = arg
    if(shape > 1) return (shape - 1) * scale;
    return undefined;
  }
  variance(arg) {
    let {shape, scale} = arg
    return shape * scale * scale
  }
}

class InvGamma extends Distribution {
  pdf(arg) {
    let {x, shape, scale} = arg
    if (x <= 0) return 0
    return exp(-(shape + 1) * log(x) - scale / x - P.gammaln(shape) + shape * log(scale))
  }
  cdf(arg) {
    let {x, shape, scale} = arg
    if (x <= 0) return 0
    return 1 - P.lowRegGamma(shape, scale / x)
  }
  inv(arg) {
    let {p, shape, scale} = arg
    return scale / P.gammapinv(1 - p, shape)
  }
  mean(arg) {
    let {shape, scale} = arg
    return (shape > 1) ? scale / (shape - 1) : undefined
  }
  mode(arg) {
    let {shape, scale} = arg
    return scale / (shape + 1)
  }
  variance(arg) {
    let {shape, scale} = arg
    if (shape <= 2) return undefined
    return scale * scale / ((shape - 1) * (shape - 1) * (shape - 2))
  }
}

class T extends Distribution {
  pdf(arg) {
    let {x, dof} = arg
    dof = dof > 1e100 ? 1e100 : dof
    return (1/(sqrt(dof) * P.betafn(0.5, dof/2))) * pow(1 + ((x * x) / dof), -((dof + 1) / 2))
  }
  cdf(arg) {
    let {x, dof} = arg
    var dof2 = dof / 2;
    return P.ibeta((x + sqrt(x * x + dof)) /
                   (2 * sqrt(x * x + dof)), dof2, dof2)
  }
  inv(arg) {
    let {p, dof} = arg
    var x = P.ibetainv(2 * min(p, 1 - p), 0.5 * dof, 0.5)
    x = sqrt(dof * (1 - x) / x)
    return (p > 0.5) ? x : -x
  }
  mean(arg) {
    let {dof} = arg
    return (dof > 1) ? 0 : undefined
  }
  median(arg) { return 0 }
  mode(arg) { return 0 }
  variance(arg) {
    let {dof} = arg
    return (dof  > 2) ? dof / (dof - 2) : (dof > 1) ? Infinity : undefined
  }
}

class Weibull extends Distribution {
  pdf(arg) {
    let {x, scale, shape} = arg
    if (x < 0 || scale < 0 || shape < 0)
      return 0;
    return (shape / scale) * pow((x / scale), (shape - 1)) * exp(-(pow((x / scale), shape)))
  }
  cdf(arg) {
    let {x, scale, shape} = arg
    return x < 0 ? 0 : 1 - exp(-pow((x / scale), shape))
  }
  inv(arg) {
    let {p, scale, shape} = arg
    return scale * pow(-log(1 - p), 1 / shape)
  }
  mean(arg) {
    let {scale, shape} = arg
    return scale * P.gammafn(1 + 1 / shape)
  }
  median(arg) {
    let {scale, shape} = arg
    return scale * pow(log(2), 1 / shape)
  }
  mode(arg) {
    let {scale, shape} = arg
    if (shape <= 1) return 0
    return scale * pow((shape - 1) / shape, 1 / shape)
  }
  variance(arg) {
    let {scale, shape} = arg
    return scale * scale * P.gammafn(1 + 2 / shape) -
        pow(P.weibull.mean(scale, shape), 2)
  }
}

class Binomial extends Distribution {
  pdf(arg) {
    let {k, p, n} = arg
    return (p === 0 || p === 1) ?
      ((n * p) === k ? 1 : 0) :
      P.combination(n, k) * pow(p, k) * pow(1 - p, n - k)
  }
  cdf(arg) {
    let {x, p, n} = arg
    if (x < 0) return 0
    if (x < n) {
      let binomarr = []
      for (let k=0; k <= x; k++) {
        binomarr[k] = this.pdf({k, p, n})
      }
      return V.sum(binomarr)
    }
    return 1;
  }
}

class NegBinomial extends Distribution {
  pdf(arg) {
    let {k, p, r} = arg
    if (k !== k >>> 0) return false
    if (k < 0) return 0
    return P.combination(k + r - 1, r - 1) * pow(1 - p, k) * pow(p, r);
  }
  cdf(arg) {
    let {x, p, r} = arg
    if (x < 0) return 0
    let sum = 0
    for (let k=0; k <= x; k++) {
      sum += P.negBinomial.pdf({k, r, p})
    }
    return sum
  }
}

class Poisson extends Distribution {
  pdf(arg) {
    let {k, l} = arg
    if (l < 0 || (k % 1) !== 0 || k < 0) return 0
    return pow(l, k) * exp(-l) / P.factorial(k)
  }
  cdf(arg) {
    let {x, l} = arg
    var sumarr = [], k = 0;
    if (x < 0) return 0;
    for (; k <= x; k++) {
      sumarr.push(P.poisson.pdf({k, l}))
    }
    return V.sum(sumarr)
  }
  mean(arg) { return 1 }
  variance(arg) { return 1 }
}

P.uniform = new Uniform()
P.exp = new Exp()
P.normal = new Normal()
P.beta = new Beta()
P.f = new F()
P.chiSquare = new ChiSquare()
P.cauchy = new Cauchy()
P.gamma = new Gamma()
P.invGamma = new InvGamma()
P.t = new T()
P.weibull = new Weibull()
P.binomial = new Binomial()
P.negBinomial = new NegBinomial()
// P.hyperGenomial = new HyperGenomial()
P.poisson = new Poisson()

Object.assign(P, {Distribution, Uniform, Exp, Normal, 
  Beta, F, ChiSquare, Cauchy, Gamma, InvGamma, T, Weibull, 
  Binomial, NegBinomial, Poisson })
