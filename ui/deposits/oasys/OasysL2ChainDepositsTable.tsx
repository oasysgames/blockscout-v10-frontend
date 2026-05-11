import React from 'react';

import type { OasysAddressListItem, OasysBlockListItem, OasysListItem } from 'ui/oasys/types';

import config from 'configs/app';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';

import OasysL2ChainDepositsTableItem from './OasysL2ChainDepositsTableItem';

const feature = config.features.beaconChain;

// Define the props for the table item component
type Props = {
  top: number;
  isLoading?: boolean;
} & ({
  items: Array<OasysListItem>;
  view: 'list';
} | {
  items: Array<OasysAddressListItem>;
  view: 'address';
} | {
  items: Array<OasysBlockListItem>;
  view: 'block';
});

const OasysL2ChainDepositsTable = ({ items, isLoading, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={ top }>
        <TableRow>
          <TableColumnHeader minW="100px">L1 block No</TableColumnHeader>
          <TableColumnHeader minW="140px">L1 Txn hash</TableColumnHeader>
          { view !== 'address' && <TableColumnHeader w="25%">L1 txn origin</TableColumnHeader> }
          { view !== 'address' && <TableColumnHeader w="25%">To</TableColumnHeader> }
          { view !== 'block' && <TableColumnHeader w="25%">Age</TableColumnHeader> }
          <TableColumnHeader w="25%">{ `Value ${ feature.currency.symbol }` }</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        { view === 'list' &&
          (items as Array<OasysListItem>)
            .slice(0, renderedItemsNum)
            .map((item, index) => (
              <OasysL2ChainDepositsTableItem
                key={ item.index + (isLoading ? String(index) : '') }
                item={ item }
                view="list"
                isLoading={ isLoading }
              />
            )) }
        { view === 'address' &&
          (items as Array<OasysAddressListItem>)
            .slice(0, renderedItemsNum)
            .map((item, index) => (
              <OasysL2ChainDepositsTableItem
                key={ item.index + (isLoading ? String(index) : '') }
                item={ item }
                view="address"
                isLoading={ isLoading }
              />
            )) }
        { view === 'block' &&
          (items as Array<OasysBlockListItem>)
            .slice(0, renderedItemsNum)
            .map((item, index) => (
              <OasysL2ChainDepositsTableItem
                key={ item.index + (isLoading ? String(index) : '') }
                item={ item }
                view="block"
                isLoading={ isLoading }
              />
            )) }
        <TableRow ref={ cutRef }/>
      </TableBody>
    </TableRoot>
  );
};

export default OasysL2ChainDepositsTable;
