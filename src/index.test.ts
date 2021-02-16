import mockProvider from './index'

describe('provider', () => {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D'
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

  const provider = mockProvider({ address, privateKey, chainId: 31, debug:false })

  it('returns a provider object', () => {
    expect(provider).toBeDefined()
  })

  describe('eth_accounts & eth_requestAccounts', () => {
    it('is correctly set', () => {
      expect(provider.selectedAddress).toBe(address)
    })

    it('is correct with request', async () => {
      const response = await provider.request({ method: 'eth_accounts', params: [] })
      expect(response).toEqual([ address ])

      const response2 = await provider.request({ method: 'eth_requestAccounts', params: [] })
      expect(response2).toEqual([ address ])
    })

    it('is correct with sendAsync', () => {
      provider.sendAsync({ method: 'eth_accounts' }, (_err: Error, success: string[]) => 
        expect(success).toEqual({ "result": [ address ] })
      )
    })
  })

  describe('eth_chainId & net_version', () => {
    it('is correctly set', () => {
      expect(provider.networkVersion).toBe(31)
      expect(parseInt(provider.chainId)).toBe(31)
    })

    it('is correct with response', async() => {
      const response = await provider.request({ method: 'net_version', params: [] })
      expect(response).toEqual(31)

      const response2 = await provider.request({ method: 'eth_chainId', params: [] })
      expect(response2).toEqual('0x1f')
    })

    it('is correct with sendAsync', () => {
      provider.sendAsync({ method: 'net_version' }, (_err: Error, success: number) =>
        expect(success).toEqual({ result: 31 })
      )
    })
  })

  describe('personal_sign', () => {
    it('returns the correct signature for the message', async () => {
      const signed = await provider.request({ method: 'personal_sign', params: ['hello world!']})
      expect(signed).toEqual('0xbb14d14dba17f231efd1680c3e150a175ba894183ef6019f4a3100fe0d17938246fcc5656a8fa76ed11c00ffd6944ed08bca23880e39a1a384d3a33e04aaf38e1c')
    })
  })
})
