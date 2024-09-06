import { Card, Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import Train from "./Train";
import { CameraStatusDisplayer } from "./CameraStatusDisplayer";
import { useTypedSelector } from "../../store/hooks";
import { selectedCameraId } from "../../slices/camera/cameraSlice";

export const TrainPage = () => {
  const { t } = useTranslation("common");
  const cameraId = useTypedSelector(selectedCameraId);
  return (
    <>
      <Helmet>
        <title>Khenda Sentinel | {t("train.page.train")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("train.page.train")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <CameraStatusDisplayer />
        {cameraId && (
          <Card sx={{ marginTop: 2, paddingBottom: 2 }}>
            <Train />
          </Card>
        )}
      </Container>
    </>
  );
};
