import React from 'react';
import { withRouter } from "react-router-dom";

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
			<div>
				<h1>This is the list of all awards for {this.props.getFestivals()[this.fId-1]}</h1>
				{this.state.isLoading && <h2>Loading...</h2>}
				{this.state.errorOcurred && <h2>Could not retrieve films list</h2>}

				{this.state.films.map((f,i) => <p key={i}>{i}: {f.name} | {f.year} | {f.award}</p>)}
			</div>
		)
	}
}

export default withRouter(FestivalAwards)
