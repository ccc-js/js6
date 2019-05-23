const Generator = require('./Generator')
const compiler = require('./exp')
const uu6 = require('../../uu6')

const S = module.exports = {}

function s1(op, diff) {
  var r, d1 = diff.toString()
  switch (op) {
    case '-': r = (d1.startsWith('-')) ? d1.substring(1) : op + d1; break
    default : throw Error('op:%j not supported!', op)
  }
  return r
}

function s2(a, op, b) {
  var r = null
  if (uu6.type(a, 'number') && uu6.type(b, 'number')) {
    r = (op==='^') ? Math.pow(a,b) : eval(a+op+b)
  }
  // console.log('typeof a=', typeof a, 'typeof b=', typeof b)
  if (r == null) {
    switch (op) {
      case '+':
      case '-': r = (uu6.type(a, 'number') && uu6.type(b, 'number')) ? eval(a+op+b) :
                    (a==0) ? b : 
                    (b==0) ? a : [a, op, b]
                break 
      case '*': r = (a==0 || b==0) ? 0 : 
                    (a==1) ? b : 
                    (b==1) ? a : 
                    (a==-1) ? s1('-', b) : [a, op, b]
                break 
      case '/': r = (b==1) ? a : [a, op, b]; break
      default : throw Error('s2: '+op+' not supported!')
    }
  }
  return (Array.isArray(r)) ? '('+r.join('')+')' : r // 避免重複的多層括號
}

class SymGenerator extends Generator {
  constructor(x) {
    super()
    this.x = x
  }
  op1 (op, t) {
    return {exp: op+t.exp, diff:s1(op, t.diff)}
  }
  op2 (op, t1, t2) {
    let d = null, {exp:a, diff:da} = t1, {exp:b, diff:db} = t2
    switch (op) {
      case '+': 
      case '-': d = s2(da, op, db); break; // a' op b' 
      case '*': d = s2(s2(a, '*', db), '+', s2(da, '*', b)); break; // a'b + ab'
      case '/': d = s2(s2(b, '*', da), '-', s2(a, '*', db)) + '/pow('+b+',2)'; break; 
      default : throw Error('op2:'+op+' not supported!')
    }
    if (d==null) throw Error('op: d==null')
    return {exp: t1.exp + op + t2.exp, diff: d }
  } 
  call (fname, args) {
    let {exp:a, diff:da} = args[0], d = null, argStr=a
    switch (fname) {
      case 'sin': d = s2('cos(' + a + ')', '*', da); break; // cos(a) a'
      case 'cos': d = s2(s1('-', da), '*', 'sin(' + a + ')'); break; // -a' * sin(a)
      case 'exp': d = s2('exp(' + a + ')', '*', da); break; // exp(a) a'
      case 'pow': // pow(a, b) = exp(b ln a)
        let {exp:b, diff:db} = args[1]
        argStr += ','+b
        d = (b==0) ? 0 :  // a^0 = 1, df = 0
            (a==1) ? 0 :  // 1^n, df = 0
            (uu6.type(b, 'number')) ? b+'*pow('+a+','+(b-1)+')' : // a^n, df = n a^(n-1)
            'pow('+a+','+b+')*('+b+'*ln('+da+')+'+db+'*ln('+a+')'
        break;
        // case '^': if (d2 == '0') d = s2(e2, '*', s2(e1, '^', s2(e2, '-', 1))); break;
      default: throw Error('call: fname=%s not supported!')
    }
    return {exp: fname+'('+argStr+')', diff: d }
  }
  number (n) {
    return {exp: n, diff: 0}
  }
  variable (name) {
    let diff = (name===this.x) ? 1 : 0
    return {exp:name, diff:diff}
  }
}

S.diff  = function(text, x) {
  let g = new SymGenerator(x)
  return compiler.compile(text, g).diff
}
