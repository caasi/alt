import Alt from '../'
import makeFinalStore from './makeFinalStore'

function make() {
  return (Date.now() * Math.random()).toString(35).substr(0, 7)
}

class TimeTravelActions {
  constructor() {
    this.generateActions('destroyAll', 'revertTo')
  }

  revertStoreTo(name, id) {
    this.dispatch({ id, name })
  }
}

class TimeTravelStore {
  static config = {
    stateKey: 'state'
  }

  constructor(alt, captureMoment) {
    this.state = {
      currentState: null,
      snapshots: {}
    }

    const TimeTravelActions = alt.getActions('TimeTravelActions')

    this.bindListeners({
      captureMoment: captureMoment,
      destroyAll: TimeTravelActions.destroyAll,
      revertStoreTo: TimeTravelActions.revertStoreTo,
      revertTo: TimeTravelActions.revertTo,
    })

    this.exportPublicMethods({
      uid() {
        let id = make()
        while (this.getState().snapshots[id]) {
          id = make()
        }
        return id
      }
    })
  }

  captureMoment(data) {
    const { snapshots } = this.state
    snapshots[data.id] = data

    this.setState({
      currentState: data.snapshot,
      snapshots
    })
  }

  destroyAll() {
    this.setState({
      snapshots: {}
    })
  }

  revertStoreTo(data) {
    const { id, name } = data

    if (!this.state.snapshots[id]) {
      return false
    }

    const appState = JSON.parse(this.state.snapshots[id])

    if (!appState[name]) {
      return false
    }

    const state = JSON.stringify(appState[name])
    alt.bootstrap(state)

    return this.setState({
      currentState: alt.takeSnapshot()
    })
  }

  revertTo(id) {
    if (!this.state.snapshots[id]) {
      return false
    }

    const state = this.state.snapshots[id]
    alt.bootstrap(state)

    return this.setState({
      currentState: state
    })
  }
}

class TimeTravel extends Alt {
  constructor(alt, config) {
    super(config)

    const captureMoment = this.createAction('captureMoment', function (payload) {
      this.dispatch({
        id: this.alt.getStore('TimeTravelStore').uid(),
        payload: payload,
        snapshot: alt.takeSnapshot(),
        timestamp: Date.now()
      })
    })

    this.addActions('TimeTravelActions', TimeTravelActions)
    this.addStore('TimeTravelStore', TimeTravelStore, this, captureMoment)

    // initial capture
    captureMoment({})

    // capture subsequent dispatches
    const payloadStore = makeFinalStore(alt)
    payloadStore.listen(state => captureMoment(state.payload))
  }

  getCurrentSnapshot() {
    return this.getStore('TimeTravelStore').getState().currentState
  }

  getSnapshots() {
    return JSON.stringify(this.getStore('TimeTravelStore').getState().snapshots)
  }
}

export default TimeTravel
