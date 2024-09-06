import { api } from "../api";
import { EndPoints } from "../EndPoints";

export const machineApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMachines: builder.mutation<any[], void>({
      query: () => ({
        url: `${EndPoints.machine}/`,
        method: "GET",
      }),
    }),

    editMachine: builder.mutation<any, any>({
      query: (body) => ({
        url: `${EndPoints.machine}/`,
        method: "PUT",
        body,
      }),
    }),
    deleteMachine: builder.mutation<any, string>({
      query: (id) => ({
        url: `${EndPoints.machine}/${id}`,
        method: "DELETE",
      }),
    }),
    getMachineById: builder.mutation<any, string>({
      query: (id) => ({
        url: `${EndPoints.machine}/${id}`,
        method: "GET",
      }),
    }),
    addMachine: builder.mutation<any, any>({
      query: (data) => ({
        url: `${EndPoints.machine}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetMachinesMutation,
  useEditMachineMutation,
  useDeleteMachineMutation,
  useGetMachineByIdMutation,
  useAddMachineMutation,
} = machineApi;
