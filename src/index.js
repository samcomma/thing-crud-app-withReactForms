import React, { Component } from 'react'
import { render } from 'react-dom'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import axios from 'axios'



const Things = ( { things } )=> {
  return (
    <ul>
      {
        things.map(thing => <li key={ thing.id }>{ thing.name }</li>)
      }
    </ul>
  )
}


class ThingCreate extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      error: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  handleChange(ev) {
    const change = {}
    change[ev.target.name] = ev.target.value
    this.setState(change)
  }

  onSave(ev) {
    ev.preventDefault()
    this.props.createThing(this.state)
      .then(()=> this.props.history.push('/things'))
      .catch(()=> this.setState({ error: true }))
  }

  render() {
    const { name, error } = this.state
    const { handleChange, onSave } = this
    return (
      <form onSubmit={ onSave }>
        <div>
          <input name='name' value={ name } onChange={ handleChange }></input>
        </div>
        <button>Save</button>
        {
          error ? ('Error') : (null)
        }
      </form>
    )
  }
  
}



class App extends Component {
  constructor() {
    super()
    this.state = {
      things: []
    }
    this.createThing = this.createThing.bind(this)
  }

  

  componentDidMount() {
    axios.get('/api/things')
      .then(response => response.data)
      .then(things => this.setState({ things }))
  }

  createThing(thing) {
    return axios.post('/api/things', thing)
      .then( response => response.data)
      .then( thing => this.setState({ things: [...this.state.things, thing] })) 
  }
  
  render() {
    const { things } = this.state
    const { createThing } = this
    return (
      <Router>
        <div>
          <ul>
            <li><Link to='/things'>Number of Things ({ things.length })</Link></li>
            <li><Link to='/things/create'>Create a Thing</Link></li>
          </ul>
          <Route exact path='/things' render = { ()=> <Things things={ things } /> } />
          <Route exact path='/things/create' render = { ({ history })=> <ThingCreate things={ things } createThing={ createThing } history={ history }/> } />
        </div>
      </Router>
    )
  }
}




const root = document.getElementById('root')
render(<App />, root)