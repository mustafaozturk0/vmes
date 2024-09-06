import { Container } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PageTitleWrapper from "../../components/PageTitleWrapper";
import PageTitle from "../../components/PageTitleWrapper/PageTitle";
import { Reports } from "./Reports";

export const ReportsPage = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>Khenda VMES | {t("sidebar.buttons.reports")}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageTitle heading={t("sidebar.buttons.reports")} />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Reports />
      </Container>
    </>
  );
};
