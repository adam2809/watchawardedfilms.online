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

const gpm = require('../gestalt-pattern-matcher')

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
            query:this.props.movie.name
        }
        const fetchOptions = {
            method:'POST',
            headers:{'User-Agent':'JustWatch Python client (github.com/dawoudt/JustWatchAPI)'},
            body:JSON.stringify(data)
        }
		fetch(process.env.REACT_APP_JW_API_URL+'content/titles/en_GB/popular',fetchOptions)
		.then(res => res.json())
        .then(res => {
            console.log('Untouched JW response')
            console.log(res)
            res.items = res.items
                           .slice(0,10)
                           .filter(i => Math.abs(i.original_release_year - this.props.movie.year) <= 1)
            console.log('Prepped JW response')
            console.log(res)

            return res
        })
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
        return !this.state.isLoading &&
            !this.state.errorOcurred &&
            this.state.jwResponse.items.length != 0 &&
            'offers' in this.state.jwResponse.items[0] &&
            !this.state.jwResponse.items[0].offers.every(o => o.monetization_type == 'cinema') &&
            [1].filter(x => {
                console.log(`The gpm score for ${this.state.jwResponse.items[0].title} and ${this.props.movie.name} is ${gpm(this.state.jwResponse.items[0].title,this.props.movie.name)}`)
                return 1
            }) &&
            gpm(this.state.jwResponse.items[0].title,this.props.movie.name) > 0.5


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
                    <DialogTitle>Watch {this.props.movie.name}</DialogTitle>
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
						{this.state.errorOcurred ? 'Could not retrieve links list' : `Could not find ${this.props.movie.name} on Justwatch`}
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
        return Array.from([...new Set(props.jwResponse.items[0].offers.map(o => o.monetization_type))])
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

    const monetTypeSort = function(a,b){
        if(a == undefined || b == undefined){
            return 0
        }
        const priorityList = ['free','flatrate','rent','buy']
        var i
        for (i=0;i<priorityList.length;i++){
            if(a == priorityList[i]){
                return -1
            }
            if(b == priorityList[i]){
                return 1
            }
        }
        return 0
    }

    return (
            getMonetizationTypes()
            .filter(mt => mt != 'cinema')
            .sort(monetTypeSort)
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
                            .map((o,i) => (
                                <ListItem button component="a" target="_blank" rel="noopener noreferrer" href={o.urls.standard_web} key={i}>
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
