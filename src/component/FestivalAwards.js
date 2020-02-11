import React from 'react';
import { withRouter } from "react-router-dom";

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
import Drawer from '@material-ui/core/Drawer';

import Alert from '@material-ui/lab/Alert';

import MaterialTable from 'material-table'

import WatchDrawer from './WatchDrawer'


class FestivalAwards extends React.Component {
	fId

	constructor(props){
		super()
		this.state = {films:[],
                      showDrawer:false,
                      chosenMovie:'',
					  errorOcurred:false}
	  	this.fId = props.match.params.festId
	}

	render(){
		return(
			<div align='center'>
				<h1>This is the list of all awards for {this.props.festivals[this.fId-1]}</h1>
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
									  showDrawer:true
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
				<Drawer anchor='top' open={this.state.showDrawer}>
					<WatchDrawer/>
				</Drawer>
			</div>
		)
	}
}

export default withRouter(FestivalAwards)
