import React from 'react';
import LinksToWatch from './LinksToWatch'

export default class WatchModal extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			isLoading: true,
			errorOccurred: false,
			jwResponse: {}
		}
	}

	componentDidMount(){
		fetch(process.env.REACT_APP_API_URL+'test')
		.then(res => res.json())
		.then(res => {
			this.setState({
				isLoading:false,
				jwResponse:res
			})
		})
		.catch(err => {
			this.setState({
				isLoading:false,
				errorOcurred:true
			})
		})
	}

	getMonetizationTypes(){
		if(this.state.isLoading || this.state.errorOcurred){
			return []
		}
		return [...new Set(this.state.jwResponse.items[0].offers.map(o => o.monetization_type))]
	}

	render(){
		return (
			<div>
				<h2>Where to watch {this.props.title}</h2>
				{this.state.isLoading && <h3>Loading...</h3>}
				{this.state.errorOcurred && <h3>Could not retrieve films list</h3>}
				{this.getMonetizationTypes().map((monetType,i) => {
					return <LinksToWatch
								monetizationType={monetType}
								offers={this.state.jwResponse.items[0].offers}
								key={i}
							/>
				})}
			</div>
		)
	}
}
