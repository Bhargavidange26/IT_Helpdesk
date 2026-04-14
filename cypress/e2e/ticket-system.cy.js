// cypress/e2e/ticket-system.cy.js - WORKING VERSION

describe('Ticket System - Complete Tests', () => {
    
    beforeEach(() => {
        cy.clearLocalStorage();
    });

    // ========== CLIENT TESTS ==========
    describe('Client Dashboard', () => {
        
        it('creates a ticket successfully', () => {
            const user = { username: 'client1', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#title').type('My Computer is Broken');
            cy.get('#desc').type('Screen not turning on');
            cy.get('#priority').select('High');
            cy.get('.btn.primary.full').first().click();
            
            cy.get('#ticketList').should('contain', 'My Computer is Broken');
        });

        it('creates ticket with Low priority', () => {
            const user = { username: 'client2', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#title').type('Low Priority Issue');
            cy.get('#desc').type('Not urgent');
            cy.get('#priority').select('Low');
            cy.get('.btn.primary.full').first().click();
            
            cy.get('#ticketList').should('contain', 'Low Priority Issue');
        });

        it('validates required fields', () => {
            const user = { username: 'client3', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('.btn.primary.full').first().click();
            cy.get('#ticketList').children().should('have.length', 0);
        });

        it('creates multiple tickets for same client', () => {
            const user = { username: 'client4', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#title').type('Ticket 1');
            cy.get('#desc').type('First issue');
            cy.get('#priority').select('High');
            cy.get('.btn.primary.full').first().click();
            
            cy.get('#title').type('Ticket 2');
            cy.get('#desc').type('Second issue');
            cy.get('#priority').select('Low');
            cy.get('.btn.primary.full').first().click();
            
            cy.get('#ticketList').children().should('have.length.at.least', 2);
        });

        it('logs out successfully', () => {
            const user = { username: 'client5', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('.btn.primary.full').contains('Logout').click();
            cy.url().should('include', 'index.html');
        });
    });

    // ========== AGENT TESTS ==========
    describe('Agent Dashboard', () => {
        
        beforeEach(() => {
            const tickets = [
                { id: 1, title: 'Bug Report', status: 'Open', priority: 'High', token: 'TKT-001', desc: 'Crash', createdBy: 'alice', createdAt: new Date().toLocaleString() },
                { id: 2, title: 'Feature Request', status: 'Open', priority: 'Medium', token: 'TKT-002', desc: 'Dark mode', createdBy: 'bob', createdAt: new Date().toLocaleString() },
                { id: 3, title: 'Login Issue', status: 'In Progress', priority: 'High', token: 'TKT-003', desc: 'Cannot login', createdBy: 'charlie', createdAt: new Date().toLocaleString() },
                { id: 4, title: 'Password Reset', status: 'Resolved', priority: 'Low', token: 'TKT-004', desc: 'Reset email', createdBy: 'david', createdAt: new Date().toLocaleString() }
            ];
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            const agent = { username: 'agent1', password: 'pass', role: 'agent' };
            localStorage.setItem('users', JSON.stringify([agent]));
            localStorage.setItem('currentUser', JSON.stringify(agent));
            cy.visit('agent.html');
            cy.wait(500);
        });

        it('displays all tickets', () => {
            cy.get('#ticketList').should('contain', 'Bug Report');
            cy.get('#ticketList').should('contain', 'Feature Request');
            cy.get('#ticketList').should('contain', 'Login Issue');
            cy.get('#ticketList').should('contain', 'Password Reset');
        });

        it('filters by Open status', () => {
            cy.get('#filterStatus').select('Open');
            cy.wait(1000);
            cy.get('#ticketList').should('contain', 'Bug Report');
        });

        it('filters by In Progress status', () => {
            cy.get('#filterStatus').select('In Progress');
            cy.wait(1000);
            cy.get('#ticketList').should('contain', 'Login Issue');
        });

        it('filters by Resolved status', () => {
            cy.get('#filterStatus').select('Resolved');
            cy.wait(1000);
            cy.get('#ticketList').should('contain', 'Password Reset');
        });

        it('searches tickets by title', () => {
            cy.get('#searchBox').type('Bug Report');
            cy.wait(1000);
            cy.get('#ticketList').should('contain', 'Bug Report');
        });

        it('searches tickets by token', () => {
            cy.get('#searchBox').type('TKT-003');
            cy.wait(1000);
            cy.get('#ticketList').should('contain', 'Login Issue');
        });

        it('shows correct statistics', () => {
            cy.get('#openCount').should('contain', '2');
            cy.get('#progressCount').should('contain', '1');
            cy.get('#resolvedCount').should('contain', '1');
        });
    });

    // ========== DATA PERSISTENCE ==========
    describe('Data Persistence', () => {
        
        it('saves tickets to localStorage', () => {
            const user = { username: 'saveclient', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#title').type('Saved Ticket');
            cy.get('#desc').type('This should be saved');
            cy.get('#priority').select('Medium');
            cy.get('.btn.primary.full').first().click();
            
            cy.window().then((win) => {
                const tickets = JSON.parse(win.localStorage.getItem('tickets'));
                expect(tickets.length).to.be.at.least(1);
            });
        });

        it('retains tickets after page refresh', () => {
            const user = { username: 'refreshclient', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#title').type('Refresh Test Ticket');
            cy.get('#desc').type('Should survive refresh');
            cy.get('#priority').select('High');
            cy.get('.btn.primary.full').first().click();
            cy.get('#ticketList').should('contain', 'Refresh Test Ticket');
            
            cy.reload();
            cy.get('#ticketList').should('contain', 'Refresh Test Ticket');
        });
    });

    // ========== EDGE CASES ==========
    describe('Edge Cases', () => {
        
        it('handles very long ticket titles', () => {
            const user = { username: 'edgeclient', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            const longTitle = 'A'.repeat(200);
            cy.get('#title').type(longTitle);
            cy.get('#desc').type('Test description');
            cy.get('#priority').select('Low');
            cy.get('.btn.primary.full').first().click();
            
            cy.get('#ticketList').should('exist');
        });

        it('handles special characters in title', () => {
            const user = { username: 'specialclient', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#title').type('Ticket with @#$%^&*()');
            cy.get('#desc').type('Special chars test');
            cy.get('#priority').select('Medium');
            cy.get('.btn.primary.full').first().click();
            
            cy.get('#ticketList').should('contain', '@#$%^&*()');
        });
    });

    // ========== SECURITY ==========
    describe('Security', () => {
        
        it('clears user session on logout', () => {
            const user = { username: 'securityclient', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('.btn.primary.full').contains('Logout').click();
            
            cy.window().then((win) => {
                expect(win.localStorage.getItem('currentUser')).to.be.null;
            });
        });

        it('client cannot see other clients tickets', () => {
            const tickets = [
                { id: 1, title: 'Alice Ticket', status: 'Open', token: 'TKT-001', desc: 'Test', priority: 'High', createdBy: 'alice', createdAt: new Date().toLocaleString() },
                { id: 2, title: 'Bob Ticket', status: 'Open', token: 'TKT-002', desc: 'Test', priority: 'Medium', createdBy: 'bob', createdAt: new Date().toLocaleString() }
            ];
            localStorage.setItem('tickets', JSON.stringify(tickets));
            
            const user = { username: 'alice', password: 'pass', role: 'client' };
            localStorage.setItem('users', JSON.stringify([user]));
            localStorage.setItem('currentUser', JSON.stringify(user));
            cy.visit('client.html');
            
            cy.get('#ticketList').should('contain', 'Alice Ticket');
            cy.get('#ticketList').should('not.contain', 'Bob Ticket');
        });
    });
});