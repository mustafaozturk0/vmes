import React, { useEffect, useRef } from "react";
import { MachineLogDto } from "../../api/swagger/swagger.api";
import * as echarts from "echarts";
import { duration } from "@mui/material";

interface LogChartProps {
  data: MachineLogDto[];
  colors: any;
}

const LogChart: React.FC<LogChartProps> = ({ data, colors }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  const processData = (data: MachineLogDto[], colors: any) => {
    const processed = data.reduce(
      (acc, cur, index) => {
        const { log, datetime } = cur;
        acc.categories.push(log as string);
        acc.data.push({
          name: log,
          value: datetime,
          itemStyle: {
            color: colors[log as string],
          },
          duration: Math.floor(
            Math.abs(
              new Date(cur.datetime as any).getTime() -
                new Date(data[index - 1]?.datetime as any)?.getTime()
            ) / 1000
          ),
        });
        return acc;
      },
      {
        categories: [] as string[],
        data: [] as any[], // each entry contains a series item with color and value
      }
    );

    return { processed };
  };

  useEffect(() => {
    if (chartRef.current && data?.length > 0) {
      if (chartInstance) {
        chartInstance.dispose(); // Dispose the previous instance to avoid memory leaks
      }

      const { processed } = processData(data, colors);
      chartInstance = echarts.init(chartRef.current); // Initialize a new chart instance

      const options = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: (params: any) => {
            const param = params[0];
            console.log(param);
            return `${param.name}: ${param.value}`;
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} seconds",
          },
        },
        yAxis: {
          type: "category",
        },
        series: processed.data.map((item) => ({
          name: item.name,
          type: "bar",
          stack: "total",

          emphasis: {
            focus: "series",
          },
          data: [item.duration],
          itemStyle: item.itemStyle,
        })),
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            filterMode: "empty",
          },
          {
            type: "inside",
            xAxisIndex: 0,
            filterMode: "empty",
          },
        ],
      };

      chartInstance.setOption(options);
    }

    // Clean up the chart instance when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [data, colors]);

  return (
    <div
      ref={chartRef}
      className="chart"
      style={{ height: "200px", width: "100%" }}
    ></div>
  );
};

export default LogChart;
