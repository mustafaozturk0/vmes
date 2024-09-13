import React, { useRef, useState, useEffect } from "react";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import VggPlayer from "./VggPlayer";
import { vggData } from "./VggData";
import VggChart from "./VggChart";

export const Vgg = () => {
  const url =
    "https://khenda-public.s3.eu-west-3.amazonaws.com/video_1_run_cut.mp4";
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const videoJsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: url,
        type: "video/mp4",
      },
    ],
  };

  const handleTimeUpdate = () => {
    console.log("currentTime", videoRef.current?.currentTime);
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const getDataForTime = (data: any) => {
    return data.reduce((prev: any, curr: any) => {
      return currentTime >= curr.seconds ? curr : prev;
    });
  };

  const handlePlayerReady = (player: any) => {
    videoRef.current = player.el().querySelector("video");

    if (videoRef.current) {
      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
    }
  };

  const calculateBoxStyles = (item: any) => {
    const containerWidth = 640;
    const containerHeight = 360;
    const videoOriginalWidth = 1920;
    const videoOriginalHeight = 1080;

    const top = item.y1 * (containerHeight / videoOriginalHeight);
    const left = item.x1 * (containerWidth / videoOriginalWidth);
    const width = (item.x2 - item.x1) * (containerWidth / videoOriginalWidth);
    const height =
      (item.y2 - item.y1) * (containerHeight / videoOriginalHeight);

    return { top, left, width, height };
  };

  return (
    <Box textAlign={"center"}>
      <Card sx={{ p: 2, mb: 2, display: "flex", justifyContent: "center" }}>
        <Box
          position="relative"
          ref={containerRef}
          width="640px"
          height="360px"
        >
          <Box position="relative" zIndex={1} width="100%" height="100%">
            <VggPlayer options={videoJsOptions} onReady={handlePlayerReady} />
          </Box>

          {Object.keys(vggData).map((key) => {
            const item = vggData[key];
            const currentData = getDataForTime(item.data);
            const boxStyles = calculateBoxStyles(item);

            return (
              <Box
                key={key}
                position="absolute"
                top={boxStyles.top}
                left={boxStyles.left}
                width={boxStyles.width}
                height={boxStyles.height}
                border="2px solid red"
                color="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                zIndex={2} // Ensures that the boxes appear above the video
              >
                <Typography variant="body1" color="error" fontWeight={800}>
                  {item.type === "classDet"
                    ? currentData.class
                    : `Count: ${currentData.humanCount}`}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Card>
      <Card
        sx={{
          p: 2,
          mt: 2,
          width: "100%",
          overflow: "auto",
        }}
      >
        <VggChart />
      </Card>
    </Box>
  );
};
