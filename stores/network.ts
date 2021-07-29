import { DEFAULT_NETWORK, SupportedNetworks } from 'lib/constants';
import create from 'zustand';

const [useNetworkStore] = create(set => ({
  network: DEFAULT_NETWORK,
  setNetwork: (net: SupportedNetworks) => set(() => ({ network: net })),
}));

export default useNetworkStore;