import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Button,
  useTheme,
  Divider,
  Card,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Add, Refresh } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { useTypedSelector } from "../../store/hooks";

import { useDispatch } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  selectMachineOptions,
  selectedMachineId,
  setMachineOptions,
  setSelectedMachineId,
} from "../../slices/machine/machineSlice";
import { AddEditMachineDrawer } from "./AddEditMachineDrawer";

const Machines: React.FC = () => {
  const [getMachines, { isLoading: machinesLoading }] =
    useGetMachinesMutation();
  const [deleteMachine, { isLoading: deleteLoading }] =
    useDeleteMachineMutation();
  const [getMachineById] = useGetMachineByIdMutation();

  const machineOptions = useTypedSelector(selectMachineOptions);
  const machineId = useTypedSelector(selectedMachineId);

  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState({ open: false, mode: "add" });
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    if (machineId) {
      getMachineById(machineId)
        .unwrap()
        .then((machine: any) => setSelectedMachine(machine));
    }
  }, [machineId]);

  const fetchMachines = () => {
    getMachines().unwrap();
  };

  const handleDeleteMachine = (id: number) => {
    if (!id) {
      enqueueSnackbar("Machine ID not found", { variant: "error" });
      return;
    }
    //eslint-disable-next-line
    if (!confirm("Are you sure you want to delete this machine?")) return;
    deleteMachine(id.toString())
      .unwrap()
      .then(() => {
        dispatch(
          setMachineOptions(
            machineOptions?.filter((c) => Number(c.id) !== Number(id))
          )
        );
        if (Number(selectedMachine?.id) === Number(id)) {
          const tempMachineId: string | null =
            machineOptions?.length > 0
              ? (machineOptions[0].id?.toString() as string)
              : null;
          dispatch(setSelectedMachineId(tempMachineId));
        }
        enqueueSnackbar("Machine deleted successfully", { variant: "success" });
        fetchMachines();
      })
      .catch(() => {
        enqueueSnackbar("Error deleting machine", { variant: "error" });
      });
  };

  const handleEditClick = (machine: any) => {
    setSelectedMachine(machine);
    handleOpenModal("edit");
  };

  const handleOpenModal = (mode: string) => {
    setModalOpen({ open: true, mode: mode });
  };

  const handleCloseModal = () => {
    setModalOpen({ open: false, mode: "add" });
    setSelectedMachine(null);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 60,
      },
      {
        headerName: "Machine",
        field: "name",
        flex: 1,
      },
      {
        headerName: "IP Address",
        field: "url",
        flex: 1,
      },
      {
        headerName: "Actions",
        field: "actions",
        width: 150,
        cellRenderer: (params: any) => (
          <>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleEditClick(params.data)}
              sx={{ marginRight: "8px" }}
              title="Edit Machine"
            >
              <Edit />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteMachine(params.data.id!)}
              title="Delete Machine"
              disabled={deleteLoading && selectedMachine?.id === params.data.id}
            >
              <Delete />
            </IconButton>
          </>
        ),
      },
    ],
    [deleteLoading, selectedMachine]
  ) as any;

  const theme = useTheme();

  return (
    <Card sx={{ pt: 2, minHeight: "400px" }}>
      <Grid container spacing={2} p={0}>
        <Grid item xs={12} md={12} container direction="row" spacing={2}>
          <Grid item>
            <Button
              onClick={fetchMachines}
              variant="outlined"
              sx={{ marginLeft: 1 }}
              color="primary"
              startIcon={<Refresh />}
              fullWidth
            >
              Refresh Machines
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenModal("add")}
              fullWidth
            >
              Add New Machine
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12}>
          <Divider />

          <div
            className={
              theme.palette.mode === "light"
                ? "ag-theme-alpine"
                : "ag-theme-alpine-dark"
            }
            style={{ height: "400px", width: "100%" }}
          >
            <AgGridReact
              rowData={machineOptions as any}
              columnDefs={columnDefs}
              loading={machinesLoading}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </Grid>

        <AddEditMachineDrawer
          drawerOpen={modalOpen}
          handleCloseDrawer={handleCloseModal}
          onRefresh={fetchMachines}
          selectedMachine={selectedMachine || null}
        />
      </Grid>
    </Card>
  );
};

export default Machines;
function useGetMachinesMutation(): [any, { isLoading: any }] {
  throw new Error("Function not implemented.");
}

function useDeleteMachineMutation(): [any, { isLoading: any }] {
  throw new Error("Function not implemented.");
}

function useGetMachineByIdMutation(): [any] {
  throw new Error("Function not implemented.");
}
