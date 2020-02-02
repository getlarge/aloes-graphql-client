import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './Header';
import DeviceList from './DeviceList';
import Login from './Login';
import Search from './Search';
// import logo from '../logo.svg';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path='/' render={() => <Redirect to='/new/1' />} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/top' component={DeviceList} />
            <Route exact path='/new/:page' component={DeviceList} />
            <Route exact path='/search' component={Search} />
          </Switch>
        </div>
      </div>
    )
  }
}
            

export default App;
