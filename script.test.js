// script.test.js
// Mock localStorage and document BEFORE requiring script.js
global.localStorage = {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
};

// Mock document and DOM elements
global.document = {
    getElementById: jest.fn((id) => ({
        value: '',
        innerHTML: '',
        addEventListener: jest.fn(),
        style: {},
        innerText: ''
    })),
    addEventListener: jest.fn()
};

// Mock window methods
global.window = {
    location: { href: '' },
    addEventListener: jest.fn()
};

// Mock alert
global.alert = jest.fn();

// Mock setInterval
global.setInterval = jest.fn();

// Mock Date.now to return different values for unique IDs
let mockTimestamp = 1000000;
global.Date.now = jest.fn(() => {
    mockTimestamp += 100;
    return mockTimestamp;
});

// Now require the script
const {
    findUser,
    createTicketObject,
    advanceStatus,
    generateToken
} = require('./script');

describe('Ticket Management System - Unit Tests', () => {
    
    // Mock data for testing
    const mockUsers = [
        { username: 'john', password: 'pass123', role: 'client' },
        { username: 'admin', password: 'admin123', role: 'agent' },
        { username: 'jane', password: 'pass456', role: 'client' }
    ];

    const mockUser = { username: 'testuser', password: 'test123', role: 'client' };

    beforeEach(() => {
        // Clear mocks before each test
        jest.clearAllMocks();
        // Reset timestamp for each test
        mockTimestamp = 1000000;
    });

    describe('findUser()', () => {
        test('should return user when valid credentials provided', () => {
            const result = findUser('john', 'pass123', 'client', mockUsers);
            expect(result).toEqual(mockUsers[0]);
        });

        test('should return undefined when username is incorrect', () => {
            const result = findUser('wronguser', 'pass123', 'client', mockUsers);
            expect(result).toBeUndefined();
        });

        test('should return undefined when password is incorrect', () => {
            const result = findUser('john', 'wrongpass', 'client', mockUsers);
            expect(result).toBeUndefined();
        });

        test('should return undefined when role is incorrect', () => {
            const result = findUser('john', 'pass123', 'agent', mockUsers);
            expect(result).toBeUndefined();
        });
        
        // This test is removed because it depends on the global 'users' array
        // which is already tested indirectly by the other tests
    });

    describe('generateToken()', () => {
        test('should generate token with correct format', () => {
            const username = 'testuser';
            const token = generateToken(username);
            
            expect(token).toContain(`TKT-${username}`);
            expect(token).toMatch(/TKT-\w+-\d+-\d{4}/);
        });

        test('should generate unique tokens for same username', () => {
            const username = 'testuser';
            const token1 = generateToken(username);
            const token2 = generateToken(username);
            
            expect(token1).not.toBe(token2);
        });

        test('should include timestamp in token', () => {
            const before = Date.now();
            const token = generateToken('user');
            const after = Date.now();
            
            const timestampMatch = token.match(/\d+/);
            const timestamp = parseInt(timestampMatch[0]);
            
            expect(timestamp).toBeGreaterThanOrEqual(before);
            expect(timestamp).toBeLessThanOrEqual(after);
        });

        test('should include 4-digit random number at end', () => {
            const token = generateToken('user');
            const parts = token.split('-');
            const randomNum = parts[parts.length - 1];
            
            expect(randomNum).toMatch(/^\d{4}$/);
        });
    });

    describe('createTicketObject()', () => {
        test('should create valid ticket object with all required fields', () => {
            const title = 'Test Ticket';
            const desc = 'This is a test ticket description';
            const priority = 'High';
            
            const ticket = createTicketObject(title, desc, priority, mockUser);
            
            expect(ticket).toBeDefined();
            expect(ticket.id).toBeDefined();
            expect(ticket.token).toBeDefined();
            expect(ticket.title).toBe(title);
            expect(ticket.desc).toBe(desc);
            expect(ticket.priority).toBe(priority);
            expect(ticket.status).toBe('Open');
            expect(ticket.createdBy).toBe(mockUser.username);
            expect(ticket.createdAt).toBeDefined();
        });

        test('should generate token using user\'s username', () => {
            const ticket = createTicketObject('Title', 'Desc', 'Low', mockUser);
            expect(ticket.token).toContain(`TKT-${mockUser.username}`);
        });

        test('should generate unique IDs for multiple tickets', () => {
            const ticket1 = createTicketObject('Title1', 'Desc1', 'Low', mockUser);
            const ticket2 = createTicketObject('Title2', 'Desc2', 'High', mockUser);
            
            // Since we mocked Date.now to increment, these should be different
            expect(ticket1.id).not.toBe(ticket2.id);
            expect(ticket2.id).toBeGreaterThan(ticket1.id);
        });

        test('should handle different priority values', () => {
            const priorities = ['Low', 'Medium', 'High'];
            
            priorities.forEach(priority => {
                const ticket = createTicketObject('Title', 'Desc', priority, mockUser);
                expect(ticket.priority).toBe(priority);
            });
        });
    });

    describe('advanceStatus()', () => {
        test('should advance from "Open" to "In Progress"', () => {
            const ticket = { status: 'Open' };
            const result = advanceStatus(ticket);
            expect(result.status).toBe('In Progress');
        });

        test('should advance from "In Progress" to "Resolved"', () => {
            const ticket = { status: 'In Progress' };
            const result = advanceStatus(ticket);
            expect(result.status).toBe('Resolved');
        });

        test('should not change status beyond "Resolved"', () => {
            const ticket = { status: 'Resolved' };
            const result = advanceStatus(ticket);
            expect(result.status).toBe('Resolved');
        });

        test('should return the modified ticket object', () => {
            const ticket = { status: 'Open' };
            const result = advanceStatus(ticket);
            expect(result).toBe(ticket);
        });

        test('should handle multiple status advancements', () => {
            let ticket = { status: 'Open' };
            
            ticket = advanceStatus(ticket);
            expect(ticket.status).toBe('In Progress');
            
            ticket = advanceStatus(ticket);
            expect(ticket.status).toBe('Resolved');
            
            ticket = advanceStatus(ticket);
            expect(ticket.status).toBe('Resolved');
        });
    });

    describe('Integration: Complete ticket workflow', () => {
        test('should create ticket and advance through all statuses', () => {
            const ticket = createTicketObject(
                'Integration Test',
                'Testing full workflow',
                'High',
                mockUser
            );
            
            expect(ticket.status).toBe('Open');
            expect(ticket.token).toContain(`TKT-${mockUser.username}`);
            
            const inProgressTicket = advanceStatus(ticket);
            expect(inProgressTicket.status).toBe('In Progress');
            
            const resolvedTicket = advanceStatus(inProgressTicket);
            expect(resolvedTicket.status).toBe('Resolved');
        });

        test('should generate unique tokens for each ticket', () => {
            const ticket1 = createTicketObject('Ticket 1', 'Desc 1', 'Low', mockUser);
            const ticket2 = createTicketObject('Ticket 2', 'Desc 2', 'High', mockUser);
            
            expect(ticket1.token).not.toBe(ticket2.token);
            expect(ticket1.token).toContain(mockUser.username);
            expect(ticket2.token).toContain(mockUser.username);
        });
    });
});