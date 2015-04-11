const Alt = require('./')
const TimeTravel = require('./utils/TimeTravel')

const alt = new Alt()


const actions = alt.generateActions('fire')
const store = alt.createStore({
  displayName: 'Store',

  bindListeners: { fire: actions.fire },

  state: { x: 0 },

  fire: function () {
    return this.setState({ x: this.state.x + 1 })
  }
})

const time = new TimeTravel(alt)

console.log(time.getCurrentSnapshot())

actions.fire()

console.log(time.getCurrentSnapshot())

actions.fire()

console.log(time.getCurrentSnapshot())

console.log(time.getSnapshots())

//time.clearSnapshots()
console.log(time)
