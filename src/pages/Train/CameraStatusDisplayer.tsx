import { Box, Card, Typography, Button, Grid } from "@mui/material";
import { CameraPicker } from "../../components/CameraPicker";
import { useTranslation } from "react-i18next";

export const CameraStatusDisplayer = () => {
  const [t] = useTranslation("common");

  return (
    <Box>
      <Card
        sx={{
          p: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={6}>
            <CameraPicker />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                paddingX: 2,
                paddingY: 1,
                justifyContent: "space-between",
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6">
                  {t("train.page.cameraStatus")}
                </Typography>
                <Box
                  sx={{
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    backgroundColor: "green",
                  }}
                />
                <Typography color="success.main" variant="subtitle2">
                  {t("train.page.connected")}
                </Typography>
              </Box>
              <Button color="secondary" variant="outlined" size="small">
                {t("train.page.resetCamera")}
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};
