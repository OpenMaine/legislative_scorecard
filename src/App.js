import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'

import Header from './components/Header'
import Legislators from './components/Legislators'
import LegislatorDetail from './components/LegislatorDetail'
import Bills from './components/Bills'
import BillDetail from './components/BillDetail'
import AllScores from './components/AllScores'
import About from './components/About'
import PageNotFound from './components/PageNotFound'


class App extends Component {

  render() {

    return (
      <div className="App">
        <Header />
        <div className="">
          <Switch>
            <Route path="/" exact render={() => <Redirect to='/legislators' />} />
            <Route path='/legislators/:ocdId/:slug?' component={LegislatorDetail} />
            <Route path='/legislators' component={Legislators} />
            <Route path='/bills/:billId/:slug?' component={BillDetail} />
            <Route path="/bills" component={Bills} />
            <Route path="/all-scores" component={AllScores} />
            <Route path="/about" component={About} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
        <div className="footer">
          <div className="container">
            <p>Made with &hearts; using open source tools from <a href="https://github.com/OpenMaine/aflcio_scorecard" target="_blank" rel="noopener noreferrer">Open Maine</a></p>
          </div>
        </div>
        <ScrollToTop />
      </div>
    )
  }
}

export default App;
