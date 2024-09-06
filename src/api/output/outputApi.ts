import { api } from "../api";
import { EndPoints } from "../EndPoints";
import {
  CameraDto,
  CreateCameraDto,
  CreateOutputDto,
  OutputDto,
  UpdateOutputDto,
} from "../swagger/swagger.api";

export const outputApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOutputs: builder.mutation<OutputDto[], void>({
      query: () => ({
        url: `${EndPoints.output}/`,
        method: "GET",
      }),
    }),

    deleteOutput: builder.mutation<OutputDto, number>({
      query: (id) => ({
        url: `${EndPoints.output}/${id}`,
        method: "DELETE",
      }),
    }),
    getOutputById: builder.mutation<OutputDto, number>({
      query: (id) => ({
        url: `${EndPoints.output}/${id}`,
        method: "GET",
      }),
    }),
    editOutput: builder.mutation<OutputDto, UpdateOutputDto>({
      query: (body) => ({
        url: `${EndPoints.output}/`,
        method: "PUT",
        body,
      }),
    }),
    addOutput: builder.mutation<OutputDto, CreateOutputDto>({
      query: (data) => ({
        url: `${EndPoints.output}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetOutputsMutation,
  useDeleteOutputMutation,
  useGetOutputByIdMutation,
  useEditOutputMutation,
  useAddOutputMutation,
} = outputApi;
