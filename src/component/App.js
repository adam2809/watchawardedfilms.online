import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'

export default function App() {
  return (
    <Router>
        <Switch>
          <Route path="/">
            <Festivals />
          </Route>
          <Route path="/festival/:id">
            <FestivalAwards />
          </Route>
        </Switch>
    </Router>
  );
}
