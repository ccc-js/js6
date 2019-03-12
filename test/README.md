# js6 的測試程式

測試全部

$ mocha --recursive

```
PS D:\ccc\js\js6> mocha --recursive


  ai6.gradientDescendent Algorithm
p= Point { v: [ -0.004958591413113332, -0.004972371308915885 ] } norm= 0.007022257844591805
    √ gd result point should be near zero

  nn.Net result of gradientDescendent Algorithm
p= Point { v: [ 2.999964879311512, 0.00003512068848734949 ] } norm= 2.9999648795170915
    √ gd result point should be near zero (66ms)

  nn6.Net
forward: f()
main: p= Point { v: [ 1, 2 ] }
out= 8
g= Vector { v: [ -4, 4 ] }
{ x: Variable { v: 1, g: -4 },
  y: Variable { v: 2, g: 4 },
  x2: Variable { v: 4, g: 1 },
  y2: Variable { v: 4, g: 1 },
  o: Variable { v: 8, g: 1 } }
    √ test Net.call and Net.grad

  se6.expect
    √ number test
    √ array test
    √ object test
    √ pass test

  uu6 test
    √ args test


  8 passing (171ms)
```

