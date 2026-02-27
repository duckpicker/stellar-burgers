/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
    }
  }
}

export {};
