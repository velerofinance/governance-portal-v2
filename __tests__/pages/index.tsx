import React from 'react';

import { getExecutiveProposals } from 'modules/executive/api/fetchExecutives';

let proposals;

beforeAll(async () => {
  jest.setTimeout(10000);
  [proposals, ] = await Promise.all([getExecutiveProposals()]);
});

