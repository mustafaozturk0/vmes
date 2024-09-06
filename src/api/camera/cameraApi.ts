import { api } from "../api";
import { EndPoints } from "../EndPoints";
import { CameraDto, CreateCameraDto } from "../swagger/swagger.api";

export const cameraApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCameras: builder.mutation<CameraDto[], void>({
      query: () => ({
        url: `${EndPoints.camera}/`,
        method: "GET",
      }),
    }),

    editCamera: builder.mutation<CameraDto, CameraDto>({
      query: (body) => ({
        url: `${EndPoints.camera}/`,
        method: "PUT",
        body,
      }),
    }),
    deleteCamera: builder.mutation<CameraDto, string>({
      query: (id) => ({
        url: `${EndPoints.camera}/${id}`,
        method: "DELETE",
      }),
    }),
    getCameraById: builder.mutation<CameraDto, string>({
      query: (id) => ({
        url: `${EndPoints.camera}/${id}`,
        method: "GET",
      }),
    }),
    addCamera: builder.mutation<CameraDto, CreateCameraDto>({
      query: (data) => ({
        url: `${EndPoints.camera}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCamerasMutation,
  useEditCameraMutation,
  useDeleteCameraMutation,
  useGetCameraByIdMutation,
  useAddCameraMutation,
} = cameraApi;
