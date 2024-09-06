import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useTypedSelector } from "../store/hooks";
import {
  selectCameraOptions,
  setSelectedCameraId,
  selectedCameraId,
} from "../slices/camera/cameraSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export const CameraPicker = () => {
  const [t] = useTranslation("common");
  const cameraId = useTypedSelector(selectedCameraId) || "";
  const cameraOptions = useTypedSelector(selectCameraOptions);
  const dispatch = useDispatch();

  const handleCameraChange = (e: SelectChangeEvent<unknown>) => {
    dispatch(setSelectedCameraId(e.target.value as string));
  };

  return (
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
  );
};
