import React from 'react';

const FormInput = ({ labelName, ...rest }) => {
	const inputRef = React.useRef();

	return (
		<label className='label'>
			<input ref={inputRef} className='input' {...rest} />
			<span className={`label__name ${inputRef?.current?.value ? 'label__name--visible' : ''}`}>{labelName}</span>
		</label>
	);
};

export default FormInput;
