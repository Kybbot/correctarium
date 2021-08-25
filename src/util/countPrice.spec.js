import { countPrice } from './countPrice';

describe('countPrice :', () => {
	test('should return cyrillicMinPrice', () => {
		expect(countPrice(100, 'cyrillic', 'application/msword')).toBe(50);
	});

	test('should return latinMinPrice', () => {
		expect(countPrice(100, 'latin', 'application/msword')).toBe(120);
	});

	test('should return cyrillic price', () => {
		expect(countPrice(1010, 'cyrillic', 'application/msword')).toBeGreaterThan(50);
	});

	test('should return latin price', () => {
		expect(countPrice(1015, 'latin', 'application/msword')).toBeGreaterThan(120);
	});

	test('should return cyrillic price with percent', () => {
		expect(countPrice(900, 'cyrillic', 'txt')).toBeGreaterThan(50);
	});

	test('should return latin price with percent', () => {
		expect(countPrice(850, 'latin', 'txt')).toBeGreaterThan(120);
	});
});
