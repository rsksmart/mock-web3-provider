export type UserProvierSetup = {
  address: string;
  privateKey: string;
  networkVersion: number;
  debug?: boolean;
  manualConfirmEnable?: boolean;
  blockTime?: number;
  genisisBlockTime?: number
};

export type ProviderSetup = {
  address: string;
  privateKey: string;
  networkVersion: number;
  blockTime: number;
  genisisBlockTime: number;
  debug?: boolean;
  manualConfirmEnable?: boolean;
}
