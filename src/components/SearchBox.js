import React from 'react';

const SearchBox = ({ lookup }) => {
	return (
		<div className='tc pa2'>
			<input 
				className='pa2 ba b--blue bg-lightest-blue'
				type='search' 
				placeholder='Zip Code'
				onChange={lookup} 
			/>				
		</div>
	)
}

export default SearchBox;