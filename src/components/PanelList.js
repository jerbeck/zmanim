import React from 'react';
import Panel from './Panel';

const PanelList = ({ data }) => {
	return (
		<div className='flex flex-column w-25 pa3 mr2 center'>
			{
				Object.entries(data).map(([key, value]) => {
					return (
						<Panel 
						zman={key}
						time={value}
						/>
						)
				})
			}
		</div>
		)
}

export default PanelList