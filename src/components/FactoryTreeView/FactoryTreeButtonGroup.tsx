import React, { useEffect, useState } from "react";
import { AddStringDialog as AddFactoryLineDialog } from "../../components/Dialog/AddStringDialog";
import { AddStringDialog as AddFactoryStationDialog } from "../../components/Dialog/AddStringDialog";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { PowerInput, TableRestaurant } from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../store/hooks";
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
} from "../../slices/factory/factorySlice";
import { AddStationDialog } from "./AddStationDialog";

export const FactoryTreeButtonGroup = () => {
  const [t] = useTranslation("common");
  const { enqueueSnackbar } = useSnackbar();

  const [addFactoryLine] = useAddFactoryLineMutation();
  const [addFactoryStation] = useAddFactoryStationMutation();
  const [getFactoryTree] = useGetFactoryTreeMutation();

  const selectedTreeNode = useTypedSelector(selectedTreeNodeSelector);
  const factoryTree = useTypedSelector(selectFactoryTree);

  const [addLineDialogOpen, setAddLineDialogOpen] = useState(false);

  const [addStationDialogOpen, setAddStationDialogOpen] = useState(false);

  const expandedIds = useTypedSelector(expandedNodeIdsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!factoryTree) getFactoryTree();
  }, []);

  const addNewLine = (lineName: string) => {
    addFactoryLine({ name: lineName })
      .unwrap()
      .then((id) => {
        getFactoryTree();
        return id;
      })
      .finally(() => {
        enqueueSnackbar(t("factoryButtonGroup.lineAdded"), {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(t("factoryButtonGroup.errorAddingLine"), {
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
        enqueueSnackbar(t("factoryButtonGroup.stationAdded"), {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(t("factoryButtonGroup.errorAddingStation"), {
          variant: "error",
        });
      });
  };

  function renderTreeButtonGroup() {
    const iconFontSize = 8;
    return (
      <>
        <TooltipWrapper title={<>{t("factory.addLine")}</>} arrow>
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
                {t("factory.addLine")}
              </Typography>
            </IconButton>
          </span>
        </TooltipWrapper>
        <TooltipWrapper title={<>{t("factory.addStation")}</>} arrow>
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
              {t("factory.addStation")
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
        title={t("factory.addLine")}
        label={t("factory.lineName")}
        placeholder={t("factory.linePlaceholder")}
      />
      <AddStationDialog
        open={addStationDialogOpen}
        onClose={() => setAddStationDialogOpen(false)}
        onAddCallback={getFactoryTree}
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
