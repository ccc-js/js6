const U = module.exports = {}

U.eq = function (o1, o2) {
  if (o1 == o2) return true
  if (Object.is(o1,o2)) return true
  return JSON.stringify(o1) === JSON.stringify(o2)
}

U.nNear = function (n1, n2, gap=0.01) {
  let d = Math.abs(n1-n2)
  return d < gap
}

U.near = function (n1, n2, gap=0.01) {
  if (Array.isArray(n1)) {
    for (let i=0; i<n1.length; i++) {
      if (!U.nNear(n1[i], n2[i], gap))
        return false
    }
    return true
  } else {
    return U.nNear(n1, n2, gap)
  }
}

U.clone = function (o) {
  if (null == o || "object" != typeof o) return o
  if (o.constructor != Object && o.clone != null) return o.clone()
  let r = JSON.parse(JSON.stringify(o)) // 這只會複製非函數欄位！
  if (o.constructor == Object) { // 複製非類別的函數
    for (var attr in o) {
      if (typeof o[attr] === 'function' && o.hasOwnProperty(attr)) r[attr] = o[attr]
    }
  }
  return r
  /*
  var copy = o.constructor()
  for (var attr in o) {
    if (o.hasOwnProperty(attr)) copy[attr] = U.clone(o[attr])
  }
  return copy;
  */
}

U.typeof = function (o) {
  let t = typeof o
  if (t !== 'object') return t
  return o.constructor.name
}

U.type = function (o, type) { // U.is
  if (U.typeof(o).toLowerCase() === type.toLowerCase()) return true
  if (typeof o === 'object' && o instanceof type) return true
  return false
  /*
  if (typeof o === type) return true
  if (type==='array' && Array.isArray(o)) return true
  if (type==='number') return !isNaN(parseFloat(o)) && !isNaN(o - 0) // 參考 -- https://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
  if (typeof o === 'object') {
    if (typeof type === 'object' && o instanceof type) return true
  }
  return false
  */
}

U.member = function (o, member) {
  if (typeof o === 'string') return member
  if (Array.isArray(o)) return o[o.indexOf(member)]
  if (o instanceof Set && o.has(member)) return member
  if (o instanceof Map) return o.get(member)
  return o[member]
}

U.contain = function (o, member) {
  return U.member(o, member) != null
}

U.omap2 = function (o1, o2, f) {
  let o = {}
  for (let k in o1) {
    o[k] = f(o1[k], o2[k])
  }
  return o
}

U.map2array = function (map) {
  let a = []
  for (let k in map) {
    a.push({key:k, value:map[k]})
  }
  return a
}

U.array2map = function (a) {
  let map = {}
  for (let i in a) {
    map[i] = a[i]
  }
  return map
}

U.key2value = function (o) {
  let r = {}
  for (let k in o) {
    let v = o[k]
    r[v] = k 
  }
  return r
}

// U.mixin = Object.assign

U.mixin = function (target, ...args) {
  for (let source of args) {
    Object.getOwnPropertyNames(source).forEach(function(property) {
      target[property] = source[property]; 
    })
    // Object.assign(target, source)
  }
}
