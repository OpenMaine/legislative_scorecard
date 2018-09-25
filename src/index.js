import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
// import registerServiceWorker from './registerServiceWorker';
import 'whatwg-fetch'
import 'flexboxgrid'
import './App.css'

import App from './App';

const appComponent = (
  <Router>
    <App />
  </Router>
)
const rootElement = document.getElementById('root')

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(appComponent, rootElement);
}
else {
  ReactDOM.render(appComponent, rootElement);
}

// registerServiceWorker();
