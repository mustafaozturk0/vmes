import React, { useEffect, useContext } from "react";
import { Box } from "@mui/material";
import { SidebarContext } from "../../contexts/SidebarContext";
import { TrainVideoContainer } from "./VideoPlayer/TrainVideoContainer";
import { useGetPolygonsByCameraIdMutation } from "../../api/polygon/polygonApi";
import { useTypedSelector } from "../../store/hooks";
import { selectedCameraId } from "../../slices/camera/cameraSlice";
import { usePolygons } from "../../contexts/PolygonContext";
import { AreaSettingsDrawer } from "./AreaSettings/AreaSettingsDrawer";

const Train: React.FC = () => {
  const { selectedPolygonIndex } = usePolygons();
  const { setPolygons } = usePolygons();
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const cameraId = useTypedSelector(selectedCameraId);
  const [getPolygonsByCameraId, { isLoading: polygonsLoading }] =
    useGetPolygonsByCameraIdMutation();

  useEffect(() => {
    if (cameraId) {
      getPolygonsByCameraId(cameraId)
        .unwrap()
        .then((data) => {
          setPolygons(data);
        });
    }
  }, [cameraId]);

  useEffect(() => {
    if (sidebarToggle && selectedPolygonIndex !== null) {
      toggleSidebar();
    }
  }, [selectedPolygonIndex]);

  return (
    <Box>
      <TrainVideoContainer loading={polygonsLoading} />
      <AreaSettingsDrawer />
    </Box>
  );
};

export default Train;
