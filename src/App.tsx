import React from 'react';

import { FormInput, FormSelect, FormText } from './components';

import { countPrice } from './util/countPrice';
import { getDeadline } from './util/countDeadline';

import { formDataType, dataForCountType } from './types/appForms';
import { selectOptionsItems } from './types/formSelect';

const services: selectOptionsItems[] = [
	{ name: 'Редактирование', value: 'edit' },
	{ name: 'Перевод', value: 'translate' },
];

const langs: selectOptionsItems[] = [
	{ name: 'Украинский', value: 'cyrillic' },
	{ name: 'Русский', value: 'cyrillic' },
	{ name: 'Английский', value: 'latin' },
	{ name: 'Английский (носитель)', value: 'latin' },
];

const App = () => {
	const [formData, setFormData] = React.useState<formDataType>({
		service: '',
		text: '',
		email: '',
		name: '',
		comment: '',
		lang: '',
	});

	const [price, setPrice] = React.useState<number>(0);
	const [deadline, setDeadline] = React.useState<string>('');
	const [isDisabled, setIsDisabled] = React.useState<boolean>(true);

	const [dataForCount, setDataForCount] = React.useState<dataForCountType>({
		fileName: '',
		textLength: 0,
		lang: '',
		service: '',
		fileType: 'application/msword',
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		setFormData((state) => ({
			...state,
			[name]: value,
		}));
	};

	const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data = new FormData();

		for (let key in formData) {
			data.set(key, formData[key]);
		}

		console.log('Send data to server');
	};

	React.useEffect(() => {
		const arrOfRes: boolean[] = [];

		for (let key in formData) {
			if (key !== 'comment') {
				arrOfRes.push(!!formData[key]);
			}
		}

		if (!arrOfRes.includes(false)) {
			setIsDisabled(false);
		} else {
			setIsDisabled(true);
		}
	}, [formData]);

	React.useEffect(() => {
		const countedPrice = countPrice(dataForCount.textLength, dataForCount.lang, dataForCount.fileType);
		const countedDeadline = getDeadline(dataForCount.textLength, dataForCount.lang, dataForCount.fileType);

		setPrice(countedPrice);
		setDeadline(countedDeadline);
	}, [dataForCount]);

	return (
		<div className='app'>
			<form className='form' onSubmit={handleFormSubmit}>
				<div className='form__data'>
					<h2 className='form__title'>Заказать перевод или редактирование</h2>
					<FormSelect
						items={services}
						name='Услуга'
						formName='service'
						setDataForCount={setDataForCount}
						setFormData={setFormData}
					/>
					<FormText
						dataForCount={dataForCount}
						textareaValue={formData.text}
						setDataForCount={setDataForCount}
						setFormData={setFormData}
					/>
					<fieldset className='form__fieldset'>
						<FormInput
							labelName='Ваша эл.почта'
							type='email'
							placeholder='Ваша эл.почта'
							name='email'
							required
							value={formData.email}
							onChange={handleInputChange}
						/>
						<FormInput
							labelName='Ваше имя'
							type='text'
							placeholder='Ваше имя'
							name='name'
							required
							value={formData.name}
							onChange={handleInputChange}
						/>
					</fieldset>
					<fieldset className='form__fieldset'>
						<FormInput
							labelName='Комментарий к заказу или ссылка'
							type='text'
							placeholder='Комментарий к заказу или ссылка'
							name='comment'
							value={formData.comment}
							onChange={handleInputChange}
						/>
						<FormSelect
							items={langs}
							name='Язык'
							formName='lang'
							setDataForCount={setDataForCount}
							setFormData={setFormData}
						/>
					</fieldset>
				</div>
				<div className='form__order'>
					<button className='form__close' type='button'></button>
					<p className='form__price'>
						{price}
						<span className='form__currency'>грн</span>
					</p>
					<p className='form__deadline'>{deadline}</p>
					<button className='form__submit' type='submit' disabled={isDisabled}>
						Заказать
					</button>
				</div>
			</form>
		</div>
	);
};

export default App;
