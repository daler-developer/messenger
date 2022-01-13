

describe('auth-form', () => {

  it('password field must be type of password', () => {
    cy.visit('http://localhost:3000/auth?tab=login')

    cy
      .get('input[placeholder="Password"]')
      .should('have.attr', 'type', 'password')

    cy.visit('http://localhost:3000/auth?tab=register')

    cy
      .get('input[placeholder="Password"]')
      .should('have.attr', 'type', 'password')
  })
  
  it('inputs should work', () => {
    cy.visit('http://localhost:3000/auth?tab=login')
    
    cy
      .get('input.auth-page__input[placeholder="Username"]')
      .type('daler')
      .should('have.value', 'daler')
    
    cy
      .get('input.auth-page__input[placeholder="Password"]')
      .type('2000909k')
      .should('have.value', '2000909k')
    
    cy.visit('http://localhost:3000/auth?tab=register')
    
    cy
      .get('input.auth-page__input[placeholder="Username"]')
      .type('daler')
      .should('have.value', 'daler')
    
    cy
      .get('input.auth-page__input[placeholder="Display name"]')
      .type('daler saidov')
      .should('have.value', 'daler saidov')
    
    cy
      .get('input.auth-page__input[placeholder="Password"]')
      .type('2000909k')
      .should('have.value', '2000909k')
  })
  
  it('"tab" query param should switch to "register" when clicked on a button', () => {
    cy.visit('http://localhost:3000/auth?tab=login')
    
    cy
      .get('div.auth-page__footer')
      .click()

    cy.location('search').should('include', 'tab=register')
  })

  it('"tab" query param should switch to "login" when clicked on a button', () => {
    cy.visit('http://localhost:3000/auth?tab=register')

    cy
      .get('div.auth-page__footer')
      .click()

    cy.location('search').should('include', 'tab=login')
  })

  it('"Emtpy value" error label should appear properly', () => {
    cy.visit('http://localhost:3000/auth?tab=register')
  
    cy
      .get('input.auth-page__input[placeholder="Username"]')
      .click()

    cy
      .get('input.auth-page__input[placeholder="Password"]')
      .click()

    cy
      .get('input.auth-page__input[placeholder="Display name"]')
      .click()

    cy
      .get('body')
      .click(0, 0)

    cy
      .contains('Empty username')

    cy
      .contains('Empty display name')

    cy
      .contains('Empty password')
  })
  
})

