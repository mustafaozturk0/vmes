import React from "react";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import {
  Card,
  Container,
  Grid,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { CameraPicker } from "../../components/CameraPicker";
import { VideoPlayer } from "../Train/VideoPlayer/VideoPlayer";

function Overview() {
  const [t] = useTranslation("common");
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );

  return (
    <>
      <Helmet>
        <title>Khenda Sentinel | {t("sidebar.buttons.home")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("sidebar.buttons.home")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">
                {t("overview.page.activeCameras")}
              </Typography>
              <Typography variant="h4">4</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">
                {t("overview.page.totalCameras")}
              </Typography>
              <Typography variant="h4">14</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">{t("overview.page.data")}</Typography>
              <Typography variant="h4">15</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ padding: 2, textAlign: "center" }}>
              <Typography variant="h6">{t("overview.page.data")}</Typography>
              <Typography variant="h4">25</Typography>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ padding: 2 }}>
              <CameraPicker />
              {/*         <Card
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "50%",
                    lg: "40%",
                    xl: "30%",
                  },
                }}
              >
                <FactoryTreeButtonGroup />
                <FactoryTree defaultExpanded={[]} />
              </Card> */}

              <Box
                display="flex"
                flexDirection={isSmallScreen ? "column" : "row"}
                alignItems="center"
                justifyContent="center"
                marginTop={1}
              >
                <VideoPlayer
                  width={isSmallScreen ? 400 : 600}
                  showStage={false}
                />
                <Box
                  padding={2}
                  sx={{
                    flexBasis: isSmallScreen ? "100%" : "50%",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6">Camera Details</Typography>
                  <Typography variant="body1">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec auctor, libero et feugiat ultricies, justo odio
                    tincidunt justo, nec congue magna nunc ac purus.
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Overview;
