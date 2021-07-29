import { DEFAULT_NETWORK, SupportedNetworks } from 'lib/constants';
import getMaker, { chainIdToNetworkName } from 'lib/maker';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import useNetworkStore from 'stores/network';


export type NetworkContextType = {
  setNetwork: (network: SupportedNetworks) => void,
  isDefaultNetwork: boolean,
  isTestNetwork: boolean,
  network: string
};

export const NetworkContext = React.createContext<NetworkContextType>({
  network: SupportedNetworks.MAINNET,
  isDefaultNetwork: true,
  isTestNetwork: false,
  setNetwork: () => null
});

type Props = {
  children: ReactNode;
};



function determineInitialNetwork(): SupportedNetworks {
  if (typeof global.__TESTCHAIN__ !== 'undefined' && global.__TESTCHAIN__) {
    // if the testhchain global is set, connect to the testchain
    return SupportedNetworks.TESTNET;
  } else if (typeof window === 'undefined') {
    // if not on the browser, connect to the default network
    // (eg when generating static pages at build-time)
    return DEFAULT_NETWORK;
  } else {

    if (window.location.search.includes('testnet')) {
      return SupportedNetworks.TESTNET;
    }
    // 2) check the browser provider if there is one
    if (typeof window.ethereum !== 'undefined') {
      const chainId = parseInt(window.ethereum.chainId);
      const providerNetwork = chainIdToNetworkName(chainId);

      if (providerNetwork === SupportedNetworks.UNSUPPORTED) {
        return DEFAULT_NETWORK;
      }

      return providerNetwork;
      
    }
    // if it's not clear what network to connect to, use the default
    return DEFAULT_NETWORK;
  }
}

export function NetworkProvider({ children }: Props): React.ReactElement {

  const {network, setNetwork} = useNetworkStore(); 

  const router = useRouter();
  useEffect(() => {
    // Detect route param change to change network
    if (router.query.network) {
      onChangeNetwork(router.query.network as SupportedNetworks);
    }
  }, [router.query]);


  // Detect network change and reroute
  useEffect(() => {
    async function listenToNetworkChanges() {
      const maker = await getMaker();

      maker.service('web3')._web3.givenProvider.on('chainChanged', async () => {
        /* Ideally we would like to get the new chain ID from web3 provider
          But actually it does not return the correct network

          const chainId = await maker.service('web3')._web3.eth.getChainId();
          changeNetwork(chainIdToNetworkName(chainId));

          a window.location.reload is the standard in other protocols
          https://docs.metamask.io/guide/ethereum-provider.html#chainchanged
        */
        window.location.reload();
      });

    }

    void listenToNetworkChanges();

    // Determine initial network
    const net = determineInitialNetwork();
    onChangeNetwork(net);

  }, []);

  const onChangeNetwork = (net: SupportedNetworks): void => {
    setNetwork(net);
  };


  return (
    <NetworkContext.Provider value={{
      network,
      setNetwork : onChangeNetwork,
      isDefaultNetwork: network === DEFAULT_NETWORK,
      isTestNetwork: network === SupportedNetworks.TESTNET
    }}>{children}</NetworkContext.Provider>
  );
}
