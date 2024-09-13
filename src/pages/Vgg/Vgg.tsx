import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
} from "@mui/material";
import VggPlayer from "./VggPlayer";
import VggChart from "./VggChart";
import { vggData1 } from "./VggData1";
import { vggData0 } from "./VggData0";
import { useTranslation } from "react-i18next";

export const Vgg = () => {
  const [t] = useTranslation("common");

  const vggOptions = [
    {
      id: 0,
      url: "https://khenda-public.s3.eu-west-3.amazonaws.com/video_0_run_cut.mp4",
      data: vggData0,
      name: "Video 0",
    },
    {
      id: 1,
      url: "https://khenda-public.s3.eu-west-3.amazonaws.com/video_1_run_cut.mp4",
      data: vggData1,
      name: "Video 1",
    },
  ];

  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedVgg, setSelectedVgg] = useState(vggOptions[0]);
  const [showBbox, setShowBbox] = useState(true);

  const videoJsOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: selectedVgg.url,
        type: "video/mp4",
      },
    ],
  };

  const handleTimeUpdate = () => {
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

  const handleVggChange = (e: any) => {
    const vgg = vggOptions.find((v) => v.id === e.target.value);
    if (vgg) {
      setSelectedVgg(vgg);
    }
  };

  return (
    <Box>
      <Card sx={{ p: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="camera-select-label" shrink={true}>
            {t("components.cameraPicker.selectCamera")}
          </InputLabel>
          <Select
            variant="outlined"
            title={t("components.cameraPicker.selectCameraYouWantToUse")}
            label={t("components.cameraPicker.selectCamera")}
            sx={{ minWidth: 120 }}
            value={selectedVgg.id}
            onChange={(e) => {
              handleVggChange(e);
            }}
          >
            {vggOptions.map((vgg) => (
              <MenuItem key={vgg.id} value={vgg.id}>
                {vgg.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Card>

      <Box textAlign={"center"}>
        <Box display={"flex"} alignItems={"center"} gap={1} marginRight={2}>
          <Checkbox onClick={() => setShowBbox(!showBbox)} />
          Show Bounding Boxes
        </Box>
        <Card sx={{ p: 2, mb: 2, display: "flex", justifyContent: "center" }}>
          <Box
            position="relative"
            ref={containerRef}
            width="640px"
            height="360px"
          >
            <Box position="relative" zIndex={1} width="100%" height="100%">
              <VggPlayer
                key={selectedVgg.id}
                options={videoJsOptions}
                onReady={handlePlayerReady}
              />{" "}
            </Box>

            {showBbox &&
              Object.keys(selectedVgg.data).map((key) => {
                const item = selectedVgg.data[key];
                const currentData = getDataForTime(item.data);
                const boxStyles = calculateBoxStyles(item);

                return (
                  <Box
                    key={key}
                    position="absolute"
                    top={boxStyles.top}
                    left={boxStyles.left}
                    width={boxStyles.width}
                    bgcolor={
                      item.type === "classDet"
                        ? "rgba(255, 0, 0, 0.3)"
                        : "rgba(0, 255, 0, 0.3)"
                    }
                    height={boxStyles.height}
                    border={
                      item.type === "classDet"
                        ? "2px solid red"
                        : "2px solid green"
                    }
                    color="white"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    zIndex={item.type === "classDet" ? 5 : 2} // Ensures that the boxes appear above the video
                  >
                    <Typography
                      variant="body1"
                      color="black"
                      fontWeight={800}
                      fontSize={"larger"}
                    >
                      {item.type === "classDet"
                        ? currentData.class
                        : ` ${key} Count:  ${currentData.humanCount}`}
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
          <VggChart vggData={selectedVgg.data} />
        </Card>
      </Box>
    </Box>
  );
};
