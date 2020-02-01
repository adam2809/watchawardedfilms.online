import React from 'react';
import { Link } from "react-router-dom";
import { Text } from 'rebass'

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

				{this.state.festivals.map((f,i) => {
					return <Link to={"/festival/"+(i+1).toString()} key={i}> {f}<br/> </Link>
				})}
			</div>
		)
	}
}
