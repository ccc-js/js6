var ai6 = require("../../../js6/ai6")
var SolutionEquations = require("../solution/SolutionEquations");    // 引入線性聯立方程組解答類別

ai6.hillClimbing(SolutionEquations.zero(), 100000, 1000);