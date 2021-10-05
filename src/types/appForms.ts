export type formDataType = {
	[key: string]: string | File;
	service: string;
	text: string;
	email: string;
	name: string;
	comment: string;
	lang: string;
	file?: any;
};

export type dataForCountType = {
	fileName: string;
	textLength: number;
	lang: string;
	service: string;
	fileType: string;
};
