import Maker from '@makerdao/dai';
import McdPlugin, { DAI } from '@makerdao/dai-plugin-mcd';
import LedgerPlugin from '@makerdao/dai-plugin-ledger-web';
import TrezorPlugin from '@makerdao/dai-plugin-trezor-web';
import GovernancePlugin, { MKR } from '@makerdao/dai-plugin-governance';
import { Web3ReactPlugin } from './web3react';

import { SupportedNetworks, DEFAULT_NETWORK } from '../constants';
import { networkToRpc } from './network';
import { config } from '../config';

export const ETH = Maker.ETH;
export const USD = Maker.USD;
export { MKR };

function chainIdToNetworkName(chainId: number): SupportedNetworks {
  switch (chainId) {
    case 1:
      return SupportedNetworks.MAINNET;
    case 42:
      return SupportedNetworks.KOVAN;
    case 999:
      return SupportedNetworks.TESTNET;
    case 1337:
      return SupportedNetworks.TESTNET;
    default:
      return SupportedNetworks.UNSUPPORTED;
  }
}

type MakerSingletons = {
  [SupportedNetworks.MAINNET]: null | Promise<Maker>;
  [SupportedNetworks.KOVAN]: null | Promise<Maker>;
  [SupportedNetworks.TESTNET]: null | Promise<Maker>;
};

const makerSingletons: MakerSingletons = {
  [SupportedNetworks.MAINNET]: null,
  [SupportedNetworks.KOVAN]: null,
  [SupportedNetworks.TESTNET]: null
};

function getMaker(network?: SupportedNetworks): Promise<Maker> {
  // Chose the network we are referring to or default to the one set by the system
  const currentNetwork = network ? network : getNetwork();

  if (!makerSingletons[currentNetwork]) {
    makerSingletons[currentNetwork] = Maker.create('http', {
      plugins: [
        [McdPlugin, { prefetch: false }],
        [GovernancePlugin, { network: currentNetwork, staging: !config.USE_PROD_SPOCK }],
        Web3ReactPlugin,
        LedgerPlugin,
        TrezorPlugin
      ],
      provider: {
        url: networkToRpc(currentNetwork, 'infura'),
        type: 'HTTP'
      },
      web3: {
        pollingInterval: null
      },
      log: false,
      multicall: true
    }).then(maker => {
      if (typeof window !== 'undefined') window.maker = maker;
      return maker;
    });
  }

  return makerSingletons[currentNetwork] as Promise<Maker>;
}


function isSupportedNetwork(_network: string): _network is SupportedNetworks {
  return Object.values(SupportedNetworks).some(network => network.toLowerCase() === _network);
}

async function personalSign(message) {
  const maker = await getMaker();
  const provider = maker.service('web3')._web3.currentProvider;
  const from = maker.currentAddress();
  return new Promise((resolve, reject) => {
    provider.sendAsync(
      {
        method: 'personal_sign',
        params: [message, from],
        from
      },
      (err, res) => {
        if (err) reject(err);
        resolve(res.result);
      }
    );
  });
}

export default getMaker;
export {
  DAI,
  isSupportedNetwork,
  chainIdToNetworkName,
  personalSign
};
