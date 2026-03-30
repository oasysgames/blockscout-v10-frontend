import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Skeleton } from 'toolkit/chakra/skeleton';

interface DailyBridgeStat {
  id: string;
  chainName: string;
  date: string;
  eventType: string;
  total_amount: string;
  count: string;
}

interface TotalDepositsBoxProps {
  data: Array<DailyBridgeStat>;
  isLoading: boolean;
  error: Error | null;
}

const TotalDepositsBox: React.FC<TotalDepositsBoxProps> = ({ data, isLoading, error }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const itemBg = useColorModeValue('gray.50', 'gray.700');
  const chainTotals = React.useMemo(() => {
    const totals = new Map<string, { total: number; count: number }>();

    data.forEach((stat) => {
      if (stat.eventType === 'DEPOSIT') {
        const current = totals.get(stat.chainName) || { total: 0, count: 0 };
        totals.set(stat.chainName, {
          total: current.total + Number(stat.total_amount) / 1e18,
          count: current.count + Number(stat.count),
        });
      }
    });

    return Array.from(totals.entries()).map(([ chainName, stats ]) => ({
      chainName,
      total: stats.total,
      count: stats.count,
    }));
  }, [ data ]);

  if (error) {
    return (
      <Box p={ 4 } borderRadius="lg" border="1px" borderColor={ borderColor }>
        <Text>データの取得に失敗しました</Text>
      </Box>
    );
  }

  return (
    <Box p={ 4 } borderRadius="lg" border="1px" borderColor={ borderColor }>
      <Text fontSize="lg" fontWeight="bold" mb={ 4 }>チェーンごとの総デポジット</Text>
      <Flex direction="column" gap={ 4 }>
        { isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={ i } loading height="60px"/>
          ))
        ) : (
          chainTotals.map((chain) => (
            <Box
              key={ chain.chainName }
              p={ 4 }
              borderRadius="md"
              bg={ itemBg }
            >
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="medium">{ chain.chainName }</Text>
                  <Text fontSize="sm" color="gray.500">取引回数: { chain.count.toLocaleString() }</Text>
                </Box>
                <Text fontSize="xl" fontWeight="bold">
                  { chain.total.toLocaleString() } OAS
                </Text>
              </Flex>
            </Box>
          ))
        ) }
      </Flex>
    </Box>
  );
};

export default TotalDepositsBox;
