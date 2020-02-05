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
import CircularProgress from '@material-ui/core/CircularProgress';

class FestivalAwards extends React.Component {
	fId

	constructor(props){
		super()
		this.state = {films:[],
                      isLoading:true,
					  errorOcurred:false}
	  	this.fId = props.match.params.festId
	}

	componentDidMount(){
		fetch(process.env.REACT_APP_API_URL+"festival/"+this.fId)
		.then(res => res.json())
		.then(res => {
			this.setState({
				films: res.films,
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
				<h1>This is the list of all awards for {this.props.getFestivals()[this.fId-1]}</h1>
				<Box width={600}>
				{this.state.isLoading ? <CircularProgress color='primary' /> :
						<TableContainer component={Paper}>
							<Table aria-label={"Awards for "+this.props.getFestivals()[this.fId-1]}>
								<TableHead>
									<TableRow>
										<TableCell>Title</TableCell>
										<TableCell>Award</TableCell>
										<TableCell>Year</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{
										this.state.films.sort((a,b) => (a.year < b.year) ? 1 : -1).map((f,i) => (
											<TableRow key={i}>
												<TableCell>{f.name}</TableCell>
												<TableCell>{f.award}</TableCell>
												<TableCell>{f.year}</TableCell>
											</TableRow>
										))
									}
								</TableBody>
							</Table>
						</TableContainer>
					}
				</Box>


				{this.state.errorOcurred && <h2>Could not retrieve films list</h2>}

				{this.state.films.map((f,i) => <p key={i}>{i}: {f.name} | {f.year} | {f.award}</p>)}
			</div>
		)
	}
}

export default withRouter(FestivalAwards)
