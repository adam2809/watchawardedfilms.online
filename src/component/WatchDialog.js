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

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';


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

	componentDidMount(){
		fetch(process.env.REACT_APP_API_URL+'test')
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
		return [...new Set(this.state.jwResponse.items[0].offers.map(o => o.monetization_type))]
	}

	getDomainFromUrl(url){
		let tmp = ''
		if(url.includes('www.')){
			tmp=url.substring(url.indexOf('www.'))
		}else{
			tmp=url.substring(url.indexOf('https://'))
		}
		return tmp.substring(0,tmp.indexOf('/'))
	}

	render(){
		const { classes } = this.props
		return (
			<div>
                <Dialog
                    open={this.props.open}
                    maxWidth={this.props.maxWidth}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>Watch</DialogTitle>
                    <DialogContent>
    				{
    					this.getMonetizationTypes().map((monetType,i) => (
    						<>
                                <Box>
                                    <Divider />
        							<List key={i}>
        								<ListItem>
        									<ListItemText
                                                disableTypography
                                                primary={<Typography variant='h5'>{monetType}</Typography>}
                                            />
        								</ListItem>
            							<Divider />
        								{
        									this.state.jwResponse.items[0].offers
        									.filter(o => o.monetization_type == monetType)
        									.map(o => (
        										<ListItem button>
        											<ListItemText
        												primary={(o.urls.standard_web) + ' - ' + o.retail_price + '£'}
        											/>
        										</ListItem>
        									))
        								}
        							</List>
                                </Box>
    						</>
    					))
    				}
                    </DialogContent>
                </Dialog>
			</div>
		)
	}
}

WatchDialog.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WatchDialog)
