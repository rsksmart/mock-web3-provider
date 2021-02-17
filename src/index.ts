import { personalSign, decrypt } from 'eth-sig-util'

interface ProviderSetup {
  address: string,
  privateKey: string,
  chainId: number,
  debug?: boolean
}

const provider = (startProps: ProviderSetup) => {
  const {
    address, privateKey, chainId, debug
  } = startProps

  /* Logging */
  // eslint-disable-next-line no-console
  const log = (...args: (any | null)[]) => debug && console.log('🦄', ...args)

  const buildProvider = {
    isMetaMask: true,
    networkVersion: chainId,
    chainId: `0x${chainId.toString(16)}`,
    selectedAddress: address,

    request(props: { method: any; params: string[] }) {
      log(`request[${props.method}]`)
      switch (props.method) {
        case 'eth_requestAccounts':
        case 'eth_accounts':
          return Promise.resolve([this.selectedAddress])
        case 'net_version':
          return Promise.resolve(this.networkVersion)
        case 'eth_chainId':
          return Promise.resolve(this.chainId)

        case 'personal_sign': {
          const privKey = Buffer.from(privateKey, 'hex');
          const signed = personalSign(privKey, { data: props.params[0] })
          log('signed', signed)
          return Promise.resolve(signed)
        }
        case 'eth_sendTransaction': {
          return Promise.reject(new Error('This service can not send transactions.'))
        }
        case 'eth_decrypt': {
          log('eth_decrypt', props)
          const stripped = props.params[0].substring(2)
          const buff = Buffer.from(stripped, 'hex');
          const data = JSON.parse(buff.toString('utf8'));
          return Promise.resolve(decrypt(data, privateKey))
        }
        default:
          log(`resquesting missing method ${props.method}`)
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(`The method ${props.method} is not implemented by the mock provider.`)
      }
    },

    sendAsync(props: { method: string }, cb: any) {
      switch (props.method) {
        case 'eth_accounts':
          cb(null, { result: [this.selectedAddress] })
          break;
        case 'net_version': cb(null, { result: this.networkVersion })
          break;
        default: log(`Method '${props.method}' is not supported yet.`)
      }
    },
    on(props: string) {
      log('registering event:', props)
    },
    removeAllListeners() {
      log('removeAllListeners', null)
    },
  }

  log('Mock Provider ', buildProvider)
  return buildProvider;
}

export default provider
