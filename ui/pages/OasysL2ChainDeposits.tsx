import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useState, useCallback } from 'react';

import { createAddressParam } from 'ui/oasys/types';
import type { OasysListItem } from 'ui/oasys/types';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { rightLineArrow, nbsp } from 'toolkit/utils/htmlEntities';
import OasysL2ChainDepositsListItem from 'ui/deposits/oasys/OasysL2ChainDepositsListItem';
import OasysL2ChainDepositsTable from 'ui/deposits/oasys/OasysL2ChainDepositsTable';
import { useBridgeEventCounts } from 'ui/experiment/services/useBridgeEventCounts';
import type { EventType } from 'ui/experiment/services/useBridgeEvents';
import { useBridgeEvents } from 'ui/experiment/services/useBridgeEvents';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import calculateUsdValue from 'ui/shared/value/calculateUsdValue';

const ITEMS_PER_PAGE = 20;

const OasysL2ChainDeposits = () => {
  const [ currentPage, setCurrentPage ] = useState(1);
  const eventType: EventType = 'DEPOSIT';
  const chainName = config.verse.bridge.l2ChainName();

  // Fetch bridge event data
  const { data, isLoading, isError, pagination } = useBridgeEvents({
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    eventType,
    chainName,
  });

  // Fetch bridge event counts for additional summary data
  const countersQuery = useBridgeEventCounts({
    eventType,
    chainName,
  });

  // Increment the current page
  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  // Decrement the current page
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage - 1);
  }, []);

  // Reset the current page to the first page
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Transform bridge event data into a format compatible with the components
  const transformedItems: Array<OasysListItem> = data.map((event) => {
    return {
      index: parseInt(event.blockNumber) || 0,
      validator_index: 0,
      receiver: createAddressParam(event.to),
      amount: event.amount,
      block_number: parseInt(event.blockNumber) || 0,
      timestamp: event.timestamp,
      transactionHash: event.transactionHash,
      chainName: event.chainName,
    };
  });

  // Content to display based on the screen size
  const content = transformedItems.length > 0 ? (
    <>
      { /* Render the list view for small screens */ }
      <Box display={{ base: 'block', lg: 'none' }}>
        { transformedItems.map((item, index) => (
          <OasysL2ChainDepositsListItem
            key={ item.block_number + String(index) }
            item={ item }
            view="list"
            isLoading={ isLoading }
          />
        )) }
      </Box>

      { /* Render the table view for large screens */ }
      <Box display={{ base: 'none', lg: 'block' }}>
        <OasysL2ChainDepositsTable
          items={ transformedItems }
          view="list"
          top={ pagination.hasNextPage || pagination.hasPreviousPage ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ isLoading }
        />
      </Box>
    </>
  ) : null;

  // Summary text with deposit count and total value
  const text = (() => {
    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isLoading } display="flex" flexWrap="wrap">
        { countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            { BigNumber(countersQuery.data.withdrawal_count).toFormat() } deposits have been processed
            and { calculateUsdValue({ amount: countersQuery.data.withdrawal_sum, decimals: 18 }).valueStr } { currencyUnits.ether } has been deposited
          </Text>
        ) }
      </Skeleton>
    );
  })();

  // Create a pagination object compatible with StickyPaginationWithText
  const paginationControl = {
    isVisible: pagination.hasNextPage || pagination.hasPreviousPage,
    currentPage: pagination.currentPage,
    onNextPageClick: handleNextPage,
    onPrevPageClick: handlePrevPage,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPreviousPage,
    page: pagination.currentPage,
    resetPage: resetPage,
    hasPages: pagination.hasNextPage || pagination.hasPreviousPage,
    canGoBackwards: pagination.hasPreviousPage,
    isLoading: isLoading,
  };

  const actionBar = <StickyPaginationWithText text={ text } pagination={ paginationControl }/>;

  return (
    <>
      { /* Page title */ }
      <PageTitle title={ `Deposits (L1${ nbsp }${ rightLineArrow }${ nbsp }L2)` } withTextAd/>
      { /* Main content display */ }
      <DataListDisplay
        isError={ isError }
        itemsNum={ transformedItems.length }
        emptyText="There are no withdrawals."
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default OasysL2ChainDeposits;
