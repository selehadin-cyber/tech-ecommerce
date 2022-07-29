describe('empty spec', () => {
  it('does nothing', () => {
    cy.visit("http://localhost:3000")
    cy.contains("Sign in").click()
  })
})