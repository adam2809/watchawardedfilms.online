import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'
import WatchDialog from './WatchDialog'

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
            <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        watchawardedfilms.online
                    </Typography>
                    <Button color="inherit" href='/'>Festivals</Button>
                    <Button color="inherit" href='/about'>About</Button>
                </Toolbar>
            </AppBar>
            <Router>
                <Switch>
                    <Route path="/about">
                      <About />
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
            </>
        );
    }
}

export default App
