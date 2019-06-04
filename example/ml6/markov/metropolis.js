// Metropolis Hasting 的範例
// 問題：機率式有限狀態機，P(a)=0.2, P(b)=0.3, P(c)=0.1
// 目標：尋找「轉移矩陣」的穩態，也就是 Q(x→y)=? 時系統會達到細緻平衡 (每條連線都平衡了)。
const M = require('../../../js6/ml6').markov
const P = {
  'a': 0.2, 'b': 0.7, 'c': 0.1,
  'a=>a': 0.5, 'a=>b':0.3, 'a=>c':0.2, 
  'b=>a': 0.1, 'b=>b':0.2, 'b=>c':0.7,
  'c=>a': 0.3, 'c=>b':0.3, 'c=>c':0.4,
}


M.metropolisHasting(P, ['a', 'b', 'c'])
