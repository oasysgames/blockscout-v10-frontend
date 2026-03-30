import React from 'react';

import type { TimeChartItem } from 'ui/shared/chart/types';

import ChartWidget from 'ui/shared/chart/ChartWidget';

interface DailyBridgeStat {
  id: string;
  chainName: string;
  date: string;
  eventType: string;
  total_amount: string;
  count: string;
}

interface DepositHistoryChartProps {
  data: Array<DailyBridgeStat>;
  isLoading: boolean;
  error: Error | null;
}

const DepositHistoryChart: React.FC<DepositHistoryChartProps> = ({ data, isLoading, error }) => {
  const chartData: Array<TimeChartItem> = React.useMemo(() => {
    const depositsByDate = new Map<string, number>();

    // 日付ごとの合計デポジット量を計算
    data.forEach((stat) => {
      if (stat.eventType === 'DEPOSIT') {
        const currentAmount = depositsByDate.get(stat.date) || 0;
        const newAmount = currentAmount + Number(stat.total_amount) / 1e18;
        depositsByDate.set(stat.date, newAmount);
      }
    });

    // TimeChartItem配列に変換
    return Array.from(depositsByDate.entries())
      .map(([ date, amount ]): TimeChartItem => ({
        date: new Date(date),
        value: amount,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [ data ]);

  return (
    <ChartWidget
      title="デポジット推移"
      description="日次デポジット量の合計"
      items={ chartData }
      isLoading={ isLoading }
      isError={ Boolean(error) }
      units="OAS"
    />
  );
};

export default DepositHistoryChart;
