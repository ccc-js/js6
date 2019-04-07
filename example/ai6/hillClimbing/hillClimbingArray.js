let ai6 = require("../../../js6/ai6")
let solutionArray = require("../solution/solutionArray");    // 引入多變數解答類別 (x^2+3y^2+z^2-4x-3y-5z+8)
ai6.hillClimbing(new solutionArray([1,1,1]), 100000, 1000);