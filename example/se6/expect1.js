const expect = require('../../js6/se6').expect

let a = [1,2,3]

expect(2).to.be.a('number')
expect(a).to.contain(2)
expect(a).to.not.contain(5)

let o = {name:'ccc'}

expect(o).to.contain('name').that.is.a('ccc')
