import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";
import { yoloApi } from "../../api/yolo/yoloApi";

interface YoloOptions {
  id: string;
  name: string;
}
export interface YoloState {
  yoloOptions: YoloOptions[];
}

const initialState: YoloState = {
  yoloOptions: [],
};

const yoloslice = createSlice({
  name: "yolo",
  initialState,
  reducers: {
    setYoloOptions: (state, action: PayloadAction<any[]>) => {
      state.yoloOptions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      yoloApi.endpoints.getYoloClasses.matchFulfilled,
      (state, { payload }) => {
        state.yoloOptions = payload.map((yolo) => ({
          id: yolo.classId?.toString() || "",
          name: yolo.className || "",
        }));
      }
    );
  },
});

// Selectors
export const selectYoloOptions = (state: RootState): YoloOptions[] => {
  return state.yolo.yoloOptions;
};

export default yoloslice.reducer;
