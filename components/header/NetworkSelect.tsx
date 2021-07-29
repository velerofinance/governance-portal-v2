import { SupportedNetworks } from "lib/constants";
import { NetworkContext } from "lib/web3/context/NetworkContext";
import { useContext } from "react";
import { Select } from "theme-ui";

export function NetworkSelect(): React.ReactElement {
    const { network, setNetwork } = useContext(NetworkContext);
    const onChange = (e) => {
        setNetwork(e.target.value);
    }
    return (
        <Select value={network} onChange={onChange}>
            <option value={SupportedNetworks.MAINNET}>Mainnet</option>
            <option value={SupportedNetworks.KOVAN}>Kovan</option>
            <option value={SupportedNetworks.TESTNET}>Local Testnet</option>
        </Select>
    )
}