import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Card,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  GetMachineLogsDto,
  GetMachineLogsResponseDto,
} from "../../api/swagger/swagger.api";
import { useGetMachineLogsMutation } from "../../api/machine/machineLogApi";
import { useGetPolygonsMutation } from "../../api/polygon/polygonApi";
import { useTranslation } from "react-i18next";
import { CalendarToday, Search } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import { enqueueSnackbar } from "notistack";

// Type definitions
interface MachineState {
  color: string;
  duration: number;
}

interface MachineData {
  name: string;
  time: string;
  percentage: string;
  states: MachineState[];
  status: string;
  statusTime: string;
  image: string;
}

interface MachineBarProps {
  machineData: MachineData;
}

// A function to represent each machine's data bar
const MachineBar: React.FC<GetMachineLogsResponseDto> = ({ logs }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
    {logs?.map((machine, index) => (
      <Box
        key={index}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 20,
          background: machine.log === "processing" ? "green" : "red",
        }}
      >
        -
      </Box>
    ))}
  </Box>
);

// Legend component
const Legend: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      mb: 3,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box sx={{ width: 20, height: 20, backgroundColor: "#4caf50", mr: 1 }} />
      <Typography variant="caption">Start</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box sx={{ width: 20, height: 20, backgroundColor: "#f44336", mr: 1 }} />
      <Typography variant="caption">Stop</Typography>
    </Box>
    <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
      <Box sx={{ width: 20, height: 20, backgroundColor: "#ffeb3b", mr: 1 }} />
      <Typography variant="caption">Idle</Typography>
    </Box>
  </Box>
);

// Main component
const MachineStatus: React.FC = () => {
  const [getLogs, { data: logs, isLoading }] = useGetMachineLogsMutation();
  const [getPolygons] = useGetPolygonsMutation();
  const [polygonOptions, setPolygonOptions] = React.useState<
    { id: number; name: string }[]
  >([]);

  const [selectedPolygons, setSelectedPolygons] = React.useState<number[]>([]);

  const { control, handleSubmit, setValue, getValues } = useForm<any>({
    defaultValues: {
      selectedPolygons: [],
      startDate: dayjs().subtract(1, "day"), // Set startDate to yesterday
      endDate: dayjs(), // Set endDate to now
    },
  });

  useEffect(() => {
    getPolygons()
      .unwrap()
      .then((data) => {
        const options = data.map((polygon) => ({
          id: polygon.id ?? 0,
          name: polygon.name ?? "",
        }));
        return setPolygonOptions(options);
      });
  }, []);

  const [t] = useTranslation("common");
  const [open, setOpen] = useState<"startDate" | "endDate" | null>(null);

  const onSubmit = (data: any) => {
    getLogs({
      polygonIds: data.selectedPolygons,
      from: data.startDate,
      to: data.endDate,
    })
      .unwrap()

      .catch((error) => {
        enqueueSnackbar(t("Couldnt load machine data"), {
          variant: "error",
        });
      });
  };

  const handleDateTimeChange = (dateTime: Dayjs | null, field: keyof any) => {
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
    setValue(field as any, dateTime);
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
                  onChange={(date: any) => {
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
                  onChange={(time: any) => {
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
    <Box p={3}>
      <Card sx={{ p: 1, mb: 4 }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", gap: 2 }}
        >
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item xs={3}>
              <Controller
                name="selectedPolygons"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>{t("Polygon")}</InputLabel>
                    <Select
                      {...field}
                      multiple={true}
                      value={selectedPolygons}
                      variant="outlined"
                      label={t("Polygon")}
                    >
                      {polygonOptions.map((polygon) => (
                        <MenuItem
                          key={polygon.id}
                          value={polygon.id}
                          onClick={() =>
                            setSelectedPolygons([
                              ...selectedPolygons,
                              polygon.id,
                            ])
                          }
                        >
                          {polygon.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
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
                    onClick={() => setOpen("startDate")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
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
                            size="small"
                            onClick={() => setOpen("endDate")}
                            edge="end"
                          >
                            <CalendarToday />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    onClick={() => setOpen("endDate")}
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <LoadingButton
                fullWidth
                variant="outlined"
                type="submit"
                disabled={
                  isLoading ||
                  selectedPolygons.length === 0 ||
                  !getValues("startDate") ||
                  !getValues("endDate")
                }
                loading={isLoading}
                startIcon={<Search />}
              >
                Search
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
        {renderDateTimePicker("startDate")}
        {renderDateTimePicker("endDate")}
      </Card>
      <Legend />
      {logs?.map((machine, index) => (
        <Paper key={index} sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <MachineBar logs={machine.logs} />
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Box>
  );
};

export default MachineStatus;
