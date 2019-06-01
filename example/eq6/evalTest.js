

let call = function (exp, binds) {
  let ctx = {...binds}, $r = null // 加 $ 是為了避免 exp 裏有變數 r 的名稱。
  ctx.sin = Math.sin
  eval(`with (ctx) { $r = ${exp} }`)
  return $r
}

let r = call('c+f(x)', {x:3,c:2, f:function(x) { return Math.sin(c*x)}})
console.log('r=', r)
