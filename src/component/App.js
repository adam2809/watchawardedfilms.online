import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'
import WatchModal from './WatchModal'
import WatchDrawer from './WatchDrawer'

let festivals = []

class App extends React.Component{
    constructor(props){
		super(props)
		this.state = {festivals:[],
                      isLoading:true,
					  errorOcurred:false}
    }

	componentDidMount(){
		fetch(process.env.REACT_APP_API_URL+"festivals")
		.then(res => res.json())
		.then(res => {
			this.setState({
				festivals: res.festivals,
				isLoading: false,
			})
		})
		.catch(err => {
			this.setState({
				errorOcurred: true,
				isLoading: false
			})
		})
	}

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/test">
                      <WatchDrawer/>
                    </Route>
                    <Route path="/festival/:festId">
                      <FestivalAwards festivals={this.state.festivals}/>
                    </Route>
                    <Route path="/">
                        <Festivals
                            isLoading={this.state.isLoading}
                            festivals={this.state.festivals}
                            errorOcurred={this.state.errorOcurred}
                        />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default App
