// cameraSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";
import { CameraDto } from "../../api/swagger/swagger.api"; // Ensure this is correctly typed
import { cameraApi } from "../../api/camera/cameraApi";

export interface CameraState {
  cameraOptions: CameraDto[];
  selectedCameraId: string | null;
}

const initialState: CameraState = {
  cameraOptions: [],
  selectedCameraId: null,
};

const cameraSlice = createSlice({
  name: "camera",
  initialState,
  reducers: {
    setCameraOptions: (state, action: PayloadAction<CameraDto[]>) => {
      state.cameraOptions = action.payload;
      if (
        state.selectedCameraId === null &&
        action.payload &&
        action.payload.length > 0
      ) {
        state.selectedCameraId = action.payload[0]?.id?.toString() || null;
      }
    },

    setSelectedCameraId: (state, action: PayloadAction<string | null>) => {
      state.selectedCameraId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cameraApi.endpoints.getCameras.matchFulfilled,
      (state, { payload }) => {
        state.cameraOptions = payload || [];
        if (state.selectedCameraId === null && payload && payload.length > 0) {
          state.selectedCameraId = payload[0]?.id?.toString() || null;
        }
      }
    );
  },
});

export const { setCameraOptions, setSelectedCameraId } = cameraSlice.actions;

// Selectors
export const selectCameraOptions = (state: RootState): CameraDto[] => {
  return state.camera.cameraOptions;
};

export const selectedCameraId = (state: RootState): string | null => {
  return state.camera.selectedCameraId ? state.camera.selectedCameraId : null;
};

export default cameraSlice.reducer;
