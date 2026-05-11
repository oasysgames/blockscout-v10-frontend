import React from 'react';

import type { TimeChartData, TimeChartItem } from 'toolkit/components/charts/types';

import { ChartWidget } from 'toolkit/components/charts/ChartWidget';

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
  const charts: TimeChartData = React.useMemo(() => ([ {
    id: 'deposit-history',
    name: 'Deposit history',
    items: chartData,
    charts: [ {
      type: 'line',
      color: '#3182CE',
    } ],
    units: 'OAS',
  } ]), [ chartData ]);

  return (
    <ChartWidget
      title="デポジット推移"
      description="日次デポジット量の合計"
      charts={ charts }
      isLoading={ isLoading }
      isError={ Boolean(error) }
    />
  );
};

export default DepositHistoryChart;
