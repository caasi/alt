import Alt from '../'
import { assert } from 'chai'
import Symbol from 'es-symbol'

const alt = new Alt()

alt.generateActions('one', 'two')
const test = alt.generateActions('three')

alt.createActions(class FooActions {
  one() {}
  two() {}
})

alt.createAction('test', function () { })

export default {
  'actions obj'() {
    assert.isObject(alt.actions)
    assert.isFunction(alt.actions.test)
    assert(Object.keys(alt.actions).length === 6)
    assert.isDefined(alt.actions[Symbol.keyFor(test.THREE)])
  },
}
