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
import { useSnackbar } from "notistack";
import {
  useAddMachineMutation,
  useEditMachineMutation,
} from "../../api/machine/machineApi";
import { Edit, Add, CloseSharp } from "@mui/icons-material";

interface AddEditMachineDrawerProps {
  drawerOpen: { open: boolean; mode: string };
  selectedMachine: any | null;
  onRefresh: () => void;
  handleCloseDrawer: () => void;
}

export const AddEditMachineDrawer = ({
  drawerOpen,
  handleCloseDrawer,
  onRefresh,
  selectedMachine,
}: AddEditMachineDrawerProps) => {
  const [form, setForm] = useState<any>({ id: 0, name: "", url: "" });
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [addMachine, { isLoading: addMachineLoading }] =
    useAddMachineMutation();
  const [editMachine, { isLoading: editLoading }] = useEditMachineMutation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (drawerOpen.open && drawerOpen.mode === "edit" && selectedMachine) {
      setForm(selectedMachine);
    } else {
      resetForm();
    }
  }, [drawerOpen, selectedMachine]);

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
      newErrors.name = "Name is required";
    }
    if (!form.url) {
      newErrors.url = "IP address is required";
    } else {
      const ipPattern = new RegExp(
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      );
      if (!ipPattern.test(form.url)) {
        newErrors.url = "Invalid IP address format";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddOrEditMachine = () => {
    if (!validateForm()) {
      enqueueSnackbar("Please fill in the required fields", {
        variant: "error",
      });
      return;
    }

    const action = drawerOpen.mode === "edit" ? editMachine : addMachine;
    action(form)
      .unwrap()
      .then(() => {
        enqueueSnackbar(
          selectedMachine
            ? "Machine edited successfully"
            : "Machine added successfully",
          { variant: "success" }
        );
        resetForm();
        onRefresh();
        handleCloseDrawer();
      })
      .catch(() => {
        enqueueSnackbar(
          selectedMachine ? "Error editing machine" : "Error adding machine",
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
            {drawerOpen.mode === "edit" ? "Edit Machine" : "Add Machine"}
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
          label="Name"
          name="name"
          value={form.name}
          onChange={handleFormChange}
          fullWidth
          margin="normal"
          error={Boolean(errors.name)}
          helperText={errors.name}
        />
        <TextField
          label="IP Address"
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
          onClick={handleAddOrEditMachine}
          loading={drawerOpen.mode === "edit" ? editLoading : addMachineLoading}
          fullWidth
          startIcon={drawerOpen.mode === "edit" ? <Edit /> : <Add />}
        >
          {drawerOpen.mode === "edit" ? "Edit Machine" : "Add Machine"}
        </LoadingButton>
      </Box>
    </Drawer>
  );
};
