import type { AddressWithdrawalsItem } from 'types/api/address';
import type { AddressParam } from 'types/api/addressParams';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

export interface OasysBridgeItemExtra {
  transactionHash?: string;
  chainName?: string;
}

export type OasysListItem = WithdrawalsItem & OasysBridgeItemExtra;
export type OasysAddressListItem = AddressWithdrawalsItem & OasysBridgeItemExtra;
export type OasysBlockListItem = BlockWithdrawalsItem & OasysBridgeItemExtra;

export function createAddressParam(hash: string): AddressParam {
  return {
    hash,
    implementations: null,
    name: null,
    is_contract: false,
    is_verified: false,
    ens_domain_name: null,
    private_tags: null,
    public_tags: null,
    watchlist_names: null,
  };
}
