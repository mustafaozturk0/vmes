import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { t } from "i18next";
import { RecordDto, SetFalsePositiveDto } from "../../api/swagger/swagger.api";
import { useEffect, useState } from "react";
import { BorderedBox } from "../../components/CustomComponents";
import {
  useAddFalsePositiveMutation,
  useGetRecordImagesMutation,
} from "../../api/reports/reportsApi";
import { EndPoints } from "../../api/EndPoints";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

interface SearchResultModalProps {
  open: boolean;
  handleClose: () => void;
  selectedVideo: RecordDto | null;
}

export const SearchResultModal = ({
  open,
  handleClose,
  selectedVideo,
}: SearchResultModalProps) => {
  const [images, setImages] = useState<string[] | null>(null);
  const [getImages, { isLoading: imagesLoading }] =
    useGetRecordImagesMutation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [markAsFalsePositive, { isLoading: markAsFalsePositiveLoading }] =
    useAddFalsePositiveMutation();

  useEffect(() => {
    if (selectedVideo) {
      getImages(Number(selectedVideo.id))
        .unwrap()
        .then((data) => {
          setImages(data.images as string[]);
          setCurrentIndex(0); // Reset index when new images are loaded
        });
    }
  }, [selectedVideo]);

  const onFalsePositive = (path: string) => {
    window.confirm(`Are you sure to mark this image as False Positive?`);
    const parts = path.split("/");
    const filename = parts.pop();
    const filepath = parts.join("/");
    const dto: SetFalsePositiveDto = {
      filename: filename,
      foldername: filepath,
    };
    markAsFalsePositive(dto)
      .unwrap()
      .then(() => {
        enqueueSnackbar("Marked as false positive", {
          variant: "success",
        });
        setImages(images?.filter((i) => i !== path) || []);
      })
      .catch(() => {
        enqueueSnackbar("Error marking false positive", {
          variant: "error",
        });
      });
  };

  const handleNext = () => {
    if (images && currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (images && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "85%", md: "75%", lg: "65%" },
          bgcolor: "background.paper",
          overflow: "auto",
          height: { xs: "90%", md: "85%" },
          boxShadow: 24,
          p: 3,
          outline: 0,
          borderRadius: 2,
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 10, right: 10 }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>

        {selectedVideo && (
          <Box
            sx={{
              position: "relative",
              pb: "56.25%", // 16:9 aspect ratio
              height: 0,
              mb: 2,
            }}
          >
            <video
              src={EndPoints.record + "/video/" + selectedVideo.path}
              controls
              autoPlay
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: 2,
              }}
            />
          </Box>
        )}

        <Typography variant="h6" noWrap sx={{ mb: 2 }}>
          <strong>{t("reports.page.date")}</strong>{" "}
          {new Date(
            selectedVideo?.datetime as unknown as string
          )?.toLocaleDateString()}
        </Typography>

        {imagesLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50%",
              mt: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          images &&
          images.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{ mb: 2, textAlign: "center" }}
              >{`${currentIndex + 1} / ${images.length}`}</Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <IconButton
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  sx={{ mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>

                <BorderedBox
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: { xs: "180px", sm: "250px", md: "300px" },
                    minHeight: { xs: "180px", sm: "250px", md: "300px" },
                    maxWidth: "100%",
                    maxHeight: "100%",
                    overflow: "hidden",
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={EndPoints.record + "/image/" + images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    style={{
                      width: "auto",
                      height: "170px",
                      objectFit: "cover",
                    }}
                  />
                  <LoadingButton
                    variant="contained"
                    color="error"
                    onClick={() => onFalsePositive(images[currentIndex])}
                    loading={markAsFalsePositiveLoading}
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                      mt: 1,
                    }}
                  >
                    {t("False Positive")}
                  </LoadingButton>
                </BorderedBox>

                <IconButton
                  onClick={handleNext}
                  disabled={currentIndex === images.length - 1}
                  sx={{ ml: 1 }}
                >
                  <ArrowForward />
                </IconButton>
              </Box>

              <Grid container spacing={1} justifyContent="center">
                {images.map((image, index) => (
                  <Grid item key={index}>
                    <Box
                      sx={{
                        border:
                          currentIndex === index
                            ? "2px solid blue"
                            : "2px solid transparent",
                        borderRadius: 0.1,
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <img
                        src={EndPoints.record + "/image/" + image}
                        alt={`Thumbnail ${index + 1}`}
                        style={{
                          width: "auto",
                          height: "70px",
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )
        )}
      </Box>
    </Modal>
  );
};
