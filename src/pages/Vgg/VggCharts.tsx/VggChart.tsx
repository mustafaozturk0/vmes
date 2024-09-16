import React from "react";
import { PersonDetChart } from "./PersonDetChart";
import { ClassDetChart } from "./ClassDetChart";

interface VggChartProps {
  vggData: any;
  duration: number;

  seekToTime?: (time: number) => void;
}

const VggChart = ({ vggData, seekToTime, duration }: VggChartProps) => {
  return (
    <div>
      <PersonDetChart vggData={vggData} seekToTime={seekToTime} />
      {Object.keys(vggData)
        .filter((key) => vggData[key].type === "classDet")
        .map((key) => (
          <ClassDetChart
            key={key}
            duration={duration}
            chartKey={key}
            vggData={vggData}
            seekToTime={seekToTime}
          />
        ))}
    </div>
  );
};

export default VggChart;
