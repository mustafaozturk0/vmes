// factorySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";
import { factoryApi } from "../../api/factory/factoryApi";

export interface FactoryTreeDTO {
  factoryLineId: any;
  factoryLineName: any;
  factoryLines: FactoryLineDTO[];
}

export interface FactoryLineDTO {
  factoryLineId: string;
  factoryLineName: string;
  factoryStations: FactoryStationDTO[];
}

export interface FactoryStationDTO {
  factoryStationId: string;
  factoryStationName: string;
  factoryStations: FactoryMachinesDTO[];
}

export interface FactoryMachinesDTO {
  factoryMachineId: string;
  factoryMachineName: string;
}

export interface FactoryState {
  factoryTree: FactoryTreeDTO[];
  selectedTreeNode: SelectedTreeNode | null;

  expandedNodeIds: number[];
}

export enum SelectedTreeNodeType {
  FactoryMachine = "FactoryMachine",
  FactoryStation = "FactoryStation",
  FactoryLine = "FactoryLine",
}

export interface SelectedTreeNode {
  node: FactoryMachinesDTO | FactoryStationDTO | FactoryLineDTO | null;
  type: SelectedTreeNodeType;
}

const initialState: FactoryState = {
  factoryTree: [],
  selectedTreeNode: null,
  expandedNodeIds: [],
};

const factorySlice = createSlice({
  name: "factory",
  initialState,
  reducers: {
    setFactoryTree: (state, action: PayloadAction<FactoryTreeDTO[]>) => {
      state.factoryTree = action.payload;
    },

    setSelectedTreeNodeReducer: (
      state,
      action: PayloadAction<SelectedTreeNode | null>
    ) => {
      state.selectedTreeNode = action.payload;
    },

    setExpandedNodeIdsReducer: (state, action: PayloadAction<number[]>) => {
      state.expandedNodeIds = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      factoryApi.endpoints.getFactoryTree.matchFulfilled,
      (state, { payload }) => {
        state.factoryTree = payload || [];
        if (state.selectedTreeNode === null && payload && payload.length > 0) {
          state.selectedTreeNode = {
            type: SelectedTreeNodeType.FactoryLine,
            node: payload[0]?.factoryLines[0] || null,
          };
        }
      }
    );
  },
});

export const {
  setFactoryTree,
  setExpandedNodeIdsReducer,
  setSelectedTreeNodeReducer,
} = factorySlice.actions;

// Selectors
export const selectFactoryTree = (state: RootState): FactoryTreeDTO[] => {
  return state.factory?.factoryTree || [];
};

export const selectedTreeNodeSelector = (
  state: RootState
): SelectedTreeNode | null => {
  return state.factory?.selectedTreeNode
    ? state.factory.selectedTreeNode
    : null;
};

export const expandedNodeIdsSelector = (state: RootState): number[] => {
  return state.factory?.expandedNodeIds || [];
};

export default factorySlice.reducer;
