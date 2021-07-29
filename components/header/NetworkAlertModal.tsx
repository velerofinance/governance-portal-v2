/** @jsx jsx */
import { useState } from 'react';
import { jsx, Flex, Text } from 'theme-ui';
import { Icon } from '@makerdao/dai-ui-icons';
import { DialogOverlay, DialogContent } from '@reach/dialog';
import { useBreakpointIndex } from '@theme-ui/match-media';

import { SupportedNetworks } from 'lib/constants';
import { fadeIn, slideUp } from 'lib/keyframes';


const NetworkAlertModal = ({
  chainIdError
}: {
  chainIdError: boolean;
}): React.ReactElement | null => {
  const [showDialog, setShowDialog] = useState(true);
  const bpi = useBreakpointIndex();

  if (chainIdError) {
    return (
      <DialogOverlay isOpen={showDialog} onDismiss={() => setShowDialog(false)}>
        <DialogContent
          aria-label="Unsupported Network"
          sx={
            bpi === 0
              ? { variant: 'dialog.mobile', animation: `${slideUp} 350ms ease` }
              : { variant: 'dialog.desktop', animation: `${fadeIn} 350ms ease`, width: '450px' }
          }
        >
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Flex sx={{ alignItems: 'center' }}>
              <Text variant="microHeading" sx={{ alignItems: 'center' }}>
                Warning
              </Text>
              <Icon name="warning" sx={{ ml: 3, width: '23px', height: '23px' }} />
            </Flex>

            <Text sx={{ mt: 3 }}>
              Your wallet is connected to an unsupported network, please switch it to{' '}
              {SupportedNetworks.MAINNET} or {SupportedNetworks.KOVAN} to continue.
            </Text>
          </Flex>
        </DialogContent>
      </DialogOverlay>
    );
  }

  return null;
};

export default NetworkAlertModal;
