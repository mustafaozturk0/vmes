import React, { useState } from "react";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { RecordDto } from "../../api/swagger/swagger.api";
import { useTranslation } from "react-i18next";
import { SearchResultModal } from "./SearchResultModal";
import { EndPoints } from "../../api/EndPoints";

interface SearchResultsDisplayerProps {
  searchResults: RecordDto[];
  loading: boolean;
}

const SearchResultsDisplayer = ({
  searchResults,
  loading,
}: SearchResultsDisplayerProps) => {
  const { t } = useTranslation("common");
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<RecordDto | null>(null);

  const handleOpen = (video: RecordDto) => {
    setSelectedVideo(video);
    setDetailModalOpen(true);
  };

  const handleClose = () => {
    setDetailModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Card>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ opacity: loading ? 0.5 : 1 }}
        >
          {searchResults.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <Card
                sx={{ position: "relative" }}
                onClick={() => handleOpen(video)}
              >
                <CardMedia
                  component="video"
                  src={EndPoints.record + "/video/" + video.path}
                  title={`${t("reports.page.video")}: ${video.id}`}
                  controls={false}
                  sx={{ height: 200, objectFit: "cover", cursor: "pointer" }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                  aria-label="play video"
                >
                  <PlayArrowIcon sx={{ fontSize: 50 }} />
                </IconButton>
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {t("reports.page.video")}: {video.id}
                  </Typography>
                  <Typography variant="h6" noWrap>
                    {t("reports.page.date")}
                    {new Date(
                      video?.datetime as unknown as string
                    )?.toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
      <SearchResultModal
        open={detailModalOpen}
        handleClose={handleClose}
        selectedVideo={selectedVideo}
      />
    </>
  );
};

export default SearchResultsDisplayer;
