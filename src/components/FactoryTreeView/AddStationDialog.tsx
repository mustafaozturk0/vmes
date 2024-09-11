import { LoadingButton } from "@mui/lab";
import {
  DialogTitle,
  DialogActions,
  Dialog,
  Button,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCameraOptions,
  setSelectedCameraId,
} from "../../slices/camera/cameraSlice";
import { useTypedSelector } from "../../store/hooks";
import { useAddPolygonMutation } from "../../api/polygon/polygonApi";
import { CreatePolygonDto, VggModelsDto } from "../../api/swagger/swagger.api";
import { selectedTreeNodeSelector } from "../../slices/factory/factorySlice";
import { useGetVggModelsMutation } from "../../api/vgg/vggModelsApi";
import { enqueueSnackbar } from "notistack";

interface AddStringDialogProps {
  open: boolean;
  onClose: () => void;
  onAddCallback: () => void;
}

export const AddStationDialog = ({
  open,
  onAddCallback,
  onClose,
}: AddStringDialogProps) => {
  const [newString, setNewString] = useState<string>("");
  const [cameraId, setCameraId] = useState<string>("");

  const cameraOptions = useTypedSelector(selectCameraOptions);
  const selectedTreeNode = useTypedSelector(selectedTreeNodeSelector);
  const dispatch = useDispatch();
  const [addPolygon, { isLoading }] = useAddPolygonMutation();
  const [getVggModels, { data: vggModels }] = useGetVggModelsMutation();
  const handleCameraChange = (e: SelectChangeEvent<unknown>) => {
    setCameraId(e.target.value as string);
  };
  const [selectedVgg, setSelectedVgg] = useState<VggModelsDto>();

  useEffect(() => {
    getVggModels().unwrap();
    setNewString("");
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    console.log(selectedVgg);
    const dto: CreatePolygonDto = {
      name: newString,
      cameraId: Number(cameraId),
      lineId: Number(selectedTreeNode?.node.id.split("+")[0]) || 0,
      x: 0,
      y: 0,
      points: [
        [selectedVgg?.x || 0, selectedVgg?.y || 0],
        [
          (selectedVgg?.x || 0) + (selectedVgg?.width || 0),
          selectedVgg?.y || 0,
        ],
        [
          (selectedVgg?.x || 0) + (selectedVgg?.width || 0),
          (selectedVgg?.y || 0) + (selectedVgg?.height || 0),
        ],
        [
          selectedVgg?.x || 0,
          (selectedVgg?.y || 0) + (selectedVgg?.height || 0),
        ],
      ],
      modelName: selectedVgg?.modelFile || "",
      classList: selectedVgg?.classList || [],
      classColors: selectedVgg?.classColors || [],
      color: "rgba(0, 0, 255, 0.5)",
    };
    addPolygon(dto)
      .then(() => {
        onAddCallback();
        handleClose();
      })
      .then(() => {
        enqueueSnackbar("Polygon added successfully", {
          variant: "success",
        });
      })
      .catch(() => {
        enqueueSnackbar("Polygon could not be added", {
          variant: "error",
        });
      });
  };

  const handleStringChange = (event: any) => {
    setNewString(event.target.value as string);
  };

  const handleVggModelChange = (e: SelectChangeEvent<unknown>) => {
    const selectedModel = vggModels?.find(
      (model) => model.modelFile === e.target.value
    );
    setSelectedVgg(selectedModel);
  };

  const [t] = useTranslation("common");
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <>Add Station</>
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <TextField
          placeholder={"Enter station name"}
          value={newString}
          onChange={handleStringChange}
          autoFocus={true}
          variant="outlined"
          sx={{ mt: 1, mb: 2, minWidth: "300px" }}
          label={"Station Name"}
          inputProps={{ maxLength: 150, minLength: 0 }}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="camera-select-label" shrink={true}>
            {t("components.cameraPicker.selectCamera")}
          </InputLabel>
          <Select
            variant="outlined"
            title={t("components.cameraPicker.selectCameraYouWantToUse")}
            label={t("components.cameraPicker.selectCamera")}
            sx={{ minWidth: 120 }}
            value={cameraId}
            disabled={!cameraOptions.length}
            onChange={(e) => {
              handleCameraChange(e);
            }}
          >
            {cameraOptions.map((camera) => (
              <MenuItem key={camera.id} value={camera.id}>
                {camera.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="camera-select-label" shrink={true}>
            {t("Vgg Models")}
          </InputLabel>
          <Select
            variant="outlined"
            title={t("Vgg Models")}
            label={t("Vgg Models")}
            sx={{ minWidth: 120 }}
            value={selectedVgg?.modelFile}
            disabled={!vggModels?.length}
            onChange={(e) => {
              handleVggModelChange(e);
            }}
          >
            {vggModels?.map((model) => (
              <MenuItem key={model.modelFile} value={model.modelFile}>
                {model.modelFile?.split(".pth")[0]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          <> {t("commonWords.cancel")}</>
        </Button>

        <LoadingButton
          onClick={handleAdd}
          loading={isLoading}
          color="primary"
          variant={"outlined"}
          disabled={
            newString.length === 0 ||
            selectedVgg === undefined ||
            cameraId === ""
          }
        >
          <> {t("commonWords.add")}</>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
