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

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


const styles = theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  }
})

class WatchDialog extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			isLoading: true,
			errorOccurred: false,
			showError: true,
			jwResponse: {}
		}
	}

    makeJustwatchApiCall(){
        this.setState({
			isLoading: true,
			errorOccurred: false,
			showError: true,
			jwResponse: {}
		})

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

    isResponseValid(){
        if(this.state.isLoading || this.state.errorOcurred){
            return false
        }
        return this.state.jwResponse.items.length != 0 && 'offers' in this.state.jwResponse.items[0]
    }

	render(){
		const { classes } = this.props
		return (
			<>
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
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.props.onClose} color='primary'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
				<Snackbar
					open={!this.isResponseValid() && !this.state.isLoading && this.state.showError}
					onClose={() => this.setState({showError:false})}>
					<Alert
						onClose={() => this.setState({showError:false})}
						severity='error'>
						{this.state.errorOcurred ? 'Could not retrieve links list' : `Could not find ${this.props.movie} on Justwatch`}
					</Alert>
				</Snackbar>
			</>
		)
	}
}

function WatchDialogContent(props){
    const displayedMonetizationTypes = {
        'flatrate':'Streaming service'
    }

    const getMonetizationTypes = () => {
        return [...new Set(props.jwResponse.items[0].offers.map(o => o.monetization_type))]
    }

    const displayOffer = (offer) => {
        const domainName = offer.urls.standard_web.split('/')[2]
        let res = `${domainName}[${offer.presentation_type.toUpperCase()}]`

        if(offer.monetization_type != 'flatrate'){
            res = res.concat(` - ${offer.retail_price}£`)
        }

        return res
    }

    const displayMonetizationType = (mt) => {
        if(mt in displayedMonetizationTypes){
            return displayedMonetizationTypes[mt]
        }
        return mt[0].toUpperCase() + mt.substring(1)
    }
    return (
            getMonetizationTypes()
            .filter(mt => mt != 'cinema')
            .map((monetType,i) => (
                <>
                    <List key={i}>
                        <ListItem>
                            <ListItemText
                                disableTypography
                                primary={<Typography variant='h5'>{displayMonetizationType(monetType)}</Typography>}
                            />
                        </ListItem>
                        {
                            props.jwResponse.items[0].offers
                            .filter(o => o.monetization_type == monetType)
                            .map(o => (
                                <ListItem button component="a" target="_blank" rel="noopener noreferrer" href={o.urls.standard_web}>
                                    <ListItemText
                                        primary={displayOffer(o)}
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
