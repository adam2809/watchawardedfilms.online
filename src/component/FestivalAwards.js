import React from 'react';
import { withRouter } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

import MaterialTable from 'material-table'

import WatchDialog from './WatchDialog'


class FestivalAwards extends React.Component {
	fId

	constructor(props){
		super()
		this.state = {films:[],
                      showDialog:false,
                      chosenMovie:'',
					  errorOcurred:false}
	  	this.fId = props.match.params.festId
	}

	render(){
		return(
			<div align='center'>
				<Typography variant='h4' style={{paddingTop:25,paddingBottom:25}}>{this.props.festivals[this.fId-1]}</Typography>
				<Box width={600}>
					<MaterialTable
						columns={[
							{title: 'Title',field:'name'},
							{title:'Award',field:'award'},
							{title:'Year',field:'year'},
						]}
						data={query => new Promise((resolve,reject) => {
							fetch(process.env.REACT_APP_API_URL+"festival/"+this.fId)
							.then(res => res.json())
							.then(res => {
								resolve({
									data: res.films
								})
							})
							.catch(err => {
								this.setState({
									errorOcurred: true
								})
							})
						})}
						actions={[
							{
							  icon: 'movie',
							  tooltip: 'Show watch offers',
							  onClick: (event, rowData) => {
								  this.setState({
									  chosenMovie:rowData.name,
									  showDialog:true
								  })
							  }
							}
						]}
						options={{paging:false,showTitle:false}}
						localization={{
							header: {actions:''}
						}}
					/>
				</Box>
				<Snackbar
					open={this.state.errorOcurred}
					onClose={() => this.setState({errorOcurred:false})}>
					<Alert
						onClose={() => this.setState({errorOcurred:false})}
						severity='error'>
						Could not retrieve films list
					</Alert>
				</Snackbar>
				<WatchDialog
					open={this.state.showDialog}
					maxWidth={'md'}
					onClose={() => this.setState({showDialog:false})}
					movie={this.state.chosenMovie}
				/>
			</div>
		)
	}
}

export default withRouter(FestivalAwards)
