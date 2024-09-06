import { Drawer, Box, useMediaQuery, useTheme } from "@mui/material";
import { AreaSettings } from "./AreaSettings";
import { usePolygons } from "../../../contexts/PolygonContext";

export const AreaSettingsDrawer = () => {
  const { selectedPolygonIndex, setSelectedPolygonIndex } = usePolygons();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={selectedPolygonIndex !== null}
      onClose={() => setSelectedPolygonIndex(null)}
      PaperProps={{
        style: {
          width: isMobile ? "100%" : 700,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          padding: 2,
        }}
      >
        {selectedPolygonIndex !== null && <AreaSettings />}
      </Box>
    </Drawer>
  );
};
