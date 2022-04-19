/** @jsx jsx */

import { useMemo, useEffect, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Heading, Container, Grid, Text, Flex, jsx, useColorMode } from 'theme-ui';
import ErrorPage from 'next/error';
import { Global } from '@emotion/core';
import { isDefaultNetwork, getNetwork } from 'lib/maker';
import { fetchJson } from 'lib/fetchJson';

import { useHat } from 'lib/hooks';
import PrimaryLayout from 'components/layouts/Primary';
import Stack from 'components/layouts/Stack';
import SystemStats from 'components/index/SystemStats';
import ExecutiveCard from 'components/index/ExecutiveCard';
import ExecutiveIndicator from 'components/index/ExecutiveIndicator';
import { CMSProposal } from 'modules/executive/types';
import PageLoadingPlaceholder from 'components/PageLoadingPlaceholder';
import { getExecutiveProposals } from 'modules/executive/api/fetchExecutives';

type Props = {
  proposals: CMSProposal[];
};

const LandingPage = ({ proposals }: Props) => {
  const [mode] = useColorMode();

  const [backgroundImage, setBackroundImage] = useState('url(/assets/heroVisual.svg');

  const { data: hat } = useHat();

  useEffect(() => {
    setBackroundImage(mode === 'dark' ? 'url(/assets/heroVisualDark.svg)' : 'url(/assets/heroVisual.svg)');
  }, [mode]);

  return (
    <div>
      <Head>
        <title>Velero Governance Voting Portal</title>
      </Head>
      <div
        sx={{
          top: 0,
          left: 0,
          pt: '100%',
          width: '100vw',
          zIndex: -1,
          position: 'absolute',
          backgroundImage,
          backgroundSize: ['cover', 'contain'],
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <PrimaryLayout sx={{ maxWidth: 'page' }}>
        {/* <Flex sx={{ justifyContent: 'center' }}>
          <Badge
            variant="primary"
            sx={{
              textTransform: 'none',
              textAlign: 'center',
              borderColor: '#FDC134',
              borderRadius: '50px',
              width: '1020px',
              whiteSpace: 'normal',
              fontWeight: 'normal',
              fontSize: [1, 2],
              py: 2,
              px: [3, 4],
              mt: ['-10px', '-25px']
            }}
          > */}
        {/* <Text sx={{ display: ['block', 'none'] }}>
              Welcome to the new Vote Portal. The legacy site can still be reached at{' '}
              <Link href="//v1.vote.makerdao.com">
                <a>v1.vote.makerdao.com</a>
              </Link>
              .
            </Text> */}
        {/* <Text>
              VELERO is currently migrating to a new governance chief contract to prevent flashloans from
              being used in governance activities. Please withdraw from the old Chief, deposit your VDGT in the
              new Chief contract, and vote on the new proposal on the Executive Voting page. For more
              information please refer to this{' '}
              <Link href="//blog.makerdao.com/maker-dschief-1-2-governance-security-update-requires-mkr-holder-actions/">
                <a sx={{ color: 'accentBlue' }}>blog</a>
              </Link>
              .
            </Text> */}
        {/* <Text sx={{ display: ['none', 'block'] }}>
              Welcome to the new Vote Portal, featuring easier access to information, batched poll voting,
              executive voting comments, and on-chain effects. For questions visit{' '}
              <Link href="//chat.makerdao.com/channel/governance-and-risk">
                <a>Rocket Chat</a>
              </Link>
              . The legacy Vote Portal can still be reached at{' '}
              <Link href="//v1.vote.makerdao.com">
                <a>v1.vote.makerdao.com</a>
              </Link>
              .
            </Text> */}
        {/* </Badge>
        </Flex> */}
        <Stack gap={[5, 6]}>
          <section>
            <Stack gap={[4, 6]}>
              <Container pt={4} sx={{ maxWidth: 'title', textAlign: 'center' }}>
                <Stack gap={3}>
                  <Heading as="h1" sx={{ color: 'text', fontSize: [7, 8] }}>
                    Velero Governance
                  </Heading>
                  <Text
                    as="p"
                    mb="3"
                    sx={{
                      color: 'text',
                      opacity: '0.7',
                      fontWeight: 'semiBold',
                      fontSize: [3, 5],
                      px: [3, 'inherit']
                    }}
                  >
                    Join a decentralized community protecting the integrity of the Velero Protocol through
                    research, discussion, and on-chain voting.
                  </Text>
                  <Flex
                    sx={{ flexDirection: ['column', 'row'], width: ['100%', '85%'], alignSelf: 'center' }}
                  >
                    <ExecutiveIndicator proposals={proposals} sx={{ mt: [2, 0] }} />
                  </Flex>
                </Stack>
              </Container>
            </Stack>
          </section>

          <section>
            <SystemStats />
          </section>

          <section>
            <Stack>
              <Container sx={{ textAlign: 'center', maxWidth: 'title' }}>
                <Stack gap={2}>
                  <Heading as="h2">Executive Votes</Heading>
                  <Text sx={{ fontWeight: 400, color: 'textSecondary', px: 'inherit', fontSize: [2, 4] }}>
                    Executive Votes are conducted to make changes to the protocol. The governing proposal
                    represents the current state of the system.
                  </Text>
                </Stack>
              </Container>

              <Container sx={{ textAlign: 'left', maxWidth: 'column' }}>
                <Stack>
                  {proposals
                    .filter(proposal => proposal.active)
                    .map(proposal => (
                      <ExecutiveCard
                        isHat={hat ? hat.toLowerCase() === proposal.address.toLowerCase() : false}
                        key={proposal.key}
                        proposal={proposal}
                      />
                    ))}
                </Stack>
              </Container>
            </Stack>
          </section>

          <section sx={{ py: 5 }}>
            <Container
              sx={{
                textAlign: 'center',
                maxWidth: 'page',
                position: ['relative']
              }}
            >
              <div
                sx={{
                  borderRadius: 'small',
                  height: '100%',
                  width: '100%',
                  position: 'absolute',
                  zIndex: -1,
                  mt: t => `-${(t as any).space[5]}px`,
                  bg: 'background'
                }}
              />
            </Container>
          </section>
        </Stack>
      </PrimaryLayout>
      <Global
        /* react-loading-skeleton uses an outdated version of @emotion/core which causes incorrect type errors.
        see: https://github.com/emotion-js/emotion/issues/1800 */
        // @ts-ignore
        styles={() => ({
          body: {
            backgroundColor: 'transparent'
          },
          ':root': {
            background: theme => theme.colors.surface
          }
        })}
      />
    </div>
  );
};

export default function Index({
  proposals: prefetchedProposals,
}: Props): JSX.Element {
  // fetch polls & proposals at run-time if on any network other than the default
  const [proposals, setProposals] = useState<CMSProposal[]>(prefetchedProposals);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!isDefaultNetwork() && !proposals) {
      Promise.all([
        fetchJson(`/api/executive?network=${getNetwork()}`)
      ])
        .then(([proposals]) => {
          setProposals(proposals);
        })
        .catch(setError);
    }
  }, []);

  if (error) {
    return <ErrorPage statusCode={404} title="Error fetching proposals" />;
  }

  if (!isDefaultNetwork() && !proposals)
    return (
      <PrimaryLayout>
        <PageLoadingPlaceholder />
      </PrimaryLayout>
    );

  return <LandingPage proposals={proposals}/>;
}

export const getStaticProps: GetStaticProps = async () => {
  // fetch polls, proposals, blog posts at build-time

  const [proposals] = await Promise.all([
    getExecutiveProposals(),
  ]);

  return {
    revalidate: 30, // allow revalidation every 30 seconds
    props: {
      proposals,
    }
  };
};
