import { Button, Box, Flex, Text } from '@theme-ui/components';
import { Alert } from 'theme-ui';
import { MKRInput } from 'components/MKRInput';
import BigNumber from 'bignumber.js';
import { useState } from 'react';
import useAccountsStore from 'stores/accounts';
import { useLockedMkr } from 'lib/hooks';

type Props = {
  title: string;
  description: string;
  onChange: any;
  balance?: BigNumber;
  buttonLabel: string;
  onClick: () => void;
};

export function InputDelegateMkr({
  title,
  description,
  onChange,
  balance,
  buttonLabel,
  onClick
}: Props): React.ReactElement {
  const [value, setValue] = useState(new BigNumber(0));

  const currentAccount = useAccountsStore(state =>state.currentAccount);
  const voteProxy = useAccountsStore(state =>
    currentAccount ? state.proxies[currentAccount.address] : null
  );
  const { data: lockedMkr } = useLockedMkr(currentAccount?.address, voteProxy);
  function handleChange(val: BigNumber): void {
    setValue(val);
    onChange(val);
  }
  return (
    <Flex
      sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
    >
      <Text variant="microHeading" sx={{ fontSize: [3, 6] }}>
        {title}
      </Text>
      <Text sx={{ color: 'secondaryEmphasis', mt: 3 }}>{description}</Text>
      <Box sx={{ mt: 3, width: '20rem' }}>
        <MKRInput value={value} onChange={handleChange} balance={balance} />
        {balance && lockedMkr && lockedMkr.gt(0) && (
          <Alert variant="notice">{balance.gt(0) ? `You have an additional ${lockedMkr.toString()} in the voting contract. Do you want to withdraw it first?` : 'You need to withdraw your MKR from the voting contract before it can be delegated'}</Alert>
        )}
        <Button onClick={onClick} sx={{ width: '100%', mt: 3 }} disabled={!value || value.eq(0)}>
          {buttonLabel}
        </Button>
      </Box>
    </Flex>
  );
}
