import React from "react";
import { PersonDetChart } from "./PersonDetChart";
import { ClassDetChart } from "./ClassDetChart";

interface VggChartProps {
  vggData: any;
  seekToTime?: (time: number) => void;
}

const VggChart = ({ vggData, seekToTime }: VggChartProps) => {
  return (
    <div>
      <PersonDetChart vggData={vggData} seekToTime={seekToTime} />
      {Object.keys(vggData)
        .filter((key) => vggData[key].type === "classDet")
        .map((key) => (
          <ClassDetChart
            key={key}
            chartKey={key}
            vggData={vggData}
            seekToTime={seekToTime}
          />
        ))}
    </div>
  );
};

export default VggChart;
