import Cypress from 'cypress';

const BASE_URL = 'https://norma.nomoreparties.space/api';
const ID_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093c'}]`;
const ID_ANOTHER_BUN = `[data-cy=${'643d69a5c3f7b9001cfa093d'}]`;
const ID_FILLING = `[data-cy=${'643d69a5c3f7b9001cfa0941'}]`;
const ID_SAUCE = `[data-cy=${'643d69a5c3f7b9001cfa0945'}]`;
const ID_MAIN = `[data-cy=${'643d69a5c3f7b9001cfa0946'}]`;

beforeEach(() => {
  cy.intercept('GET', `${BASE_URL}/ingredients`, {
    fixture: 'ingredients.json'
  });
  cy.intercept('POST', `${BASE_URL}/auth/login`, {
    fixture: 'user.json'
  });
  cy.intercept('GET', `${BASE_URL}/auth/user`, {
    fixture: 'user.json'
  });
  cy.intercept('POST', `${BASE_URL}/orders`, {
    fixture: 'orderResponse.json'
  });
  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get(`[data-cy='constructor']`, { timeout: 10000 }).as('constructor');
  cy.get('#modals').as('modal');
});

describe('добавление ингредиента в список заказа', () => {
  it('инкремент счетчика ингредиента', () => {
    cy.get(ID_FILLING).children('button').click();
    cy.get(ID_FILLING).find('.counter__num').contains('1');
    cy.get('@constructor').contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('инкремент счетчика соуса и основного ингредиента', () => {
    cy.get(ID_SAUCE).children('button').click();
    cy.get(ID_MAIN).children('button').click();
    cy.get(ID_SAUCE).find('.counter__num').contains('1');
    cy.get(ID_MAIN).find('.counter__num').contains('1');
    cy.get('@constructor').within(() => {
      cy.contains('Соус с шипами Антарианского плоскоходца').should('exist');
      cy.contains('Хрустящие минеральные кольца').should('exist');
    });
  });

  describe('добавление булок и начинок', () => {
    it('добавление булки и начинки в список заказа', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });

    it('добавление булки после добавления начинок', () => {
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });

    it('добавление булки, соуса и основного ингредиента', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_SAUCE).children('button').click();
      cy.get(ID_MAIN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Соус с шипами Антарианского плоскоходца').should('exist');
        cy.contains('Хрустящие минеральные кольца').should('exist');
      });
    });
  });

  describe('замена булок', () => {
    it('замена булки другой булкой при пустом списке начинок', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Краторная булка N-200i').should('not.exist');
      });
    });

    it('замена булки другой булкой при полном списке начинок', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_FILLING).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Краторная булка N-200i').should('not.exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });

    it('замена булки при наличии соуса и основного ингредиента', () => {
      cy.get(ID_BUN).children('button').click();
      cy.get(ID_SAUCE).children('button').click();
      cy.get(ID_MAIN).children('button').click();
      cy.get(ID_ANOTHER_BUN).children('button').click();
      cy.get('@constructor').within(() => {
        cy.contains('Флюоресцентная булка R2-D3').should('exist');
        cy.contains('Краторная булка N-200i').should('not.exist');
        cy.contains('Соус с шипами Антарианского плоскоходца').should('exist');
        cy.contains('Хрустящие минеральные кольца').should('exist');
      });
    });
  });
});

describe('оформление заказа', () => {
  beforeEach(() => {
    window.localStorage.setItem('refreshToken', 'ipsum');
    cy.setCookie('accessToken', 'lorem');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearAllCookies();
  });

  it('отправка заказа c проверкой корректности ответа', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_FILLING).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('75000');
    cy.get('@constructor').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
    });
  });

  it('отправка заказа с соусом и основным ингредиентом', () => {
    cy.get(ID_BUN).children('button').click();
    cy.get(ID_SAUCE).children('button').click();
    cy.get(ID_MAIN).children('button').click();
    cy.get(`[data-cy='order-button']`).click();
    cy.get('@modal').find('h2').contains('75000');
    cy.get('@constructor').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Соус с шипами Антарианского плоскоходца').should('not.exist');
      cy.contains('Хрустящие минеральные кольца').should('not.exist');
    });
  });
});

describe('модальные окна', () => {
  it('открытие и проверка отображения данных модального окна ингредиента', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('открытие модального окна для соуса', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_SAUCE).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Соус с шипами Антарианского плоскоходца').should('exist');
  });

  it('открытие модального окна для основного ингредиента', () => {
    cy.get('@modal').should('be.empty');
    cy.get(ID_MAIN).children('a').click();
    cy.get('@modal').should('be.not.empty');
    cy.get('@modal').contains('Хрустящие минеральные кольца').should('exist');
  });

  it('закрытие модального окна по клику на "✕"', () => {
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').find('button').click();
    cy.get('@modal').should('be.empty');
  });

  it('закрытие модального окна по клику на оверлей', () => {
    cy.get(ID_FILLING).children('a').click();
    cy.get('@modal').should('exist');
    cy.get(`[data-cy='overlay']`).click({ force: true });
    cy.get('@modal').should('be.empty');
  });
});
