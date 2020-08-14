import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import Inicio from './Components/Inicio';
import { initFirebase } from './FirebaseAdministrator';

initFirebase();

class App extends Component {
  render() {
    return (
        <Inicio />
    );
  }
}

export default App;
