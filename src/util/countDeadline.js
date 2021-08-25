import { defaultFiles } from '../constants';

function timeConvert(n) {
	const num = n;
	const hours = num / 60;
	const rhours = Math.floor(hours);

	const minutes = (hours - rhours) * 60;
	let rminutes = Math.round(minutes);

	rminutes = rminutes < 10 ? '0' + rminutes : rminutes;

	return Number(`${rhours}.${rminutes}`);
}

function getWorkTime(textLength, textType, fileType) {
	const maxCyrillicSignForHoure = 1333;
	const maxLatinSignForHoure = 333;

	const baseTime = 30; //min
	const minTimeOfProcessing = 60; //min

	const percent = 20;
	let addPercent = true;

	let time;

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

function getDateInfo(date) {
	const dayOfWeek = date.getDay();

	const year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;

	const readableDate = `${day}.${month}.${String(year).slice(2)}`;

	const currentHour = date.getHours();
	let currentMinuts = date.getMinutes();

	currentMinuts = currentMinuts < 10 ? '0' + currentMinuts : currentMinuts;

	const currentTime = Number(`${currentHour}.${currentMinuts}`);

	return {
		year,
		month: month - 1,
		day,
		dayOfWeek,
		readableDate,
		currentTime,
	};
}

function workDate(y, m, d) {
	const date = new Date(y, m, d);
	const dateInfo = getDateInfo(date);

	if (dateInfo.dayOfWeek === 0 || dateInfo.dayOfWeek === 6) {
		return null;
	}

	return dateInfo.readableDate;
}

function getNextWorkDate(year, month, day) {
	let nextDate = null;
	let n = 0;

	while (nextDate === null) {
		n += 1;
		nextDate = workDate(year, month, day + n);
	}

	return nextDate;
}

function getEndOfWork(a, b) {
	const aArr = a.toString().split('.');
	if (aArr[1]?.length === 1) aArr[1] = aArr[1] + '0';

	const aMin = +aArr[0] * 60 + (+aArr[1] || 0);

	const bArr = b.toString().split('.');
	if (bArr[1]?.length === 1) bArr[1] = bArr[1] + '0';

	const bMin = +bArr[0] * 60 + (+bArr[1] || 0);

	const result = timeConvert(aMin + bMin);

	return result;
}

export function countDeadline(textLength, textType, fileType) {
	if (!textLength || !textType || !fileType) {
		return '';
	}

	const workTime = getWorkTime(textLength, textType, fileType);

	const startWorkTime = 10.0;
	const endWorkTime = 19.0;

	const date = new Date();
	const dateInfo = getDateInfo(date);

	const currentTime = dateInfo.currentTime;

	let endOfWork = getEndOfWork(workTime, currentTime);

	if (currentTime >= endWorkTime || dateInfo.dayOfWeek === 0 || dateInfo.dayOfWeek === 6) {
		endOfWork = (workTime + startWorkTime).toFixed(2);

		const nextDate = getNextWorkDate(dateInfo.year, dateInfo.month, dateInfo.day);

		return `Срок сдачи: ${nextDate} в ${endOfWork}`;
	}

	if (endOfWork > endWorkTime) {
		const diff = Number((endOfWork - endWorkTime).toFixed(2));
		endOfWork = (startWorkTime + diff).toFixed(2);

		const nextDate = getNextWorkDate(dateInfo.year, dateInfo.month, dateInfo.day);

		return `Срок сдачи: ${nextDate} в ${endOfWork}`;
	}

	if (currentTime < startWorkTime) {
		endOfWork = (workTime + startWorkTime).toFixed(2);

		return `Срок сдачи: ${dateInfo.readableDate} в ${endOfWork}`;
	}

	return `Срок сдачи: ${dateInfo.readableDate} в ${endOfWork.toFixed(2)}`;
}
