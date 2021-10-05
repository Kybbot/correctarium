import React from 'react';
import arrowDown from '../assets/img/arrow_down.svg';

import {
	formSelectProps,
	handleKeyDownOnSelectItemType,
	handleOnSelectItemType,
	handleSelectChangeType,
} from '../types/formSelect';

const FormSelect: React.FC<formSelectProps> = React.memo(
	({ items, name, formName, setDataForCount, setFormData }: formSelectProps) => {
		const [visiblePopup, setVisiblePopup] = React.useState<boolean>(false);
		const [value, setValue] = React.useState<string>('');

		const selectRef = React.useRef<HTMLDivElement>(null);

		const toggleVisiblePopup = () => {
			setVisiblePopup(!visiblePopup);
		};

		const toggleVisiblePopuponKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === 'Enter') {
				setVisiblePopup(!visiblePopup);
			}
		};

		const handleOutsideClick = (event: any) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setVisiblePopup(false);
			}
		};

		const handleSelectChange: handleSelectChangeType = (name, value, type) => {
			setDataForCount((state) => ({
				...state,
				[name]: type,
			}));

			setFormData((state) => ({
				...state,
				[name]: value,
			}));
		};

		const handleOnSelectItem: handleOnSelectItemType = (name, value) => {
			setValue(name);
			handleSelectChange(formName, name, value);
			setVisiblePopup(!visiblePopup);
		};

		const handleKeyDownOnSelectItem: handleKeyDownOnSelectItemType = (event, name, value) => {
			if (event.key === 'Enter') {
				setValue(name);
				handleSelectChange(formName, name, value);
				setVisiblePopup(!visiblePopup);
			}
		};

		React.useEffect(() => {
			document.body.addEventListener('click', handleOutsideClick);
		}, []);

		return (
			<div
				ref={selectRef}
				className='select'
				onClick={toggleVisiblePopup}
				onKeyDown={toggleVisiblePopuponKeyDown}
				role='button'
				tabIndex={0}
			>
				<div className='select__label'>
					<span className={`select__name ${value ? 'select__name--min' : ''}`}>{name}</span>
					<span className={`select__value ${value ? '' : 'select__value--hiden'}`}>{value}</span>
					<img
						className={`select__arrow ${visiblePopup ? 'select__arrow--open' : ''}`}
						src={arrowDown}
						alt='Arrow down'
					/>
				</div>
				{visiblePopup && (
					<div className='select__popup'>
						{items.map((item) => (
							<div
								className='select__item'
								key={item.name}
								onClick={() => handleOnSelectItem(item.name, item.value)}
								onKeyDown={(event) => handleKeyDownOnSelectItem(event, item.name, item.value)}
								role='button'
								tabIndex={0}
							>
								{item.name}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}
);

export default FormSelect;
