import { api } from "../api";
import { EndPoints } from "../EndPoints";
import {
  FactoryTreeDTO,
  FactoryLineDTO,
  FactoryStationDTO,
} from "../../slices/factory/factorySlice"; // Import the FactoryLineDTO type

export const factoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryTree: builder.mutation<FactoryTreeDTO[], void>({
      query: () => ({
        url: `${EndPoints.factory}/`,
        method: "GET",
      }),
    }),
    updateFactoryTree: builder.mutation<FactoryTreeDTO[], FactoryTreeDTO[]>({
      query: (body) => ({
        url: `${EndPoints.factory}/`,
        method: "PUT",
        body,
      }),
    }),
    addFactoryLine: builder.mutation<number, { factoryLineName: string }>({
      query: (body) => ({
        url: `${EndPoints.factory}/line`,
        method: "POST",
        body,
      }),
    }),
    addFactoryStation: builder.mutation<
      number,
      { factoryStationName: string; factoryLineId: number }
    >({
      query: (body) => ({
        url: `${EndPoints.factory}/station`,
        method: "POST",
        body,
      }),
    }),
  }),
});
export const {
  useGetFactoryTreeMutation,
  useUpdateFactoryTreeMutation,
  useAddFactoryLineMutation,
  useAddFactoryStationMutation,
} = factoryApi;
