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
          to: data[index + 1]?.datetime,
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

      console.log(processed);

      chartInstance = echarts.init(chartRef.current);

      var categories = processed.data.map((item) => item.name);
      var durations = processed.data.map((item) => item.duration);
      var c = processed.data.map((item) => item.itemStyle.color);

      // ECharts option configuration
      var options = {
        title: {
          text: "Horizontal Bar Graph",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: categories,
        },
        series: [
          {
            name: "Duration",
            type: "bar",
            stack: "total",
            data: durations.map((value, index) => {
              return {
                value: value,
                itemStyle: {
                  color: c[index],
                },
              };
            }),
          },
        ],
      };

      chartInstance.setOption(options);

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
