import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface SuccessDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

function SuccessDialog({ open, title, message, onClose }: SuccessDialogProps) {
  const [t] = useTranslation("common");
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/static/images/logo/logo.png"
          style={{ width: 60, background: "transparent" }}
        />
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant={"outlined"}>
          {t("commonWords.ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SuccessDialog;
