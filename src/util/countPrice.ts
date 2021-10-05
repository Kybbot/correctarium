import { defaultFiles } from '../constants';

export function countPrice(textLength: number, textType: string, fileType: string): number {
	if (!textLength || !textType || !fileType) {
		return 0;
	}

	const oneCyrillicSignPrice = 0.05;
	const oneLatinSignPrice = 0.12;

	const cyrillicMinPrice = 50;
	const latinMinPrice = 120;

	const percent = 20;
	let addPercent = true;

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
