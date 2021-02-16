# mock-web3-provider

A mock web3 provider for Cypress built in Cyprus.

Under development

## Usage

```
import mockProvider from 'mock-web3-provider'

describe('test interaction with web3', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      win.ethereum = currentProvider(
        address,
        'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3',
        31,
        true
      )
    })
  })
  // ...
})
```
