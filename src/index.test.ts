import mockProvider from './index'

describe('provider', () => {
  const address = 'address'
  const provider = mockProvider(address, 'private', 31, false)

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
})
