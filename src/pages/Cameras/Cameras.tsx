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
import {
  useGetCamerasMutation,
  useDeleteCameraMutation,
  useGetCameraByIdMutation,
} from "../../api/camera/cameraApi";
import { useTypedSelector } from "../../store/hooks";
import {
  selectCameraOptions,
  selectedCameraId,
  setCameraOptions,
  setSelectedCameraId,
} from "../../slices/camera/cameraSlice";
import { CameraDto } from "../../api/swagger/swagger.api";
import { AddEditCameraDrawer } from "./AddEditCameraDrawer";
import { useDispatch } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useTranslation } from "react-i18next";

const Cameras: React.FC = () => {
  const { t } = useTranslation("common");
  const [getCameras, { isLoading: camerasLoading }] = useGetCamerasMutation();
  const [deleteCamera, { isLoading: deleteLoading }] =
    useDeleteCameraMutation();
  const [getCameraById] = useGetCameraByIdMutation();

  const cameraOptions = useTypedSelector(selectCameraOptions);
  const cameraId = useTypedSelector(selectedCameraId);

  const [selectedCamera, setSelectedCamera] = useState<CameraDto | null>(null);
  const [modalOpen, setModalOpen] = useState({ open: false, mode: "add" });
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  useEffect(() => {
    fetchCameras();
  }, []);

  useEffect(() => {
    if (cameraId) {
      getCameraById(cameraId)
        .unwrap()
        .then((camera) => setSelectedCamera(camera));
    }
  }, [cameraId]);

  const fetchCameras = () => {
    getCameras().unwrap();
  };

  const handleDeleteCamera = (id: number) => {
    if (!id) {
      enqueueSnackbar(t("cameras.cameraTable.cameraIdNotFound"), {
        variant: "error",
      });
      return;
    }
    //eslint-disable-next-line
    if (!confirm(t("cameras.cameraTable.wantToDeleteThisCamera"))) return;
    deleteCamera(id.toString())
      .unwrap()
      .then(() => {
        dispatch(
          setCameraOptions(
            cameraOptions?.filter((c) => Number(c.id) !== Number(id))
          )
        );
        if (Number(selectedCamera?.id) === Number(id)) {
          const tempCameraId: string | null =
            cameraOptions?.length > 0
              ? (cameraOptions[0].id?.toString() as string)
              : null;
          dispatch(setSelectedCameraId(tempCameraId));
        }
        enqueueSnackbar(t("cameras.cameraTable.cameraDeletedSuccess"), {
          variant: "success",
        });
        fetchCameras();
      })
      .catch(() => {
        enqueueSnackbar(t("cameras.cameraTable.errorDeletingCamera"), {
          variant: "error",
        });
      });
  };

  const handleEditClick = (camera: CameraDto) => {
    setSelectedCamera(camera);
    handleOpenModal("edit");
  };

  const handleOpenModal = (mode: string) => {
    setModalOpen({ open: true, mode: mode });
  };

  const handleCloseModal = () => {
    setModalOpen({ open: false, mode: "add" });
    setSelectedCamera(null);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 60,
      },
      {
        headerName: t("cameras.cameraTable.camera"),
        field: "name",
        flex: 1,
      },
      {
        headerName: t("cameras.cameraTable.ipAddress"),
        field: "url",
        flex: 1,
      },
      {
        headerName: t("cameras.cameraTable.actions"),
        field: "actions",
        width: 150,
        cellRenderer: (params: any) => (
          <>
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => handleEditClick(params.data)}
              sx={{ marginRight: "8px" }}
              title={t("cameras.cameraTable.editCamera")}
            >
              <Edit />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteCamera(params.data.id!)}
              title={t("cameras.cameraTable.deleteCamera")}
              disabled={deleteLoading && selectedCamera?.id === params.data.id}
            >
              <Delete />
            </IconButton>
          </>
        ),
      },
    ],
    [deleteLoading, selectedCamera]
  ) as any;

  const theme = useTheme();

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
      <Grid container spacing={2} p={0}>
        <Grid item xs={12} md={12} container direction="row" spacing={2}>
          <Grid item>
            <Button
              onClick={fetchCameras}
              variant="outlined"
              sx={{ marginLeft: 1 }}
              color="primary"
              startIcon={<Refresh />}
              fullWidth
            >
              {t("cameras.cameraTable.refreshCameras")}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleOpenModal("add")}
              fullWidth
            >
              {t("cameras.cameraTable.addNewCamera")}
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
              rowData={cameraOptions}
              columnDefs={columnDefs}
              loading={camerasLoading}
              pagination={true}
              paginationPageSize={10}
            />
          </div>
        </Grid>

        <AddEditCameraDrawer
          drawerOpen={modalOpen}
          handleCloseDrawer={handleCloseModal}
          onRefresh={fetchCameras}
          selectedCamera={selectedCamera || null}
        />
      </Grid>
    </Card>
  );
};

export default Cameras;
