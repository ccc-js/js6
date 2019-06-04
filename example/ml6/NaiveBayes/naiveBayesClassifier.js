const B = require('../../../js6/ml6').naiveBayes
const prob = {
  'c1': 0.6, 'c2': 0.4,
  'c1=>f1': 0.5, 'c1=>f2': 0.8, 'c1=>f3': 0.6,
  'c2=>f1': 0.7, 'c2=>f2': 0.6, 'c2=>f3': 0.2,
}

const f = ['f1', 'f2']
const c = ['c1', 'c2']

B.naiveBayesClassifier(prob, c, f)
