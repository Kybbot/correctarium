import { defaultFiles } from '../constants';

type getDateInfoResult = {
	year: number;
	month: number;
	day: number;
	dayOfWeek: number;
	readableDate: string;
	currentTime: number;
};

function timeConvert(n: number): number {
	const num: number = n; // minutes
	const hours: number = num / 60; // conver minutes to houres and minutes
	const rhours: number = Math.floor(hours); // get houres without minutes

	const minutes: number = (hours - rhours) * 60; // get minutes without houres
	let rminutes: number | string = Math.round(minutes); // get integer minutes

	rminutes = rminutes < 10 ? `0${rminutes}` : rminutes;

	return Number(`${rhours}.${rminutes}`);
}

function getWorkTime(textLength: number, textType: string, fileType: string): number {
	const maxCyrillicSignForHoure = 1333;
	const maxLatinSignForHoure = 333;

	const baseTime = 30; // min
	const minTimeOfProcessing = 60; // min

	const percent = 20;
	let addPercent = true;

	let time: number;

	switch (textType) {
		case 'cyrillic':
			time = Number(((textLength / maxCyrillicSignForHoure) * 60).toFixed());
			break;
		case 'latin':
			time = Number(((textLength / maxLatinSignForHoure) * 60).toFixed());
			break;
		default:
			time = Number(((textLength / maxCyrillicSignForHoure) * 60).toFixed());
			break;
	}

	// check filte type
	for (let i = 0; i < defaultFiles.length; i++) {
		if (fileType === defaultFiles[i]) addPercent = false;
	}

	if (addPercent) {
		time += Math.round((time / 100) * percent);
	}

	time += baseTime;

	time = Math.max(time, minTimeOfProcessing);

	return timeConvert(time);
}

function getDateInfo(date: Date): getDateInfoResult {
	const dayOfWeek: number = date.getDay();

	const year: number = date.getFullYear();
	let month: number | string = date.getMonth() + 1;
	let day: number | string = date.getDate();

	month = month < 10 ? `0${month}` : month;
	day = day < 10 ? `0${day}` : day;

	const readableDate = `${day}.${month}.${String(year).slice(2)}`;

	const currentHour: number = date.getHours();
	let currentMinuts: number | string = date.getMinutes();

	currentMinuts = currentMinuts < 10 ? `0${currentMinuts}` : currentMinuts;

	const currentTime = Number(`${currentHour}.${currentMinuts}`);

	return {
		year,
		month: +month - 1,
		day: +day,
		dayOfWeek,
		readableDate,
		currentTime,
	};
}

// checks the day of the week

function workDate(y: number, m: number, d: number): string | null {
	const date: Date = new Date(y, m, d);
	const dateInfo: getDateInfoResult = getDateInfo(date);

	if (dateInfo.dayOfWeek === 0 || dateInfo.dayOfWeek === 6) {
		return null;
	}

	return dateInfo.readableDate;
}

// returns weekday date

function getNextWorkDate(year: number, month: number, day: number): string {
	let nextDate: string | null = null;
	let n = 0;

	while (nextDate === null) {
		n += 1;
		nextDate = workDate(year, month, day + n);
	}

	return nextDate;
}

// sums up the time for work and the current time

function getEndOfWork(a: number, b: number): number {
	const aArr: string[] = a.toString().split('.'); // split time on hourse and minutes
	if (aArr[1]?.length === 1) aArr[1] += '0'; // if a = 1.2 => convert to 1.20

	const aMin: number = +aArr[0] * 60 + (+aArr[1] || 0); // convert to minutes

	const bArr: string[] = b.toString().split('.');
	if (bArr[1]?.length === 1) bArr[1] += '0';

	const bMin: number = +bArr[0] * 60 + (+bArr[1] || 0);

	const result: number = timeConvert(aMin + bMin); // get time in hourse and minutes

	return result;
}

// return final date and time without non-working hours and weekends

function getFinalResult(endOfWork: number, startDaysToWork: number, dateInfo: getDateInfoResult): string {
	const startWorkDay = 10.0;
	const endWorkDay = 19.0;

	let diff = Number((endOfWork - endWorkDay).toFixed(2));
	let daysToWork: number = startDaysToWork;

	// counting how many days to spend on work

	while (diff >= 9.01) {
		daysToWork += 1;
		diff = Number((diff - 9).toFixed(2));
	}

	let n = 1;
	let nextDate: Date;
	let finalDate: getDateInfoResult;

	while (daysToWork) {
		nextDate = new Date(dateInfo.year, dateInfo.month, dateInfo.day + n);
		finalDate = getDateInfo(nextDate);

		if (finalDate.dayOfWeek !== 0 && finalDate.dayOfWeek !== 6) {
			daysToWork -= 1;
		}

		n += 1;
	}

	const finalEndOfWork: string = (diff + startWorkDay).toFixed(2);

	return `Срок сдачи: ${finalDate!.readableDate} в ${finalEndOfWork}`;
}

// main function

export function getDeadline(textLength: number, textType: string, fileType: string): string {
	if (!textLength || !textType || !fileType) {
		return '';
	}

	const workTime: number = getWorkTime(textLength, textType, fileType);

	const startWorkDay = 10.0;
	const endWorkDay = 19.0;

	const date: Date = new Date();
	const dateInfo = getDateInfo(date);

	const { currentTime } = dateInfo;

	let endOfWork: number = getEndOfWork(workTime, currentTime);

	if (currentTime >= endWorkDay || dateInfo.dayOfWeek === 0 || dateInfo.dayOfWeek === 6) {
		endOfWork = workTime + startWorkDay;

		if (endOfWork > endWorkDay) {
			return getFinalResult(endOfWork, 2, dateInfo);
		}

		const nextDate = getNextWorkDate(dateInfo.year, dateInfo.month, dateInfo.day);

		return `Срок сдачи: ${nextDate} в ${endOfWork.toFixed(2)}`;
	}

	if (currentTime < startWorkDay) {
		endOfWork = workTime + startWorkDay;

		if (endOfWork > endWorkDay) {
			return getFinalResult(endOfWork, 1, dateInfo);
		}

		return `Срок сдачи: ${dateInfo.readableDate} в ${endOfWork.toFixed(2)}`;
	}

	if (endOfWork > endWorkDay) {
		return getFinalResult(endOfWork, 1, dateInfo);
	}

	return `Срок сдачи: ${dateInfo.readableDate} в ${endOfWork.toFixed(2)}`;
}
