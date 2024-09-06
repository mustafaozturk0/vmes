import {
  Typography,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  keyframes,
} from "@mui/material";
import { polygonOptionsList } from "./polygonOptionsList";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../contexts/PolygonContext";

export interface IPolygonOptions {
  type: string;
  defaultCoordinates: [number, number][];
  shape: string;
  color: string;
}

interface PolygonOptionsCardProps {
  handlePolygonAddToVideo: (index: number) => void;
  disabled?: boolean;
}

const blinkAnimation = keyframes`
  50% {
    opacity: 0.2;
  }
`;

export const PolygonOptionsCard = ({
  handlePolygonAddToVideo,
  disabled,
}: PolygonOptionsCardProps) => {
  const [t] = useTranslation("common");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { polygons } = usePolygons();

  const getIcon = (type: string, highlightMode?: boolean) => {
    switch (type) {
      case "Triangle":
        return (
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="15,0 30,30 0,30"
              fill={highlightMode ? "white" : "#203257"}
              stroke="#5e5bae"
            />
          </svg>
        );
      case "Square":
        return (
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="0"
              y="0"
              width="30"
              height="30"
              fill="#203257"
              stroke="#5e5bae"
            />
          </svg>
        );
      case "Pentagon":
        return (
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="15,0 30,10 27,30 3,30 0,10"
              fill="#203257"
              stroke="#5e5bae"
            />
          </svg>
        );
      case "Hexagon":
        return (
          <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="15,0 30,15 30,30 15,45 0,30 0,15"
              fill="#203257"
              stroke="#5e5bae"
            />
          </svg>
        );
    }
  };

  if (!polygonOptionsList || polygonOptionsList.length === 0) return null;

  return (
    <Card
      sx={{
        overflow: "auto",
        display: "flex",
        marginBottom: isMobile || isTablet ? 2 : 0,
        justifyContent: "center",
        alignItems: "center",
        opacity: disabled ? 0.2 : 1,
      }}
    >
      <Typography variant="caption" align="center" margin={2}>
        {t("train.videoPlayer.addArea")}
      </Typography>

      <Divider orientation={"vertical"} />

      {polygonOptionsList.map(
        (option: IPolygonOptions, optionIndex: number) => (
          <Box
            key={optionIndex}
            textAlign={{
              xs: "start",
              sm: "center",
            }}
            boxShadow={1}
            sx={
              polygons.length === 0 && option.type === "Triangle" && !disabled
                ? {
                    position: "relative",
                    animation: `${blinkAnimation} 4s linear infinite`,
                  }
                : {}
            }
          >
            <IconButton
              onClick={() => handlePolygonAddToVideo(optionIndex)}
              title={t("train.videoPlayer.add") + " " + option.type}
              disabled={disabled}
              sx={{
                border: "1px solid #203257",
                margin: 1,
                borderRadius: 0.5,
                backgroundColor:
                  polygons.length === 0 && option.type === "Triangle"
                    ? "#5e5bae"
                    : "transparent",
              }}
            >
              {getIcon(option.type, polygons.length === 0)}{" "}
              {polygons.length === 0 &&
                option.type === "Triangle" &&
                !disabled && (
                  <Typography variant="caption" color="white">
                    {t("train.videoPlayer.clickToAdd")}
                  </Typography>
                )}
            </IconButton>
          </Box>
        )
      )}
    </Card>
  );
};
