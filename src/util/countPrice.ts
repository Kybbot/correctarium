import { defaultFiles } from '../constants';

export function countPrice(textLength: number, textType: string, fileType: string) {
	if (!textLength || !textType || !fileType) {
		return 0;
	}

	const oneCyrillicSignPrice: number = 0.05;
	const oneLatinSignPrice: number = 0.12;

	const cyrillicMinPrice: number = 50;
	const latinMinPrice: number = 120;

	const percent: number = 20;
	let addPercent: boolean = true;

	let price: number;

	switch (textType) {
		case 'cyrillic':
			price = Math.round(oneCyrillicSignPrice * textLength);
			break;
		case 'latin':
			price = Math.round(oneLatinSignPrice * textLength);
			break;
		default:
			price = Math.round(oneCyrillicSignPrice * textLength);
			break;
	}

	for (let i = 0; i < defaultFiles.length; i++) {
		if (fileType === defaultFiles[i]) addPercent = false;
	}

	if (addPercent) {
		price += Math.round((price / 100) * percent);
	}

	switch (textType) {
		case 'cyrillic':
			return Math.max(price, cyrillicMinPrice);
		case 'latin':
			return Math.max(price, latinMinPrice);
		default:
			return Math.max(price, cyrillicMinPrice);
	}
}
