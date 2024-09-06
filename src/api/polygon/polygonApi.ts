import { api } from "../api";
import { EndPoints } from "../EndPoints";
import {
  CameraDto,
  CreatePolygonDto,
  PolygonDto,
} from "../swagger/swagger.api";

export const polygonApi = api.injectEndpoints({
  endpoints: (builder) => ({
    editPolygon: builder.mutation<PolygonDto, PolygonDto>({
      query: (body) => ({
        url: `${EndPoints.polygon}/`,
        method: "PUT",
        body,
      }),
    }),

    getPolygons: builder.mutation<PolygonDto[], void>({
      query: () => ({
        url: `${EndPoints.polygon}/`,
        method: "GET",
      }),
    }),
    addPolygon: builder.mutation<PolygonDto, CreatePolygonDto>({
      query: (data) => ({
        url: `${EndPoints.polygon}/`,
        method: "POST",
        body: data,
      }),
    }),
    getPolygonsByCameraId: builder.mutation<PolygonDto[], string>({
      query: (cameraId) => ({
        url: `${EndPoints.polygon}/camera/${cameraId}`,
        method: "GET",
      }),
    }),
    getPolygonById: builder.mutation<PolygonDto, string>({
      query: (id) => ({
        url: `${EndPoints.polygon}/${id}`,
        method: "GET",
      }),
    }),
    deletePolygon: builder.mutation<CameraDto, string>({
      query: (id) => ({
        url: `${EndPoints.polygon}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useEditPolygonMutation,
  useGetPolygonsMutation,
  useAddPolygonMutation,
  useGetPolygonsByCameraIdMutation,
  useGetPolygonByIdMutation,
  useDeletePolygonMutation,
} = polygonApi;
