import { personalSign } from 'eth-sig-util'

const provider = (
  selectedAddress: string,
  privateKey: string,
  networkVersion: number,
  debug?: boolean
) => {
  /* Logging */
  // eslint-disable-next-line no-console
  const log = (...args: (any | null)[]) => debug && console.log('🦄', ...args)

  const buildProvider = {
    isMetaMask: true,
    networkVersion,
    chainId: `0x${networkVersion.toString(16)}`,
    selectedAddress,

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
        default:
          log(`resquesting missing method ${props.method}`)
          return Promise.reject('Missing Method')
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
