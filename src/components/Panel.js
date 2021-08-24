import React from 'react';

const Panel = ({zman, time}) => {
	return (
		<div className='tc bg-light-blue dib br3 pa3 ma2 grow bw2 shadow-5'>
				<h2>{zman}</h2>
				<p>{time}</p>
		</div>
	)
}

export default Panel;