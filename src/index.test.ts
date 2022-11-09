import MockDate from 'mockdate';
import { BigNumber } from '@ethersproject/bignumber';
import { MockProvider } from './index';

describe('default provider', function test(this: { provider: MockProvider }) {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

  beforeEach(() => {
    this.provider = new MockProvider({
      address,
      privateKey,
      networkVersion: 31,
      debug: false,
    });
  });

  it('returns a provider object', () => {
    expect(this.provider).toBeDefined();
  });

  describe('type of provider', () => {
    it('is metamask', () => {
      expect(this.provider.isMetaMask).toBeTruthy();
    });

    it('can set that is not metamask', () => {
      this.provider.isMetaMask = false;
      expect(this.provider.isMetaMask).toBeFalsy();
    });

    it('can set that is another provider', () => {
      (this.provider as any).isLedger = true;

      expect((this.provider as any).isLedger).toBeTruthy();
    });
  });

  describe('overwrites', () => {
    it('can overwrite request to make it fail', async () => {
      this.provider.request = () => Promise.reject(new Error('Fail'));

      await expect(this.provider.request({ method: 'any' })).rejects.toThrow();
    });
  });

  describe('eth_accounts & eth_requestAccounts', () => {
    it('is correctly set', () => {
      expect(this.provider.selectedAddress).toBe(address);
    });

    it('is correct with request', async () => {
      const response = await this.provider.request({
        method: 'eth_accounts',
        params: [],
      });
      expect(response).toEqual([address]);

      const response2 = await this.provider.request({
        method: 'eth_requestAccounts',
        params: [],
      });
      expect(response2).toEqual([address]);
    });

    it('is correct with sendAsync', () => {
      this.provider.sendAsync(
        { method: 'eth_accounts' },
        (_err: Error, success: string[]) => expect(success).toEqual({ result: [address] })
      );
    });
  });

  describe('eth_chainId & net_version', () => {
    it('is correctly set', () => {
      expect(this.provider.networkVersion).toBe(31);
      expect(parseInt(this.provider.chainId)).toBe(31);
    });

    it('is correct with response', async () => {
      const response = await this.provider.request({
        method: 'net_version',
        params: [],
      });
      expect(response).toEqual(31);

      const response2 = await this.provider.request({
        method: 'eth_chainId',
        params: [],
      });
      expect(response2).toEqual('0x1f');
    });

    it('is correct with sendAsync', () => {
      this.provider.sendAsync(
        { method: 'net_version' },
        (_err: Error, success: number) => expect(success).toEqual({ result: 31 })
      );
    });
  });

  describe('eth_blockNumber', () => {
    it('returns correctly', async () => {
      MockDate.set(1665773724867);
      const response = await this.provider.request({
        method: 'eth_blockNumber',
        params: [],
      });
      expect(response).toEqual(BigNumber.from(9015517));
    });
  });

  describe('personal_sign', () => {
    it('returns the correct signature for the message', async () => {
      const signed = await this.provider.request({
        method: 'personal_sign',
        params: ['hello world!'],
      });
      expect(signed).toEqual(
        '0xbb14d14dba17f231efd1680c3e150a175ba894183ef6019f4a3100fe0d17938246fcc5656a8fa76ed11c00ffd6944ed08bca23880e39a1a384d3a33e04aaf38e1c'
      );
    });
  });

  describe('eth_decrypt', () => {
    it('decrypts content', async () => {
      const encrypted = '0x7b2276657273696f6e223a227832353531392d7873616c736132302d706f6c7931333035222c226e6f6e6365223a224467743246724554314f4d786f6a786c41533069374a6c4f76546f777a6b6a6a222c22657068656d5075626c69634b6579223a227a48762f3853664544384267326b557576797770543274323378774d4659583738716a7869444a387147303d222c2263697068657274657874223a224c6e35644d566c6c4b53726b4c5a345862424b56342b536d53727557227d';
      const result = await this.provider.request({
        method: 'eth_decrypt',
        params: [encrypted, address],
      });
      expect(result).toEqual('hello');
    });

    it('decrypts content 2', async () => {
      const encrypted = '0x7b2276657273696f6e223a227832353531392d7873616c736132302d706f6c7931333035222c226e6f6e6365223a224a5647674e476b3149677957577253546b4448784145347a4e7341313967612f222c22657068656d5075626c69634b6579223a22567973642b7445517a6e6f557459614e485554696a4c614d6f386a767332656f4e43636675556a512f41633d222c2263697068657274657874223a227166306e6450374c5569416276704e4f5945764b3331783953445971227d';
      const result = await this.provider.request({
        method: 'eth_decrypt',
        params: [encrypted, address],
      });
      expect(result).toEqual('tacos');
    });
  });
});

describe('provider with confirm enable', function test(this: {
  provider: MockProvider;
}) {
  const address = '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D';
  const privateKey = 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

  beforeEach(async () => {
    this.provider = new MockProvider({
      address,
      privateKey,
      networkVersion: 31,
      debug: false,
      manualConfirmEnable: true,
    });
  });

  it('should not allow to use acceptEnable without pending request', () => {
    expect(() => this.provider.answerEnable(true)).toThrow();
    expect(() => this.provider.answerEnable(false)).toThrow();
  });

  it('resolves with acceptance', async () => {
    expect.assertions(1);

    const responsePromise = this.provider
      .request({ method: 'eth_requestAccounts', params: [] })
      .then((accounts: any) => expect(accounts[0]).toEqual(address));

    this.provider.answerEnable(true);
    await responsePromise;
  });

  it('rejects with denial', async () => {
    expect.assertions(1);

    const responsePromise = this.provider
      .request({ method: 'eth_requestAccounts', params: [] })
      .catch((e) => expect(e).toBeDefined());

    this.provider.answerEnable(false);
    await responsePromise;
  });

  /*
  it('does not resolver request accounts if no answer', async () => {
    // see that this timeouts
    await provider.request({ method: 'eth_requestAccounts', params: [] })
  })
  */
});
