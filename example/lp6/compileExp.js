/* 運算式編譯器：

語法: E = T ([+-/*] E)*
      T = N | (E)

範例：3+(5*4)-2 */
var c = console;

var tagMap={
  N : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  OP: ["+", "-", "*", "/"]
};

var wi = 0;

function isNext(tag) {
  if (words[wi] === tag) return true;
  var tagWords=tagMap[tag];
  if (typeof tagWords === "undefined") 
    return false;
  else
    return (tagWords.indexOf(words[wi])>=0);
}

function next(tag) {
  // c.log("tag="+tag+" word="+words[wi]);
  if (isNext(tag)) {
    return words[wi++];
  }
  throw Error("Error !");
}

var tempIdx = 0;
var getTemp=function() {
  return tempIdx++;
}
// E = T ([+-/*] E)*
function E() {
  var t = T();
  while (isNext("OP")) {
    var op = next("OP");
    var e = E();
    var result = getTemp();
    console.log(" T%d=T%d%sT%d", result, t, op, e);
    t = result;
  }
  return t;
}

// T = N | (E)
function T() {
  if (isNext("N")) {
    var t = getTemp();
    var number = next("N");
    console.log(" T%d=%d", t, number);
    return t;
  } else {
    next("(");
    var e = E();
    next(")");
    return e;
  }
}

if (process.argv.length != 3) {
  c.log("參數數量錯誤，請嘗試以下範例：\n\nnode compileExp '3+(5*4)-2'\n")
  process.exit(1)
}
let words = process.argv[2]
c.log("%j", words);
E(words);