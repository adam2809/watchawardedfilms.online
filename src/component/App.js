import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Festivals from './Festivals'
import FestivalAwards from './FestivalAwards'
import WatchDialog from './WatchDialog'
import About from './About'

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
					  errorOcurred:false,
                      locale:'en_GB'
                     }
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

        this.getLocale()
	}

    getLocale(){
        const ipInfoUrl = 'http://ip-api.com/json'
        const jwLocalesUrl = process.env.REACT_APP_JW_API_URL + 'content/locales/state'
        const jwHeaders = {'User-Agent':'JustWatch Python client (github.com/dawoudt/JustWatchAPI)'}


        fetch(ipInfoUrl,{method:'GET'})
        .then(ipInfo => ipInfo.json())
        .then(ipInfo => {
            return fetch(jwLocalesUrl,{method:'GET',headers:jwHeaders})
                            .then(locales => locales.json())
                            .then(locales => {
                                const loc = locales.find(loc => loc['iso_3166_2'] == ipInfo['countryCode'])
                                if(loc !== undefined){
                                    this.setState({locale:loc['full_locale']})
                                }
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
