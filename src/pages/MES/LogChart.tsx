import React, { useEffect, useRef } from "react";
import { MachineLogDto } from "../../api/swagger/swagger.api";
import * as echarts from "echarts";
import { Box, Typography } from "@mui/material";

interface LogChartProps {
  data: MachineLogDto[];
  colors: any;
}

const LogChart: React.FC<LogChartProps> = ({ data, colors }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  let chartInstance: echarts.ECharts | null = null;

  const processData = (data: MachineLogDto[], colors: any) => {
    const totalDurations: Record<string, number> = {};

    const processed = data.reduce(
      (acc, cur, index) => {
        const { log, datetime } = cur;
        const prevDatetime = data[index - 1]?.datetime;
        const duration = prevDatetime
          ? Number(
            (
              Math.abs(
                new Date(datetime as any).getTime() -
                new Date(prevDatetime).getTime()
              ) / 1000
            ).toFixed(2)
          )
          : 0;

        if (!totalDurations[log as string]) {
          totalDurations[log as string] = 0;
        }
        totalDurations[log as string] += duration;

        acc.data.push({
          name: log,
          value: datetime,
          itemStyle: {
            color: colors[log as string] || "#000",
          },
          duration: duration,
        });

        return acc;
      },
      {
        data: [] as any[],
      }
    );

    return { processed, totalDurations };
  };

  useEffect(() => {
    if (chartRef.current && data?.length > 0) {
      if (chartInstance) {
        chartInstance.dispose();
      }

      const { processed, totalDurations } = processData(data, colors);

      chartInstance = echarts.init(chartRef.current);

      chartInstance.setOption({
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow",
          },
          formatter: (params: any, ...others: any[]) => {
            const param = params[0];
            const item = processed.data[params.seriesIndex]
            return `${item.name}: ${item.duration} seconds`;
          },
        },
        legend: {},
        grid: {
          left: "8%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLabel: {
            formatter: (value: number, ...others:any[]) => {
              const firstDate = new Date(processed.data[0].value);
              const labelDate = new Date(firstDate.getTime() + value * 1000);
              return labelDate.toLocaleString();
            },
          },
        },
        yAxis: {
          type: "category",
          show: false,
        },
        series: processed.data.map(
          (item) => (
            {
              name: item.name,
              type: "bar",
              stack: "total",
              emphasis: {
                focus: "series",
              },
              data: [item.duration],
              itemStyle: item.itemStyle,
            }
          )
        ),
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
      });

      const logSummaryElement = document.getElementById("logSummary");
      if (logSummaryElement) {
        logSummaryElement.innerHTML = Object.entries(totalDurations)
          .map(
            ([log, duration]) =>
              `<div>${log.toLocaleUpperCase()}: ${duration} (sec)</div>`
          )
          .join("");
      }
    }

    return () => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    };
  }, [data, colors]);

  return (
    <Box display="inline-flex" gap={2} width={"100%"}>
      <div
        ref={chartRef}
        className="chart"
        style={{ height: "150px", width: "80%" }}
      ></div>
      <Box id="logSummary" sx={{ mt: 2 }}>
        <Typography variant="h5" align="center">
          Log Summary:
        </Typography>
      </Box>
    </Box>
  );
};

export default LogChart;
