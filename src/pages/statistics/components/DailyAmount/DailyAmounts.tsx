import styled from 'styled-components';
import Chart from 'react-apexcharts';

import SwipeLayout from '@components/layout/SwipeLayout';
import StatisticsContentLayout from '../StatisticsContentLayout';
import type { Register } from '@models/index';
import type { DailyAmountsChartData } from './types';

import { format } from 'date-fns';
import { addCommasToNumber, getThirtyDaysDateObjArray } from '@utils/index';

type DailyAmountProps = {
  date: Date;
  dailyAmounts: DailyAmountsChartData[][];
  registerType: Register;
};

const getMaxValue = (data: number[]) => Math.max(...data);

const DailyAmounts = ({ date, dailyAmounts, registerType }: DailyAmountProps) => {
  const colors = ['#47CFB0', '#FC4873'];

  return (
    <SwipeLayout>
      {dailyAmounts.map((dailyAmount, index) => {
        const series = dailyAmount;

        const maxValues = series.map((s) => ({
          value: getMaxValue(s.data),
          index: s.data.indexOf(getMaxValue(s.data)),
        }));

        const getSmallMarkers = (data: number[]) => {
          return data
            .map((_, index) => (index % 5 === 0 ? index : null))
            .filter((index) => index !== null) as number[];
        };

        const smallMarkers = series.map((s) => getSmallMarkers(s.data));
        const chartLabels = getThirtyDaysDateObjArray(date).map((date) => format(date, 'M/d'));
        const overallMaxValue = Math.max(...series.flatMap((s) => s.data));

        return (
          <StatisticsContentLayout
            key={index}
            message={
              <Message>
                {registerType === 'SPEND' ? '지출' : '절약'}을 많이 한 날은
                <br />
                <span className="green">
                  {dailyAmount[0].name}는 {chartLabels[maxValues[0].index]}
                </span>
                ,{' '}
                <span className="red">
                  {dailyAmount[1].name}는 {chartLabels[maxValues[1].index]}
                </span>{' '}
                이에요
              </Message>
            }>
            <Chart
              height={'100%'}
              width={'100%'}
              type="line"
              series={series}
              options={{
                chart: {
                  type: 'line',
                  height: 440,
                  width: 1000,
                  toolbar: { show: false },
                },
                legend: {
                  position: 'top',
                  offsetX: 160,
                  fontSize: '12px',
                  fontFamily: 'SUIT',
                  fontWeight: 300,
                  itemMargin: {
                    vertical: 10,
                    horizontal: 8, // 라벨 사이 간격
                  },
                  markers: {
                    width: 6,
                    height: 6,
                    offsetX: -4,
                  },
                  formatter: (legendName) => {
                    if (legendName == '남자') return '남';
                    if (legendName == '여자') return '여';
                    return legendName;
                  },
                },
                colors: colors,
                tooltip: { enabled: false },
                dataLabels: {
                  enabled: true,
                  formatter: (val, opts) => {
                    const seriesIndex = opts.seriesIndex;
                    const maxValue = maxValues[seriesIndex].value;
                    return val === maxValue ? addCommasToNumber(val) : ''; // 최댓값만 데이터 라벨 표시
                  },
                  offsetY: -10,
                  style: {
                    colors: ['black'],
                    fontFamily: 'SUIT',
                    fontSize: '12px',
                    fontWeight: 400,
                  },
                  background: { enabled: false },
                },
                stroke: {
                  width: 2,
                },
                xaxis: {
                  axisTicks: { show: false },
                  labels: {
                    rotate: 0,
                    show: true,
                    style: {
                      fontSize: '9px',
                      fontFamily: 'SUIT',
                      fontWeight: 500,
                      colors: '#9F9F9F',
                    },
                    // i는 1부터 시작
                    formatter: (_, i) => (i && (i == 1 || i % 5 == 0) ? chartLabels[i - 1] : ''),
                  },
                },
                yaxis: {
                  axisBorder: { show: true },
                  min: 0,
                  max: overallMaxValue,
                  labels: {
                    formatter: (val: number) =>
                      val === 0 ? '0' : val === overallMaxValue ? '최대값' : '',
                    style: {
                      fontSize: '12px',
                      fontFamily: 'SUIT',
                      fontWeight: 500,
                      colors: '#9F9F9F',
                    },
                  },
                },
                grid: {
                  show: false,
                },
                markers: {
                  shape: 'circle',
                  strokeWidth: 0,
                  discrete: [
                    ...maxValues.map((max, seriesIndex) => ({
                      fillColor: colors[seriesIndex],
                      seriesIndex,
                      dataPointIndex: max.index,
                      size: 5,
                    })),
                    ...smallMarkers.flatMap((indices, seriesIndex) =>
                      indices.map((index) => ({
                        fillColor: colors[seriesIndex],
                        seriesIndex,
                        dataPointIndex: index,
                        size: 2,
                      })),
                    ),
                  ],
                },
              }}
            />
          </StatisticsContentLayout>
        );
      })}
    </SwipeLayout>
  );
};

export default DailyAmounts;

const Message = styled.div`
  & > span.green {
    color: #47cfb0;
  }

  & > span.red {
    color: #fc4873;
  }
`;
