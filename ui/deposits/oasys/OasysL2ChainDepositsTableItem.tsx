import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableRow, TableCell } from 'toolkit/chakra/table';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

// Extend the types to include our custom properties
interface ExtendedDepositsItem extends WithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedAddressDepositsItem extends AddressWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedBlockDepositsItem extends BlockWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

type Props = {
  item: ExtendedDepositsItem | ExtendedAddressDepositsItem | ExtendedBlockDepositsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
};

// Type guards
const hasBlockNumber = (item: object): item is { block_number: number } =>
  'block_number' in item;

const hasReceiver = (item: object): item is { receiver: ExtendedDepositsItem['receiver'] } =>
  'receiver' in item;

const hasTimestamp = (item: object): item is { timestamp: string } =>
  'timestamp' in item;

// Helper function to convert timestamp from seconds to milliseconds if needed
const formatTimestamp = (timestamp: string): number => {
  // If timestamp is a numeric string and less than year 2100 in seconds (4102444800)
  // it's likely in seconds and needs to be converted to milliseconds
  const numericTimestamp = Number(timestamp);
  if (!isNaN(numericTimestamp) && numericTimestamp < 4102444800) {
    return numericTimestamp * 1000;
  }
  return numericTimestamp;
};

const OasysL2ChainDepositsTableItem = ({ item, view, isLoading }: Props) => {
  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <TableRow>
      { !isBlock && hasBlockNumber(item) && (
        <TableCell>
          <BlockEntityL1
            number={ item.block_number }
            isLoading={ isLoading }
            fontSize="sm"
          />
        </TableCell>
      ) }
      { !isAddress && (
        <TableCell>
          { item.transactionHash ? (
            <TxEntityL1
              isLoading={ isLoading }
              hash={ item.transactionHash }
              truncation="constant_long"
              noIcon
              fontSize="sm"
            />
          ) : (
            <Skeleton loading={ isLoading } display="inline-block">
              -
            </Skeleton>
          ) }
        </TableCell>
      ) }
      { !isAddress && hasReceiver(item) && (
        <TableCell>
          <AddressEntityL1
            address={ item.receiver }
            isLoading={ isLoading }
            truncation="constant"
            fontSize="sm"
          />
        </TableCell>
      ) }
      { !isAddress && hasReceiver(item) && (
        <TableCell>
          <AddressEntity
            address={ item.receiver }
            isLoading={ isLoading }
            truncation="constant"
            fontSize="sm"
          />
        </TableCell>
      ) }
      { !isBlock && hasTimestamp(item) && (
        <TableCell>
          <TimeWithTooltip
            timestamp={ formatTimestamp(item.timestamp) }
            isLoading={ isLoading }
            display="inline-block"
          />
        </TableCell>
      ) }
      <TableCell>
        <CurrencyValue value={ item.amount } currency={ currencyUnits.ether } isLoading={ isLoading }/>
      </TableCell>
    </TableRow>
  );
};

export default OasysL2ChainDepositsTableItem;
