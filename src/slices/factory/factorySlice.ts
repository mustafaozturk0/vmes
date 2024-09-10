// factorySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/Store";
import { factoryApi } from "../../api/factory/factoryApi";
import { LineDto } from "../../api/swagger/swagger.api";

export interface FactoryState {
  factoryTree: LineDto[];
  selectedTreeNode: SelectedTreeNode | null;

  expandedNodeIds: number[];
}

export enum SelectedTreeNodeType {
  FactoryMachine = "FactoryMachine",
  FactoryStation = "FactoryStation",
  FactoryLine = "FactoryLine",
}

export interface SelectedTreeNode {
  node: any | null;
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
    setFactoryTree: (state, action: PayloadAction<LineDto[]>) => {
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
export const selectFactoryTree = (state: RootState): LineDto[] => {
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
