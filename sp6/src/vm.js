const uu6 = require('../../uu6')

const c = [
  'LEA', // load local address 載入區域變數
  'IMM', // load global address or immediate 載入全域變數或立即值
  'JMP', // jump               躍躍指令
  'JSR', // jump to subroutine 跳到副程式
  'BZ' , // branch if zero     if (a==0) goto m[pc]
  'BNZ', // branch if not zero if (a!=0) goto m[pc]
  'ENT', // enter subroutine   進入副程式
  'ADJ', // stack adjust       調整堆疊
  'LEV', // leave subroutine   離開副程式
  'LI' , // load int           載入整數
  'LC' , // load char          載入字元
  'SI' , // store int          儲存整數
  'SC' , // store char         儲存字元
  'PSH', // push               推入堆疊
  'OR' , // a = a OR pop       pop 代表從堆疊中取出一個元素
  'XOR', // a = a XOR pop
  'AND', // a = a AND pop
  'EQ' , // a = a EQ pop
  'NE' , // a = a NE pop
  'LT' , // a = a LT pop
  'GT' , // a = a GT pop
  'LE' , // a = a LE pop
  'GE' , // a = a GE pop
  'SHL', // a = a SHL pop
  'SHR', // a = a SHR pop
  'ADD', // a = a ADD pop
  'SUB', // a = a SUB pop
  'MUL', // a = a MUL pop
  'DIV', // a = a DIV pop
  'MOD', // a = a MOD pop
  'EXIT', // 終止離開
  'OPEN', // open
  'READ', // read
  'CLOS', // close
  'PRTF', // printf
  'MALC', // malloc
  'FREE', // free
  'MSET', // memset
  'MCMP', // memcmp
]

const i2c = uu6.array2map(c)
const c2i = uu6.key2value(c)

console.log('i2c=', i2c)
console.log('c2i=', c2i)
