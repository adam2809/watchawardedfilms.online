import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { ThemeProvider } from 'emotion-theming'
import theme from '@rebass/preset'

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'
import WatchModal from './WatchModal'

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
            <ThemeProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route path="/test">
                          <WatchModal/>
                        </Route>
                        <Route path="/festival/:festId">
                          <FestivalAwards getFestivals={this.getFestivals}/>
                        </Route>
                        <Route path="/">
                            <Festivals setFestivals={this.setFestivals}/>
                        </Route>
                    </Switch>
                </Router>
            </ThemeProvider>
        );
    }
}

export default App
