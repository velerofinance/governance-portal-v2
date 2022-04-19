import { Flex, Text } from 'theme-ui';
import useSWR from 'swr';
import useAccountsStore from 'stores/accounts';
import getMaker from 'lib/maker';

export default function VotingWeight(props): JSX.Element {
  const account = useAccountsStore(state => state.currentAccount);
  const voteDelegate = useAccountsStore(state => (account ? state.voteDelegate : null));
  const addressToCheck = voteDelegate ? voteDelegate.getVoteDelegateAddress() : account?.address;
  const { data: votingWeight } = useSWR(
    addressToCheck ? ['/user/polling-voting-weight', addressToCheck] : null,
    (_, address) => getMaker().then(maker => maker.service('govPolling').getMkrWeightFromChain(address))
  );


  return (
    <>
      <Flex {...props} sx={{ justifyContent: 'space-between' }}>
        <Text color="textSecondary" variant="caps" sx={{ pt: 4, fontSize: 1, fontWeight: '600' }}>
          polling voting weight
        </Text>
      </Flex>
      <Flex>
        <Text sx={{ fontSize: 5 }}>
          {votingWeight ? `${votingWeight.total.toBigNumber().toFormat(2)} VDGT` : '--'}
        </Text>
      </Flex>
    </>
  );
}
