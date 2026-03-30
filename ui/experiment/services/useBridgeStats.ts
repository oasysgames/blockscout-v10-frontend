import { GraphQLClient } from 'graphql-request';
import { useState, useEffect } from 'react';

import type { DailyBridgeStat, BridgeStatsResponse } from './types';
import { DAILY_STATS_QUERY } from './types';

import { getEnvValue } from 'configs/app/utils';

const createClient = () => {
  const url = getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL');

  if (!url) {
    throw new Error('NEXT_PUBLIC_EXPERIMENT_API_URL is not defined');
  }

  return new GraphQLClient(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

interface UseBridgeStatsParams {
  startDate: string;
  endDate: string;
  chainFilter: string;
  eventTypeFilter: string;
}

interface UseBridgeStatsResult {
  data: Array<DailyBridgeStat>;
  isLoading: boolean;
  error: Error | null;
}

export const useBridgeStats = ({
  startDate,
  endDate,
  chainFilter,
  eventTypeFilter,
}: UseBridgeStatsParams): UseBridgeStatsResult => {
  const [ data, setData ] = useState<Array<DailyBridgeStat>>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ error, setError ] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async() => {
      try {
        setIsLoading(true);
        const client = createClient();

        const requestParams = {
          first: 1000,
          orderBy: 'date',
          orderDirection: 'desc',
          startDate,
          endDate,
        };

        const response = await client.request<BridgeStatsResponse>(DAILY_STATS_QUERY, requestParams);

        if ('message' in response) {
          throw new Error(typeof response.message === 'string' ? response.message : 'API returned an error');
        }

        if (!response.dailyBridgeStats) {
          setData([]);
          return;
        }

        let filteredData = response.dailyBridgeStats;

        if (chainFilter !== 'all') {
          filteredData = filteredData.filter((item: DailyBridgeStat) => item.chainName === chainFilter);
        }

        if (eventTypeFilter !== 'all') {
          filteredData = filteredData.filter((item: DailyBridgeStat) => item.eventType === eventTypeFilter);
        }

        setData(filteredData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch bridge stats'));
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ startDate, endDate, chainFilter, eventTypeFilter ]);

  return { data, isLoading, error };
};
