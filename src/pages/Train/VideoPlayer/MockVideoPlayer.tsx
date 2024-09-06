import { CircularProgress, Typography } from "@mui/material";
import { BorderedBox } from "../../../components/CustomComponents";
import { useTranslation } from "react-i18next";

export const MockVideoPlayer = () => {
  const [t] = useTranslation("common");

  return (
    <BorderedBox
      height={350}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
      sx={{
        backgroundColor: "#000",
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <CircularProgress
        sx={{ color: "rgba(255, 255, 255, 0.8)", position: "absolute" }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "rgba(255, 255, 255, 0.8)",
          marginTop: "20px",
          position: "absolute",
          bottom: "10%",
        }}
      >
        {t("train.videoPlayer.loadingVideo")}
      </Typography>
    </BorderedBox>
  );
};
