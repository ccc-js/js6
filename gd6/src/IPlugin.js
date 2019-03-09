module.exports = class IPlugin {
  call(p) { throw Error('Gradable.call not defined!') }
  grad(p) { throw Error('Gradable.grad not defined!') }
  isBetter(g, p) { throw Error('Gradable.isBetter not defined!') }
  apply(g, p) { throw Error('Gradable.apply not defined!') }
}
