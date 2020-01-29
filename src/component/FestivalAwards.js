import React, { Component } from 'react';
import { withRouter } from "react-router-dom";

class FestivalAwards extends React.Component {
	constructor(props){
		super()
		this.state = {films:[],
                      isLoading:true,
					  errorOcurred:false}
	}

	componentDidMount(){
		fetch("http://localhost:8000/api/festival/"+this.props.match.params.festId)
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
			<div>
				<h1>This is the list of all awards for {this.props.festName}</h1>
				{this.state.isLoading && <h2>Loading...</h2>}
				{this.state.errorOcurred && <h2>Could not retrieve films list</h2>}

				{this.state.films.map((f,i) => <p key={i}>{i}: {f.name}		{f.year}	{f.award}</p>)}
			</div>
		)
	}
}

export default withRouter(FestivalAwards)
