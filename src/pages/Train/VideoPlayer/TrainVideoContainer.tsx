import { Box } from "@mui/material";
import { PolygonOptionsCard } from "./PolygonOptions";
import { useResizeDetector } from "react-resize-detector";
import { CreatePolygonDto } from "../../../api/swagger/swagger.api";
import { selectedCameraId } from "../../../slices/camera/cameraSlice";
import { useTypedSelector } from "../../../store/hooks";
import { usePolygons } from "../../../contexts/PolygonContext";
import { t } from "i18next";
import { useSnackbar } from "notistack";
import { polygonOptionsList } from "./polygonOptionsList";
import { useAddPolygonMutation } from "../../../api/polygon/polygonApi";
import { VideoPlayer } from "./VideoPlayer";

interface TrainVideoPlayerProps {
  loading: boolean;
}
export const TrainVideoContainer = ({ loading }: TrainVideoPlayerProps) => {
  const { width, ref: sizeRef } = useResizeDetector();
  const { polygons, setPolygons, selectedPolygonIndex } = usePolygons();
  const cameraId = useTypedSelector(selectedCameraId);
  const [addPolygon] = useAddPolygonMutation();
  const { enqueueSnackbar } = useSnackbar();

  const handlePolygonAddToVideo = (index: number) => {
    const polygon = polygonOptionsList[index];

    const newPolygon = {
      points: polygon.defaultCoordinates.map(([x, y]: [number, number]) => [
        x,
        y,
      ]),
      x: 0,
      y: 0,
      color: polygon.color,
      name: "Area " + (polygons.length + 1),
    };

    const postData: CreatePolygonDto = {
      ...newPolygon,
      cameraId: Number(cameraId),
    };

    addPolygon(postData)
      .unwrap()
      .then((newPolygon) => {
        setPolygons([...polygons, newPolygon]);
      })
      .catch(() => {
        enqueueSnackbar(t("train.page.errorAddingPolygon"), {
          variant: "error",
        });
      });
  };

  const decideWidth = () => {
    const widthR = width || 0;
    if (widthR < 450) {
      return 400;
    }
    if (widthR > 450 && widthR < 800) {
      return 500;
    }
    if (widthR > 800) {
      return 600;
    }
    if (widthR > 1200) {
      return 700;
    }

    return width;
  };

  return (
    <Box
      alignItems="flex-start"
      display="flex"
      justifyContent={selectedPolygonIndex != null ? "flex-start" : "center"}
      mt={1}
      mb={1}
    >
      <Box
        flexDirection={"row"}
        display={"block"}
        alignItems="center"
        justifyContent="center"
        padding={1}
        paddingLeft={2}
        width={`100%`}
        ref={sizeRef}
      >
        <>
          <Box display={"flex"}>
            <PolygonOptionsCard
              handlePolygonAddToVideo={handlePolygonAddToVideo}
              disabled={loading}
            />
          </Box>
          <VideoPlayer width={decideWidth() || 0} showStage={true} />
        </>
      </Box>
    </Box>
  );
};
