import mockProvider from './index'

describe('provider', () => {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D'
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'

  const provider = mockProvider(address, privateKey, 31, false)

  it('returns a provider object', () => {
    expect(provider).toBeDefined()
  })

  it('has the correct address', () => {
    expect(provider.selectedAddress).toBe(address)

    provider.sendAsync({ method: 'eth_accounts' }, (_err: Error, success: string[]) => 
      expect(success).toEqual({ "result": [ address ] })
    )
  })

  it('has the correct chainId', () => {
    expect(provider.networkVersion).toBe(31)
    expect(parseInt(provider.chainId)).toBe(31)

    provider.sendAsync({ method: 'net_version' }, (_err: Error, success: number) =>
      expect(success).toEqual({ result: 31 })
    )
  })

  describe('personal_sign', () => {
    it('returns the correct signature for the message', async () => {
      const signed = await provider.request({ method: 'personal_sign', params: ['hello world!']})
      expect(signed).toEqual('0xbb14d14dba17f231efd1680c3e150a175ba894183ef6019f4a3100fe0d17938246fcc5656a8fa76ed11c00ffd6944ed08bca23880e39a1a384d3a33e04aaf38e1c')
    })
  })
})
