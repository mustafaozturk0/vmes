import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Button,
  MenuItem,
  Select,
  Grid,
  Card,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  TextField,
  DialogTitle,
} from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { CalendarToday, Search } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { CameraPicker } from "../../components/CameraPicker";
import { useTypedSelector } from "../../store/hooks";
import { selectedCameraId } from "../../slices/camera/cameraSlice";
import { useGetPolygonsByCameraIdMutation } from "../../api/polygon/polygonApi";
import { PolygonDto, RecordSearchDto } from "../../api/swagger/swagger.api";
import { LoadingButton } from "@mui/lab";

type FormValues = {
  page?: number;
  pageSize?: number;
  camera: string;
  area: string;
  conditionId: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
};

interface SearchFormProps {
  onSubmitCallback: (data: RecordSearchDto) => void;
  loading?: boolean;
}

export const SearchForm = ({ onSubmitCallback, loading }: SearchFormProps) => {
  const cameraId = useTypedSelector(selectedCameraId);

  const [getPolygonsByCameraId, { isLoading: polygonsLoading }] =
    useGetPolygonsByCameraIdMutation();

  const [polygons, setPolygons] = useState<PolygonDto[]>([]);
  const [conditionOptions, setConditionOptions] = useState<any[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonDto | null>(
    null
  );

  useEffect(() => {
    if (cameraId) {
      getPolygonsByCameraId(cameraId)
        .unwrap()
        .then((data) => {
          setPolygons(data);
          setValue("area", data[0]?.id as unknown as string);
        });
    }
  }, [cameraId]);

  useEffect(() => {
    if (
      polygons &&
      polygons[0]?.conditionPages &&
      polygons[0].conditionPages[0]
    ) {
      setValue("area", (polygons[0].id as unknown as string) || "");
      setValue(
        "conditionId",
        (polygons[0].conditionPages[0].id as string) || ""
      );
    }
  }, [polygons]);

  useEffect(() => {
    const conditionPages = selectedPolygon?.conditionPages;
    if (selectedPolygon && conditionPages) {
      setConditionOptions(
        conditionPages.map((condition) => ({
          value: condition.id,
          label: condition.name,
        }))
      );
    }
  }, [selectedPolygon]);

  const { control, handleSubmit, setValue, getValues } = useForm<FormValues>({
    defaultValues: {
      page: 1,
      pageSize: 10,
      camera: "",
      area: "",
      conditionId: "",
      startDate: dayjs().subtract(1, "day"), // Set startDate to yesterday
      endDate: dayjs(), // Set endDate to now
    },
  });

  const [open, setOpen] = useState<"startDate" | "endDate" | null>(null);
  const [t] = useTranslation("common");
  const handleDateTimeChange = (
    dateTime: Dayjs | null,
    field: keyof FormValues
  ) => {
    if (
      field === "startDate" &&
      dateTime &&
      dateTime.isAfter(getValues("endDate"))
    ) {
      setValue("endDate", dateTime);
    } else if (
      field === "endDate" &&
      dateTime &&
      dateTime.isBefore(getValues("startDate"))
    ) {
      setValue("startDate", dateTime);
    }
    setValue(field, dateTime);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const dto: RecordSearchDto = {
      page: 1,
      pageSize: 10,
      startDate: data.startDate?.toDate() || undefined,
      endDate: data.endDate?.toDate() || undefined,
      conditionId: data.conditionId,
    };
    onSubmitCallback(dto);
  };

  const renderDateTimePicker = (field: "startDate" | "endDate") => {
    return (
      <Dialog open={open === field}>
        <DialogTitle>{`${t("searchForm.dialogTitle")} `}</DialogTitle>
        <DialogContent>
          <Controller
            name={field}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box marginTop={1}>
                <DatePicker
                  label={t("reports.page.selectDate")}
                  sx={{ marginBottom: 2 }}
                  value={value}
                  onChange={(date) => {
                    onChange(date);
                    handleDateTimeChange(date, field);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
                <TimePicker
                  label={t("reports.page.selectTime")}
                  value={value}
                  onChange={(time) => {
                    onChange(time);
                    handleDateTimeChange(time, field);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </Box>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(null)}>
            {t("commonWords.cancel")}
          </Button>
          <Button
            onClick={() => {
              setOpen(null);
            }}
            variant="contained"
            color="primary"
          >
            {t("commonWords.ok")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Card sx={{ padding: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <Controller
              name="camera"
              disabled={cameraId === null}
              control={control}
              render={({ field }) => <CameraPicker />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Controller
              name="area"
              disabled={polygonsLoading || polygons.length === 0}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t("reports.page.area")}</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    variant="outlined"
                    label={t("reports.page.area")}
                  >
                    {polygons.map((polygon) => (
                      <MenuItem
                        key={polygon.id}
                        value={polygon.id}
                        onClick={() => setSelectedPolygon(polygon)}
                      >
                        {polygon.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Controller
              name="conditionId"
              disabled={conditionOptions.length === 0}
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>{t("reports.page.condition")}</InputLabel>
                  <Select
                    {...field}
                    fullWidth
                    variant="outlined"
                    label={t("reports.page.condition")}
                    placeholder={t("reports.page.condition")}
                  >
                    {conditionOptions.map((condition) => (
                      <MenuItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label={t("reports.page.start")}
              value={
                getValues("startDate")?.format("YYYY-MM-DD HH:mm") ||
                t("reports.page.selectStartDateTime")
              }
              variant="outlined"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setOpen("startDate")}
                      edge="end"
                    >
                      <CalendarToday />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  paddingRight: 0,
                },
              }}
              onClick={() => setOpen("startDate")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label={t("reports.page.end")}
              value={
                getValues("endDate")?.format("YYYY-MM-DD HH:mm") ||
                t("reports.page.selectEndDateTime")
              }
              variant="outlined"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setOpen("endDate")}
                      edge="end"
                      size="small"
                    >
                      <CalendarToday />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  paddingRight: 0,
                },
              }}
              onClick={() => setOpen("endDate")}
            />
          </Grid>

          <Grid item xs={12} display={"flex"} justifyContent={"end"}>
            <LoadingButton
              type="submit"
              sx={{
                minWidth: 160,
              }}
              variant="outlined"
              disabled={
                loading ||
                polygonsLoading ||
                polygons.length === 0 ||
                conditionOptions.length === 0 ||
                cameraId === null ||
                !getValues("startDate") ||
                !getValues("endDate")
              }
              color="primary"
              startIcon={<Search />}
            >
              {t("reports.page.search")}
            </LoadingButton>
          </Grid>
        </Grid>
      </form>
      {renderDateTimePicker("startDate")}
      {renderDateTimePicker("endDate")}
    </Card>
  );
};
