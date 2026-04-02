const { test, expect } = require('@jest/globals');
const { validateUsername, initializeData, showFeedback, months, monthKeys, monthlyData } = require('../script.js');

// ============ Basic Math Test ============
test('hello world!', () => {
    expect(1 + 1).toBe(2);
});

// ============ validateUsername Function Tests ============
describe('validateUsername', () => {
    test('should return all false for empty string', () => {
        const result = validateUsername('');
        expect(result.length).toBe(false);
        expect(result.uppercase).toBe(false);
        expect(result.number).toBe(false);
        expect(result.special).toBe(false);
    });

    test('should validate length requirement (8+ characters)', () => {
        expect(validateUsername('short').length).toBe(false);
        expect(validateUsername('longenough').length).toBe(true);
    });

    test('should validate uppercase requirement', () => {
        expect(validateUsername('abcdefgh').uppercase).toBe(false);
        expect(validateUsername('Abcdefgh').uppercase).toBe(true);
    });

    test('should validate number requirement', () => {
        expect(validateUsername('Abcdefgh').number).toBe(false);
        expect(validateUsername('Abcdefgh1').number).toBe(true);
    });

    test('should validate special character requirement', () => {
        expect(validateUsername('Abcdefgh1').special).toBe(false);
        expect(validateUsername('Abcdefgh1!').special).toBe(true);
    });

    test('should accept various special characters', () => {
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '-', '='];
        specialChars.forEach(char => {
            const username = `MyPass123${char}`;
            expect(validateUsername(username).special).toBe(true);
        });
    });

    test('should validate complete valid username', () => {
        const result = validateUsername('MyPass123!');
        expect(result.length).toBe(true);
        expect(result.uppercase).toBe(true);
        expect(result.number).toBe(true);
        expect(result.special).toBe(true);
    });

    test('should handle very long usernames', () => {
        const longUsername = 'MyPass123!' + 'a'.repeat(100);
        const result = validateUsername(longUsername);
        expect(result.length).toBe(true);
    });

    test('should be case-sensitive for uppercase requirement', () => {
        expect(validateUsername('mypass123!').uppercase).toBe(false);
        expect(validateUsername('MYPASS123!').uppercase).toBe(true);
    });
});

// ============ initializeData Function Tests ============
describe('initializeData', () => {
	beforeEach(() => {
		// Reset monthlyData before each test
		Object.keys(monthlyData).forEach(key => delete monthlyData[key]);
	});

    test('should have income and expense properties for each month', () => {
        initializeData();
        monthKeys.forEach(key => {
            expect(monthlyData[key]).toHaveProperty('income');
            expect(monthlyData[key]).toHaveProperty('expense');
        });
    });

    test('should generate random values between 50 and 1000', () => {
        initializeData();
        monthKeys.forEach(key => {
            expect(monthlyData[key].income).toBeGreaterThanOrEqual(50);
            expect(monthlyData[key].income).toBeLessThanOrEqual(1000);
            expect(monthlyData[key].expense).toBeGreaterThanOrEqual(50);
            expect(monthlyData[key].expense).toBeLessThanOrEqual(1000);
        });
    });

    test('should generate numeric values', () => {
        initializeData();
        monthKeys.forEach(key => {
            expect(typeof monthlyData[key].income).toBe('number');
            expect(typeof monthlyData[key].expense).toBe('number');
        });
    });

    test('should use correct monthKeys', () => {
        initializeData();
        expect(Object.keys(monthlyData).sort()).toEqual(monthKeys.sort());
    });
});

// ============ showFeedback Function Tests ============
describe('showFeedback', () => {
    let feedbackAlert;

    beforeEach(() => {
        // Mock DOM element
        feedbackAlert = {
            className: '',
            textContent: '',
            style: { display: 'none' }
        };
		// Mock the global document object
		global.document = {
			getElementById: jest.fn(() => feedbackAlert)
		};
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		delete global.document;
	});

	test('should set alert class with type', () => {
		showFeedback('Test message', 'success');
		expect(feedbackAlert.className).toBe('alert alert-success alert-feedback');
	});

	test('should set message text content', () => {
		showFeedback('Test message', 'danger');
		expect(feedbackAlert.textContent).toBe('Test message');
	});

	test('should display the alert', () => {
		showFeedback('Test message', 'info');
		expect(feedbackAlert.style.display).toBe('block');
	});

	test('should handle different alert types', () => {
		const types = ['success', 'danger', 'warning', 'info'];
		types.forEach(type => {
			showFeedback('Message', type);
			expect(feedbackAlert.className).toBe(`alert alert-${type} alert-feedback`);
		});
	});

	test('should auto-hide after 3 seconds', () => {
		showFeedback('Test message', 'success');
		expect(feedbackAlert.style.display).toBe('block');

		jest.advanceTimersByTime(3000);
		expect(feedbackAlert.style.display).toBe('none');
	});

    test('months should contain all calendar months', () => {
        const expectedMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        expect(months).toEqual(expectedMonths);
    });
});