import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'

export default class App extends React.Component{
    festivals
    setFestivals(festivals){
        this.festivals = festivals
    }

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/festival/:festId" festivals={this.festivals}>
                      <FestivalAwards />
                    </Route>
                  <Route path="/" setFestivals={this.setFestivals}>
                    <Festivals />
                  </Route>
                </Switch>
            </Router>
        );
    }
}
