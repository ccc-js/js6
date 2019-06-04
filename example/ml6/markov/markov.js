// 參考： 自然語言處理 -- Hidden Markov Model http://cpmarkchang.logdown.com/posts/192352
const P = require('./prob')
const M = require('../../../js6/ml6').markov

const seq = ['b', 'a', 'b', 'b']

console.log('P(%j)=%d', seq, M.markovSeqProb(P, seq))