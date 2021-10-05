import React from 'react';
import { formTextProps } from '../types/formText';

const FormText: React.FC<formTextProps> = ({ dataForCount, textareaValue, setDataForCount, setFormData }) => {
	const [open, setOpen] = React.useState(false);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = event.target;
		const file = event.target.files![0];

		let reader = new FileReader();

		reader.readAsText(file);

		reader.onload = function () {
			setDataForCount((state) => ({
				...state,
				fileName: file.name,
				fileType: file.type,
				textLength: reader.result!.toString().trim().length,
			}));

			setOpen(true);
		};

		setFormData((state) => ({
			...state,
			text: 'Text in file',
			[name]: file,
		}));
	};

	const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = event.target;

		setDataForCount((state) => ({
			...state,
			textLength: value.trim().length,
		}));

		setFormData((state) => ({
			...state,
			[name]: value,
		}));
	};

	const fileRef = React.useRef<HTMLInputElement>(null);

	const handleFileOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		fileRef.current!.click();
	};

	return (
		<div className='area'>
			<textarea className='textarea' name='text' onChange={handleTextareaChange} value={textareaValue}></textarea>
			<div className={`area__download ${textareaValue ? 'area__download--hiden' : ''}`}>
				<span className='placeholder'>Вставьте текст или </span>
				<label className='area__label' htmlFor='textFile'>
					загрузите файл
					<input ref={fileRef} id='textFile' className='file' type='file' name='file' onChange={handleFileChange} />
				</label>
			</div>
			<div className={`area__info ${open ? 'area__info--open' : ''}`}>
				<div className='area__name'>{dataForCount.fileName}</div>
				<div className='area__length'>Количество символов: {dataForCount.textLength}</div>
				<button className='area__btn' type='button' onClick={handleFileOpen}>
					загрузите файл
				</button>
			</div>
		</div>
	);
};

export default FormText;
