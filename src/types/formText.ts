import React from 'react';
import { dataForCountType, formDataType } from './appForms';

export type formTextProps = {
	dataForCount: dataForCountType;
	textareaValue: string;
	setDataForCount: React.Dispatch<React.SetStateAction<dataForCountType>>;
	setFormData: React.Dispatch<React.SetStateAction<formDataType>>;
};
