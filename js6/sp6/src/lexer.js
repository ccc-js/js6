// 本來應該用 .*? 來比對 /*...*/ 註解的，但 javascript 的 . 並不包含 \n, 因此用 \s\S 代替 . 就可以了。
const rexp = /(\/\*[\s\S]*?\*\/)|(\/\/[^\r\n])|(\d+)|([a-zA-Z]\w*)|([<=>]+)|(\r?\n)|(.)/gm // *?, +? non greedy, m for multiline

let tokenIdx, tokens = null

const tokenize = function(text) {
  tokenIdx = 0
  tokens = text.match(rexp) 
  return tokens
}

const next = function(o) {
  if (isNext(o))
    return tokens[tokenIdx++]
  throw Error('L.next() is not '+o)
}

const isNext=function(o) {
  if (tokenIdx >= tokens.length) 
    return false
  let token = tokens[tokenIdx]
  if (o instanceof RegExp) {
    return token.match(o)
  } else {
    return (token == o)
  }
}

module.exports = { isNext, next, tokenize }
