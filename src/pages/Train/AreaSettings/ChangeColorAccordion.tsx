import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../contexts/PolygonContext";
import ColorPicker from "react-best-gradient-color-picker";

export const ChangeColorAccordion = () => {
  const [t] = useTranslation("common");
  const { polygons, selectedPolygonIndex, setPolygons } = usePolygons();

  return (
    <Accordion
      sx={{
        borderRadius: "10px",
        boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
        marginTop: 2,
        marginBottom: 1,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box
          sx={{
            width: 20,
            height: 20,
            borderRadius: 1,
            backgroundColor:
              polygons[selectedPolygonIndex as number]?.color || "#000",
          }}
        />
        <Typography fontWeight={"bold"} fontSize="15px" paddingLeft={2}>
          {t("train.areaDialog.changeColor")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box justifyContent={"center"} display={"flex"}>
          <ColorPicker
            value={polygons[selectedPolygonIndex as number]?.color || "#000"}
            hideAdvancedSliders={true}
            hideColorTypeBtns={true}
            hideColorGuide={true}
            hideGradientControls={true}
            hideGradientAngle={true}
            hidePresets={true}
            height={100}
            hideInputs={true}
            onChange={(e) => {
              const newPolygons = polygons.map((polygon, pIndex) => {
                if (pIndex === selectedPolygonIndex) {
                  return {
                    ...polygon,
                    color: e,
                  };
                }
                return polygon;
              });

              setPolygons(newPolygons);
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
