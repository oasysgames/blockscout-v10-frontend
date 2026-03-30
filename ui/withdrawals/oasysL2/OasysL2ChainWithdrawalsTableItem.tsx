import React from 'react';

import type { OasysAddressListItem, OasysBlockListItem, OasysListItem } from 'ui/oasys/types';

import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import {
  TableCell as Td,
  TableRow as Tr,
} from 'toolkit/chakra/table'; // Custom components
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

type Props = {
  item: OasysListItem | OasysAddressListItem | OasysBlockListItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
};

// Type guards
const hasBlockNumber = (item: object): item is { block_number: number } =>
  'block_number' in item;

const hasReceiver = (item: object): item is { receiver: OasysListItem['receiver'] } =>
  'receiver' in item;

const hasTimestamp = (item: object): item is { timestamp: string } =>
  'timestamp' in item;

// Helper function to convert timestamp from seconds to milliseconds if needed
const formatTimestamp = (timestamp: string): number => {
  const numericTimestamp = Number(timestamp);
  if (!isNaN(numericTimestamp) && numericTimestamp < 4102444800) {
    return numericTimestamp * 1000;
  }
  return numericTimestamp;
};

const OasysL2ChainWithdrawalsTableItem = ({ item, view, isLoading }: Props) => {
  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <Tr>
      { !isBlock && hasBlockNumber(item) && (
        <Td>
          <BlockEntityL1
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
      { !isAddress && (
        <Td>
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
        <NativeCoinValue amount={ item.amount } asset={ currencyUnits.ether } loading={ isLoading } noSymbol/>
      </Td>
    </Tr>
  );
};

export default OasysL2ChainWithdrawalsTableItem;
