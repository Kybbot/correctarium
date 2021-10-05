import React from 'react';

import { formInputProps } from '../types/formInput';

const FormInput: React.FC<formInputProps> = ({ labelName, ...rest }) => {
	const inputRef = React.useRef<HTMLInputElement>(null);

	return (
		<label className='label'>
			<input ref={inputRef} className='input' {...rest} />
			<span className={`label__name ${inputRef?.current?.value ? 'label__name--visible' : ''}`}>{labelName}</span>
		</label>
	);
};

export default FormInput;
