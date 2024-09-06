import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import Cameras from "./Cameras";

export const CamerasPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda Sentinel | {t("sidebar.buttons.cameras")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("sidebar.buttons.cameras")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Cameras />
      </Container>
    </>
  );
};
