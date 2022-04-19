import { PollVoteHistory } from 'modules/polling/types';
import { Delegate } from 'modules/delegates/types';

export type AddressAPIStats = {
  pollVoteHistory: PollVoteHistory[];
};

export type VoteProxyInfo = {
  voteProxyAddress: string;
  hot: string;
  cold: string;
};

export type AddressApiResponse = {
  isProxyContract: boolean;
  voteProxyInfo?: VoteProxyInfo;
  delegateInfo?: Delegate;
  address: string;
};
