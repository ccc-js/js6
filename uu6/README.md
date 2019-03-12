## uu6 -- Useful Utility 6

File: uu6ex1.js

```js
const uu6 = require('js6/uu6')

let o = {pi:Math.PI, e:Math.E }

console.log('o', o)
console.log('clone(o)=', uu6.clone(o))
console.log('json(o)=', uu6.json(o))

```

Run

```
$ node ex1
o { pi: 3.141592653589793, e: 2.718281828459045 }
clone(o)= { pi: 3.141592653589793, e: 2.718281828459045 }
json(o)= {"pi":3.1416,"e":2.7183}

```
