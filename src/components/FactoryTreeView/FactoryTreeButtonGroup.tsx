import React, { useEffect, useState } from "react";
import { AddStringDialog as AddFactoryLineDialog } from "../../components/Dialog/AddStringDialog";
import { AddStringDialog as AddFactoryStationDialog } from "../../components/Dialog/AddStringDialog";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import {
  CenterFocusStrong,
  GppGood,
  PowerInput,
  TableRestaurant,
  Videocam,
} from "@mui/icons-material";
import AutoAwesomeMotionOutlinedIcon from "@mui/icons-material/AutoAwesomeMotionOutlined";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import TocIcon from "@mui/icons-material/Toc";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import uniq from "lodash/uniq";
import { useTypedSelector } from "../../store/hooks";
import { deepSearchByKey } from "../../utils/commonUtils";
import { TooltipWrapper } from "../Tooltip/TooltipWrapper";
import {
  useAddFactoryLineMutation,
  useAddFactoryStationMutation,
  useGetFactoryTreeMutation,
} from "../../api/factory/factoryApi";
import {
  expandedNodeIdsSelector,
  selectedTreeNodeSelector,
  SelectedTreeNodeType,
  selectFactoryTree,
  setExpandedNodeIdsReducer,
  setSelectedTreeNodeReducer,
} from "../../slices/factory/factorySlice";

export const FactoryTreeButtonGroup = () => {
  const [t] = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();

  const [addFactoryLine] = useAddFactoryLineMutation();
  const [addFactoryStation] = useAddFactoryStationMutation();
  const [getFactoryTree] = useGetFactoryTreeMutation();

  const selectedTreeNode = useTypedSelector(selectedTreeNodeSelector);
  const factoryTree = useTypedSelector(selectFactoryTree);

  const [addLineDialogOpen, setAddLineDialogOpen] = useState(false);
  const [addStationGroupDialogOpen, setAddStationGroupDialogOpen] =
    useState(false);
  const [addStationDialogOpen, setAddStationDialogOpen] = useState(false);
  const [addVideoDialogOpen, setAddVideoDialogOpen] = useState(false);

  const [addStepDialogOpen, setAddStepDialogOpen] = useState(false);
  const expandedIds = useTypedSelector(expandedNodeIdsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!factoryTree) getFactoryTree();
  }, []);

  const addNewLine = (lineName: string) => {
    addFactoryLine({ factoryLineName: lineName })
      .unwrap()
      .then((id) => {
        getFactoryTree();
        return id;
      })
      .finally(() => {
        enqueueSnackbar(t("engineeringTools.buttonGroup.lineAdded"), {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(t("engineeringTools.buttonGroup.lineAddError"), {
          variant: "error",
        });
      });
  };

  const addNewStation = (stationName: string) => {
    const factoryLineId = 2;
    addFactoryStation({
      factoryStationName: stationName,
      factoryLineId: factoryLineId,
    })
      .unwrap()
      .then((id) => {
        getFactoryTree();
        return id;
      })
      .finally(() => {
        enqueueSnackbar(t("engineeringTools.buttonGroup.stationAdded"), {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(t("engineeringTools.buttonGroup.stationAddError"), {
          variant: "error",
        });
      });
  };
  function renderTreeButtonGroup() {
    const iconFontSize = 8;
    return (
      <>
        <TooltipWrapper title={<>{t("factory.page.addLine")}</>} arrow>
          <span>
            <IconButton
              onClick={() => setAddLineDialogOpen(!addLineDialogOpen)}
              color="success"
              sx={{ display: "inline-block", padding: 0, mr: 2, ml: 1 }}
            >
              <PowerInput fontSize={"small"} />
              <Typography
                variant={"subtitle2"}
                fontSize={iconFontSize}
                marginTop={-1}
                color="success"
              >
                {t("Add Line")}
              </Typography>
            </IconButton>
          </span>
        </TooltipWrapper>
        <TooltipWrapper title={<>{t("Add Station")}</>} arrow>
          <span>
            <IconButton
              onClick={() => setAddStationDialogOpen(!addStationDialogOpen)}
              color="primary"
              disabled={
                selectedTreeNode?.type !== SelectedTreeNodeType.FactoryLine
              }
              sx={{ display: "inline-block", padding: 0, mr: 2 }}
            >
              <TableRestaurant fontSize={"small"} />
              {t("Add Station")
                .split(" ")
                .map((word, index) => (
                  <Typography
                    key={index}
                    variant={"subtitle2"}
                    color={
                      selectedTreeNode?.type !==
                      SelectedTreeNodeType.FactoryLine
                        ? "disabled"
                        : "primary"
                    }
                    fontSize={iconFontSize}
                    marginTop={index === 0 ? -0.7 : -0.5}
                    sx={{ display: "block", lineBreak: "anywhere" }} // Changed to display as block
                  >
                    {word}
                  </Typography>
                ))}
            </IconButton>
          </span>
        </TooltipWrapper>
      </>
    );
  }

  return (
    <>
      <AddFactoryLineDialog
        addDialogOpen={addLineDialogOpen}
        onClose={() => setAddLineDialogOpen(false)}
        onAddCallback={addNewLine}
        title={t("factory.page.addLine")}
        label={t("factory.addLine.lineName")}
        placeholder={t("engineeringTools.buttonGroup.linePlaceholder")}
      />
      <AddFactoryStationDialog
        addDialogOpen={addStationDialogOpen}
        onClose={() => setAddStationDialogOpen(false)}
        onAddCallback={addNewStation}
        title={t("factory.addStation")}
        label={t("factory.stationName")}
        placeholder={t("factory.stationPlaceholder")}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Grid container spacing={0}>
          <Grid item xs={9}>
            <Box paddingLeft={0.5} display={"flow"}>
              {renderTreeButtonGroup()}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
