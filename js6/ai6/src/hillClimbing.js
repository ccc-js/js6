function hillClimbing(s, maxGens=1000000, maxFails=1000, debug=true) { // 爬山演算法的主體函數
  if (debug) console.log("start: %s", s); // 印出初始解
  var fails = 0;          // 失敗次數設為 0
  // 當代數 gen<maxGen，且連續失敗次數 fails < maxFails 時，就持續嘗試尋找更好的解。
  for (var gens=0; gens<maxGens && fails < maxFails; gens++) {
    var snew = s.neighbor();           // 取得鄰近的解
    var sheight = s.height();          // sheight=目前解的高度
    var nheight = snew.height();       // nheight=鄰近解的高度
    // console.log("%d: %s", gens, snew);  //   印出新的解
    if (nheight > sheight) {
      if (debug) console.log("%d: %s", gens, snew);  //   印出新的解
      s = snew;                        //   就移動過去
      fails = 0;                       //   移動成功，將連續失敗次數歸零
    } else if (nheight < sheight) {          // 如果鄰近解比目前解更好
      fails++;                         //   將連續失敗次數加一
    }
  }
  if (debug) console.log("solution: %s", s);      // 印出最後找到的那個解
  return s;                            //   然後傳回。
}

module.exports = hillClimbing          // 將爬山演算法的類別匯出。