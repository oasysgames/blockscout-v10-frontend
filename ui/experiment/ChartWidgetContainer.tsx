import { chakra } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';

import type { TimeChartData } from 'toolkit/components/charts/types';
import type { StatsIntervalIds } from 'types/client/stats';

import { route } from 'nextjs-routes';
import type { Route } from 'nextjs-routes';

import { ChartWidget } from 'toolkit/components/charts/ChartWidget';

import { getVerseDailyAmount } from './api/getVerseDailyAmount';
import { useApiData } from './useApiData';

type Props = {
  id: string;
  title: string;
  description: string;
  units?: string;
  interval: StatsIntervalIds;
  onLoadingError: () => void;
  isPlaceholderData: boolean;
  className?: string;
  href?: Route;
};

const ChartWidgetContainer = ({
  id,
  title,
  description,
  interval,
  onLoadingError,
  units,
  isPlaceholderData,
  className,
  href,
}: Props) => {
  const params = useMemo(() => [ id, interval ] as [ string, StatsIntervalIds ], [ id, interval ]);
  const { data, isError } = useApiData(getVerseDailyAmount, params, []);
  const charts: TimeChartData = useMemo(() => ([ {
    id,
    name: title,
    items: data ?? [],
    charts: [ {
      type: 'line',
      color: '#3182CE',
    } ],
    units,
  } ]), [ data, id, title, units ]);

  useEffect(() => {
    if (isError) {
      onLoadingError();
    }
  }, [ isError, onLoadingError ]);

  return (
    <ChartWidget
      isError={ isError }
      charts={ charts }
      title={ title }
      description={ description }
      isLoading={ isPlaceholderData }
      minH="230px"
      className={ className }
      href={ href ? route(href) : undefined }
    />
  );
};

export default chakra(ChartWidgetContainer);
