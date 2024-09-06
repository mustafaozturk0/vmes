import { LoadingButton } from "@mui/lab";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  useMediaQuery,
  useTheme,
  IconButton,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { OutputDto } from "../../api/swagger/swagger.api";
import { useSnackbar } from "notistack";
import { Edit, Add, CloseSharp } from "@mui/icons-material";
import {
  useEditOutputMutation,
  useAddOutputMutation,
} from "../../api/output/outputApi";
import { useTranslation } from "react-i18next";

interface AddEditOutputDrawerProps {
  drawerOpen: { open: boolean; mode: string };
  currentOutput: OutputDto | null;
  onRefresh: () => void;
  handleCloseDrawer: () => void;
}

export const OutputDrawer = ({
  drawerOpen,
  handleCloseDrawer,
  onRefresh,
  currentOutput,
}: AddEditOutputDrawerProps) => {
  const { t } = useTranslation("common");
  const [form, setForm] = useState<OutputDto>({ id: 0, name: "", ip: "" });
  const [errors, setErrors] = useState<{ name?: string; ip?: string }>({});
  const [editOutput, { isLoading: editOutputLoading }] =
    useEditOutputMutation();
  const [addOutput, { isLoading: addOutputLoading }] = useAddOutputMutation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (drawerOpen.open && drawerOpen.mode === "edit" && currentOutput) {
      setForm(currentOutput);
    } else {
      resetForm();
    }
  }, [drawerOpen, currentOutput]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Reset error for the field
  };

  const resetForm = () => {
    setForm({ id: 0, name: "", ip: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { name?: string; ip?: string } = {};
    if (!form.name) {
      newErrors.name = t("outputs.outputDrawer.nameIsRequired");
    }
    if (!form.ip) {
      newErrors.ip = t("outputs.outputDrawer.ipAddressIsRequired");
    } else {
      const ipPattern = new RegExp(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      );
      if (!ipPattern.test(form.ip)) {
        newErrors.ip = t("outputs.outputDrawer.invalidIpAddressFormat");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrEditOutput = () => {
    if (!validateForm()) {
      enqueueSnackbar(t("outputs.outputDrawer.pleaseFillRequiredFields"), {
        variant: "error",
      });
      return;
    }

    const action = drawerOpen.mode === "edit" ? editOutput : addOutput;

    action(form)
      .unwrap()
      .then(() => {
        enqueueSnackbar(
          currentOutput
            ? t("outputs.outputDrawer.outputEditSuccessfully")
            : t("outputs.outputDrawer.outputAddedSuccessfully"),
          { variant: "success" }
        );
        resetForm();
        onRefresh();
        handleCloseDrawer();
      })
      .catch(() => {
        enqueueSnackbar(
          currentOutput
            ? t("outputs.outputDrawer.errorEditingOutput")
            : t("outputs.outputDrawer.errorAddinOoutput"),
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
              ? t("outputs.outputDrawer.editOutput")
              : t("outputs.outputDrawer.addOutput")}
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
          label={t("outputs.outputDrawer.name")}
          name="name"
          value={form.name}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label={t("outputs.outputDrawer.ipAddress")}
          name="ip"
          value={form.ip}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          error={Boolean(errors.ip)}
          helperText={errors.ip}
        />
        <LoadingButton
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddOrEditOutput}
          loading={
            drawerOpen.mode === "edit" ? editOutputLoading : addOutputLoading
          }
          fullWidth
          startIcon={drawerOpen.mode === "edit" ? <Edit /> : <Add />}
        >
          {drawerOpen.mode === "edit"
            ? t("outputs.outputDrawer.editOutput")
            : t("outputs.outputDrawer.addOutput")}
        </LoadingButton>
      </Box>
    </Drawer>
  );
};
