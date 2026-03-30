import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import {
  TableCell as Td,
  TableRow as Tr,
} from 'toolkit/chakra/table'; // Custom components
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

// Extend the types to include our custom properties
interface ExtendedWithdrawalsItem extends WithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedAddressWithdrawalsItem extends AddressWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedBlockWithdrawalsItem extends BlockWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

type Props = {
  item: ExtendedWithdrawalsItem | ExtendedAddressWithdrawalsItem | ExtendedBlockWithdrawalsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
};

// Type guards
const hasBlockNumber = (item: object): item is { block_number: number } =>
  'block_number' in item;

const hasReceiver = (item: object): item is { receiver: ExtendedWithdrawalsItem['receiver'] } =>
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

const OasysL1ChainWithdrawalsTableItem = ({ item, view, isLoading }: Props) => {
  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <Tr>
      { !isAddress && (
        <Td>
          <Skeleton loading={ isLoading } display="inline-block">
            { hasBlockNumber(item) ? item.block_number : '-' }
          </Skeleton>
        </Td>
      ) }
      { !isAddress && (
        <Td>
          { item.transactionHash ? (
            <TxEntity
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
        </Td>
      ) }
      <Td>
        <Skeleton loading={ isLoading } display="inline-block">
          { item.chainName || '-' }
        </Skeleton>
      </Td>
      { !isBlock && hasBlockNumber(item) && (
        <Td>
          <BlockEntity
            number={ item.block_number }
            isLoading={ isLoading }
            fontSize="sm"
          />
        </Td>
      ) }
      { !isAddress && hasReceiver(item) && (
        <Td>
          <AddressEntity
            address={ item.receiver }
            isLoading={ isLoading }
            truncation="constant"
            fontSize="sm"
          />
        </Td>
      ) }
      { !isBlock && hasTimestamp(item) && (
        <Td>
          <TimeWithTooltip
            timestamp={ formatTimestamp(item.timestamp) }
            isLoading={ isLoading }
            display="inline-block"
          />
        </Td>
      ) }
      <Td>
        <CurrencyValue
          value={ item.amount }
          currency={ currencyUnits.ether }
          isLoading={ isLoading }
        />
      </Td>
    </Tr>
  );
};

export default OasysL1ChainWithdrawalsTableItem;
