describe('Curtir foto (funcional)', () => {
  it('usuário logado pode curtir e descurtir uma foto', () => {
    cy.visit('/');
    cy.get('#loginEmail').type('usuario@teste.com', { force: true });
    cy.get('#loginSenha').type('senha123', { force: true });
    cy.get('button[type=submit]').then($btn => {
      if ($btn.length) {
        cy.wrap($btn.first()).click({ force: true });
      } else {
        cy.contains('button', 'Entrar').click({ force: true });
      }
    });
    // Verifica se houve erro de login
    cy.get('body').then($body => {
      if ($body.text().includes('Usuário não encontrado') || $body.text().includes('Senha incorreta')) {
        throw new Error('Login falhou: usuário ou senha inválidos');
      }
    });
    cy.url().should('include', '/explorar');
    cy.get('.foto-card').first().within(() => {
      cy.get('.like-btn').click();
      cy.get('.like-btn.liked').should('exist');
      cy.get('.like-btn').click();
      cy.get('.like-btn.liked').should('not.exist');
    });
  });
});