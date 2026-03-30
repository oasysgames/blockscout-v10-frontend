import React from 'react';

import type { OasysAddressListItem, OasysBlockListItem, OasysListItem } from 'ui/oasys/types';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityL1 from 'ui/shared/entities/address/AddressEntityL1';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import ListItemMobileGrid from 'ui/shared/ListItemMobile/ListItemMobileGrid';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const feature = config.features.beaconChain;

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
  // If timestamp is a numeric string and less than year 2100 in seconds (4102444800)
  // it's likely in seconds and needs to be converted to milliseconds
  const numericTimestamp = Number(timestamp);
  if (!isNaN(numericTimestamp) && numericTimestamp < 4102444800) {
    return numericTimestamp * 1000;
  }
  return numericTimestamp;
};

const OasysL2ChainDepositsListItem = ({ item, view, isLoading }: Props) => {
  if (!feature.isEnabled) {
    return null;
  }

  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <ListItemMobileGrid.Container>
      { !isBlock && hasBlockNumber(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 block No</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <BlockEntityL1
              number={ item.block_number }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      { !isAddress && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn hash</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            { item.transactionHash ? (
              <TxEntityL1
                isLoading={ isLoading }
                hash={ item.transactionHash }
                truncation="constant_long"
                noIcon
                fontSize="sm"
                lineHeight={ 5 }
                fontWeight={ 600 }
              />
            ) : (
              <Skeleton loading={ !isLoading } display="inline-block" fontWeight={ 600 }>
                -
              </Skeleton>
            ) }
          </ListItemMobileGrid.Value>
        </>
      ) }

      { !isAddress && hasReceiver(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>L1 txn origin</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntityL1
              address={ item.receiver }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }
      { !isAddress && hasReceiver(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>To</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <AddressEntity
              address={ item.receiver }
              isLoading={ isLoading }
              fontSize="sm"
              lineHeight={ 5 }
              fontWeight={ 600 }
            />
          </ListItemMobileGrid.Value>
        </>
      ) }
      { !isBlock && hasTimestamp(item) && (
        <>
          <ListItemMobileGrid.Label isLoading={ isLoading }>Age</ListItemMobileGrid.Label>
          <ListItemMobileGrid.Value>
            <TimeWithTooltip
              timestamp={ formatTimestamp(item.timestamp) }
              isLoading={ isLoading }
              display="inline-block"
            />
          </ListItemMobileGrid.Value>
        </>
      ) }

      <>
        <ListItemMobileGrid.Label isLoading={ isLoading }>Amount</ListItemMobileGrid.Label>
        <ListItemMobileGrid.Value>
          <NativeCoinValue amount={ item.amount } asset={ currencyUnits.ether } loading={ isLoading } noSymbol/>
        </ListItemMobileGrid.Value>
      </>
    </ListItemMobileGrid.Container>
  );
};

export default OasysL2ChainDepositsListItem;
