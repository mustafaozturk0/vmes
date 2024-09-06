import { api } from "../api";
import { EndPoints } from "../EndPoints";
import { CreateLineDto, LineDto, LineTreeDto } from "../swagger/swagger.api";

export const factoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getFactoryTree: builder.mutation<LineTreeDto[], void>({
      query: () => ({
        url: `${EndPoints.line}/tree`,
        method: "GET",
      }),
    }),
    updateFactoryTree: builder.mutation<LineDto, LineDto>({
      query: (body) => ({
        url: `${EndPoints.line}/`,
        method: "PUT",
        body,
      }),
    }),
    addFactoryLine: builder.mutation<LineDto, CreateLineDto>({
      query: (body) => ({
        url: `${EndPoints.line}/`,
        method: "POST",
        body,
      }),
    }),
    addFactoryStation: builder.mutation<
      number,
      { factoryStationName: string; factoryLineId: number }
    >({
      query: (body) => ({
        url: `${EndPoints.line}/station`,
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
