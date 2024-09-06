import { LoadingButton } from "@mui/lab";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  Divider,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { CameraDto } from "../../api/swagger/swagger.api";
import { useSnackbar } from "notistack";
import {
  useAddCameraMutation,
  useEditCameraMutation,
} from "../../api/camera/cameraApi";
import { Edit, Add, CloseSharp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

interface AddEditCameraDrawerProps {
  drawerOpen: { open: boolean; mode: string };
  selectedCamera: CameraDto | null;
  onRefresh: () => void;
  handleCloseDrawer: () => void;
}

export const AddEditCameraDrawer = ({
  drawerOpen,
  handleCloseDrawer,
  onRefresh,
  selectedCamera,
}: AddEditCameraDrawerProps) => {
  const { t } = useTranslation("common");
  const [form, setForm] = useState<CameraDto>({ id: 0, name: "", url: "" });
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [addCamera, { isLoading: addCameraLoading }] = useAddCameraMutation();
  const [editCamera, { isLoading: editLoading }] = useEditCameraMutation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (drawerOpen.open && drawerOpen.mode === "edit" && selectedCamera) {
      setForm(selectedCamera);
    } else {
      resetForm();
    }
  }, [drawerOpen, selectedCamera]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Reset error for the field
  };

  const resetForm = () => {
    setForm({ id: 0, name: "", url: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { name?: string; url?: string } = {};
    if (!form.name) {
      newErrors.name = t("cameras.editCameraDrawer.nameIsRequired");
    }
    if (!form.url) {
      newErrors.url = t("cameras.editCameraDrawer.ipAddressIsRequired");
    } else {
      const ipPattern = new RegExp(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      );
      if (!ipPattern.test(form.url)) {
        newErrors.url = t("cameras.editCameraDrawer.invalidIpAddressFormat");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrEditCamera = () => {
    if (!validateForm()) {
      enqueueSnackbar(t("cameras.editCameraDrawer.pleaseFillRequiredFields"), {
        variant: "error",
      });
      return;
    }

    const action = drawerOpen.mode === "edit" ? editCamera : addCamera;
    action(form)
      .unwrap()
      .then(() => {
        enqueueSnackbar(
          selectedCamera
            ? t("cameras.editCameraDrawer.cameraEditSuccessfully")
            : t("cameras.editCameraDrawer.cameraAddedSuccessfully"),
          { variant: "success" }
        );
        resetForm();
        onRefresh();
        handleCloseDrawer();
      })
      .catch(() => {
        enqueueSnackbar(
          selectedCamera
            ? t("cameras.editCameraDrawer.errorEditingCamera")
            : t("cameras.editCameraDrawer.errorAddingCamera"),
          { variant: "error" }
        );
      });
  };

  return (
    <Drawer
      anchor={isMobile ? "bottom" : "right"}
      open={drawerOpen.open}
      onClose={() => {
        resetForm();
        handleCloseDrawer();
      }}
    >
      <Box
        sx={{
          width: isMobile ? "100%" : 500,
          p: 4,
          pt: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            {drawerOpen.mode === "edit"
              ? t("cameras.editCameraDrawer.editCamera")
              : t("cameras.editCameraDrawer.addCamera")}
          </Typography>
          <IconButton
            onClick={() => {
              resetForm();
              handleCloseDrawer();
            }}
          >
            <CloseSharp />
          </IconButton>
        </Box>
        <Divider />

        <TextField
          label={t("cameras.editCameraDrawer.name")}
          name="name"
          value={form.name}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label={t("cameras.editCameraDrawer.ipAddress")}
          name="url"
          value={form.url}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          error={Boolean(errors.url)}
          helperText={errors.url}
        />
        <LoadingButton
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddOrEditCamera}
          loading={drawerOpen.mode === "edit" ? editLoading : addCameraLoading}
          fullWidth
          startIcon={drawerOpen.mode === "edit" ? <Edit /> : <Add />}
        >
          {drawerOpen.mode === "edit"
            ? t("cameras.editCameraDrawer.editCamera")
            : t("cameras.editCameraDrawer.addCamera")}
        </LoadingButton>
      </Box>
    </Drawer>
  );
};
