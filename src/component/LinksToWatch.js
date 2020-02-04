import React from 'react'

export default function LinksToWatch(props){
	return (
		<div>
			<h3>{props.monetizationType}</h3>
			{props.offers.filter(o => o.monetization_type == props.monetizationType)
                         .map((o,i) => {
							 return (
								<p key={i}>
								 	<a target="_blank" rel="noopener noreferrer" href={o.urls.standard_web}>
										{o.urls.standard_web}
									</a>
									<br/>
									{o.retail_price}
								</p>
							 )
						 })
	 		}
		</div>
	)
}
