import React from 'react';
import { Link } from "react-router-dom";

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
		this.state = {festivals:[],
                      isLoading:true,
					  errorOcurred:false}
	}

	componentDidMount(){
		fetch(process.env.REACT_APP_API_URL+"festivals")
		.then(res => res.json())
		.then(res => {
			this.props.setFestivals(res.festivals)
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
		return(
			<div align='center'>
				<Typography variant="h2">
					Available festivals:
				</Typography>
				{this.state.isLoading && <CircularProgress color='primary'></CircularProgress>}
				{this.state.errorOcurred && <Typography variant='h3'>Could not retrieve festival list</Typography>}
				<Box width={300}>
					<Paper>
						<List>
							{this.state.festivals.map((f,i) => {
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
										{(i != this.state.festivals.length - 1) && <Divider/>}
									</>
								)
							})}
						</List>
					</Paper>
				</Box>
			</div>
		)
	}
}
