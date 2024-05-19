import styled from 'styled-components';
import { flexCenter, flexColumnCenter } from '@styles/CommonStyles';

import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

import type { EmotionAmountTotalType } from '@models/api/dashboard';
import { getEmotionColor, getEmotionText } from '@models/emotion';

// 차트 옵션과 시리즈 데이터 타입 정의
type ChartOptions = {
  series: number[];
  options: ApexCharts.ApexOptions;
};

type EmotionChartProps = {
  data: EmotionAmountTotalType[];
};

const EmotionChart = ({ data }: EmotionChartProps) => {
  const chartLabels = data.map((data) => getEmotionText(data.emotion));
  const chartSeries = data.map((data) => data.amount);
  const chartColors = data.map((data) => getEmotionColor(data.emotion));

  // 전체 값의 합계 계산
  const total = chartSeries.reduce((acc, value) => acc + value, 0);

  const [chartOptions] = useState<ChartOptions>({
    series: chartSeries,
    options: {
      chart: {
        type: 'donut',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%', // 도넛 두께 조정
            labels: {
              show: true,
              name: {
                fontSize: '13px',
                fontFamily: 'SUIT',
                fontWeight: 400,
                color: '#9F9F9F',
                offsetY: -5,
              },
              value: {
                fontSize: '17px',
                fontFamily: 'SUIT',
                fontWeight: 600,
                color: '#575755',
                offsetY: 0,
                formatter: (value) => {
                  const percent = ((Number(value) / total) * 100).toFixed(1); // 퍼센트 계산
                  return `${percent}%`; // 퍼센트 값 표시
                },
              },
            },
          },
          expandOnClick: false, // 클릭 시 확장 효과 비활성화
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
          },
        },
      ],
      labels: chartLabels,
      dataLabels: {
        enabled: false, // 데이터 라벨 숨기기
      },
      legend: {
        show: false, // 범례 숨기기
      },
      colors: chartColors,
      tooltip: {
        enabled: false,
      },
      states: {
        hover: {
          filter: {
            type: 'darken', // 호버 시 어두워지는 효과 적용
            value: 0.15, // 어두워지는 정도
          },
        },
        active: {
          allowMultipleDataPointsSelection: false, // 여러 데이터 포인트를 동시에 선택하지 않음
          filter: {
            type: 'darken', // 클릭 시 어두워지는 효과 적용
            value: 0.15, // 어두워지는 정도
          },
        },
      },
    },
  });

  return (
    <Container>
      <DonutChartContainer>
        <div id="emotion-donut-chart" style={{ zIndex: 1 }}>
          <ReactApexChart
            options={chartOptions.options}
            series={chartOptions.series}
            type="donut"
            width="200"
          />
        </div>
        <CenterLabel />
      </DonutChartContainer>
    </Container>
  );
};

export default EmotionChart;

const Container = styled.div`
  ${flexColumnCenter}
  width: 100%;
`;

const DonutChartContainer = styled.div`
  ${flexCenter}
  position: relative;
`;

const CenterLabel = styled.div`
  ${flexCenter}
  position: absolute;
  width: 80px;
  height: 80px;
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: bold;
  z-index: 0;
`;
