import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Card } from "@mui/material";

interface VggChartProps {
  vggData: any;
}

const VggChart = ({ vggData }: VggChartProps) => {
  return (
    <div>
      <PersonDetChart vggData={vggData} />

      {Object.keys(vggData)
        .filter((key) => vggData[key].type === "classDet")
        .map((key) => (
          <ClassDetChart key={key} chartKey={key} vggData={vggData} />
        ))}
    </div>
  );
};

const PersonDetChart = ({ vggData }: any) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  useEffect(() => {
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);

      const personDetSeries = Object.keys(vggData)
        .filter((key) => vggData[key].type === "personDet")
        .map((key) => ({
          name: key,
          type: "line",
          smooth: true, // Make the line smooth
          data: vggData[key].data.map((item: any) => {
            return {
              value: [item.seconds, item.humanCount], // X axis as seconds, Y axis as humanCount
            };
          }),
        }));

      const chartOptions = {
        title: {
          text: "Person Detections Over Time",
          left: "center",
        },
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

      return () => {
        chartInstance && chartInstance.dispose();
      };
    }
  }, []);

  return (
    <Card sx={{ p: 2, mb: 2 }}>
      <div ref={chartRef} style={{ height: "400px", width: "100%" }}></div>
    </Card>
  );
};

const ClassDetChart = ({
  chartKey,
  vggData,
}: {
  chartKey: string;
  vggData: any;
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
        Open: "#2196F3", // Blue
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
      };

      chartInstance.setOption(chartOptions);

      return () => {
        chartInstance && chartInstance.dispose();
      };
    }
  }, [chartKey]);

  return (
    <Card sx={{ mt: 2, p: 2 }}>
      <div ref={chartRef} style={{ height: "150px", width: "100%" }}></div>
    </Card>
  );
};

export default VggChart;
