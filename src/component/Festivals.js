import React from 'react';
import { Link } from "react-router-dom";

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import {
	List,
	ListItem,
	ListItemText,
	Typography,
	Box,
	CircularProgress,
	Paper,
	Divider
} from '@material-ui/core'

export default class Festivals extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			showErrorAlert:true
		}
	}

	render(){
		return(
			<div align='center'>
				<Typography variant="h2">
					Available festivals:
				</Typography>
				{this.props.isLoading && <CircularProgress color='primary'></CircularProgress>}
				<Box width={300}>
					<Paper>
						<List>
							{this.props.festivals.map((f,i) => {
								return (
									<>
										<ListItem
											button
											key={i}
											component={Link}
											to={"/festival/"+(i+1).toString()}
										>
											<ListItemText primary={f} align='center'/>
										</ListItem>
										{(i != this.props.festivals.length - 1) && <Divider/>}
									</>
								)
							})}
						</List>
					</Paper>
				</Box>
				<Snackbar
					open={this.props.errorOcurred && this.state.showErrorAlert}
					onClose={() => this.setState({showErrorAlert:false})}>
					<Alert
						onClose={() => this.setState({showErrorAlert:false})}
						severity='error'>
						Could not retrieve festivals list
					</Alert>
				</Snackbar>
			</div>
		)
	}
}
