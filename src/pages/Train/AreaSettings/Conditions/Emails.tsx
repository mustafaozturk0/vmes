import {
  Add,
  RemoveCircleOutline,
  ExpandMore,
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
  IconButton,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useEditPolygonMutation } from "../../../../api/polygon/polygonApi";
import { PolygonConditionDto } from "../../../../api/swagger/swagger.api";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../../contexts/PolygonContext";

interface EmailProps {
  selectedRuleGroupIndex: string;
}
export const Emails = ({ selectedRuleGroupIndex }: EmailProps) => {
  const [t] = useTranslation("common");
  const [editPolygon, { isLoading }] = useEditPolygonMutation();
  const { polygons, selectedPolygonIndex } = usePolygons();

  const polygon = polygons[selectedPolygonIndex as number];
  const [conditions, setConditions] = useState<PolygonConditionDto[]>(
    polygon.conditionPages?.find((i) => i.id === selectedRuleGroupIndex)
      ?.conditions || []
  );

  const initialEmails = polygon.conditionPages
    ?.find((i) => i.id === selectedRuleGroupIndex)
    ?.outputMails?.map((a, index) => {
      return {
        email: a[index],
        description: "",
      };
    });

  const [emailFields, setEmailFields] = useState(
    initialEmails || [{ email: "", description: "" }]
  );

  const handleAddField = () => {
    setEmailFields([...emailFields, { email: "", description: "" }]);
  };

  const handleRemoveField = (index: number) => {
    const fields = [...emailFields];
    fields.splice(index, 1);
    setEmailFields(fields);
  };

  const handleFieldChange = (index: number, field: string, value: string) => {
    const fields: any[] = [...emailFields];
    fields[index][field] = value;
    setEmailFields(fields);
  };

  const handleSave = () => {
    const newConditionPages = polygon.conditionPages?.map((page) => {
      if (page.id === selectedRuleGroupIndex) {
        return {
          ...page,
          conditions: conditions,
          outputMails: emailFields.map((e) => e.email),
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
        enqueueSnackbar(t("train.areaSettings.emails.emailsAdded"), {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar(t("train.areaSettings.emails.errorAddingEmails"), {
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
              {t("train.areaSettings.emails.emails")}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {emailFields.map((field, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={11} sm={5} md={5}>
                <TextField
                  fullWidth
                  label={t("train.areaSettings.emails.emailAddress")}
                  variant="outlined"
                  size="small"
                  value={field.email}
                  onChange={(e) =>
                    handleFieldChange(index, "email", e.target.value)
                  }
                  sx={{ mb: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label={t("train.areaSettings.emails.description")}
                  variant="outlined"
                  size="small"
                  value={field.description}
                  onChange={(e) =>
                    handleFieldChange(index, "description", e.target.value)
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
            {t("train.areaSettings.emails.addEmail")}
          </Button>
          <LoadingButton
            loading={isLoading}
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              minHeight: "40px",
              mt: 2,
            }}
          >
            {t("train.areaSettings.emails.saveEmails")}
          </LoadingButton>
        </AccordionDetails>
      </Accordion>
    </>
  );
};
