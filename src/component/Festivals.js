import React, { Component } from 'react';

export default class Festivals extends React.Component {
	constructor(props){
		super(props)
		this.state = {festivals:[],
                      isLoading:true,
					  errorOcurred:false}
	}

	componentDidMount(){
		fetch("http://localhost:8000/api/festivals")
		.then(res => res.json())
		.then(res => {
			this.setState({
				festivals: res.festivals,
				isLoading: false,
			})
		})
		.catch(err => {
			console.log('errrrrrrrrrrrrrrr')
			this.setState({
				error: true,
				isLoading: false
			})
		})
	}

	render(){
		return(
			<div>
				<h1>This is the list of all available festivals</h1>
				{this.state.isLoading && <h2>Loading...</h2>}
				{this.state.errorOcurred && <h2>Could not retrieve festival list</h2>}

				{this.state.festivals.map((fest,index) => <p key={index}>{index}: {fest}</p>)}
			</div>
		)
	}
}
