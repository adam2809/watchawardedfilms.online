import React from 'react';
import { Link } from "react-router-dom";

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';



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
			showErrorAlert:true,
			searchInput:''
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
							<ListItem>
								<TextField
									label="Search festivals"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										),
									}}
									onChange={(e) => this.setState({searchInput:e.target.value})}
								/>


							</ListItem>
							{this.props.festivals
							 .filter((f) => f.toLowerCase().includes(this.state.searchInput.toLowerCase()))
							 .map((f,i) => {
								return (
									<>
									<Divider />
										<ListItem
											button
											key={i}
											component={Link}
											to={"/festival/"+(i+1).toString()}
										>
											<ListItemText primary={f} align='center'/>
										</ListItem>
										{(i == this.props.festivals.length - 1) && <Divider/>}
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
