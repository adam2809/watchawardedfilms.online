import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'

export default class App extends React.Component{
    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/festival/:festId">
                      <FestivalAwards />
                    </Route>
                  <Route path="/">
                    <Festivals />
                  </Route>
                </Switch>
            </Router>
        );
    }
}
