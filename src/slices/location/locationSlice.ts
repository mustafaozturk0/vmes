import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";

export interface PrevLocationState {
  prevLocation: string | null;
}

const initialState: PrevLocationState = {
  prevLocation: "",
};

const slice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setPrevLocationReducer: (state, action: PayloadAction<string>) => {
      state.prevLocation = action.payload;
    },
  },
});
export const { setPrevLocationReducer } = slice.actions;

export default slice.reducer;

export const prevLocationSelector = (state: RootState) => {
  return {
    prevLocation: state?.location?.prevLocation || null,
  };
};
