import { ExpandMore, ManageSearchSharp } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
} from "@mui/material";
import ClassConnector from "./ClassConnector";
import { AddStringDialog as AddRuleGroupNameDialog } from "../../../../components/Dialog/AddStringDialog";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { selectedCameraId } from "../../../../slices/camera/cameraSlice";
import { useTypedSelector } from "../../../../store/hooks";
import { useEditPolygonMutation } from "../../../../api/polygon/polygonApi";
import { generateUUID } from "../../../../utils/commonUtils";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../../contexts/PolygonContext";

export const Conditions = () => {
  const [t] = useTranslation("common");
  const [openAddRuleGroupDialog, setOpenAddRuleGroupDialog] = useState(false);
  const cameraId = useTypedSelector(selectedCameraId);
  const { polygons, setPolygons, selectedPolygonIndex } = usePolygons();
  const polygon = polygons[selectedPolygonIndex as number];
  const [selectedRuleGroupIndex, setSelectedRuleGroupIndex] = useState<string>(
    (polygon.conditionPages?.[0]?.id as string) ?? "-1"
  );

  const [editPolygon, { isLoading }] = useEditPolygonMutation();

  const addRuleGroup = (ruleName: string) => {
    editPolygon({
      id: polygon.id,
      cameraId: Number(cameraId),
      name: polygon.name,
      x: polygon.x,
      y: polygon.y,
      color: polygon.color,
      points: polygon.points,
      conditionPages: [
        ...(polygon.conditionPages || []),
        {
          name: ruleName,
          conditions: [],
          id: generateUUID(),
          outputMails: [],
          outputs: [],
        },
      ],
    })
      .unwrap()
      .then((res) => {
        enqueueSnackbar(t("train.areaSettings.conditions.ruleGroupAdded"), {
          variant: "success",
        });
        const newPolygons = [...polygons];
        newPolygons[selectedPolygonIndex as number] = res;
        setPolygons(newPolygons);

        setSelectedRuleGroupIndex(
          res.conditionPages?.[res.conditionPages.length - 1]?.id as string
        );
      })
      .catch(() => {
        enqueueSnackbar(
          t("train.areaSettings.conditions.ruleGroupCouldntBeAdded"),
          {
            variant: "error",
          }
        );
      });
  };

  return (
    <>
      <Accordion
        style={{
          borderRadius: "10px",
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
          marginTop: 15,
          marginBottom: 5,
        }}
        defaultExpanded={true}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <ManageSearchSharp />
          <Typography fontWeight={"bold"} fontSize="15px" paddingLeft={2}>
            {t("train.areaSettings.conditions.manageConditions")}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              padding: "16px",
              borderRadius: "8px",
              position: "relative",
              mb: 2,
              flexGrow: 1,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="camera-select-label" shrink={true}>
                    {t("train.areaSettings.conditions.ruleGroup")}
                  </InputLabel>
                  <Select
                    variant="outlined"
                    title={t("train.areaSettings.conditions.ruleGroup")}
                    label={t("train.areaSettings.conditions.ruleGroup")}
                    disabled={!polygon.conditionPages?.length}
                    value={selectedRuleGroupIndex}
                    onChange={(e) => {
                      setSelectedRuleGroupIndex(e.target.value as string);
                    }}
                  >
                    {polygon.conditionPages?.length === 0 && (
                      <MenuItem key={"-1"} value={"-1"}>
                        {t("train.areaSettings.conditions.pleaseAddRuleGroup")}
                      </MenuItem>
                    )}
                    {polygon.conditionPages?.map((ruleGroup) => (
                      <MenuItem key={ruleGroup.id} value={ruleGroup.id}>
                        {ruleGroup.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} md={6}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setOpenAddRuleGroupDialog(true)}
                >
                  {t("train.areaSettings.conditions.addRuleGroup")}
                </Button>
              </Grid>
            </Grid>
            <Box mt={1}>
              <ClassConnector selectedRuleGroupIndex={selectedRuleGroupIndex} />
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <AddRuleGroupNameDialog
        addDialogOpen={openAddRuleGroupDialog}
        onClose={() => {
          setOpenAddRuleGroupDialog(false);
        }}
        onAddCallback={(ruleName: string) => {
          addRuleGroup(ruleName);
        }}
        title={t("train.areaSettings.conditions.addRuleGroup?")}
        placeholder={t("train.areaSettings.conditions.enterRuleGroupName")}
        label={t("train.areaSettings.conditions.ruleGroupName")}
        loading={isLoading}
      />
    </>
  );
};
