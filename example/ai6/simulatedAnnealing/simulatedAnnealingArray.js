let ai6 = require("../../../js6/ai6")
let SolutionArray = require("../solution/SolutionArray") // 引入多變數解答類別 (x^2+3y^2+z^2-4x-3y-5z+8)
ai6.simulatedAnnealing(new SolutionArray([1,1,1]), 20000)