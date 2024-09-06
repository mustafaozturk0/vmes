import {
  Add,
  ExpandMore,
  RemoveCircleOutline,
  Save,
} from "@mui/icons-material";
import {
  TextField,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Grid,
  MenuItem,
  Select,
  IconButton,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { selectOutputs } from "../../../../slices/output/outputSlice";
import { useEffect, useState } from "react";
import { PolygonConditionDto } from "../../../../api/swagger/swagger.api";
import { useEditPolygonMutation } from "../../../../api/polygon/polygonApi";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import { useGetOutputsMutation } from "../../../../api/output/outputApi";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../../contexts/PolygonContext";

interface OutputsProps {
  selectedRuleGroupIndex: string;
}
export const Outputs = ({ selectedRuleGroupIndex }: OutputsProps) => {
  const [t] = useTranslation("common");
  const outputList = useSelector(selectOutputs);
  const { polygons, selectedPolygonIndex } = usePolygons();

  const polygon = polygons[selectedPolygonIndex as number];
  const [conditions, setConditions] = useState<PolygonConditionDto[]>(
    polygon.conditionPages?.find((i) => i.id === selectedRuleGroupIndex)
      ?.conditions || []
  );
  const [editPolygon, { isLoading }] = useEditPolygonMutation();

  const initialOutputs =
    polygon.conditionPages?.find((i) => i.id === selectedRuleGroupIndex)
      ?.outputs || [];

  const outputOptions = outputList.map((o) => ({
    id: o.id?.toString() || "",
    name: o.name || "",
  }));

  const [outputFields, setOutputFields] = useState(initialOutputs);
  const [getOutputs, { isLoading: loadingOutputs }] = useGetOutputsMutation();

  useEffect(() => {
    getOutputs().unwrap();
  }, []);

  const handleAddField = () => {
    setOutputFields([...outputFields, { id: 0, duration: 0, number: 0 }]);
  };

  const handleRemoveField = (index: number) => {
    const fields = [...outputFields];
    fields.splice(index, 1);
    setOutputFields(fields);
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const fields: any[] = [...outputFields];
    fields[index][field] = value;
    setOutputFields(fields);
  };

  const handleSave = () => {
    const newConditionPages = polygon.conditionPages?.map((page) => {
      if (page.id === selectedRuleGroupIndex) {
        return {
          ...page,
          conditions: conditions,
          outputs: outputFields.map((e) => ({
            duration: Number(e.duration),
            number: Number(e.number),
            id: Number(e.id),
          })),
        };
      }
      return page;
    });

    editPolygon({
      id: polygon.id,
      cameraId: polygon.cameraId,
      name: polygon.name,
      x: polygon.x,
      y: polygon.y,
      color: polygon.color,
      points: polygon.points,
      conditionPages: newConditionPages,
    })
      .unwrap()
      .then(() => {
        enqueueSnackbar(t("train.areaSettings.outputs.outputsAdded"), {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(t("train.areaSettings.outputs.errorAddingOutputs"), {
          variant: "error",
        });
      });
  };

  return (
    <>
      <Accordion
        sx={{
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
          mt: 2,
          mb: 1,
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box display="flex" alignItems="center">
            <Typography fontWeight={"bold"} fontSize="15px" pl={2}>
              {t("train.areaSettings.outputs.outputs")}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {outputFields.map((field, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={11} sm={5} md={3}>
                <Select
                  fullWidth
                  value={field.id}
                  disabled={loadingOutputs}
                  onChange={(e) =>
                    handleFieldChange(index, "id", String(e.target.value))
                  }
                  displayEmpty
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                >
                  <MenuItem value="" disabled>
                    {t("train.areaSettings.outputs.selectOutput")}
                  </MenuItem>
                  {outputOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t("train.areaSettings.outputs.outputTimes")}
                  variant="outlined"
                  type="number"
                  size="small"
                  value={field.duration}
                  onChange={(e) =>
                    handleFieldChange(index, "duration", e.target.value)
                  }
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label={t("train.areaSettings.outputs.outputCoil")}
                  variant="outlined"
                  size="small"
                  value={field.number}
                  onChange={(e) =>
                    handleFieldChange(index, "number", e.target.value)
                  }
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={1} sm={1} md={1}>
                <IconButton
                  onClick={() => handleRemoveField(index)}
                  aria-label="remove"
                >
                  <RemoveCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            size="small"
            startIcon={<Add />}
            onClick={handleAddField}
            sx={{
              minHeight: "40px",
              mt: 2,
            }}
          >
            {t("train.areaSettings.outputs.addOutput")}
          </Button>
          <LoadingButton
            fullWidth
            loading={isLoading}
            variant="outlined"
            onClick={handleSave}
            size="small"
            startIcon={<Save />}
            sx={{
              minHeight: "40px",
              mt: 2,
            }}
          >
            {t("train.areaSettings.outputs.saveOutputs")}
          </LoadingButton>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
