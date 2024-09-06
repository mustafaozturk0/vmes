import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  IconButton,
  TextField,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { BorderedBox } from "../../../../components/CustomComponents";
import { LoadingButton } from "@mui/lab";
import {
  PolygonConditionDto,
  PolygonSubConditionDto,
} from "../../../../api/swagger/swagger.api";
import { useEditPolygonMutation } from "../../../../api/polygon/polygonApi";
import { enqueueSnackbar } from "notistack";
import { Save } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { selectYoloOptions } from "../../../../slices/yolo/yoloSlice";
import { Outputs } from "./Outputs";
import { Emails } from "./Emails";
import { useTranslation } from "react-i18next";
import { usePolygons } from "../../../../contexts/PolygonContext";

interface ClassConnectorProps {
  selectedRuleGroupIndex: string;
}

const ClassConnector: React.FC<ClassConnectorProps> = ({
  selectedRuleGroupIndex,
}) => {
  const [t] = useTranslation("common");
  const { polygons, setPolygons, selectedPolygonIndex } = usePolygons();

  const polygon = polygons[selectedPolygonIndex as number];
  const yoloOptions = useSelector(selectYoloOptions);

  const [conditions, setConditions] = useState<PolygonConditionDto[]>(
    polygon.conditionPages?.find(
      (i) => Number(i.id) === Number(selectedRuleGroupIndex)
    )?.conditions || []
  );
  const [editPolygon, { isLoading }] = useEditPolygonMutation();

  useEffect(() => {
    if (selectedRuleGroupIndex) {
      setConditions(
        polygon.conditionPages?.find(
          (i) => String(i.id) === String(selectedRuleGroupIndex)
        )?.conditions || []
      );
    }
  }, [selectedRuleGroupIndex]);

  const handleSaveConditions = () => {
    const newConditionPages = polygon.conditionPages?.map((page) => {
      if (page.id === selectedRuleGroupIndex) {
        return {
          ...page,
          conditions: conditions,
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
      .then((res) => {
        enqueueSnackbar(
          t("train.areaSettings.classConnector.conditionsAreAdded"),
          { variant: "success" }
        );

        const newPolygons = [...polygons];
        newPolygons[selectedPolygonIndex as number] = res;
        setPolygons(newPolygons);
      })
      .catch(() => {
        enqueueSnackbar(
          t("train.areaSettings.classConnector.conditionsCouldntBeAdded"),
          {
            variant: "error",
          }
        );
      });
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        class: 0,
        count: 0,
        operator: PolygonConditionDto.OperatorEnum.GreaterThan,
        type: PolygonConditionDto.TypeEnum.Intersect,
        subConditions: [],
      },
    ]);
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const handleConditionChange = (
    index: number,
    field: keyof PolygonConditionDto,
    value: string | number
  ) => {
    const newConditions: any = JSON.parse(JSON.stringify(conditions));
    newConditions[index][field] = value;
    setConditions(newConditions);
  };

  const handleSubconditionChange = (
    condIndex: number,
    subIndex: number,
    field: keyof PolygonSubConditionDto,
    value: string | number
  ) => {
    const newConditions: PolygonConditionDto[] = JSON.parse(
      JSON.stringify(conditions)
    );

    if (newConditions && newConditions[condIndex].subConditions) {
      //@ts-ignore
      let newSubConditions = [...newConditions[condIndex].subConditions];

      newSubConditions[subIndex] = {
        ...newSubConditions[subIndex],
        [field]: value,
      };

      newConditions[condIndex] = {
        ...newConditions[condIndex],
        subConditions: newSubConditions,
      };

      setConditions(newConditions);
    }
  };

  const addSubcondition = (index: number) => {
    const newConditions = JSON.parse(JSON.stringify(conditions));
    let subConditions = newConditions[index].subConditions
      ? // @ts-ignore
        [...newConditions[index].subConditions]
      : [];

    subConditions.push({
      class: 0,
      operator: PolygonSubConditionDto.OperatorEnum.With,
    });

    newConditions[index] = {
      ...newConditions[index],
      subConditions, // Assign the new subConditions array
    };

    setConditions(newConditions);
  };

  const removeSubcondition = (condIndex: number, subIndex: number) => {
    const newConditions = JSON.parse(JSON.stringify(conditions));
    newConditions[condIndex].subConditions?.splice(subIndex, 1);
    setConditions(newConditions);
  };

  const renderSubconditions = (
    subconditions: PolygonSubConditionDto[],
    condIndex: number
  ) => {
    return (
      <Box ml={{ xs: 2, sm: 4 }} mt={2}>
        {subconditions.map((subcondition, subIndex) => (
          <Box key={subIndex} display="flex" alignItems="center" mb={1}>
            <FormControl
              variant="outlined"
              fullWidth
              sx={{ marginRight: { xs: 2, sm: 2 } }}
            >
              <InputLabel size="small">
                {t("train.areaSettings.classConnector.subCondition")}
              </InputLabel>
              <Select
                value={subcondition.operator}
                size="small"
                onChange={(e) =>
                  handleSubconditionChange(
                    condIndex,
                    subIndex,
                    "operator",
                    e.target.value
                  )
                }
                label={t("train.areaSettings.classConnector.subCondition")}
              >
                <MenuItem value="with">
                  {t("train.areaSettings.classConnector.with")}
                </MenuItem>
                <MenuItem value="without">
                  {t("train.areaSettings.classConnector.without")}
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              fullWidth
              sx={{ marginRight: { xs: 2, sm: 2 } }}
            >
              <InputLabel size="small">
                {t("train.areaSettings.classConnector.subClass")}
              </InputLabel>
              <Select
                size="small"
                value={subcondition.class}
                onChange={(e) =>
                  handleSubconditionChange(
                    condIndex,
                    subIndex,
                    "class",
                    Number(e.target.value)
                  )
                }
                label={t("train.areaSettings.classConnector.subClass")}
              >
                {yoloOptions.map((className, i) => (
                  <MenuItem key={i} value={className.id}>
                    {className.name.toString().charAt(0).toUpperCase() +
                      className.name.toString().slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton
              onClick={() => removeSubcondition(condIndex, subIndex)}
              color="secondary"
              title={t("train.areaSettings.classConnector.removeSubCondition")}
            >
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="text"
          size="small"
          color="primary"
          onClick={() => addSubcondition(condIndex)}
          startIcon={<AddCircleOutlineIcon />}
        >
          {t("train.areaSettings.classConnector.addSubCondition")}
        </Button>
      </Box>
    );
  };
  return (
    <Box>
      {conditions.map((condition, index) => (
        <Box key={index} mb={2}>
          <Box display="flex" alignItems="center" mb={1} flexWrap="wrap">
            {index > 0 && (
              <>
                <Box>
                  <FormControl
                    variant="outlined"
                    sx={{
                      minWidth: 100,
                      flexGrow: 1,
                      marginBottom: 3,
                    }}
                  >
                    <InputLabel>
                      {t("train.areaSettings.classConnector.operator")}
                    </InputLabel>
                    <Select
                      size="small"
                      fullWidth
                      defaultValue={"and"}
                      disabled
                      label={t("train.areaSettings.classConnector.operator")}
                    >
                      <MenuItem value="and">
                        {t("train.areaSettings.classConnector.and")}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    color="secondary"
                    onClick={() => removeCondition(index)}
                    startIcon={<RemoveCircleOutlineIcon />}
                  >
                    {t("train.areaSettings.classConnector.removeCondition")}
                  </Button>
                </Box>
              </>
            )}
            <BorderedBox padding={1} width={"100%"}>
              <Grid container spacing={2}>
                <Grid item xs={8} sm={8}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    sx={{ marginRight: { xs: 0, sm: 3 }, flexGrow: 1 }}
                  >
                    <InputLabel size="small">
                      {t("train.areaSettings.classConnector.class")}
                    </InputLabel>
                    <Select
                      value={condition.class}
                      size="small"
                      onChange={(e) =>
                        handleConditionChange(
                          index,
                          "class",
                          Number(e.target.value)
                        )
                      }
                      label={t("train.areaSettings.classConnector.class")}
                    >
                      {yoloOptions.map((className, i) => (
                        <MenuItem key={i} value={className.id}>
                          {className.name.toString().charAt(0).toUpperCase() +
                            className.name.toString().slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={4} sm={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    sx={{ marginRight: { xs: 2, sm: 2 } }}
                  >
                    <InputLabel size="small">
                      {t("train.areaSettings.classConnector.type")}
                    </InputLabel>
                    <Select
                      size="small"
                      value={condition.type}
                      onChange={(e) =>
                        handleConditionChange(index, "type", e.target.value)
                      }
                      label={t("train.areaSettings.classConnector.type")}
                    >
                      {Object.values(PolygonConditionDto.TypeEnum).map(
                        (type, i) => (
                          <MenuItem key={i} value={type}>
                            {type.toString().charAt(0).toUpperCase() +
                              type.toString().slice(1)}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "80px" },
                  marginRight: { xs: 0, sm: 3 },
                  flexGrow: 1,
                  marginY: 2,
                }}
              >
                <InputLabel size="small">
                  {t("train.areaSettings.classConnector.operator")}
                </InputLabel>
                <Select
                  size="small"
                  value={condition.operator}
                  onChange={(e) =>
                    handleConditionChange(index, "operator", e.target.value)
                  }
                  label={t("train.areaSettings.classConnector.operator")}
                >
                  <MenuItem value="<">{"<"}</MenuItem>
                  <MenuItem value=">">{">"}</MenuItem>
                  <MenuItem value="=">{"="}</MenuItem>
                  <MenuItem value=">=">{">="}</MenuItem>
                  <MenuItem value="<=">{"<="}</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label={t("train.areaSettings.classConnector.count")}
                type="number"
                value={condition.count}
                size="small"
                onChange={(e) =>
                  handleConditionChange(
                    index,
                    "count",
                    parseInt(e.target.value)
                  )
                }
                sx={{
                  width: { xs: "100%", sm: "80px" },
                  flexGrow: 1,
                  marginY: { xs: 0, sm: 2 },
                }}
                inputProps={{ min: 1 }}
              />

              {condition.subConditions &&
                renderSubconditions(condition.subConditions, index)}
            </BorderedBox>
          </Box>
        </Box>
      ))}
      {selectedRuleGroupIndex != "-1" && (
        <>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={addCondition}
            startIcon={<AddCircleOutlineIcon />}
            sx={{ mt: 2 }}
          >
            {t("train.areaSettings.classConnector.addCondition")}
          </Button>
          <Outputs selectedRuleGroupIndex={selectedRuleGroupIndex} />
          <Emails selectedRuleGroupIndex={selectedRuleGroupIndex} />

          <LoadingButton
            onClick={handleSaveConditions}
            color="primary"
            loading={isLoading}
            variant="contained"
            startIcon={<Save />}
            fullWidth
            sx={{ mt: 2 }}
          >
            {t("train.areaSettings.classConnector.saveCondition")}
          </LoadingButton>
        </>
      )}
    </Box>
  );
};

export default ClassConnector;
