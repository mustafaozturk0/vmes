import React, { useEffect, useState, useMemo } from "react";
import {
  Grid,
  Button,
  IconButton,
  useTheme,
  Box,
  useMediaQuery,
  Card,
} from "@mui/material";
import { Edit, Delete, AddOutlined, Refresh } from "@mui/icons-material";
import { OutputDrawer } from "./OutputDrawer";
import {
  useGetOutputsMutation,
  useDeleteOutputMutation,
} from "../../api/output/outputApi";
import { OutputDto } from "../../api/swagger/swagger.api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useTranslation } from "react-i18next";

const Outputs: React.FC = () => {
  const { t } = useTranslation("common");
  const [outputs, setOutputs] = useState<OutputDto[]>([]);
  const [currentOutput, setCurrentOutput] = useState<OutputDto | null>(null);
  const [modalOpen, setModalOpen] = useState({ open: false, mode: "add" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [getOutputs, { isLoading: loadingOutputs }] = useGetOutputsMutation();
  const [deleteOutput] = useDeleteOutputMutation();

  useEffect(() => {
    refetch();
  }, []);

  const refetch = () => {
    getOutputs()
      .unwrap()
      .then((fetchedOutputs) => {
        if (fetchedOutputs) {
          setOutputs(fetchedOutputs);
        }
      });
  };

  const handleDeleteOutput = async (id: number) => {
    //eslint-disable-next-line
    if (!confirm(t("outputs.outputTable.wantToDeleteThisOutput"))) return;

    await deleteOutput(id);
    setOutputs(outputs.filter((out) => out.id !== id));
    refetch();
  };

  const handleEditOutput = (output: OutputDto) => {
    setCurrentOutput(output);
    setModalOpen({ open: true, mode: "edit" });
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 60,
      },
      {
        field: "name",
        headerName: t("outputs.outputTable.outputName"),
        flex: 1,
      },
      { field: "ip", headerName: t("outputs.outputTable.ipAddress"), flex: 1 },
      {
        field: "lastChecked",
        headerName: t("outputs.outputTable.lastChecked"),
        flex: 1,
      },

      {
        field: "isActive",
        headerName: t("outputs.outputTable.isActive"),
        width: 100, // Adjust the width to fit the circle nicely
        suppressSizeToFit: true,
        cellRenderer: (params: any) => (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: params.value ? "green" : "red",
              border: "1px solid #ddd",
              margin: 15,
            }}
          />
        ),
      },

      {
        headerName: t("outputs.outputTable.actions"),
        cellRenderer: (params: any) => (
          <Box>
            <IconButton
              onClick={() => handleEditOutput(params.data)}
              sx={{ marginRight: 1 }}
              title={t("outputs.outputTable.edit")}
              size="small"
            >
              <Edit color="primary" fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() =>
                params.data.id && handleDeleteOutput(params.data.id)
              }
              title={t("commonWords.delete")}
              size="small"
            >
              <Delete color="secondary" fontSize="small" />
            </IconButton>
          </Box>
        ),
        width: 120,
        suppressSizeToFit: true,
      },
    ],
    [outputs]
  ) as any;

  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
  };

  const handleCloseModal = () => {
    setModalOpen({ open: false, mode: "add" });
    setCurrentOutput(null);
  };

  return (
    <Card
      sx={{
        pt: 2,
        minHeight: "400px",
        background:
          theme.palette.mode === "dark"
            ? "#222628"
            : theme.palette.background.paper,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            sx={{ alignSelf: "center", marginX: 1 }}
            fullWidth={isMobile}
          >
            {t("outputs.outputTable.refreshOutput")}
          </Button>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            startIcon={<AddOutlined />}
            onClick={() => setModalOpen({ open: true, mode: "add" })}
            sx={{ alignSelf: "center" }}
            fullWidth={isMobile}
          >
            {t("outputs.outputTable.addOutput")}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <div
            className={
              theme.palette.mode === "light"
                ? "ag-theme-alpine"
                : "ag-theme-alpine-dark"
            }
            style={{
              height: isMobile ? "calc(100vh - 200px)" : "400px",
              width: "100%",
            }}
          >
            <AgGridReact
              rowData={outputs}
              columnDefs={columnDefs}
              gridOptions={gridOptions}
              loading={loadingOutputs}
            />
          </div>
        </Grid>

        <OutputDrawer
          drawerOpen={modalOpen}
          handleCloseDrawer={handleCloseModal}
          onRefresh={refetch}
          currentOutput={currentOutput}
        />
      </Grid>
    </Card>
  );
};

export default Outputs;
