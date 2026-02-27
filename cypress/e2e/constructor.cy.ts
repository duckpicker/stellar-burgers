/// <reference types="cypress" />

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    cy.setCookie('accessToken', 'mock-access-token');
    localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  describe('Добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .parent()
        .find('button')
        .click();
      cy.contains('Мясо бессмертных моллюсков Protostomia').should('exist');
    });

    it('должен заменять булку при добавлении другой', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();

      cy.wait(500);

      cy.contains('Флюоресцентная булка R2-D3').parent().find('button').click();

      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно ингредиента при клике', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должен закрывать модалку по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Детали ингредиента').should('be.visible');

      cy.get('#modals button svg').click({ force: true });

      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен закрывать модалку по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.contains('Детали ингредиента').should('be.visible');

      cy.get('#modals > div:last-child').click({ force: true });

      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ с правильным номером', () => {
      cy.contains('Краторная булка N-200i').parent().find('button').click();
      cy.contains('Мясо бессмертных моллюсков Protostomia')
        .parent()
        .find('button')
        .click();

      cy.contains('Оформить заказ').click();
      cy.wait('@postOrder');

      cy.contains('12345').should('be.visible');

      cy.get('#modals button svg').click({ force: true });

      cy.get('section[class*="R0Ja10"]').within(() => {
        cy.contains('Мясо бессмертных моллюсков Protostomia').should(
          'not.exist'
        );
        cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      });
    });
  });
});
