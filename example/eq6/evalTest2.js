let expandFunctions = function (binds) {
  let codes = []
  for (let name in binds) {
    let value = binds[name]
    if (typeof value === 'string') {
      codes.push(`var ${name}=eval("${value}")`)
    }
  }
  return codes.join(';')
}

let call = function (exp, binds) {
  let ctx = {...binds}, $r = null // 加 $ 是為了避免 exp 裏有變數 r 的名稱。
  ctx.sin = Math.sin
  eval(`with (ctx) { ${expandFunctions(binds)}; $r = ${exp} }`)
  return $r
}

let r = call('c+f(x)', {x:3,c:2, f:'(x)=>sin(c*x)' })
console.log('r=', r)
