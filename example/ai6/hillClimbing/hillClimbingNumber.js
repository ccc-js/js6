var ai6 = require("../../../js6/ai6")
var SolutionNumber = require("../solution/SolutionNumber");    // 引入平方根解答類別

// 執行爬山演算法 (從「解答=0.0」開始尋找, 最多十萬代、失敗一千次就跳出。
ai6.hillClimbing(new SolutionNumber(0.0), 100000, 1000);