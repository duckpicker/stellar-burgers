/// <reference types="cypress" />
/// <reference path="./index.ts" />

Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'mock-access-token');
  localStorage.setItem('refreshToken', 'mock-refresh-token');
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  localStorage.removeItem('refreshToken');
});
