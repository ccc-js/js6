
// https://en.wikipedia.org/wiki/Arc_length
R.ArcLength = function(f,a,b,d) {
  let len = 0
  for (let t=a; t<b; t+=d) {
    len += f(t+d)-f(t)
  }
  return len
}

