import { LoadingButton } from "@mui/lab";
import {
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  DialogContent,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AddStringDialogProps {
  addDialogOpen: boolean;
  onClose: () => void;
  onAddCallback: (lineName: string) => void;
  title: string;
  placeholder: string;
  label: string;
  loading?: boolean;
}

export const AddStringDialog = ({
  addDialogOpen,
  onAddCallback,
  onClose,
  label,
  title,
  placeholder,
  loading,
}: AddStringDialogProps) => {
  const [newString, setNewString] = useState<string>("");

  useEffect(() => {
    setNewString("");
  }, [addDialogOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    onAddCallback(newString);
    handleClose();
  };

  const handleStringChange = (event: any) => {
    setNewString(event.target.value as string);
  };
  const [t] = useTranslation("common");
  return (
    <Dialog open={addDialogOpen} onClose={handleClose}>
      <DialogTitle>
        <>{title}</>
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <TextField
          placeholder={placeholder}
          value={newString}
          onChange={handleStringChange}
          autoFocus={true}
          variant="outlined"
          sx={{ mt: 1, mb: 0, minWidth: "300px" }}
          label={label}
          inputProps={{ maxLength: 150, minLength: 0 }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          <> {t("commonWords.cancel")}</>
        </Button>

        <LoadingButton
          onClick={handleAdd}
          loading={loading || false}
          color="primary"
          variant={"outlined"}
          disabled={newString.length === 0}
        >
          <> {t("commonWords.add")}</>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
