import React from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';


const styles = theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  }
})

class WatchDialog extends React.Component{

    displayedMonetizationTypes = {
        'flatrate':'Streaming service'
    }

	constructor(props){
		super(props)
		this.state = {
			isLoading: true,
			errorOccurred: false,
			jwResponse: {}
		}
	}

    makeJustwatchApiCall(){
        console.log('calling')

        const data = {
            query:this.props.movie
        }
        const fetchOptions = {
            method:'POST',
            headers:{'User-Agent':'JustWatch Python client (github.com/dawoudt/JustWatchAPI)'},
            body:JSON.stringify(data)
        }
		fetch(process.env.REACT_APP_JW_API_URL+'content/titles/en_GB/popular',fetchOptions)
		.then(res => res.json())
		.then(res => {
			this.setState({
				isLoading:false,
				jwResponse:res
			})
		})
		.catch(err => {
			this.setState({
				isLoading:false,
				errorOcurred:true
			})
		})
    }

	getMonetizationTypes(){
		if(this.state.isLoading || this.state.errorOcurred){
			return []
		}
        console.log(this.state.jwResponse.items[0])
		return [...new Set(this.state.jwResponse.items[0].offers.map(o => o.monetization_type))]
	}

	displayOffer(offer){
        const domainName = offer.urls.standard_web.split('/')[2]
        let res = `${domainName}[${offer.presentation_type.toUpperCase()}]`

        if(offer.monetization_type != 'flatrate'){
            res = res.concat(` - ${offer.retail_price}£`)
        }

        return res
	}

    displayMonetizationType(mt){
        if(mt in this.displayedMonetizationTypes){
            return this.displayedMonetizationTypes[mt]
        }
        return mt[0].toUpperCase() + mt.substring(1)
    }

    isResponseValid(){
        if(this.state.isLoading || this.state.errorOcurred){
            return false
        }
        return this.state.jwResponse.items.length != 0 && 'offers' in this.state.jwResponse.items[0]
    }

	render(){
		const { classes } = this.props
		return (
			<div>
                <Dialog
                    open={this.props.open}
                    maxWidth={this.props.maxWidth}
                    onClose={this.props.onClose}
                    onEnter={() => this.makeJustwatchApiCall()}
                >
                    <DialogTitle>Watch {this.props.movie}</DialogTitle>
                    <DialogContent>
                        {this.state.isLoading && <div align='center'><CircularProgress/></div>}
                        {this.isResponseValid() && (
                            <WatchDialogContent
                            	jwResponse={this.state.jwResponse}
                            	displayMonetizationType={() => this.displayMonetizationType()}
                            	displayOffer={() => this.displayOffer()}
                                getMonetizationTypes={() => this.getMonetizationTypes()}
                            />
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.props.onClose} color='primary'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
			</div>
		)
	}
}

function WatchDialogContent(props){
    return (
            props.getMonetizationTypes().map((monetType,i) => (
                <>
                    <List key={i}>
                        <ListItem>
                            <ListItemText
                                disableTypography
                                primary={<Typography variant='h5'>{props.displayMonetizationType(monetType)}</Typography>}
                            />
                        </ListItem>
                        {
                            props.jwResponse.items[0].offers
                            .filter(o => o.monetization_type == monetType)
                            .map(o => (
                                <ListItem button>
                                    <ListItemText
                                        primary={props.displayOffer(o)}
                                    />
                                </ListItem>
                            ))
                        }
                    </List>
                </>
        )
    ))
}

WatchDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WatchDialog)
