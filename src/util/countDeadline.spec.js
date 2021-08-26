import { getDeadline } from './countDeadline';

describe('countPrice :', () => {
	beforeEach(() => {
		jest.useFakeTimers('modern').setSystemTime(new Date('2021-08-26T12:10:00'));
	});

	test('should return current day for cyrillic', () => {
		expect(getDeadline(2031, 'cyrillic', 'application/msword')).toBe('Срок сдачи: 26.08.21 в 14.11');
	});

	test('should return next day (27) for cyrillic', () => {
		expect(getDeadline(9920, 'cyrillic', 'application/msword')).toBe('Срок сдачи: 27.08.21 в 11.07');
	});

	test('should return 30.08.21 excluding weekends for cyrillic', () => {
		expect(getDeadline(26784, 'cyrillic', 'application/msword')).toBe('Срок сдачи: 30.08.21 в 14.46');
	});

	test('should return current day for latin', () => {
		expect(getDeadline(2031, 'latin', 'application/msword')).toBe('Срок сдачи: 26.08.21 в 18.46');
	});

	test('should return next day (27) day for latin', () => {
		expect(getDeadline(3920, 'latin', 'application/msword')).toBe('Срок сдачи: 27.08.21 в 15.26');
	});

	test('should return 01.09.21 excluding weekends day for latin', () => {
		expect(getDeadline(13945, 'latin', 'application/msword')).toBe('Срок сдачи: 01.09.21 в 18.33');
	});
});
