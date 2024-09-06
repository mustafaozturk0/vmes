import { api } from "../api";
import { EndPoints } from "../EndPoints";
import {
  RecordDto,
  RecordImagesResultDto,
  RecordSearchDto,
  RecordSearchResultDto,
  SetFalsePositiveDto,
} from "../swagger/swagger.api";

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    searchReports: builder.mutation<RecordSearchResultDto, RecordSearchDto>({
      query: (body) => ({
        url: `${EndPoints.record}/`,
        method: "POST",
        body,
      }),
    }),
    getRecordById: builder.mutation<RecordDto, number>({
      query: (id) => ({
        url: `${EndPoints.record}/${id}`,
        method: "GET",
      }),
    }),
    getRecordImages: builder.mutation<RecordImagesResultDto, number>({
      query: (id) => `${EndPoints.record}/images/${id}`,
    }),
    addFalsePositive: builder.mutation<
      SetFalsePositiveDto,
      SetFalsePositiveDto
    >({
      query: (body) => ({
        url: `${EndPoints.record}/false-positive`,
        method: "POST",
        body,
      }),
    }),
    getFalsePositiveByFilename: builder.mutation<
      boolean,
      { classId: string; fileName: string }
    >({
      query: (body) =>
        `${EndPoints.record}/false-positive-image/${body.classId}/${body.fileName}`,
    }),
    getFalsePositiveByClassId: builder.mutation<RecordImagesResultDto, number>({
      query: (classId) => `${EndPoints.record}/false-positive/${classId}`,
    }),
    removeFalsePositive: builder.mutation<
      RecordImagesResultDto,
      { classId: string; fileName: string }
    >({
      query: (body) => ({
        url: `${EndPoints.record}/false-positive/${body.classId}/${body.fileName}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSearchReportsMutation,
  useGetRecordByIdMutation,
  useGetRecordImagesMutation,
  useAddFalsePositiveMutation,
  useGetFalsePositiveByFilenameMutation,
  useGetFalsePositiveByClassIdMutation,
  useRemoveFalsePositiveMutation,
} = reportsApi;
