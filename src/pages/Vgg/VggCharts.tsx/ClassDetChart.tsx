import { Card } from "@mui/material";
import * as echarts from "echarts";
import { useRef, useEffect } from "react";

export const ClassDetChart = ({
  chartKey,
  vggData,
  seekToTime,
}: {
  chartKey: string;
  vggData: any;
  seekToTime?: (time: number) => void;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      const classColorMap: Record<string, string> = {
        Run: "#4CAF50", // Green
        Pause: "#FFC107", // Yellow
        Stop: "#F44336", // Red
        Take: "#00BCD4", // Cyan
        Place: "#FF5722", // Orange
        Closed: "#9C27B0", // Purple
        Open: "#2196F3", // Blue,
        UrunVar: "#607D8B", // Grey
        UrunYok: "#795548", // Brown
        KapakKapali: "#FF9800", // Amber
        KapakAcik: "#9E9E9E", // Grey
        IsikVar: "#8BC34A", // Light Green
        IsikYok: "#FFEB3B", // Yellow
        Alarm: "#E91E63", // Pink
      };

      const classDetSeries = vggData[chartKey].data.map(
        (item: any, index: number) => ({
          name: item.class,
          type: "bar",
          stack: "total",
          data: [{ value: item.seconds, name: item.class }],
          itemStyle: {
            color: classColorMap[item.class] || "#000",
          },
        })
      );

      const chartOptions = {
        title: {
          text: `Class Detections - ${chartKey}`,
          left: "center",
        },
        animation: false,
        tooltip: {
          trigger: "item",
          formatter: (params: any) => {
            const className = params.seriesName;
            const duration = params.data.value;
            return `${className}: ${duration} sec`;
          },
        },
        legend: {
          data: Array.from(
            new Set(vggData[chartKey].data.map((item: any) => item.class))
          ),
          top: 30,
        },
        xAxis: {
          type: "value",
          name: "Seconds",
        },
        yAxis: {
          type: "category",
          show: false,
        },
        series: classDetSeries,
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
          const time = params.value; // x-axis value represents time
          seekToTime(time);
        }
      });

      return () => {
        chartInstance && chartInstance.dispose();
      };
    }
  }, [chartKey, vggData, seekToTime]);

  return (
    <Card sx={{ mt: 2, p: 2 }}>
      <div ref={chartRef} style={{ height: "150px", width: "100%" }}></div>
    </Card>
  );
};
