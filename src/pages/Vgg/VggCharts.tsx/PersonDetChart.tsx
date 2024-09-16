import { Card } from "@mui/material";
import * as echarts from "echarts";
import { useRef, useEffect } from "react";

// Helper function to calculate moving median
const calculateMovingMedian = (data: number[], windowSize: number) => {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const subset = data.slice(start, end);
    subset.sort((a, b) => a - b);
    const middle = Math.floor(subset.length / 2);
    const median =
      subset.length % 2 !== 0
        ? subset[middle]
        : Math.round((subset[middle - 1] + subset[middle]) / 2);
    result.push(median);
  }
  return result;
};

export const PersonDetChart = ({ vggData, seekToTime }: any) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      const personDetSeries = Object.keys(vggData)
        .filter((key) => vggData[key].type === "personDet")
        .map((key) => {
          const rawData = vggData[key].data.map((item: any) => {
            return {
              seconds: item.seconds,
              humanCount: item.humanCount,
            };
          });

          const filteredData = rawData.filter(
            (item: any, index: number, arr: any[]) => {
              if (index === 0) return true;
              return item.humanCount !== arr[index - 1].humanCount;
            }
          );

          const humanCounts = filteredData.map((item: any) => item.humanCount);
          const smoothedCounts = calculateMovingMedian(humanCounts, 30);

          const chartData = filteredData.map((item: any, index: number) => {
            return {
              value: [item.seconds, smoothedCounts[index]],
            };
          });

          return {
            name: key,
            type: "line",
            step: "middle",
            data: chartData,
          };
        });

      const chartOptions = {
        title: {
          text: "Person Detections Over Time",
          left: "center",
        },
        animation: false,
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            let tooltipText = `Time: ${params[0].value[0]} sec<br/>`;
            params.forEach((item: any) => {
              tooltipText += `${item.seriesName}: ${item.value[1]}<br/>`;
            });
            return tooltipText;
          },
        },
        legend: {
          data: personDetSeries.map((series) => series.name),
          top: 30,
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: "Time (seconds)",
          nameLocation: "middle",
          nameGap: 25,
        },
        yAxis: {
          type: "value",
          name: "Number of People",
          nameLocation: "middle",
          nameGap: 50,
          minInterval: 1,
          min: 0,
          axisLabel: {
            formatter: "{value}",
          },
        },
        series: personDetSeries,
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "none",
          },
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "none",
          },
        ],
      };

      chartInstance.setOption(chartOptions);

      // Add click event listener for seeking
      chartInstance.on("click", (params: any) => {
        console.log(params);
        if (seekToTime && params.value) {
          const time = params.value[0]; // x-axis value represents time
          seekToTime(time);
        }
      });

      return () => {
        chartInstance && chartInstance.dispose();
      };
    }
  }, [vggData, seekToTime]);

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>
    </Card>
  );
};
