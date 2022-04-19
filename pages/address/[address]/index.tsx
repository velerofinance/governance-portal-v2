/** @jsx jsx */
import { useEffect, useState } from 'react';
import { Heading, Box, jsx, Flex, NavLink, Button } from 'theme-ui';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { getNetwork } from 'lib/maker';
import { fetchJson } from 'lib/fetchJson';
import { useAnalytics } from 'lib/client/analytics/useAnalytics';
import { ANALYTICS_PAGES } from 'lib/client/analytics/analytics.constants';
import PrimaryLayout from 'components/layouts/Primary';
import SidebarLayout from 'components/layouts/Sidebar';
import Stack from 'components/layouts/Stack';
import SystemStatsSidebar from 'components/SystemStatsSidebar';
import PageLoadingPlaceholder from 'components/PageLoadingPlaceholder';
import { useRouter } from 'next/router';
import { AddressApiResponse } from 'modules/address/types/addressApiResponse';
import { AddressDetail } from 'modules/address/components/AddressDetail';

const AddressView = ({ addressInfo }: { addressInfo: AddressApiResponse }) => {

  const { trackButtonClick } = useAnalytics(
    ANALYTICS_PAGES.ADDRESS_DETAIL
  );

  return (
    <PrimaryLayout shortenFooter={true} sx={{ maxWidth: [null, null, null, 'page', 'dashboard'] }}>
      <Head>
        <title>Velero Governance - {'Address'} Information</title>
      </Head>

      <SidebarLayout>
        <Stack gap={2}>
          <Box>
            {(
              <AddressDetail
                address={addressInfo.address}
                voteProxyInfo={addressInfo.voteProxyInfo}
              />
            )}
          </Box>
        </Stack>
        <Stack gap={3}>
          <SystemStatsSidebar
            fields={['polling contract', 'savings rate', 'total dai', 'debt ceiling', 'system surplus']}
          />
          {/*<ResourceBox />*/}
        </Stack>
      </SidebarLayout>
    </PrimaryLayout>
  );
};

export default function AddressPage(): JSX.Element {
  const [addressInfo, setAddressInfo] = useState<AddressApiResponse>();
  const [error, setError] = useState<string>();
  const router = useRouter();
  const { address } = router.query;

  useEffect(() => {
    if (address) {
      fetchJson(`/api/address/${address}?network=${getNetwork()}`).then(setAddressInfo).catch(setError);
    }
  }, [address]);

  if (error) {
    return <ErrorPage statusCode={404} title="Error fetching address information" />;
  }

  if (!addressInfo) {
    return (
      <PrimaryLayout shortenFooter={true}>
        <PageLoadingPlaceholder />
      </PrimaryLayout>
    );
  }

  return <AddressView addressInfo={addressInfo} />;
}
