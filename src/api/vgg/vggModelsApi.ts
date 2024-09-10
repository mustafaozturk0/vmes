import { api } from "../api";
import { EndPoints } from "../EndPoints";
import { VggModelsDto } from "../swagger/swagger.api";

export const vggModelsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVggModels: builder.mutation<VggModelsDto[], void>({
      query: () => ({
        url: `${EndPoints.vggModels}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetVggModelsMutation } = vggModelsApi;
