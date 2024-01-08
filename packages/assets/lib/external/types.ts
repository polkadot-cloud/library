export interface NetworkInformation {
  name: string;
  network_type: string; // TODO, add type guard for string: "mainnet" | "canarynet" | "solo_mainnet" | "solo_testnet";
  chain: Chain;
  chainspec: Chainspec;
  goals: string[];
  repository: string;
  validators: string[];
  release_cycle: string;
  specs: Specs;
  contacts: Contact[];
  faucet?: null | string;
  rpc_endpoints: RpcEndpoint[];
  api_endpoints: ApiEndpoint[];
  bootnodes: Bootnode[];
  documentation: string[];
  expectations: string[];
  features: string[];
  notes?: string[];
}

export interface Chain {
  type: string;
  // TODO, add type guard for string
  // | "relaychain"
  // | "parachain"
  // | "testnet"
  // | "solo_mainnet"
  // | "solo_testnet";
  parent?: string;
  // TODO, add type guard for string
  // | "Polkadot"
  // | "Kusama"
  // | "Westend"
  // | "Rococo"
  // | "Moonbase Relay"
  // | "Tokyo";
  consensus: string;
  // TODO, add type guard for string
  // "PoS" | "PoA" | "Aura";
  sudo: boolean;
  para_id?: number;
}

export interface Chainspec {
  http_url: string;
}

export interface Specs {
  block_time: number;
  decimals: number;
  token: string;
  ss58_format: number;
  ed?: number;
  lease_period?: number;
  era?: number | null;
}

export interface Contact {
  type: string;
  contact: string;
}

export interface Endpoint {
  name: string;
  url: string;
}

export type RpcEndpoint = Endpoint;
export type ApiEndpoint = Endpoint;
export type Bootnode = Endpoint;
