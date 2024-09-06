import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";
import { OutputDto } from "../../api/swagger/swagger.api";
import { outputApi } from "../../api/output/outputApi";

export interface OutputState {
  outputs: OutputDto[];
}

const initialState: OutputState = {
  outputs: [],
};

const outputSlice = createSlice({
  name: "output",
  initialState,
  reducers: {
    setOutputs: (state, action: PayloadAction<OutputDto[]>) => {
      state.outputs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      outputApi.endpoints.getOutputs.matchFulfilled,
      (state, { payload }) => {
        state.outputs = payload;
      }
    );
  },
});

// Selectors
export const selectOutputs = (state: RootState): OutputDto[] => {
  return state.output.outputs;
};

export default outputSlice.reducer;
