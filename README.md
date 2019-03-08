# js6 -- 6th Generation Framework for JavaScript

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

## nu6 -- Numerical Library 6

Code

```js
const nu6 = require('js6/nu6')

function f(p) {
  let {x,y} = p
  return x*x+y*y
}

nu6.gradientDescendent(f, {x:1, y:1})
```

Run

```
$ node .\nu6optimize.js
p= {"x":1,"y":1} f(p)= 2
  gp= [ x: 2.010000000000023, y: 2.010000000000023 ]  norm= 8.080200000000184
p= {"x":0.9799,"y":0.9799} f(p)= 1.920408019999999
  gp= [ x: 1.9697999999999993, y: 1.9697999999999993 ]  norm= 7.760224079999995
...
...
...
  gp= [ x: 0.0022654656943404284, y: 0.0022654656943404284 ]  norm= 0.00001026466962446672
p= {"x":-0.0039,"y":-0.0039} f(p)= 0.000030262983372298253
  gp= [ x: 0.0022201563804536213, y: 0.0022201563804536213 ]  norm= 0.00000985818870733785
```

## cn6 -- Computational Network 6


File 

```js
const js6 = require('js6')
const {nu6, cn6} = js6

let net = new cn6.Net()
let x = net.variable(2)
let y = net.variable(1)
let x2 = net.mul(x, x)
let y2 = net.mul(y, y)
let o  = net.add(x2, y2)

net.watch({x,y,x2,y2,o})

let fnet = new cn6.FNet(net, {x:x, y:y})

nu6.gradientDescendent(fnet, {x:1, y:2})

```

Run

```
$ node .\cn6optimize.js
p= {"x":1,"y":2} f(p)= 5
  gp= { x: 2, y: 4 }  norm= 20
p= {"x":0.98,"y":1.96} f(p)= 4.802
  gp= { x: 1.96, y: 3.92 }  norm= 19.208
p= {"x":0.9604,"y":1.9208} f(p)= 4.6118408
  gp= { x: 1.9208, y: 3.8416 }  norm= 18.4473632
...
...
...
  gp= { x: 0.0014748199981430578, y: 0.0029496399962861157 }  norm= 0.000010875470134613445
p= {"x":0.0007,"y":0.0014} f(p)= 0.0000026112003793206882
  gp= { x: 0.0014453235981801967, y: 0.0028906471963603933 }  norm= 0.000010444801517282753
p= {"x":0.0007,"y":0.0014} f(p)= 0.0000025077968442995883
  gp= { x: 0.0014164171262165926, y: 0.0028328342524331853 }  norm= 0.000010031187377198353
p= {"x":0.0007,"y":0.0014} f(p)= 0.000002408488089265325
  gp= { x: 0.0013880887836922608, y: 0.0027761775673845216 }  norm= 0.0000096339523570613
```
