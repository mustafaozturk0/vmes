import { ExpandMore, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionSummary,
  Box,
  Typography,
  AccordionDetails,
  Grid,
  TextField,
} from "@mui/material";
import { usePolygons } from "../../../contexts/PolygonContext";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useEditPolygonMutation } from "../../../api/polygon/polygonApi";
import { PolygonDto } from "../../../api/swagger/swagger.api";
import { useSelector } from "react-redux";
import { selectedCameraId } from "../../../slices/camera/cameraSlice";
import { useTranslation } from "react-i18next";
import {
  selectedTreeNodeSelector,
  selectFactoryTree,
} from "../../../slices/factory/factorySlice";
import { useGetFactoryTreeMutation } from "../../../api/factory/factoryApi";

export const ChangeNameAccordion = () => {
  const [editPolygon, { isLoading: isEditing }] = useEditPolygonMutation();
  const { t } = useTranslation("common");

  const { polygons, selectedPolygonIndex } = usePolygons();

  const [newName, setNewName] = useState<string>(
    polygons[selectedPolygonIndex as number].name as string
  );
  const cameraId = useSelector(selectedCameraId);
  const selectedTreeNode = useSelector(selectedTreeNodeSelector);
  const factoryTree = useSelector(selectFactoryTree);
  const [getFactoryTree] = useGetFactoryTreeMutation();

  const savePolygonName = () => {
    const polygon = polygons[selectedPolygonIndex as number] as PolygonDto;
    const lineId = factoryTree.find(
      (i) => i.id === Number(selectedTreeNode?.node?.parent.split("+")[0])
    )?.id;

    editPolygon({
      id: polygon.id,
      lineId: Number(lineId),
      cameraId: Number(cameraId),
      name: newName,
      x: polygon.x,
      y: polygon.y,
      color: polygon.color,
      points: polygon.points,
      conditionPages: polygon.conditionPages,
    })
      .unwrap()
      .then(() => {
        enqueueSnackbar(t("train.areaDialog.polygonNameChanged"), {
          variant: "success",
        });
        getFactoryTree().unwrap();
      })
      .catch(() => {
        enqueueSnackbar(t("train.areaDialog.polygonNameCouldntChanged"), {
          variant: "error",
        });
      });
  };

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
          }}
        />
        <Typography fontWeight={"bold"} fontSize="15px" paddingLeft={2}>
          {t("train.areaDialog.changeName")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container alignItems="center" spacing={1} display={"flex"}>
          <Grid item xs={12} sm={8} md={8}>
            <TextField
              label={t("train.areaDialog.name")}
              variant="outlined"
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <LoadingButton
              variant="outlined"
              size="small"
              color="primary"
              loading={isEditing}
              startIcon={<Save />}
              fullWidth
              onClick={savePolygonName}
            >
              {t("train.areaDialog.saveName")}
            </LoadingButton>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
