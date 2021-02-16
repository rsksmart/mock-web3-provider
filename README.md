# mock-web3-provider

A mock web3 provider for Cypress built in Cyprus.

Under development

## Usage

```
import mockProvider from 'mock-web3-provider'

describe('test interaction with web3', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      win.ethereum = mockProvider({ address, privateKey, chainId: 31, debug:false })

      // when used with rLogin:
      cy.visit('/')
      cy.contains('Connect with rLogin').click()
      cy.contains('MetaMask').click()
    })
  })

  // your e2e tests...
})
```
