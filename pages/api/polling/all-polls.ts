import invariant from 'tiny-invariant';
import { NextApiRequest, NextApiResponse } from 'next';
import { isSupportedNetwork } from 'lib/maker';
import { DEFAULT_NETWORK } from 'lib/constants';
import withApiHandler from 'lib/api/withApiHandler';
import { getPolls } from 'modules/polling/api/fetchPolls';

export default withApiHandler(async (req: NextApiRequest, res: NextApiResponse) => {
  const network = (req.query.network as string) || DEFAULT_NETWORK;
  invariant(isSupportedNetwork(network), `unsupported network ${network}`);

  const polls = await getPolls(network);

  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate');
  res.status(200).json(polls);
});
