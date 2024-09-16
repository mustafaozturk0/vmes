import { Card } from "@mui/material";
import * as echarts from "echarts";
import { useRef, useEffect } from "react";

export const ClassDetChart = ({
  chartKey,
  vggData,
  seekToTime,
  duration,
}: {
  chartKey: string;
  vggData: any;
  duration: number;
  seekToTime?: (time: number) => void;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      // Prepare data
      const data = vggData[chartKey].data;

      // Extract class names
      const classNames = Array.from(
        new Set(data.map((item: any) => item.class))
      );

      // Prepare data points using class names directly
      const lineData: [number, string][] = [];

      // Start with initial class at time 0 if not already
      if (data[0].seconds !== 0) {
        lineData.push([0, data[0].class]);
      }

      data.forEach((item: any, index: number) => {
        const currentTime = item.seconds;
        const currentClass = item.class;

        // Add data point at current time
        lineData.push([currentTime, currentClass]);

        // If not the last item, add a point at the next time with the same class
        if (index < data.length - 1) {
          const nextTime = data[index + 1].seconds;
          lineData.push([nextTime, currentClass]);
        } else {
          // For the last item, extend to the duration
          lineData.push([duration, currentClass]);
        }
      });

      const chartOptions = {
        title: {
          text: `Class Detections - ${chartKey}`,
          left: "center",
        },
        animation: false,
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const className = params[0].data[1];
            const time = params[0].data[0];
            return `${className}: ${time.toFixed(2)} sec`;
          },
        },
        xAxis: {
          type: "value",
          name: "Seconds",
          min: 0,
          max: duration,
        },
        yAxis: {
          type: "category",
          data: classNames,
          name: "Classes",
        },
        series: [
          {
            type: "line",
            step: "end",
            data: lineData,
            lineStyle: {
              color: "#2196F3",
            },
            symbol: "none",
          },
        ],
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
        if (seekToTime && params.value) {
          const time = params.value[0]; // x-axis value represents time
          seekToTime(time);
        }
      });

      return () => {
        chartInstance && chartInstance.dispose();
      };
    }
  }, [chartKey, vggData, duration, seekToTime]);

  return (
    <Card sx={{ mt: 2, p: 2 }}>
      <div ref={chartRef} style={{ height: "250px", width: "100%" }}></div>
    </Card>
  );
};
