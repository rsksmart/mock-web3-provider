import { personalSign, decrypt } from 'eth-sig-util'

interface ProviderSetup {
  address: string,
  privateKey: string,
  networkVersion: number,
  debug?: boolean
  manualConfirmEnable?: boolean
}

export class MockProvider {
  setup: ProviderSetup

  constructor(setup: ProviderSetup) {
    this.setup = setup
  }

  private log = (...args: (any | null)[]) => this.setup.debug && console.log('🦄', ...args)

  get selectedAddress() {
    return this.setup.address
  }

  get networkVersion() {
    return this.setup.networkVersion
  }

  get chainId() {
    return `0x${this.setup.networkVersion.toString(16)}`
  }

  request(props: { method: any; params: string[] }) {
    this.log(`request[${props.method}]`)

    switch (props.method) {
      case 'eth_requestAccounts':
      case 'eth_accounts':
        return Promise.resolve([this.setup.address])

      case 'net_version':
        return Promise.resolve(this.setup.networkVersion)

      case 'eth_chainId':
        return Promise.resolve(this.chainId)

      case 'personal_sign': {
        const privKey = Buffer.from(this.setup.privateKey, 'hex');
        const signed = personalSign(privKey, { data: props.params[0] })

        this.log('signed', signed)

        return Promise.resolve(signed)
      }

      case 'eth_sendTransaction': {
        return Promise.reject(new Error('This service can not send transactions.'))
      }

      case 'eth_decrypt': {
        this.log('eth_decrypt', props)

        const stripped = props.params[0].substring(2)
        const buff = Buffer.from(stripped, 'hex');
        const data = JSON.parse(buff.toString('utf8'));

        return Promise.resolve(decrypt(data, this.setup.privateKey))
      }

      default:
        this.log(`resquesting missing method ${props.method}`)
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject(`The method ${props.method} is not implemented by the mock provider.`)
    }
  }

  sendAsync(props: { method: string }, cb: any) {
    switch (props.method) {
      case 'eth_accounts':
        cb(null, { result: [this.setup.address] })
        break;

      case 'net_version': cb(null, { result: this.setup.networkVersion })
        break;

      default: this.log(`Method '${props.method}' is not supported yet.`)
    }
  }

  on(props: string) {
    this.log('registering event:', props)
  }

  removeAllListeners() {
    this.log('removeAllListeners', null)
  }
}
