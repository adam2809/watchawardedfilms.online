import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'

let festivals = []

class App extends React.Component{
    setFestivals(f){
        festivals = f
    }

    getFestivals(){
        return festivals
    }

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/festival/:festId">
                      <FestivalAwards getFestivals={this.getFestivals}/>
                    </Route>
                  <Route path="/">
                    <Festivals setFestivals={this.setFestivals}/>
                  </Route>
                </Switch>
            </Router>
        );
    }
}

export default App
