import { api } from "../api";
import { EndPoints } from "../EndPoints";
import { YoloClass } from "../swagger/swagger.api";

export const yoloApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getYoloClasses: builder.mutation<YoloClass[], void>({
      query: () => ({
        url: `${EndPoints.yolo}/list`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetYoloClassesMutation } = yoloApi;
