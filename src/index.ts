import { personalSign } from 'eth-sig-util'

const provider = (selectedAddress, privateKey, networkVersion, debug = false) => {
  /* Logging */
  const log = (...args) => debug && console.log('🦄', ...args)

  const provider = {
    isMetaMask: true,
    networkVersion,
    chainId: `0x${((0xFF + networkVersion +1) & 0x0FF).toString(16)}`,
    selectedAddress,

    request: function(props, cb) {
      log(`request[${props.method}]`)
      switch(props.method) {
        case 'eth_requestAccounts':
        case 'eth_accounts':
          return true
        case 'net_version':
        case 'eth_chainId':
          return true
        case 'personal_sign': {
          const privKey = Buffer.from(privateKey, 'hex');
          const signed = personalSign(privKey, { data: props.params[0] })
          log('signed', signed)
          return Promise.resolve(signed)
        }
        case 'eth_sendTransaction': {
          return Promise.reject(new Error('This service can not send transactions.'))
        }
        default: log(`resquesting missing method ${props.method}`)
      }
    },

    sendAsync: function(props, cb) {
      switch(props.method) {
        case 'eth_accounts':
          cb(null, { result: [ this.selectedAddress ] })
          break;
        case 'net_version': cb(null, { result: [ this.networkVersion ]})
          break;
        default: log(`Method '${props.method}' is not supported yet.`)
      }
    },
    on: function(props) {
      log('registering event:', props)
    },
    removeAllListeners: function() {
      log('removeAllListeners', null)
    }
  }

  debug && log('Provider ', provider)
  return provider;
}

export default provider
