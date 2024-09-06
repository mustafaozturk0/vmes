import { useSelector } from "react-redux";
import { selectYoloOptions } from "../../../slices/yolo/yoloSlice";
import { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardActions,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import {
  useGetFalsePositiveByClassIdMutation,
  useRemoveFalsePositiveMutation,
} from "../../../api/reports/reportsApi";
import { RecordImagesResultDto } from "../../../api/swagger/swagger.api";
import { DevRootURL } from "../../../api/EndPoints";
import { enqueueSnackbar } from "notistack";

export const FalsePositives = () => {
  const yoloClasses = useSelector(selectYoloOptions);
  const [selectedClass, setSelectedClass] = useState("");
  const [getFalsePositives] = useGetFalsePositiveByClassIdMutation();
  const [falsePositives, setFalsePositives] =
    useState<RecordImagesResultDto | null>(null);
  const [removeFalsePositive] = useRemoveFalsePositiveMutation();

  const handleSelectChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedClass(selectedValue);
    const selectedItem = yoloClasses.find(
      (yoloClass) => yoloClass.name === selectedValue
    );
    getFalsePositives(Number(selectedItem?.id || 0))
      .unwrap()
      .then((data) => {
        setFalsePositives(data);
      });
  };

  const onRemoveFalsePositive = (path: string) => {
    window.confirm("Are you sure that this is not a false positive?");
    const selectedItem = yoloClasses.find(
      (yoloClass) => yoloClass.name === selectedClass
    );
    if (selectedItem) {
      removeFalsePositive({ classId: selectedItem.id, fileName: path })
        .unwrap()
        .then((res) => {
          setFalsePositives(res);
          enqueueSnackbar("Removed from false positives", {
            variant: "success",
          });
        })
        .catch(() =>
          enqueueSnackbar("Error removing from false positives", {
            variant: "error",
          })
        );
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="yolo-select-label">Select a class</InputLabel>
        <Select
          labelId="yolo-select-label"
          value={selectedClass}
          disabled={yoloClasses.length === 0}
          onChange={handleSelectChange}
          label="Select a class"
        >
          {yoloClasses.map((yoloClass) => (
            <MenuItem key={yoloClass.id} value={yoloClass.name}>
              {yoloClass.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {falsePositives &&
        falsePositives?.images &&
        falsePositives?.images?.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Images marked as False Positive: {falsePositives?.images.length}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              {falsePositives?.images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{ p: 1 }}>
                    <img
                      src={
                        DevRootURL +
                        "/api/record/false-positive-image/" +
                        yoloClasses.find(
                          (yoloClass) => yoloClass.name === selectedClass
                        )?.id +
                        "/" +
                        image
                      }
                      alt={`False positive ${index + 1}`}
                      style={{ width: "100%", height: 200 }}
                    />
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={() => onRemoveFalsePositive(image)}
                      >
                        Not False Positive
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
    </Card>
  );
};
