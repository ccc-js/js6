var ai6 = require("../../../js6/ai6")
var SolutionScheduling = require("../solution/SolutionScheduling")   // 引入排課系統
var s = new SolutionScheduling(SolutionScheduling.init())
ai6.hillClimbing(s, 100000, 1000)