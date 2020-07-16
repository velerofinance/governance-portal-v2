import invariant from 'tiny-invariant';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

import { getConnectedMakerObj } from '../../_lib/utils';
import { ETH_TX_STATE_DIFF_ENDPOINT, SupportedNetworks } from '../../../../lib/constants';
import { fetchJson } from '../../../../lib/utils';
import withApiHandler from '../../_lib/withApiHandler';

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const spellAddress: string = req.query.address as string;
  invariant(spellAddress && ethers.utils.isAddress(spellAddress), 'valid spell address required');

  const network = req.query.network as string;
  invariant(!network || network === SupportedNetworks.MAINNET, `unsupported network ${network}`);

  const maker = await getConnectedMakerObj(SupportedNetworks.MAINNET);

  const { MCD_PAUSE, MCD_PAUSE_PROXY } = maker.service('smartContract').getContractAddresses();

  const provider = new ethers.providers.AlchemyProvider();
  const encoder = new ethers.utils.Interface([
    'function sig() returns (bytes)',
    'function action() returns (address)',
    'function done() returns (bool)',
    'function exec(address, bytes)'
  ]);

  async function ethCall(method) {
    const calldata = [
      {
        to: spellAddress,
        data: encoder.encodeFunctionData(method)
      }
    ];
    return encoder.decodeFunctionResult(method, await provider.send('eth_call', calldata));
  }

  const [hasBeenCast] = await ethCall('done');
  const [usr] = await ethCall('action');

  let trace;
  let executedOn: number | null = null;

  if (hasBeenCast) {
    const pauseExecSelector = `${ethers.utils
      .id('exec(address,bytes32,bytes,uint256)')
      .slice(0, 10)}${Array.from({ length: 56 })
      .map(() => '0')
      .join('')}`;

    const spellAddressBytes32 = `0x${Array.from({ length: 24 })
      .map(() => '0')
      .join('')}${spellAddress.replace('0x', '')}`;

    const usrBytes32 = `0x${Array.from({ length: 24 })
      .map(() => '0')
      .join('')}${usr.replace('0x', '')}`;

    const [{ transactionHash, blockNumber }] = await provider.getLogs({
      address: MCD_PAUSE,
      fromBlock: 0,
      toBlock: 'latest',
      topics: [pauseExecSelector, spellAddressBytes32, usrBytes32]
    });

    invariant(transactionHash, `Unable to find cast transaction for spell ${spellAddress}`);
    trace = await provider.send('trace_replayTransaction', [transactionHash, ['vmTrace', 'stateDiff']]);
    executedOn = blockNumber;
  } else {
    const [fax] = await ethCall('sig');

    trace = await provider.send('trace_call', [
      {
        from: MCD_PAUSE,
        to: MCD_PAUSE_PROXY,
        data: encoder.encodeFunctionData('exec', [usr, fax])
      },
      ['vmTrace', 'stateDiff']
    ]);
  }

  const decodedDiff = await fetchJson(ETH_TX_STATE_DIFF_ENDPOINT(SupportedNetworks.MAINNET), {
    method: 'POST',
    body: JSON.stringify({ trace })
  });

  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
  res.status(200).json({ hasBeenCast, executedOn, decodedDiff });
});