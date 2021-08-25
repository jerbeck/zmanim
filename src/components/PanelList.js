import React from 'react';
import Panel from './Panel';

const PanelList = ({ times }) => {
	console.log(times);
	return (
		<div className='flex flex-column w-25 pa3 mr2 center'>
			{
				times.map((key, i) => {
					return (
						<Panel 
						zman={key[0]}
						time={key[1]}
						/>
					);
				})
			}
		</div>
		)
}

export default PanelList