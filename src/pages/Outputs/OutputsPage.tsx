import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import Outputs from "./Outputs";

export const OutputsPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda Sentinel | {t("sidebar.buttons.outputs")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("sidebar.buttons.outputs")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Outputs />
      </Container>
    </>
  );
};
