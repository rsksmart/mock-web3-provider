<p align="middle">
    <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle">mock-web3-provider</h3>
<p align="middle">
    A mock web3 provider for Cypress built in Cyprus.
</p>
<p align="middle">
    <a href="https://circleci.com/gh/rsksmart/mock-web3-provider">
        <img src="https://img.shields.io/circleci/build/github/rsksmart/mock-web3-provider?label=CircleCI" alt="npm" />
    </a>
    <a href="https://lgtm.com/projects/g/rsksmart/mock-web3-provider/alerts/">
      <img src="https://img.shields.io/lgtm/alerts/github/rsksmart/mock-web3-provider" alt="alerts">
    </a>
    <a href="https://lgtm.com/projects/g/rsksmart/mock-web3-provider/context:javascript">
      <img src="https://img.shields.io/lgtm/grade/javascript/github/rsksmart/mock-web3-provider">
    </a>
    <a href="https://www.npmjs.com/package/@rsksmart/mock-web3-provider">
      <img src="https://img.shields.io/npm/v/@rsksmart/mock-web3-provider">
    </a>
</p>

Under development and missing many request methods and listeners. See below under 'contributing' to help!

## Usage

Setup the mock provider before the window loads and set it to the `win.ethereum` variable. For a complete integration example, see the [rLogin basic dapp test integration](https://github.com/rsksmart/rlogin-sample-apps/blob/main/basic-dapp/cypress/integration/injected_spec.js).

```js
import { MockProvider } from './index'

describe('test interaction with web3', () => {
  beforeEach(() => {
    cy.on("window:before:load", (win) => {
      win.ethereum = new MockProvider({ address, privateKey, networkVersion: 31, debug:false })

      // when used with rLogin:
      cy.visit('/')
      cy.contains('Connect with rLogin').click()
      cy.contains('MetaMask').click()
    })
  })

  // assuming there is an item displaying the account when the user logs in
  it('displays the account', () => {
    cy.get('.account').should('have.text', `Account: ${address}`)
  })

  // additional e2e tests...
})
```

To handle user acceptance on `provider.request({ method: 'eth_requestAccounts', params: [] })`

```ts
describe('test user acceptance for eth_requestAccounts', function test(this: {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D'
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

  beforeEach(async () => {
    this.provider = new MockProvider({
      address, privateKey, networkVersion: 31, debug: false, manualConfirmEnable: true
    })
  })
  
  it('resolves with acceptance', async () => {
    expect.assertions(1)

    const responsePromise = this.provider.request({ method: 'eth_requestAccounts', params: [] })
      .then((accounts: any) => expect(accounts[0]).toEqual(address))

    this.provider.answerEnable(true)
    await responsePromise
  })

  it('rejects with denial', async () => {
    expect.assertions(1)

    const responsePromise = this.provider.request({ method: 'eth_requestAccounts', params: [] })
      .catch((e) => expect(e).toBeDefined())

    this.provider.answerEnable(false)
    await responsePromise
  })
})
```

## Contributing

Additional mock methods should be added as well as the event listeners. PRs are welcomed as long as corresponding tests are included.
