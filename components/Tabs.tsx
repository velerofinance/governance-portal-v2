/** @jsx jsx */
import { useState, useEffect } from 'react';
import { Flex, Divider, ThemeUIStyleObject, jsx } from 'theme-ui';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import Router from 'next/router';
import { slugify } from 'lib/utils';

type Props = {
  tabTitles: string[];
  tabPanels: React.ReactNode[];
  tabListStyles?: ThemeUIStyleObject;
  hashRoute?: boolean;
  banner?: JSX.Element;
};

const TabbedLayout = ({
  tabTitles,
  tabPanels,
  tabListStyles = {},
  hashRoute = true,
  banner
}: Props): JSX.Element => {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const activeTab = tabTitles[activeTabIndex];

  useEffect(() => {
    const [, hash] = location.href.split('#');
    if (hashRoute && hash) {
      tabTitles.forEach((title, i) => {
        if (slugify(title) === hash) setActiveTabIndex(i);
      });
    }
  }, []);

  useEffect(() => {
    if (hashRoute) {
      Router.replace(`${location.pathname + location.search}#${slugify(activeTab)}`);
    }
  }, [activeTab]);

  return (
    <Flex
      sx={{
        flexDirection: 'column'
      }}
    >
      <Tabs index={activeTabIndex} onChange={index => setActiveTabIndex(index)}>
        <TabList sx={{ display: ['flex', 'block'], bg: 'inherit', ...tabListStyles }}>
          {tabTitles.map((tabTitle, index) => (
            <Tab
              key={tabTitle}
              sx={{
                ...getTabStyles({ isActive: activeTab === tabTitle, isFirst: index === 0 })
              }}
            >
              {tabTitle}
            </Tab>
          ))}
        </TabList>
        {banner ? banner : <Divider sx={{ m: 0 }} />}
        <TabPanels>
          {tabPanels.map((tabPanel, i) => (
            <TabPanel key={i}>{tabPanel}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

const baseTabStyles: ThemeUIStyleObject = {
  flex: 1,
  appearance: 'none',
  mx: 3,
  p: 0,
  mb: 2,
  color: 'textSecondary',
  fontSize: [2, 3],
  fontWeight: 400,
  border: 'none !important',
  bg: 'inherit',
  outline: 'none'
};

const getTabStyles = ({ isActive, isFirst }) => ({
  ...baseTabStyles,
  ...(isActive ? { color: 'primary', fontWeight: 500 } : {}),
  ...(isFirst ? { ml: 0 } : {})
});

export default TabbedLayout;
