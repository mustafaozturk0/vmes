import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
  okButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  noConfirm?: boolean;
  onClosed?: () => void;

  jsxElement?: JSX.Element;
}

function ConfirmationDialog({
  open,
  title,
  question,
  onConfirm,
  onCancel,
  okButtonText,
  cancelButtonText,
  isLoading,
  noConfirm,
  jsxElement,
  onClosed,
}: ConfirmationDialogProps) {
  const [t] = useTranslation("common");
  return (
    <Dialog open={open} onClose={onClosed || undefined}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {!jsxElement ? question : jsxElement}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          {cancelButtonText ? cancelButtonText : t("commonWords.cancel")}
        </Button>
        {!noConfirm && (
          <LoadingButton
            onClick={onConfirm}
            variant={"outlined"}
            loading={isLoading || false}
          >
            {okButtonText ? okButtonText : t("commonWords.ok")}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
