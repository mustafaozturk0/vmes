import { api } from "../api";
import { EndPoints } from "../EndPoints";
import {
  GetMachineLogsDto,
  GetMachineLogsResponseDto,
} from "../swagger/swagger.api";

export const machineLogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMachineLogs: builder.mutation<
      GetMachineLogsResponseDto[],
      GetMachineLogsDto
    >({
      query: (body) => ({
        url: `${EndPoints.machineLogs}/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetMachineLogsMutation } = machineLogApi;
