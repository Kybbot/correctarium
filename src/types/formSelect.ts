import React from 'react';
import { formDataType, dataForCountType } from './appForms';

export type selectOptionsItems = {
	name: string;
	value: string;
};

export type formSelectProps = {
	items: selectOptionsItems[];
	name: string;
	formName: string;
	setDataForCount: React.Dispatch<React.SetStateAction<dataForCountType>>;
	setFormData: React.Dispatch<React.SetStateAction<formDataType>>;
};

export type handleSelectChangeType = {
	(name: string, value: string, type: string): void;
};

export type handleOnSelectItemType = {
	(name: string, value: string): void;
};

export type handleKeyDownOnSelectItemType = {
	(event: React.KeyboardEvent, name: string, value: string): void;
};
