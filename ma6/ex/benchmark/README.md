# vaddSpeed.js 測試

## vaddSpeed.html 網頁中的結果


```
vaddNumjs time:4286 ms
vaddSpeed.html:95 vaddDirect time:2977 ms
vaddSpeed.html:95 vaddTemplate time:2636 ms
vaddSpeed.html:95 vaddEval time:2756 ms
vaddSpeed.html:95 vaddCall1 time:12830 ms
vaddSpeed.html:95 vaddCall2 time:12672 ms
vaddSpeed.html:95 vaddCall3 time:11244 ms
vaddSpeed.html:95 vaddCall4 time:4388 ms
vaddSpeed.html:95 vaddIn time:64185 ms
```

## vaddSpeed.js 在 Node.js 中的結果

```
$ node .\vaddSpeed.js
vaddNumjs time:2616 ms
vaddDirect time:2369 ms
vaddTemplate time:2396 ms
vaddEval time:2559 ms
vaddCall1 time:8030 ms
vaddCall2 time:8029 ms
vaddCall3 time:7968 ms
vaddCall4 time:2378 ms
vaddIn time:58959 ms
```
