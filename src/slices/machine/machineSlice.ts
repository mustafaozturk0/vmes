// machineSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";
import { machineApi } from "../../api/machine/machineApi";

export interface MachineState {
  machineOptions: any[];
  selectedMachineId: string | null;
}

const initialState: MachineState = {
  machineOptions: [],
  selectedMachineId: null,
};

const machineSlice = createSlice({
  name: "machine",
  initialState,
  reducers: {
    setMachineOptions: (state, action: PayloadAction<any[]>) => {
      state.machineOptions = action.payload;
      if (
        state.selectedMachineId === null &&
        action.payload &&
        action.payload.length > 0
      ) {
        state.selectedMachineId = action.payload[0]?.id?.toString() || null;
      }
    },

    setSelectedMachineId: (state, action: PayloadAction<string | null>) => {
      state.selectedMachineId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      machineApi.endpoints.getMachines.matchFulfilled,
      (state, { payload }) => {
        state.machineOptions = payload || [];
        if (state.selectedMachineId === null && payload && payload.length > 0) {
          state.selectedMachineId = payload[0]?.id?.toString() || null;
        }
      }
    );
  },
});

export const { setMachineOptions, setSelectedMachineId } = machineSlice.actions;

// Selectors
export const selectMachineOptions = (state: RootState): any[] => {
  return state.machine.machineOptions;
};

export const selectedMachineId = (state: RootState): string | null => {
  return state.machine.selectedMachineId
    ? state.machine.selectedMachineId
    : null;
};

export default machineSlice.reducer;
