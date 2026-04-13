const { validateCredentials } = require('./auth');

describe('validateCredentials', () => {

    test('should return success for valid input', () => {
        const result = validateCredentials("john", "1234");

        expect(result.success).toBe(true);
        expect(result.message).toBe("Valid input");
    });

    test('should fail if username is missing', () => {
        const result = validateCredentials("", "1234");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Missing fields");
    });

    test('should fail if password is missing', () => {
        const result = validateCredentials("john", "");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Missing fields");
    });

    test('should fail if both fields are empty', () => {
        const result = validateCredentials("", "");

        expect(result.success).toBe(false);
        expect(result.message).toBe("Missing fields");
    });

});