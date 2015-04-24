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
    assert.isObject(alt.actions, 'actions exist')
    assert.isFunction(alt.actions.global.test, 'test exists')
    assert(Object.keys(alt.actions.global).length === 6, 'global actions contain all the actions')
    assert(Object.keys(alt.actions.FooActions).length === 2, '2 actions namespaced on FooActions')
    assert.isDefined(alt.actions.global[Symbol.keyFor(test.THREE)], 'three action is defined on global')
  },
}
